<?php
/**
 * OTP generator for password reset.
 * Returns plain text: valid|<OTP>, invalid_email, or error.
 */

header('Content-Type: text/plain; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$email = trim($_POST['email'] ?? '');
if ($email === '') {
    echo 'invalid_email';
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo 'invalid_email';
        exit();
    }

    $otp = strval(rand(100000, 999999));
    $_SESSION['reset_password'] = [
        'email' => $email,
        'otp' => $otp,
        'verified' => false,
        'created_at' => time(),
    ];

    echo 'valid|' . $otp;
} catch (Exception $e) {
    error_log('send_otp.php error: ' . $e->getMessage());
    echo 'error';
}
?>