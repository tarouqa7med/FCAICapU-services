<?php
/**
 * Database setup script for FCAICapU Crowdfunding.
 *
 * This script creates the database, schema, default users, and initial projects.
 */

try {
    $pdo_create = new PDO('mysql:host=localhost;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo_create->exec('CREATE DATABASE IF NOT EXISTS fcaicrowdfund CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $pdo_create = null;
} catch (PDOException $e) {
    die('DB creation failed: ' . $e->getMessage());
}

require_once __DIR__ . '/config.php';

// Drop and recreate tables in case the structure changed.
$pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
$pdo->exec('DROP TABLE IF EXISTS donations, contacts, projects, users');
$pdo->exec('SET FOREIGN_KEY_CHECKS = 1');

$tables = [
    'CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        image VARCHAR(255) DEFAULT \'attachments/logos/default_user.jpg\',
        role ENUM(\'user\', \'admin\') DEFAULT \'user\',
        mobile VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    'CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        collected_money DECIMAL(10,2) DEFAULT 0,
        pledged_goal DECIMAL(10,2) NOT NULL,
        backers INT DEFAULT 0,
        days_to_go INT DEFAULT 30,
        image VARCHAR(255) DEFAULT \'\',
        description TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    'CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        project_id INT,
        card_number VARCHAR(32) NULL,
        backer_name VARCHAR(120) NULL,
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
    'CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
];

foreach ($tables as $sql) {
    $pdo->exec($sql);
    echo "✅ Table created or verified\n";
}

$defaultUsers = [
    ['AdminAdmin', 'Admin Admin', 'admin@admin.admin', '$2y$10$e7NCeguXe3zRlEt/eVpqzOEPL3sk80qPN2.6jRoZjH9q0N11xOJqC', 'attachments/logos/default_user.jpg', 'admin'],
    ['UserUser', 'User User', 'user@user.user', '$2y$10$e7NCeguXe3zRlEt/eVpqzOEPL3sk80qPN2.6jRoZjH9q0N11xOJqC', 'attachments/logos/default_user.jpg', 'user'],
];

$stmt = $pdo->prepare('INSERT IGNORE INTO users (username, full_name, email, password, image, role) VALUES (?, ?, ?, ?, ?, ?)');
foreach ($defaultUsers as $user) {
    $stmt->execute($user);
}

$projects = [
    ['Labs', 'activities', 0, 90000, 0, 0],
    ['Halls', 'activities', 0, 40000, 0, 0],
    ['Projectors', 'activities', 0, 70000, 0, 0],
    ['Equipments', 'activities', 0, 65000, 0, 0],
    ['College Labs', 'college', 0, 120000, 0, 0],
    ['Lecture Halls', 'college', 0, 80000, 0, 0],
    ['Smart Projectors', 'college', 0, 85000, 0, 0],
    ['AV Equipments', 'college', 0, 75000, 0, 0],
    ['AI Research', 'graduationProjects', 0, 50000, 0, 0],
    ['Web Dev Project', 'graduationProjects', 0, 35000, 0, 0],
    ['ML Model', 'graduationProjects', 0, 60000, 0, 0],
    ['App Development', 'graduationProjects', 0, 45000, 0, 0],
    ['Subject\'s Notes', 'students', 0, 25000, 0, 0],
    ['Paid Courses', 'students', 0, 40000, 0, 0],
    ['Study Materials', 'students', 0, 30000, 0, 0],
    ['Laptop Fund', 'students', 0, 55000, 0, 0],
];

$stmt = $pdo->prepare('INSERT IGNORE INTO projects (project_name, category, collected_money, pledged_goal, backers, days_to_go) VALUES (?, ?, ?, ?, ?, ?)');
foreach ($projects as $project) {
    $stmt->execute($project);
}

echo "✅ Database ready with project records\n";
?>

