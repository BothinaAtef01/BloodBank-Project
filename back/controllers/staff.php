<?php
// controllers/staff.controller.php

require_once __DIR__ . '/../config/db.php';
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
        SELECT sp.id AS staff_id, sp.center_id, bc.name AS center_name
        FROM staff_profiles sp
        JOIN blood_centers bc ON bc.id = sp.center_id
        WHERE sp.user_id = ?
    ');
    $stmt->execute([$user['id']]);
    $staff = $stmt->fetch();

    if (!$staff) {
        jsonResponse(['success' => false, 'message' => 'Staff profile not found.'], 404);
    }

    $check = $db->prepare("SELECT id FROM donor_registration_tokens WHERE email = ? AND status = 'pending' AND expires_at > NOW()");
    $check->execute([$email]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'This email already has an active registration token.'], 409);
    }

    $tokenCode = generateToken();
    $expiresAt = tokenExpiresAt();

    $ins = $db->prepare("INSERT INTO donor_registration_tokens (issued_by_staff_id, center_id, token_code, email, status, expires_at) VALUES (?, ?, ?, ?, 'pending', ?)");
    $ins->execute([$staff['staff_id'], $staff['center_id'], $tokenCode, $email, $expiresAt]);
    $newId = (int) $db->lastInsertId();

    try {
        sendWelcomeCredentials($email,"", $tokenCode, $staff['center_name']);
    } catch (Exception $e) {
        error_log('email failed: ' . $e->getMessage());
    }

    auditLog([
        'userId'      => $user['id'],
        'action'      => 'issue_token',
        'targetTable' => 'donor_registration_tokens',
        'targetId'    => $newId,
        'newValue'    => ['email' => $email, 'tokenCode' => $tokenCode, 'center_id' => $staff['center_id']],
        'ipAddress'   => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);

    jsonResponse([
        'success'    => true,
        'message'    => "Registration token issued. Email sent to {$email}.",
        'token_code' => $tokenCode,
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
        SELECT u.id AS user_id, u.full_name, u.email, u.phone,
               dp.id AS donor_id, dp.blood_type, dp.national_id, dp.date_of_birth,
               (SELECT donation_date FROM donation_records WHERE donor_id = dp.id ORDER BY donation_date DESC LIMIT 1) AS last_donation_date,
               (SELECT next_eligible_date FROM donation_records WHERE donor_id = dp.id ORDER BY donation_date DESC LIMIT 1) AS next_eligible_date
        FROM users u
        JOIN donor_profiles dp ON dp.user_id = u.id
        WHERE u.role = \'donor\' AND (u.full_name LIKE ? OR u.phone LIKE ? OR dp.national_id LIKE ?)
        LIMIT 20
    ');
    $stmt->execute([$like, $like, $like]);

    jsonResponse(['success' => true, 'donors' => $stmt->fetchAll()]);
}

// 
function staffGetDonorInfo(int $donorId): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT user_id, u.full_name, u.email, u.phone, u.created_at AS registered_at,
               dp.id AS donor_id, dp.blood_type, dp.date_of_birth, dp.gender,
               dp.weight_kg, dp.national_id, dp.medical_conditions
        FROM donor_profiles dp
        JOIN users u ON u.id = dp.user_id
        WHERE dp.id = ?
    ');
    $stmt->execute([$donorId]);
    $donor = $stmt->fetch();

    if (!$donor) {
        jsonResponse(['success' => false, 'message' => 'Donor not found.'], 404);
    }

    $s = $db->prepare('
        SELECT dr.id, dr.donation_date, dr.donation_type, dr.volume_ml,
               dr.status, dr.next_eligible_date, dr.notes,
               bc.name AS center_name,
               st.is_eligible, st.hemoglobin_g_dl, st.blood_pressure,
               st.hiv_result, st.hepatitis_b_result, st.hepatitis_c_result, st.syphilis_result
        FROM donation_records dr
        JOIN blood_centers bc ON bc.id = dr.center_id
        LEFT JOIN screening_tests st ON st.donation_id = dr.id
        WHERE dr.donor_id = ?
        ORDER BY dr.donation_date DESC
    ');
    $s->execute([$donorId]);
    $donations = $s->fetchAll();

    $completed = array_filter($donations, fn($d) => $d['status'] === 'completed');

    jsonResponse([
        'success'          => true,
        'donor'            => $donor,
        'donations'        => $donations,
        'total_donations'  => count($completed),
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

