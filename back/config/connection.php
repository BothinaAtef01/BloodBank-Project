<?php

$host   = "localhost";
$username = "root";
$password = "";
$dbname = "smart_blood_bank";

function getDB(): PDO {
    global $host, $username, $password, $dbname;
    
    static $pdo = null;
    
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }
    
    return $pdo;
}

try {
    getDB();
    echo "connect";
} catch (Exception $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
