<?php

require_once __DIR__ . '/../config/db.php';

//يرجع بيانات المتبرع
function donorGetProfile(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT u.id AS user_id, u.full_name, u.email, u.phone, u.created_at,
               dp.id AS donor_id, dp.blood_type, dp.date_of_birth, dp.gender,
               dp.weight_kg, dp.national_id, dp.medical_conditions
        FROM donor_profiles dp
        JOIN users u ON u.id = dp.user_id
        WHERE dp.user_id = ?
    ');
    $stmt->execute([$user['id']]);
    $profile = $stmt->fetch();

    if (!$profile) {
        jsonResponse(['success' => false, 'message' => 'Donor profile not found.'], 404);
    }

    $s = $db->prepare('
        SELECT donation_date, next_eligible_date, status,
               DATEDIFF(next_eligible_date, CURDATE()) AS days_until_eligible
        FROM donation_records WHERE donor_id = ? ORDER BY donation_date DESC LIMIT 1
    ');
    $s->execute([$profile['donor_id']]);
    $lastDon = $s->fetch() ?: null;

    $s2 = $db->prepare("SELECT COUNT(*) AS total_donations FROM donation_records WHERE donor_id = ? AND status = 'completed'");
    $s2->execute([$profile['donor_id']]);
    $totals = $s2->fetch();

    jsonResponse([
        'success'          => true,
        'profile'          => $profile,
        'last_donation'    => $lastDon,
        'total_donations'  => (int) $totals['total_donations'],
        'is_eligible'      => !$lastDon || strtotime($lastDon['next_eligible_date']) <= time(),
    ]);
}

//يشوف المراكز المتاحه
function donorGetNearbyCenters(): void {
    $lat    = $_GET['lat']    ?? null;
    $lng    = $_GET['lng']    ?? null;
    $radius = $_GET['radius'] ?? 50;

    $db = getDB();

    if (!$lat || !$lng) {
        $stmt = $db->query('SELECT id, name, address, city, phone, opening_hours FROM blood_centers WHERE is_active = 1');
        jsonResponse(['success' => true, 'centers' => $stmt->fetchAll()]);
    }

    $stmt = $db->prepare('
        SELECT id, name, address, city, phone, opening_hours, latitude, longitude,
            ROUND(6371 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(latitude)) *
                COS(RADIANS(longitude) - RADIANS(?)) +
                SIN(RADIANS(?)) * SIN(RADIANS(latitude))
            ), 2) AS distance_km
        FROM blood_centers
        WHERE is_active = 1
        HAVING distance_km <= ?
        ORDER BY distance_km ASC
    ');
    $stmt->execute([$lat, $lng, $lat, $radius]);

    jsonResponse(['success' => true, 'centers' => $stmt->fetchAll()]);
}

//تاريخ التبرعات
function donorGetDonationHistory(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id FROM donor_profiles WHERE user_id = ?');
    $stmt->execute([$user['id']]);
    $donor = $stmt->fetch();

    if (!$donor) {
        jsonResponse(['success' => false, 'message' => 'Profile not found.'], 404);
    }

    $s = $db->prepare('
        SELECT dr.donation_date, dr.volume_ml, dr.status,
               dr.next_eligible_date,
               DATEDIFF(dr.next_eligible_date, CURDATE()) AS days_until_eligible,
               bc.name AS center_name, bc.city
        FROM donation_records dr
        JOIN blood_centers bc ON bc.id = dr.center_id
        WHERE dr.donor_id = ?
        ORDER BY dr.donation_date DESC
    ');
    $s->execute([$donor['id']]);
    $donations = $s->fetchAll();

    jsonResponse(['success' => true, 'donations' => $donations, 'total' => count($donations)]);
}

// نصائح
function donorGetTips(): void {
    $type = $_GET['type'] ?? 'whole';
    $db   = getDB();
    $stmt = $db->prepare("
        SELECT id, category, title, content
        FROM post_donation_tips
        WHERE is_active = 1 AND (applies_to_type = 'all' OR applies_to_type = ?)
        ORDER BY sort_order ASC
    ");
    $stmt->execute([$type]);
    jsonResponse(['success' => true, 'tips' => $stmt->fetchAll()]);
}

// 
// function donorUpdateProfile(array $user): void {
//     $body      = jsonBody();
//     $full_name = trim($body['full_name'] ?? '');
//     $latitude  = $body['latitude']  ?? null;
//     $longitude = $body['longitude'] ?? null;

//     $db = getDB();

//     if ($full_name) {
//         $db->prepare('UPDATE users SET full_name = ? WHERE id = ?')->execute([$full_name, $user['id']]);
//     }

//     if ($latitude && $longitude) {
//         $db->prepare('UPDATE donor_profiles SET latitude = ?, longitude = ? WHERE user_id = ?')
//            ->execute([$latitude, $longitude, $user['id']]);
//     }

//     jsonResponse(['success' => true, 'message' => 'Profile updated.']);
// }

// share
function donorGetShareCard(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT u.full_name, dp.blood_type,
            (SELECT COUNT(*) FROM donation_records WHERE donor_id = dp.id AND status=\'completed\') AS total_donations,
            (SELECT donation_date FROM donation_records WHERE donor_id = dp.id ORDER BY donation_date DESC LIMIT 1) AS last_donation
        FROM donor_profiles dp
        JOIN users u ON u.id = dp.user_id
        WHERE dp.user_id = ?
    ');
    $stmt->execute([$user['id']]);
    $d = $stmt->fetch();

    if (!$d) {
        jsonResponse(['success' => false, 'message' => 'Profile not found.'], 404);
    }

    $total = (int) $d['total_donations'];
    $s     = $total !== 1 ? 's' : '';

    jsonResponse([
        'success'    => true,
        'share_data' => [
            'full_name'       => $d['full_name'],
            'blood_type'      => $d['blood_type'],
            'total_donations' => $total,
            'last_donation'   => $d['last_donation'],
            'message'         => "I've donated blood {$total} time{$s}! 🩸 Blood type: {$d['blood_type']}. Every donation saves lives. Join me!",
        ],
    ]);
}