<?php
/**
 * Password reset endpoint.
 * Accepts POST with password and uses session email/OTP state.
 */
header('Content-Type: application/json; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$password = trim($input['password'] ?? '');
if ($password === '') {
    echo json_encode(['success' => false, 'message' => 'empty']);
    exit();
}

if (!isset($_SESSION['reset_password']['email'], $_SESSION['reset_password']['verified']) || $_SESSION['reset_password']['verified'] !== true) {
    echo json_encode(['success' => false, 'message' => 'unauthorized']);
    exit();
}

$resetData = $_SESSION['reset_password'];
$email = $resetData['email'];

require_once __DIR__ . '/config.php';

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();
if (!$user) {
    echo json_encode(['success' => false, 'message' => 'invalid']);
    exit();
}

try {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('UPDATE users SET password = ? WHERE email = ?');
    $stmt->execute([$hashedPassword, $email]);

    if ($stmt->rowCount() > 0) {
        unset($_SESSION['reset_password']);
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'success']);
    } else {
        echo json_encode(['success' => false, 'message' => 'error']);
    }
} catch (Exception $e) {
    error_log('reset_password.php error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'error']);
}
?>