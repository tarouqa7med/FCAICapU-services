<?php
/**
 * Database Configuration
 * FCAICapU-Crowdfunding System
 */
session_start();

$host = 'localhost';
$dbname = 'crowdfunding';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    
    // ✅ Check if users table exists
    $tables = $pdo->query("SHOW TABLES LIKE 'users'")->rowCount();
    if ($tables === 0) {
        throw new Exception('Users table does not exist');
    }
    
} catch(PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Database connection error: ' . $e->getMessage()
    ]);
    exit();
} catch(Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => $e->getMessage()
    ]);
    exit();
}
?>