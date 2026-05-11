<?php
/**
 * Password reset endpoint.
 * Accepts POST with password and uses session email/OTP state.
 */
header('Content-Type: text/plain; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$password = trim($_POST['password'] ?? '');
if ($password === '') {
    echo 'empty';
    exit();
}

if (!isset($_SESSION['email'], $_SESSION['otp'])) {
    echo 'error';
    exit();
}

$email = $_SESSION['email'];

require_once 'config.php';

try {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('UPDATE users SET password = ? WHERE email = ?');
    $stmt->execute([$hashedPassword, $email]);

    if ($stmt->rowCount() > 0) {
        session_destroy();
        echo 'success';
    } else {
        echo 'error';
    }
} catch (Exception $e) {
    error_log('reset_password.php error: ' . $e->getMessage());
    echo 'error';
}
?>