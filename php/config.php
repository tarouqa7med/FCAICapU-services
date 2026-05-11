<?php
/**
 * Database Configuration - FCAICapU Crowdfunding
*/
$host = 'localhost';
$dbname = 'fcaicrowdfund'; // Fixed to match setup.php
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    if (PHP_SAPI !== 'cli' && session_status() === PHP_SESSION_NONE && !headers_sent()) {
        session_start();
    }

    // Schema migration: ensure optional admin fields exist without breaking existing data.
    $projectTableExists = $pdo->query("SHOW TABLES LIKE 'projects'")->fetch();
    if ($projectTableExists) {
        $projectImageColumn = $pdo->query("SHOW COLUMNS FROM projects LIKE 'image'")->fetch();
        if (!$projectImageColumn) {
            $pdo->exec("ALTER TABLE projects ADD COLUMN image VARCHAR(255) DEFAULT ''");
        }
        $projectDescriptionColumn = $pdo->query("SHOW COLUMNS FROM projects LIKE 'description'")->fetch();
        if (!$projectDescriptionColumn) {
            $pdo->exec("ALTER TABLE projects ADD COLUMN description TEXT NULL");
        }
    }
} catch(PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]));
}

?>

