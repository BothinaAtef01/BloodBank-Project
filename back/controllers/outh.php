<?php
//(login, register, validate token)

require_once __DIR__ . '/../config/connection.php';


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// login
function login(): void {
    $body   = jsonBody();
    $email    = trim($body['email']    ?? '');
    $password = trim($body['password'] ?? '');

    if (!$email || !$password) {
        jsonResponse(['success' => false, 'message' => 'Email and password are required.'], 400);
    }

    $db   = getDB();
    $role    = null;
    $user    = null;

    $stmt = $db->prepare('SELECT * FROM donors WHERE email = ?');
    $stmt->execute([$email]);
    $found = $stmt->fetch();
    if ($found) {
        $role = 'donor';
        $user = $found;
    }

    if (!$user) {
        $stmt = $db->prepare('SELECT * FROM staff WHERE email = ?');
        $stmt->execute([$email]);
        $found = $stmt->fetch();
        if ($found) {
            $role = 'staff';
            $user = $found;
        }
    }

    if (!$user) {
        $stmt = $db->prepare('SELECT * FROM admins WHERE email = ?');
        $stmt->execute([$email]);
        $found = $stmt->fetch();
        if ($found) {
            $role = 'admin';
            $user = $found;
        }
    }

    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Invalid credentials.'], 401);
    }

    if (!password_verify($password, $user['password'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid credentials.'], 401);
    }

    // ===== Remember Me =====
    $days = (int) ($_ENV['SESSION_LIFETIME_DAYS'] ?? 30);
    session_set_cookie_params([
        'lifetime' => $days * 24 * 3600,
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    ini_set('session.gc_maxlifetime', $days * 24 * 3600);

    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role']    = $role;

    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'user'    => [
            'id'        => $user['id'],
            'email'     => $user['email'],
            'full_name' => $user['full_name'],
            'role'      => $role,
        ],
    ]);
}

// logout
function logout(): void {
    // نمسح كل بيانات السيشن ونحذفها من السيرفر
    $_SESSION = [];
    session_destroy();
    jsonResponse(['success' => true, 'message' => 'Logged out successfully.']);
}

// التأكد من الكود اللي وصل المستخدم
function validateRegistrationToken(): void {
    $body       = jsonBody();
    $token_code = strtoupper(trim($body['token_code'] ?? ''));

    if (!$token_code) {
        jsonResponse(['success' => false, 'message' => 'Token code is required.'], 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM donors WHERE donor_unique_id = ?');
    $stmt->execute([$token_code]);
    $donor = $stmt->fetch();

    if (!$donor) {
        jsonResponse(['success' => false, 'message' => 'Invalid registration code.'], 404);
    }

    jsonResponse(['success' => true, 'message' => 'Token is valid. Please complete your registration.']);
    registerDonor();
}

// إنشاء حساب جديد عن طريق الكود
function registerDonor(): void {
    $body = jsonBody();

    $token_code         = strtoupper(trim($body['token_code']         ?? ''));
    $email              = trim($body['email']              ?? '');
    $password           = trim($body['password']           ?? '');
    $full_name          = trim($body['full_name']           ?? '');
    $username           = trim($body['username']           ?? '');
    $date_of_birth      = $body['date_of_birth']      ?? null;
    $gender             = $body['gender']             ?? null;
    $blood_type         = $body['blood_type']         ?? null;
    $weight_kg          = $body['weight_kg']          ?? null;
    $national_id        = $body['national_id']        ?? null;
    $medical_conditions = $body['medical_conditions'] ?? null;

    $db = getDB();

    // Re-validate 
    $stmt = $db->prepare('SELECT * FROM donors WHERE donor_unique_id = ?');
    $stmt->execute([$token_code]);
    $donor= $stmt->fetch();

    if (!$donor) {
        jsonResponse(['success' => false, 'message' => 'Invalid registration code.'], 400);
    }

    $check = $db->prepare('SELECT id FROM donors WHERE email = ?');
    $check->execute([$email]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email already registered.'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    try {
        $db->beginTransaction();

          $db->prepare('
            UPDATE donors SET
                email              = ?,
                username           = ?,
                password           = ?,
                full_name          = ?,
                date_of_birth      = ?,
                gender             = ?,
                blood_type         = ?,
                weight_kg          = ?,
                national_id        = ?,
                medical_conditions = ?
            WHERE donor_unique_id  = ?
        ')->execute([
            $email, $username, $hash, $full_name,
            $date_of_birth, $gender, $blood_type,
            $weight_kg, $national_id, $medical_conditions,
            $token_code
        ]);
 
        $userId = $donor['id'];
 
        $db->commit();
 
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }
 
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
    $_SESSION['role']    = 'donor';
 
    jsonResponse([
        'success' => true,
        'message' => 'Account created successfully. Welcome!',
        'user'    => [
            'id'        => $userId,
            'email'     => $email,
            'full_name' => $full_name,
            'role'      => 'donor',
        ],
    ], 201);
}
 
function getMe(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, email, full_name, role, phone, created_at FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    jsonResponse(['success' => true, 'user' => $stmt->fetch()]);
}