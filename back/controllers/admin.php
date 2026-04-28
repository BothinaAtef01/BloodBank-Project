<?php


require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/audit.php';

//admin/dashboard
function adminGetDashboard(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM admin_profiles WHERE user_id = ?');
    $stmt->execute([$user['id']]);
    $admin = $stmt->fetch();

    $isSuper      = $admin['access_level'] === 'super' || !$admin['managed_center_id'];
    $centerId     = $admin['managed_center_id'];

    $totalDonors    = $db->query('SELECT COUNT(*) FROM donor_profiles')->fetchColumn();
    $totalStaff     = $db->query('SELECT COUNT(*) FROM staff_profiles')->fetchColumn();
    $totalCenters   = $db->query("SELECT COUNT(*) FROM blood_centers WHERE is_active=1")->fetchColumn();

    $donFilter = $isSuper ? '' : "AND dr.center_id = {$centerId}";
    $totalDonations = $db->query("SELECT COUNT(*) FROM donation_records WHERE status='completed' {$donFilter}")->fetchColumn();
    $monthDonations = $db->query("SELECT COUNT(*) FROM donation_records WHERE status='completed' AND MONTH(donation_date)=MONTH(NOW()) AND YEAR(donation_date)=YEAR(NOW()) {$donFilter}")->fetchColumn();

    $invFilter = $isSuper ? '' : "AND bi.center_id = {$centerId}";
    $shortages = $db->query("SELECT bi.blood_type, bi.units_available, bi.minimum_threshold, bc.name AS center_name FROM blood_inventory bi JOIN blood_centers bc ON bc.id = bi.center_id WHERE bi.units_available < bi.minimum_threshold {$invFilter} ORDER BY bi.units_available ASC")->fetchAll();

    $recentDonations = $db->query("SELECT u.full_name, dp.blood_type, dr.donation_date, dr.status, bc.name AS center_name FROM donation_records dr JOIN donor_profiles dp ON dp.id = dr.donor_id JOIN users u ON u.id = dp.user_id JOIN blood_centers bc ON bc.id = dr.center_id WHERE dr.status='completed' {$donFilter} ORDER BY dr.donation_date DESC LIMIT 5")->fetchAll();

    jsonResponse([
        'success' => true,
        'stats'   => [
            'total_donors'         => (int) $totalDonors,
            'total_staff'          => (int) $totalStaff,
            'total_donations'      => (int) $totalDonations,
            'total_centers'        => (int) $totalCenters,
            'donations_this_month' => (int) $monthDonations,
            'shortage_alerts'      => count($shortages),
        ],
        'shortages'          => $shortages,
        'recent_donations'   => $recentDonations,
    ]);
}

// يعرض كل الحسابات
function adminGetAccounts(): void {
    $role   = $_GET['role']  ?? null;
    $page   = max(1, (int) ($_GET['page']  ?? 1));
    $limit  = max(1, (int) ($_GET['limit'] ?? 20));
    $offset = ($page - 1) * $limit;

    $db     = getDB();
    $where  = $role ? "AND u.role = " . $db->quote($role) : '';

    $users = $db->query("SELECT u.id, u.email, u.full_name, u.phone, u.role, u.is_active, u.created_at, u.last_login FROM users u WHERE 1=1 {$where} ORDER BY u.created_at DESC LIMIT {$limit} OFFSET {$offset}")->fetchAll();
    $total = $db->query("SELECT COUNT(*) FROM users WHERE 1=1 {$where}")->fetchColumn();

    jsonResponse(['success' => true, 'users' => $users, 'total' => (int) $total, 'page' => $page, 'limit' => $limit]);
}

