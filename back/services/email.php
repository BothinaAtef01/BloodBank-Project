<?php
// services/email.php — Mailtrap email sender

function sendWelcomeCredentials(string $emailAddress, string $fullName, string $password, string $username): string {
    $host     = $_ENV['MAIL_HOST']     ?? 'sandbox.smtp.mailtrap.io';
    $port     = $_ENV['MAIL_PORT']     ?? '587';
    $username = $_ENV['MAIL_USERNAME'] ?? '';
    $smtp_password = $_ENV['MAIL_PASSWORD'] ?? '';
    $from     = $_ENV['MAIL_FROM']     ?? 'noreply@bloodbank.com';

   $subject = "🩸 Welcome to Blood Bank - Your Login Credentials";
   $body = "Hello {$fullName},\r\n\r\n"
         . "Your account has been created successfully!\r\n\r\n"
         . "Your login credentials:\r\n"
         . "Username: {$username}\r\n"
         . "Password: {$password}\r\n\r\n"
         . "Please keep these details in a safe place.\r\n"
         . "Do not share them with anyone.";

    // اتصال بـ SMTP
    $socket = fsockopen("tls://{$host}", (int)$port, $errno, $errstr, 10);
    if (!$socket) {
        throw new RuntimeException("Mail connection failed: {$errstr}");
    }

    $read = fn() => fgets($socket, 512);
    $send = fn($cmd) => fputs($socket, $cmd . "\r\n");

    $read(); // 220 welcome

    $send("EHLO bloodbank.local");
    while ($line = $read()) {
        if (str_starts_with($line, '250 ')) break;
    }

    $send("AUTH LOGIN");
    $read();
    $send(base64_encode($username));
    $read();
    $send(base64_encode($password));
    $read(); // 235 authenticated

    $send("MAIL FROM:<{$from}>");
    $read();
    $send("RCPT TO:<{$emailAddress}>");
    $read();
    $send("DATA");
    $read();

    $send("From: Blood Bank <{$from}>");
    $send("To: {$emailAddress}");
    $send("Subject: {$subject}");
    $send("Content-Type: text/plain; charset=UTF-8");
    $send("");
    $send($body);
    $send(".");
    $response = $read(); // 250 OK + message id

    $send("QUIT");
    fclose($socket);

    // نجيب الـ message id من الرد
    if (!str_starts_with(trim($response), '250')) {
        throw new RuntimeException("Mail failed: {$response}");
    }

    preg_match('/\S+@\S+/', $response, $m);
    return $m[0] ?? uniqid('mail_');
}