<?php
// middleware/auth.php — JWT authentication & role/permission guards

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

//composer install
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// بشوف لوالمستخدم مسجل و صالح
function authenticate(): array {
    $headers = getallheaders();
    $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$auth || !str_starts_with($auth, 'Bearer ')) {
        jsonResponse(['success' => false, 'message' => 'No token provided.'], 401);
        exit;
    }

    $token = substr($auth, 7);
    try {
        $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'] ?? '', 'HS256'));
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'message' => 'Invalid or expired token.'], 401);
        exit;
    }

    $db   = getDB();
    $stmt = $db->prepare('SELECT id, email, role, full_name, is_active FROM users WHERE id = ?');
    $stmt->execute([$decoded->id ?? 0]);
    $user = $stmt->fetch();

    if (!$user || !$user['is_active']) {
        jsonResponse(['success' => false, 'message' => 'Account not found or deactivated.'], 401);
        exit;
    }

    return $user;
}

//تتأكد إن المستخدم عنده الصلاحيات المناسبه 
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


?>