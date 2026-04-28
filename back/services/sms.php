<?php 
//ترسل الكود للمتبرع SMS


function sendRegistrationToken(string $phoneNumber, string $tokenCode, string $centerName): string {
    $sid   = $_ENV['TWILIO_ACCOUNT_SID']  ?? '';
    $token = $_ENV['TWILIO_AUTH_TOKEN']   ?? '';
    $from  = $_ENV['TWILIO_PHONE_NUMBER'] ?? '';
    $hours = $_ENV['TOKEN_EXPIRY_HOURS']  ?? '24';

    $body = "🩸 Blood Bank Registration\n"
          . "Your registration code from {$centerName} is:\n\n"
          . "{$tokenCode}\n\n"
          . "Enter this code on the registration page to create your account.\n"
          . "This code expires in {$hours} hours.";

    $url  = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";
    $data = http_build_query(['Body' => $body, 'From' => $from, 'To' => $phoneNumber]);

    $ctx = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Authorization: Basic " . base64_encode("{$sid}:{$token}") . "\r\n"
                       . "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $data,
            'ignore_errors' => true,
        ],
    ]);

    $result   = file_get_contents($url, false, $ctx);
    $response = json_decode($result, true);

    if (empty($response['sid'])) {
        throw new RuntimeException($response['message'] ?? 'SMS failed');
    }

    return $response['sid'];
}



?>