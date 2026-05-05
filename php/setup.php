<?php
require_once 'config.php';

echo "Final DB setup - no user_id...\n";

// Create DB
try {
    $pdo_create = new PDO("mysql:host=localhost", 'root', '');
    $pdo_create->exec("CREATE DATABASE IF NOT EXISTS fcaicrowdfund CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo_create = null;
} catch(PDOException $e) {
    die("DB creation failed: " . $e->getMessage());
}

require_once 'config.php';

// Drop and recreate
$pdo->exec("DROP TABLE IF EXISTS donations, projects, contacts, users");

$tables = [
    "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        image VARCHAR(255) DEFAULT 'attachments/logos/default_user.jpg',
        role ENUM('user', 'admin') DEFAULT 'user',
        mobile VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    "CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        collected_money DECIMAL(10,2) DEFAULT 0,
        pledged_goal DECIMAL(10,2) NOT NULL,
        backers INT DEFAULT 0,
        days_to_go INT DEFAULT 30
    )",

    "CREATE TABLE donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        project_id INT,
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
    )",

    "CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )"
];

foreach ($tables as $sql) {
    $pdo->exec($sql);
    echo "✅ Table: " . trim(explode(' ', $sql)[2]) . "\n";
}

// Insert default admin if not exists (admin@admin.admin / admin123@)
$admin_email = 'admin@fcai.capu.edu.eg';

$stmt = $pdo->prepare("INSERT IGNORE INTO users (username, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)");
foreach ($users as $user) {
    $stmt->execute($user);
}

// Projects - match exact task fields
$projects = [
    ['Labs', 'activities', 40530, 90000, 172, 17],
    ['Halls', 'activities', 51380, 40000, 208, 8],
    ['Projectors', 'activities', 56814, 70000, 304, 20],
    ['Equipments', 'activities', 84293, 65000, 243, 6],
    ['College Labs', 'college', 54000, 120000, 189, 25],
    ['Lecture Halls', 'college', 92380, 80000, 312, 12],
    ['Smart Projectors', 'college', 61234, 85000, 267, 18],
    ['AV Equipments', 'college', 102937, 75000, 289, 9],
    ['AI Research', 'graduationProjects', 28500, 50000, 145, 22],
    ['Web Dev Project', 'graduationProjects', 41250, 35000, 198, 15],
    ['ML Model', 'graduationProjects', 48720, 60000, 234, 28],
    ['App Development', 'graduationProjects', 58964, 45000, 176, 11],
    ["Subject's Notes", 'students', 11250, 25000, 89, 30],
    ['Paid Courses', 'students', 49200, 40000, 156, 14],
    ['Study Materials', 'students', 21600, 30000, 123, 19],
    ['Laptop Fund', 'students', 75425, 55000, 201, 7]
];

$stmt = $pdo->prepare("INSERT INTO projects (project_name, category, collected_money, pledged_goal, backers, days_to_go) VALUES (?, ?, ?, ?, ?, ?)");
foreach ($projects as $proj) {
    $stmt->execute($proj);
}

echo "✅ Database ready with exact fields: project_name, collected_money, pledged_goal, backers, days_to_go\n";
?>

