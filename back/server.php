<?php

declare(strict_types=1);

// ── Load .env ─────────────────────────────────────────────────────────────────
if (file_exists(__DIR__ . '/.env')) {
    foreach (file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($val);
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function jsonResponse(array $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function jsonBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw ?: '{}', true) ?? [];
}

// ── CORS & headers ────────────────────────────────────────────────────────────
$allowedOrigin = $_ENV['CLIENT_URL'] ?? 'http://localhost:3000';//
header("Access-Control-Allow-Origin: {$allowedOrigin}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


// ── Routing ───────────────────────────────────────────────────────────────────
require_once __DIR__ . '/middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = '/' . trim($uri, '/');


if (str_starts_with($uri, '/api')) {
    $uri = substr($uri, 4);
}

// ── Health check ──────────────────────────────────────────────────────────────
if ($uri === '/health' && $method === 'GET') {
    jsonResponse(['success' => true, 'message' => 'Blood Bank API is running', 'timestamp' => date('c')]);
}

// ── outh routes ───────────────────────────────────────────────────────────────
if (str_starts_with($uri, '/auth')) {
    require_once __DIR__ . '/controllers/outh.php';

    match (true) {
        $uri === '/auth/login'          && $method === 'POST' => login(),
        $uri === '/auth/validate-token' && $method === 'POST' => validateRegistrationToken(),
        $uri === '/auth/register-donor' && $method === 'POST' => registerDonor(),
        $uri === '/auth/me'             && $method === 'GET'  => getMe(authenticate()),
        $uri === '/auth/logout' && $method === 'POST' => logout(),
        default => jsonResponse(['success' => false, 'message' => "Route {$uri} not found."], 404),
    };
}

// ── Donor routes ──────────────────────────────────────────────────────────────
if (str_starts_with($uri, '/donor')) {
    require_once __DIR__ . '/controllers/donor.php';
    $user = authenticate();
    authorize(['donor'], $user);

    match (true) {
        $uri === '/donor/profile'          && $method === 'GET'   => donorGetProfile($user),
        $uri === '/donor/nearby-centers'   && $method === 'GET'   => donorGetNearbyCenters(),
        $uri === '/donor/donation-history' && $method === 'GET'   => donorGetDonationHistory($user),
        $uri === '/donor/tips'             && $method === 'GET'   => donorGetTips(),
        $uri === '/donor/share-card'       && $method === 'GET'   => donorGetShareCard($user),
        default => jsonResponse(['success' => false, 'message' => "Route {$uri} not found."], 404),
    };
}

// ── Staff routes ──────────────────────────────────────────────────────────────
if (str_starts_with($uri, '/staff')) {
    require_once __DIR__ . '/controllers/staff.php';
    $user = authenticate();
    authorize(['staff', 'admin'], $user);

    // Match parameterized routes
    
     if ($uri === '/staff/issue-token' && $method === 'POST') {
        requirePermission('issue_tokens', $user);
        staffIssueToken($user);
    } elseif ($uri === '/staff/donors/search' && $method === 'GET') {
        requirePermission('register_donor', $user);
        staffSearchDonors();
    } elseif (preg_match('#^/staff/donors/(\d+)$#', $uri, $m) && $method === 'GET') {
        requirePermission('register_donor', $user);
        staffGetDonorInfo((int) $m[1]);
    } elseif ($uri === '/staff/donations' && $method === 'POST') {
        requirePermission('run_tests', $user);
        staffAddDonation($user);
    } elseif (preg_match('#^/staff/donations/(\d+)/screening$#', $uri, $m) && $method === 'POST') {
        requirePermission('run_tests', $user);
        staffAddScreeningTest($user, (int) $m[1]);
    } else {
        jsonResponse(['success' => false, 'message' => "Route {$uri} not found."], 404);
    }
}

// ── Admin routes ──────────────────────────────────────────────────────────────
if (str_starts_with($uri, '/admin')) {
    require_once __DIR__ . '/controllers/admin.php';
    $user = authenticate();
    authorize(['admin'], $user);

    if      ($uri === '/admin/dashboard'                                        && $method === 'GET')    adminGetDashboard($user);
    elseif  ($uri === '/admin/accounts'                                         && $method === 'GET')    adminGetAccounts();
    elseif  ($uri === '/admin/accounts/staff'                                   && $method === 'POST')   adminCreateStaffAccount($user);
    elseif  ($uri === '/admin/permissions'                                      && $method === 'POST')   adminGrantPermission($user);
    elseif  ($uri === '/admin/permissions'                                      && $method === 'DELETE') adminRevokePermission($user);
    elseif  ($uri === '/admin/inventory'                                        && $method === 'GET')    adminGetInventory();
    elseif  (preg_match('#^/admin/inventory/(\d+)$#', $uri, $m)                && $method === 'PATCH')  adminUpdateInventory($user, (int) $m[1]);
    elseif  ($uri === '/admin/reports'                                          && $method === 'GET')    adminGetReports();
    elseif  ($uri === '/admin/branches'                                         && $method === 'GET')    adminGetBranches();
    else    jsonResponse(['success' => false, 'message' => "Route {$uri} not found."], 404);
}

// ── Centers routes (public) ───────────────────────────────────────────────────
if (str_starts_with($uri, '/centers')) {
    $db = require __DIR__ . '/config/db.php';
    require_once __DIR__ . '/config/db.php';

    if ($uri === '/centers' && $method === 'GET') {
        $lat = $_GET['lat'] ?? null;
        $lng = $_GET['lng'] ?? null;
        $db2 = getDB();

        if ($lat && $lng) {
            $stmt = $db2->prepare('SELECT id, name, address, city, phone, opening_hours, ROUND(6371*ACOS(COS(RADIANS(?))*COS(RADIANS(latitude))*COS(RADIANS(longitude)-RADIANS(?))+SIN(RADIANS(?))*SIN(RADIANS(latitude))),2) AS distance_km FROM blood_centers WHERE is_active=1 ORDER BY distance_km ASC');
            $stmt->execute([$lat, $lng, $lat]);
        } else {
            $stmt = $db2->query('SELECT id, name, address, city, phone, opening_hours FROM blood_centers WHERE is_active=1');
        }
        jsonResponse(['success' => true, 'centers' => $stmt->fetchAll()]);
    } elseif (preg_match('#^/centers/(\d+)$#', $uri, $m) && $method === 'GET') {
        $stmt = getDB()->prepare('SELECT id, name, address, city, phone, opening_hours FROM blood_centers WHERE id = ? AND is_active = 1');
        $stmt->execute([(int) $m[1]]);
        $center = $stmt->fetch();
        if (!$center) jsonResponse(['success' => false, 'message' => 'Center not found.'], 404);
        jsonResponse(['success' => true, 'center' => $center]);//
    } else {
        jsonResponse(['success' => false, 'message' => "Route {$uri} not found."], 404);
    }
}

// ── Inventory route (staff) ───────────────────────────────────────────────────
if ($uri === '/inventory' && $method === 'GET') {
    $user = authenticate();
    authorize(['staff', 'admin'], $user);
    requirePermission('view_inventory', $user);

    $db = getDB();
    if ($user['role'] !== 'admin') {
        $s = $db->prepare('SELECT center_id FROM staff_profiles WHERE user_id = ?');
        $s->execute([$user['id']]);
        $centerId = $s->fetchColumn();
    } else {
        $centerId = $_GET['center_id'] ?? null;
    }

    $filter = $centerId ? 'WHERE bi.center_id = ?' : '';
    $params = $centerId ? [$centerId] : [];

    $stmt = $db->prepare("SELECT bi.blood_type, bi.units_available, bi.minimum_threshold, CASE WHEN bi.units_available < bi.minimum_threshold THEN 1 ELSE 0 END AS is_shortage, bc.name AS center_name FROM blood_inventory bi JOIN blood_centers bc ON bc.id = bi.center_id {$filter} ORDER BY bi.blood_type");
    $stmt->execute($params);
    jsonResponse(['success' => true, 'inventory' => $stmt->fetchAll()]);
}

// ── 404 fallback ──────────────────────────────────────────────────────────────
jsonResponse(['success' => false, 'message' => "Route {$uri} not found."], 404);
