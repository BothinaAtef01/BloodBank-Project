<?php
// controllers/staff.controller.php

require_once __DIR__ . '/../config/connection.php';
require_once __DIR__ . '/../utils/token.php';
require_once __DIR__ . '/../services/email.php';
require_once __DIR__ . '/../middleware/audit.php';

// يرسل كود التسجيل
function staffIssueToken(array $user): void {
    $body         = jsonBody();
    $email= trim($body['email'] ?? '');

    if (!$email) {
        jsonResponse(['success' => false, 'message' => 'Email is required.'], 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('
        SELECT staff_id
        FROM staff
        WHERE staff_id =?
    ');
    $stmt->execute([$user['id']]);
    $staff = $stmt->fetch();

    if (!$staff) {
        jsonResponse(['success' => false, 'message' => 'Staff profile not found.'], 404);
    }

    $check = $db->prepare("SELECT donor_unique_id FROM donor WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'This email already has a registration token.'], 409);
    }

    $donor_unique_id = generateToken();
    $expiresAt = tokenExpiresAt();

    $ins = $db->prepare("INSERT INTO donor (donor_unique_id, email) VALUES (?, ?)");
    $ins->execute(['$donor_unique_id', $email]);
    $newId = (int) $db->lastInsertId();

    try {
        sendWelcomeCredentials($email,"", $donor_unique_id, $staff['center_name']);///
    } catch (Exception $e) {
        error_log('email failed: ' . $e->getMessage());
    }

    auditLog([
        'userId'      => $user['id'],
        'action'      => 'issue_token',
        'targetTable' => 'donor_registration_tokens',
        'targetId'    => $newId,
        'newValue'    => ['email' => $email, 'tokenCode' => $donor_unique_id, 'center_id' => $staff['center_id']],
        'ipAddress'   => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);

    jsonResponse([
        'success'    => true,
        'message'    => "Registration token issued. Email sent to {$email}.",
        'token_code' => $donor_unique_id,
        'expires_at' => $expiresAt,
    ], 201);
}

//يبحث عن المتبرعين
function staffSearchDonors(): void {
    $q = trim($_GET['q'] ?? '');
    if (!$q) {
        jsonResponse(['success' => true, 'donors' => []]);
    }

    $like = "%{$q}%";
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT donor_id, full_name, email,
                blood_type,national_id,date_of_birth
        FROM donors 
        WHERE full_name LIKE ? OR blood_type LIKE ? OR email LIKE ?
        LIMIT 20
    ');
    $stmt->execute([$like, $like, $like]);

    jsonResponse(['success' => true, 'donors' => $stmt->fetchAll()]);
}

// 
function staffGetDonorInfo(int $donorId): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT id, full_name, email, blood_type, age, 
            weight_kg, national_id
        FROM donors
        WHERE id = ?
    ');
    $stmt->execute([$donorId]);
    $donor = $stmt->fetch();

    if (!$donor) {
        jsonResponse(['success' => false, 'message' => 'Donor not found.'], 404);
    }

    $s = $db->prepare('
        SELECT  donors.last_donation_date,donations.hemoglobin_level,
        donations.virus_test
        FROM donors
        JOIN donations ON donors.donor_unique_id = donations.donor_unique_id
        WHERE donors.id = ?
        ORDER BY donations.last_donation_date DESC
       LIMIT 1;
    ');
    $s->execute([$donorId]);
    $donations = $s->fetchAll();


    jsonResponse([
        'success'          => true,
        'donor'            => $donor,
        'donations'        => $donations,
    ]);
}

//تسجل عملة تبرع جديده
function staffAddDonation(array $user): void {
    $body          = jsonBody();
    $donor_id      = (int) ($body['donor_id']      ?? 0);
    $volume_ml     = $body['volume_ml']     ?? null;
    $notes         = $body['notes']         ?? null;

    if (!$donor_id) {
        jsonResponse(['success' => false, 'message' => 'donor_id is required.'], 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('SELECT id, center_id FROM staff_profiles WHERE user_id = ?');
    $stmt->execute([$user['id']]);
    $staff = $stmt->fetch();

    if (!$staff) {
        jsonResponse(['success' => false, 'message' => 'Staff profile not found.'], 404);
    }

    $s = $db->prepare('SELECT next_eligible_date FROM donation_records WHERE donor_id = ? ORDER BY donation_date DESC LIMIT 1');
    $s->execute([$donor_id]);
    $lastDon = $s->fetch();

    if ($lastDon && strtotime($lastDon['next_eligible_date']) > time()) {
        jsonResponse(['success' => false, 'message' => "Donor is not yet eligible. Next eligible: {$lastDon['next_eligible_date']}"], 400);
    }

    $donationDate  = date('Y-m-d');
    $nextEligible  = nextEligibleDate( $donationDate);

    try {
        $db->beginTransaction();

        $ins = $db->prepare("INSERT INTO donation_records (donor_id, center_id, staff_id, donation_date, volume_ml, status, next_eligible_date, notes) VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?)");
        $ins->execute([$donor_id, $staff['center_id'], $staff['id'], $donationDate, $volume_ml, $nextEligible, $notes]);
        $donationId = (int) $db->lastInsertId();

        $db->prepare('
            INSERT INTO blood_inventory (center_id, blood_type, units_available)
            SELECT ?, dp.blood_type, 1
            FROM donor_profiles dp WHERE dp.id = ?
            ON DUPLICATE KEY UPDATE units_available = units_available + 1
        ')->execute([$staff['center_id'], $donor_id]);

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

    auditLog([
        'userId' => $user['id'], 'action' => 'add_donation',
        'targetTable' => 'donation_records', 'targetId' => $donationId,
        'newValue' => ['donor_id' => $donor_id,, 'donationDate' => $donationDate],
        'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);

    jsonResponse([
        'success'            => true,
        'message'            => 'Donation recorded successfully.',
        'donation_id'        => $donationId,
        'next_eligible_date' => $nextEligible,
    ], 201);
}

//يسجل نتيجه الفحص 
function staffAddScreeningTest(array $user, int $donationId): void {
    $body = jsonBody();

    $db   = getDB();
    $stmt = $db->prepare('SELECT id FROM staff_profiles WHERE user_id = ?');
    $stmt->execute([$user['id']]);
    $staff = $stmt->fetch();

    $db->prepare('
        INSERT INTO tests
            (ٍSeccessful, fail, hemoglobin_g_dl)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            hemoglobin_g_dl=VALUES(hemoglobin_g_dl), blood_pressure=VALUES(blood_pressure),
            hiv_result=VALUES(hiv_result), hepatitis_b_result=VALUES(hepatitis_b_result),
            hepatitis_c_result=VALUES(hepatitis_c_result), syphilis_result=VALUES(syphilis_result),
            is_eligible=VALUES(is_eligible)
    ')->execute([
        $donationId,
        $staff['id'],
        $body['hemoglobin_g_dl']    ?? null,
        $body['blood_pressure']     ?? null,
        $body['pulse_bpm']          ?? null,
        $body['temperature_c']      ?? null,
        $body['hiv_result']         ?? 'pending',
        $body['hepatitis_b_result'] ?? 'pending',
        $body['hepatitis_c_result'] ?? 'pending',
        $body['syphilis_result']    ?? 'pending',
        isset($body['is_eligible']) && $body['is_eligible'] ? 1 : 0,
    ]);

    jsonResponse(['success' => true, 'message' => 'Screening test results saved.']);
}

