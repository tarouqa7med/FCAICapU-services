<?php
// Database configuration for XAMPP MySQL
$host = 'localhost';
$dbname = 'fcaicrowdfund';
$username = 'root';
$password = '';

try {
$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4");
} catch(PDOException $e) {
    // If DB doesn't exist, we'll create it in setup.php
    die("Connection failed: " . $e->getMessage());
}

session_start(); // Start session for all pages
?>

