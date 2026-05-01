<?php
// middleware/auth.php — Session-based authentication & role/permission guards

require_once __DIR__ . '/../config/connection.php';

// نبدأ السيشن إذا ما بدأت
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// بشوف لو المستخدم مسجل وصالح
function authenticate(): array {
    // بدل ما نقرأ Authorization header، نقرأ من السيشن مباشرة
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['success' => false, 'message' => 'Not logged in.'], 401);
        exit;
    }

    // كل ما المستخدم يدخل الموقع نجدد السيشن 30 يوم
    $days = (int) ($_ENV['SESSION_LIFETIME_DAYS'] ?? 30);
    session_set_cookie_params([
        'lifetime' => $days * 24 * 3600,
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    ini_set('session.gc_maxlifetime', $days * 24 * 3600);
    session_regenerate_id(false); 
    
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, email, role, full_name, is_active FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user || !$user['is_active']) {
        // لو الحساب اتوقف نحذف السيشن فوراً
        session_destroy();
        jsonResponse(['success' => false, 'message' => 'Account not found or deactivated.'], 401);
        exit;
    }

    return $user;
}

// تتأكد إن المستخدم عنده الصلاحيات المناسبه
function authorize(array $roles, array $user): void {
    if (!isset($user['role']) || !in_array($user['role'], $roles, true)) {
        jsonResponse(['success' => false, 'message' => 'Access denied.'], 403);
        exit;
    }
}

function requirePermission(string $permission, array $user): void {
    if (isset($user['role']) && $user['role'] === 'admin') return;

    $db   = getDB();
    $stmt = $db->prepare('
        SELECT sp.id FROM staff_permissions sp
        JOIN staff_profiles stf ON stf.id = sp.staff_id
        WHERE stf.user_id = ? AND sp.permission = ? AND sp.is_active = 1
    ');
    $stmt->execute([$user['id'] ?? 0, $permission]);

    if (!$stmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Access denied.'], 403);
        exit;
    }
}