<?php
require_once 'config.php';

// Create database if not exists
try {
    $pdo_create = new PDO("mysql:host=localhost", 'root', '');
    $pdo_create->exec("CREATE DATABASE IF NOT EXISTS fcaicrowdfund CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo_create = null;
} catch(PDOException $e) {
    die("DB creation failed: " . $e->getMessage());
}

// Now connect to our DB
require_once 'config.php';

// Create tables
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
        days_left INT DEFAULT 30
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
}

// Insert default admin if not exists (admin@admin.admin / admin123@)
$admin_email = 'admin@fcai.capu.edu.eg';
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$admin_email]);
if (!$stmt->fetch()) {
    $password = password_hash('admin123@', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, full_name, email, password, role) VALUES (?, ?, ?, ?, 'admin')");
    $stmt->execute(['admin', 'Admin User', $admin_email, $password]);
}

echo "✅ Database setup complete! Tables created. Admin: admin@fcai.capu.edu.eg / admin123@";
?>

