<?php
/**
 * User registration endpoint.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'POST method required']);
    exit();
}

$username = trim(strtolower($_POST['username'] ?? ''));
$full_name = trim($_POST['full_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($username === '' || $full_name === '' || $email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields']);
    exit();
}

if (strlen($username) < 3) {
    echo json_encode(['success' => false, 'message' => 'Username must be at least 3 characters']);
    exit();
}

if (strlen($full_name) < 2) {
    echo json_encode(['success' => false, 'message' => 'Full name too short']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
    exit();
}

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)');
    $stmt->execute([$username, $email]);

    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already exists in database. Please use another email.']);
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (username, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$username, $full_name, $email, $hashedPassword, 'user']);

    $_SESSION['user_id'] = $pdo->lastInsertId();

    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
} catch (PDOException $e) {
    error_log('register.php error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}
?>

