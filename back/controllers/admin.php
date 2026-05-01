<?php

require_once __DIR__ . '/../config/connection.php';
require_once __DIR__ . '/../middleware/audit.php';

//admin dashboard
function adminGetDashboard(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM admin WHERE id = ?');
    $stmt->execute([$user['id']]);
    $admin = $stmt->fetch();

    $centerId     = $admin['managed_center_id'];

    $totalDonors    = $db->query('SELECT COUNT(*) FROM donors')->fetchColumn();
    $totalStaff     = $db->query('SELECT COUNT(*) FROM staff')->fetchColumn();
    $totalCenters   = $db->query("SELECT COUNT(*) FROM hospitals")->fetchColumn();
    $totalDonations = $db->query("SELECT COUNT(*) FROM donations")->fetchColumn();


    jsonResponse([
        'success' => true,
        'stats'   => [
            'total_donors'         => (int) $totalDonors,
            'total_staff'          => (int) $totalStaff,
            'total_donations'      => (int) $totalDonations,
            'total_centers'        => (int) $totalCenters,
        ],
       'admin_profile' => $admin
    ]);
}

// يعرض كل حسابات الموظفين
function adminGetAccounts(): void {
    $page   = max(1, (int) ($_GET['page']  ?? 1));
    $limit  = max(1, (int) ($_GET['limit'] ?? 20));

    $db  = getDB();

    $users = $db->query("SELECT id, email, full_name, phone,is_active, created_at,last_login 
    FROM staff")->fetchAll();
    $total = $db->query("SELECT * FROM staff ")->fetchColumn();

    jsonResponse(['success' => true, 
    'users' => $users, 
    'total' => (int) $total, 
    'page' => $page,
     'limit' => $limit]);
}

//يضيف موظف جديد
function adminCreateStaffAccount(array $user): void {
    $body = jsonBody();

    $db = getDB();
    $ch = $db->prepare('SELECT staff_id FROM staff WHERE email = ?');
    $ch->execute([$body['email']]);
    if ($ch->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email already in use.'], 409);
    }

    $hash = password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]);

    try {
        $db->beginTransaction();

        $db->prepare('INSERT INTO staff (staff_id, hospital_id,full_name,username,password_hash) VALUES (?, ?, ?, ?, ?)')
         ->execute([
            $body['email'],
            $hash,
            $body['full_name'],
            $body['username'],
            $body['staff_id'],
            $body['hospital_id']
        ]);
        $staffId = (int) $db->lastInsertId();

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack(); throw $e;
    }

    auditLog(['userId' => $user['id'], 'action' => 'create_staff_account', 'targetTable' => 'staff', 'targetId' => $staffId, 'newValue' => ['email' => $body['email'], 'center_id' => $body['center_id']], 'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null]);

    jsonResponse(['success' => true, 'message' => 'Staff account created successfully.', 'user_id' => $staffId, 'staff_id' => $staffId], 201);
}


//يمنح صلاحية للموضف
// function adminGrantPermission(array $user): void {
//     $body = jsonBody();
//     $db   = getDB();

//     $adminRows = $db->prepare('SELECT id FROM admin_profiles WHERE user_id = ?');
//     $adminRows->execute([$user['id']]);
//     $admin = $adminRows->fetch();

//     $db->prepare('
//         INSERT INTO staff_permissions (staff_id, granted_by_admin_id, permission, is_active)
//         VALUES (?, ?, ?, 1)
//         ON DUPLICATE KEY UPDATE is_active=1, granted_at=NOW(), revoked_at=NULL, granted_by_admin_id=VALUES(granted_by_admin_id)
//     ')->execute([$body['staff_id'], $admin['id'], $body['permission']]);

//     auditLog(['userId' => $user['id'], 'action' => 'grant_permission', 'targetTable' => 'staff_permissions', 'newValue' => ['staff_id' => $body['staff_id'], 'permission' => $body['permission']], 'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null]);

//     jsonResponse(['success' => true, 'message' => "Permission '{$body['permission']}' granted."]);
// }

//يحذف الموضف
function admindeleteStaff(array $user): void {
    $body = jsonBody();
    $db   = getDB();

    $stmt= $db->prepare('DELETE FROM staff WHERE staff_id=?');
    $stmt->execute([$body['staff_id']]);


    jsonResponse([
     'success' => true,
     'message' => "Staff member deleted successfully."]);
}

//ادارة المخزون
function adminGetInventory(): void {
    $centerId = $_GET['center_id'] ?? null;
    $db       = getDB();

    $filter = $centerId ? 'WHERE bi.center_id = ?' : '';
    $params = $centerId ? [$centerId] : [];

    $stmt = $db->prepare("
        SELECT bi.id, bi.units_available, bi.units_reserved,
               bi.minimum_threshold, bi.updated_at, bc.name AS center_name, bc.city,
               CASE WHEN bi.units_available < bi.minimum_threshold THEN 1 ELSE 0 END AS is_shortage
        FROM blood_inventory bi
        JOIN blood_centers bc ON bc.id = bi.center_id
        {$filter}
        ORDER BY bc.name, bi.blood_type
    ");
    $stmt->execute($params);
    jsonResponse(['success' => true, 'inventory' => $stmt->fetchAll()]);
}

//تحديث المخزون
function adminUpdateInventory(array $user, int $id): void {
    $body = jsonBody();
    $db   = getDB();

    $stmt = $db->prepare('SELECT * FROM blood_inventory WHERE id = ?');
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if (!$current) jsonResponse(['success' => false, 'message' => 'Inventory record not found.'], 404);

    $adminStmt = $db->prepare('SELECT id FROM admin_profiles WHERE user_id = ?');
    $adminStmt->execute([$user['id']]);
    $adminRow = $adminStmt->fetch();

    try {
        $db->beginTransaction();

        $db->prepare('UPDATE blood_inventory SET units_available=COALESCE(?,units_available), units_reserved=COALESCE(?,units_reserved), minimum_threshold=COALESCE(?,minimum_threshold) WHERE id=?')
           ->execute([$body['units_available'] ?? null, $body['units_reserved'] ?? null, $body['minimum_threshold'] ?? null, $id]);

        if (!empty($body['transaction_type']) && isset($body['units_available'])) {
            $diff = $body['units_available'] - $current['units_available'];
            if ($diff !== 0) {
                $db->prepare('INSERT INTO inventory_transactions (center_id, recorded_by, blood_type, transaction_type, units, notes) VALUES (?, ?, ?, ?, ?, ?)')
                   ->execute([$current['center_id'], $adminRow['id'], $current['blood_type'], $body['transaction_type'], abs($diff), $body['notes'] ?? null]);
            }
        }

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack(); throw $e;
    }

    auditLog(['userId' => $user['id'], 'action' => 'update_inventory', 'targetTable' => 'blood_inventory', 'targetId' => $id, 'oldValue' => $current, 'newValue' => $body, 'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null]);

    jsonResponse(['success' => true, 'message' => 'Inventory updated.']);
}

// عرض تقارير المخزون
function adminGetReports(): void {
    $db     = getDB();
    $stmt = $db->prepare("
        SELECT * FROM blood_inventory 
    ");
    $stmt->execute();
    jsonResponse(['success' => true, 'stmt' => $stmt->fetchAll()]);
}


// عرض قائمة الفروع
function adminGetBranches(): void {
    $db   = getDB();
    $rows = $db->query('
        SELECT * from hospitals
    ')->fetchAll();
    jsonResponse(['success' => true, 'branches' => $rows]);
}