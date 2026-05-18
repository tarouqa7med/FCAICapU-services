<?php
/**
 * Database configuration for FCAICapU Crowdfunding.
 *
 * This file creates a shared PDO instance named $pdo and starts
 * a session if one is not already active.
 */

$host = 'localhost';
$dbname = 'fcaicrowdfund';
$username = 'root';
$password = '';

try {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // Keep the projects table compatible with the application only if the table already exists.
    if ($pdo->query("SHOW TABLES LIKE 'projects'")->fetch()) {
        $projectImageColumn = $pdo->query("SHOW COLUMNS FROM projects LIKE 'image'")->fetch();
        if (!$projectImageColumn) {
            $pdo->exec("ALTER TABLE projects ADD COLUMN image VARCHAR(255) DEFAULT ''");
        }

        $projectDescriptionColumn = $pdo->query("SHOW COLUMNS FROM projects LIKE 'description'")->fetch();
        if (!$projectDescriptionColumn) {
            $pdo->exec("ALTER TABLE projects ADD COLUMN description TEXT NULL");
        }
    }
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
}
?>

