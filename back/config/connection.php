<?php
$host   = "localhost";
$username = "root";
$password = "";
$dbname = "smart_blood_bank";
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";


try {
    $con = new PDO($dsn,$username,$password);
    $con->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
