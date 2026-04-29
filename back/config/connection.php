<?php
$host="localhost";
$username="root";
$password="";
$dbname="smart_blood_bank";
$conn=mysqli_connect($host, $username, $password, $dbname);

if($conn)
{
    echo"connect";
}



?>