//
function adminCreateStaffAccount(array $user): void {
    $body = jsonBody();

    $db = getDB();
    $ch = $db->prepare('SELECT id FROM users WHERE email = ? OR phone = ?');
    $ch->execute([$body['email'], $body['phone']]);
    if ($ch->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email or phone already in use.'], 409);
    }

    $hash = password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]);

    try {
        $db->beginTransaction();

        $db->prepare("INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (?, ?, 'staff', ?, ?)")
           ->execute([$body['email'], $hash, $body['full_name'], $body['phone']]);
        $userId = (int) $db->lastInsertId();

        $db->prepare('INSERT INTO staff_profiles (user_id, center_id, employee_code, job_title, department, hired_at) VALUES (?, ?, ?, ?, ?, ?)')
           ->execute([$userId, $body['center_id'], $body['employee_code'], $body['job_title'] ?? null, $body['department'] ?? null, $body['hired_at'] ?? null]);
        $staffId = (int) $db->lastInsertId();

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack(); throw $e;
    }

    auditLog(['userId' => $user['id'], 'action' => 'create_staff_account', 'targetTable' => 'users', 'targetId' => $userId, 'newValue' => ['email' => $body['email'], 'center_id' => $body['center_id']], 'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null]);

    jsonResponse(['success' => true, 'message' => 'Staff account created successfully.', 'user_id' => $userId, 'staff_id' => $staffId], 201);
}

// POST /api/admin/accounts/admin
// function adminCreateAdminAccount(array $user): void {
//     $body = jsonBody();
//     $db   = getDB();

//     $my = $db->prepare('SELECT access_level FROM admin_profiles WHERE user_id = ?');
//     $my->execute([$user['id']]);
//     $myAdmin = $my->fetch();
//     if (!$myAdmin || $myAdmin['access_level'] !== 'super') {
//         jsonResponse(['success' => false, 'message' => 'Only super admins can create admin accounts.'], 403);
//     }

//     $hash = password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]);

//     try {
//         $db->beginTransaction();
//         $db->prepare("INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (?, ?, 'admin', ?, ?)")
//            ->execute([$body['email'], $hash, $body['full_name'], $body['phone']]);
//         $userId = (int) $db->lastInsertId();
//         $db->prepare('INSERT INTO admin_profiles (user_id, access_level, managed_center_id) VALUES (?, ?, ?)')
//            ->execute([$userId, $body['access_level'] ?? 'center', $body['managed_center_id'] ?? null]);
//         $db->commit();
//     } catch (Exception $e) {
//         $db->rollBack(); throw $e;
//     }

//     jsonResponse(['success' => true, 'message' => 'Admin account created.', 'user_id' => $userId], 201);
// }

/////
// function adminToggleAccount(array $user, int $targetId): void {
//     $db   = getDB();
//     $stmt = $db->prepare('SELECT id, is_active, role FROM users WHERE id = ?');
//     $stmt->execute([$targetId]);
//     $target = $stmt->fetch();

//     if (!$target) jsonResponse(['success' => false, 'message' => 'User not found.'], 404);

//     $newStatus = $target['is_active'] ? 0 : 1;
//     $db->prepare('UPDATE users SET is_active = ? WHERE id = ?')->execute([$newStatus, $targetId]);

//     auditLog(['userId' => $user['id'], 'action' => $newStatus ? 'activate_account' : 'deactivate_account', 'targetTable' => 'users', 'targetId' => $targetId, 'oldValue' => ['is_active' => $target['is_active']], 'newValue' => ['is_active' => $newStatus], 'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null]);

//     jsonResponse(['success' => true, 'message' => 'Account ' . ($newStatus ? 'activated' : 'deactivated') . '.', 'is_active' => (bool) $newStatus]);
// }
/////////
//
// function adminGetStaffPermissions(int $staffId): void {
//     $db   = getDB();
//     $stmt = $db->prepare('
//         SELECT sp.id, sp.permission, sp.is_active, sp.granted_at, sp.revoked_at, u.full_name AS granted_by
//         FROM staff_permissions sp
//         JOIN admin_profiles ap ON ap.id = sp.granted_by_admin_id
//         JOIN users u ON u.id = ap.user_id
//         WHERE sp.staff_id = ?
//     ');
//     $stmt->execute([$staffId]);
//     jsonResponse(['success' => true, 'permissions' => $stmt->fetchAll()]);
// }

//يمنح صلاحية للموضف
function adminGrantPermission(array $user): void {
    $body = jsonBody();
    $db   = getDB();

    $adminRows = $db->prepare('SELECT id FROM admin_profiles WHERE user_id = ?');
    $adminRows->execute([$user['id']]);
    $admin = $adminRows->fetch();

    $db->prepare('
        INSERT INTO staff_permissions (staff_id, granted_by_admin_id, permission, is_active)
        VALUES (?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE is_active=1, granted_at=NOW(), revoked_at=NULL, granted_by_admin_id=VALUES(granted_by_admin_id)
    ')->execute([$body['staff_id'], $admin['id'], $body['permission']]);

    auditLog(['userId' => $user['id'], 'action' => 'grant_permission', 'targetTable' => 'staff_permissions', 'newValue' => ['staff_id' => $body['staff_id'], 'permission' => $body['permission']], 'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null]);

    jsonResponse(['success' => true, 'message' => "Permission '{$body['permission']}' granted."]);
}

//يحذف صلاحيه الموضف
function adminRevokePermission(array $user): void {
    $body = jsonBody();
    $db   = getDB();

    $db->prepare('UPDATE staff_permissions SET is_active=0, revoked_at=NOW() WHERE staff_id=? AND permission=?')
       ->execute([$body['staff_id'], $body['permission']]);

    auditLog(['userId' => $user['id'], 'action' => 'revoke_permission', 'targetTable' => 'staff_permissions', 'newValue' => ['staff_id' => $body['staff_id'], 'permission' => $body['permission']], 'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? null]);

    jsonResponse(['success' => true, 'message' => "Permission '{$body['permission']}' revoked."]);
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
    $where  = 'WHERE 1=1';
    $params = [];

    if (!empty($_GET['center_id'])) { $where .= ' AND ir.center_id = ?'; $params[] = $_GET['center_id']; }
    if (!empty($_GET['period']))    { $where .= ' AND ir.period = ?';    $params[] = $_GET['period'];    }
    if (!empty($_GET['status']))    { $where .= ' AND ir.status = ?';    $params[] = $_GET['status'];    }

    $stmt = $db->prepare("
        SELECT ir.*, bc.name AS center_name, u.full_name AS created_by_name
        FROM inventory_reports ir
        JOIN blood_centers bc ON bc.id = ir.center_id
        JOIN admin_profiles ap ON ap.id = ir.created_by_admin_id
        JOIN users u ON u.id = ap.user_id
        {$where}
        ORDER BY ir.created_at DESC
    ");
    $stmt->execute($params);
    jsonResponse(['success' => true, 'reports' => $stmt->fetchAll()]);
}

// انشاء تقرير للمخزون
function adminCreateReport(array $user): void {
    $body = jsonBody();
    $db   = getDB();

    $adminStmt = $db->prepare('SELECT id FROM admin_profiles WHERE user_id = ?');
    $adminStmt->execute([$user['id']]);
    $admin = $adminStmt->fetch();

    $inv = $db->prepare('SELECT blood_type, units_available, minimum_threshold FROM blood_inventory WHERE center_id = ?');
    $inv->execute([$body['center_id']]);
    $inventory = $inv->fetchAll();

    $shortage_summary = [];
    $surplus_summary  = [];
    foreach ($inventory as $row) {
        $diff = $row['units_available'] - $row['minimum_threshold'];
        if ($diff < 0)  $shortage_summary[$row['blood_type']] = abs($diff);
        elseif ($diff > 5) $surplus_summary[$row['blood_type']] = $diff;
    }

    $db->prepare('
        INSERT INTO inventory_reports (center_id, created_by_admin_id, report_date, period, shortage_summary, surplus_summary, recommendations, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ')->execute([
        $body['center_id'],
        $admin['id'],
        $body['report_date'] ?? date('Y-m-d'),
        $body['period']      ?? 'weekly',
        json_encode($shortage_summary),
        json_encode($surplus_summary),
        $body['recommendations'] ?? null,
        $body['status']          ?? 'draft',
    ]);
    $reportId = (int) $db->lastInsertId();

    jsonResponse(['success' => true, 'message' => 'Report created successfully.', 'report_id' => $reportId, 'shortage_summary' => $shortage_summary, 'surplus_summary' => $surplus_summary], 201);
}

// عرض قائمة الفروع
function adminGetBranches(): void {
    $db   = getDB();
    $rows = $db->query('
        SELECT bc.*,
            (SELECT COUNT(*) FROM staff_profiles WHERE center_id = bc.id) AS staff_count,
            (SELECT COUNT(*) FROM donation_records WHERE center_id = bc.id AND status=\'completed\') AS total_donations
        FROM blood_centers bc ORDER BY bc.name
    ')->fetchAll();
    jsonResponse(['success' => true, 'branches' => $rows]);
}

// اضافه فرع
function adminCreateBranch(): void {
    $body = jsonBody();
    $db   = getDB();

    $db->prepare('INSERT INTO blood_centers (name, address, city, latitude, longitude, phone, opening_hours) VALUES (?, ?, ?, ?, ?, ?, ?)')
       ->execute([$body['name'], $body['address'], $body['city'], $body['latitude'], $body['longitude'], $body['phone'], json_encode($body['opening_hours'] ?? [])]);

    jsonResponse(['success' => true, 'message' => 'Branch created.', 'center_id' => (int) $db->lastInsertId()], 201);
}