<?php 
//يعمل رمز عشوائي
function generateToken(): string {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    $token = 'DB-';
    for ($i = 0; $i < 5; $i++) {
        $token .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $token;
}

//حساب وقت انهاء صلاحية الرمز
$_ENV['TOKEN_EXPIRY_HOURS'] = 24;
function tokenExpiresAt(): string {
    $hours = (int) ($_ENV['TOKEN_EXPIRY_HOURS'] ?? 24);
    return date('Y-m-d H:i:s', time() + $hours * 3600);
}

//الفتره اللي يقدر يتبرع تاني بعدها
function nextEligibleDate(string $donationDate): string {
    $days = 56;
    return date('Y-m-d', strtotime($donationDate . " +{$days} days"));
}


?>