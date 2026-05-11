<?php
/**
 * OTP generator for password reset.
 * Returns plain text: valid|<OTP> or invalid.
 */

header('Content-Type: text/plain; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$email = trim($_POST['email'] ?? '');
if ($email === '') {
    echo 'invalid';
    exit();
}

require_once 'config.php';

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $otp = strval(rand(100000, 999999));
        $_SESSION['otp'] = $otp;
        $_SESSION['email'] = $email;
        echo 'valid|' . $otp;
    } else {
        echo 'invalid';
    }
} catch (Exception $e) {
    error_log('send_otp.php error: ' . $e->getMessage());
    echo 'invalid';
}
?>