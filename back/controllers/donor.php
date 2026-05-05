<?php

require_once __DIR__ . '/../config/connection.php';

//يرجع بيانات المتبرع dashboard
function donorGetProfile(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT  email,                      
                full_name  ,        
                date_of_birth ,
                phone_num,              
                blood_type  ,       
        FROM donors
        WHERE donor_unique_id = ?
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
    
    $db = getDB();

    $stmt = $db->prepare('
        SELECT hospital_id,hospital_name,location,contact_info
        FROM hospitals
    ');

     $stmt->execute(); 

    jsonResponse([
        'success' => true,
        'centers' => $stmt->fetchAll()
    ]);
}

//تاريخ التبرعات
function donorGetDonationHistory(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id FROM donors WHERE user_id = ?');
    $stmt->execute([$user['id']]);
    $donor = $stmt->fetch();

    if (!$donor) {
        jsonResponse(['success' => false, 'message' => 'Profile not found.'], 404);
    }

    $s = $db->prepare('
         SELECT last_donation_date
         FROM donors
         WHERE id = ?
    ');
    $s->execute([$donor['id']]);
    $donations = $s->fetchAll();

    jsonResponse([
    'success' => true, 
    'donations' => $donations
    ]);
}



// share
function donorGetShareCard(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT full_name, blood_type,
            (SELECT COUNT(*) FROM donation_records WHERE donor_id = dp.id AND status=\'completed\') AS total_donations,
            (SELECT donation_date FROM donation_records WHERE donor_id = dp.id ORDER BY donation_date DESC LIMIT 1) AS last_donation
        FROM donors dp
        JOIN users u ON u.id = dp.user_id
        WHERE dp.user_id = ?
    ');
    $stmt->execute([$user['id']]);
    $d = $stmt->fetch();

    if (!$d) {
        jsonResponse(['success' => false, 'message' => 'Profile not found.'], 404);
    }

    $total = (int) $d['total_donations'];
    $s = $total !== 1 ? 's' : '';

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