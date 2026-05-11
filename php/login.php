<?php
/**
 * Login endpoint.
 * Accepts POST requests with email and password.
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

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($email === '') {
    echo json_encode(['success' => false, 'message' => 'Please enter your email']);
    exit();
}

if ($password === '') {
    echo json_encode(['success' => false, 'message' => 'Please enter your password']);
    exit();
}

try {
    $stmt = $pdo->prepare('SELECT id, username, email, password, full_name, image, role FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sleep(1);
        echo json_encode(['success' => false, 'message' => 'Email not registered. Please check your email address.']);
        exit();
    }

    if (!password_verify($password, $user['password'])) {
        sleep(1);
        echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        exit();
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['username'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'user' => [
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'role' => $user['role'],
            'image' => $user['image']
        ]
    ]);
} catch (Exception $e) {
    error_log('login.php error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
}
?>