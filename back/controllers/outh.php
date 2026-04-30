<?php
// outh.php — Session-based auth functions (login, register, validate token)

require_once __DIR__ . '/../config/db.php';

// نبدأ السيشن في كل الدوال اللي تحتاجها
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// login
function login(): void {
    $body     = jsonBody();
    $email    = trim($body['email']    ?? '');
    $password = trim($body['password'] ?? '');

    if (!$email || !$password) {
        jsonResponse(['success' => false, 'message' => 'Email and password are required.'], 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !$user['is_active'] || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid credentials.'], 401);
    }

    // يحدث آخر تسجيل دخول للمستخدم
    $db->prepare('UPDATE users SET last_login = NOW() WHERE id = ?')->execute([$user['id']]);
    
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


    // ===== هنا الفرق الأساسي =====
    // بدل ما نولد JWT token، نحفظ بيانات المستخدم في السيشن على السيرفر
    // session_regenerate_id يحمي من هجمة Session Fixation
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role']    = $user['role'];
    // ==============================

    $profile = null;

    if ($user['role'] === 'donor') {
        $s = $db->prepare('SELECT * FROM donor_profiles WHERE user_id = ?');
        $s->execute([$user['id']]);
        $profile = $s->fetch() ?: null;
    } elseif ($user['role'] === 'staff') {
        $s = $db->prepare('
            SELECT sp.*, bc.name AS center_name
            FROM staff_profiles sp
            JOIN blood_centers bc ON bc.id = sp.center_id
            WHERE sp.user_id = ?
        ');
        $s->execute([$user['id']]);
        $profile = $s->fetch() ?: null;
    } elseif ($user['role'] === 'admin') {
        $s = $db->prepare('SELECT * FROM admin_profiles WHERE user_id = ?');
        $s->execute([$user['id']]);
        $profile = $s->fetch() ?: null;
    }

    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'user'    => [
            'id'        => $user['id'],
            'email'     => $user['email'],
            'full_name' => $user['full_name'],
            'role'      => $user['role'],
            'phone'     => $user['phone'],
            'profile'   => $profile,
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
    $stmt = $db->prepare('
        SELECT drt.*, bc.name AS center_name, bc.city
        FROM donor_registration_tokens drt
        JOIN blood_centers bc ON bc.id = drt.center_id
        WHERE drt.token_code = ?
    ');
    $stmt->execute([$token_code]);
    $token = $stmt->fetch();

    if (!$token) {
        jsonResponse(['success' => false, 'message' => 'Invalid registration code.'], 404);
    }
    if ($token['status'] === 'used') {
        jsonResponse(['success' => false, 'message' => 'This code has already been used.'], 400);
    }
    if ($token['status'] === 'expired' || strtotime($token['expires_at']) < time()) {
        $db->prepare("UPDATE donor_registration_tokens SET status='expired' WHERE id=?")->execute([$token['id']]);
        jsonResponse(['success' => false, 'message' => 'This code has expired. Please visit the center again.'], 400);
    }

    jsonResponse([
        'success'      => true,
        'message'      => 'Token is valid. Please complete your registration.',
        'token_id'     => $token['id'],
        'email' => $token['email'],
        'center'       => ['name' => $token['center_name'], 'city' => $token['city']],
    ]);
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
    $stmt = $db->prepare("SELECT * FROM donor_registration_tokens WHERE token_code = ? AND status = 'pending' AND expires_at > NOW()");
    $stmt->execute([$token_code]);
    $regToken = $stmt->fetch();

    if (!$regToken) {
        jsonResponse(['success' => false, 'message' => 'Invalid or expired registration code.'], 400);
    }

    $check = $db->prepare('SELECT id FROM users WHERE email = ?');
    $check->execute([$email]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email already registered.'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    try {
        $db->beginTransaction();

        $stmt = $db->prepare("INSERT INTO users (email, username, password_hash, role, full_name, phone, is_active) VALUES (?, ?, ?, 'donor', ?, ?, 1)");
        $stmt->execute([$email, $username, $hash, $full_name, $regToken['phone_number']]);
        $userId = (int) $db->lastInsertId();

        $db->prepare('
            INSERT INTO donor_profiles (user_id, registration_token_id, date_of_birth, gender, blood_type, weight_kg, national_id, medical_conditions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ')->execute([$userId, $regToken['id'], $date_of_birth, $gender, $blood_type, $weight_kg, $national_id, $medical_conditions]);

        $db->prepare("UPDATE donor_registration_tokens SET status='used', used_at=NOW() WHERE id=?")->execute([$regToken['id']]);

        $db->commit();
     try {
      require_once __DIR__ . '/../services/email.php';
       sendWelcomeCredentials($email, $full_name, $password, $username);
    } catch (Exception $e) {
     error_log('Welcome email failed: ' . $e->getMessage());
    }

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
            'phone'     => $regToken['phone_number'],
        ],
    ], 201);
}

function getMe(array $user): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, email, full_name, role, phone, created_at FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    jsonResponse(['success' => true, 'user' => $stmt->fetch()]);
}