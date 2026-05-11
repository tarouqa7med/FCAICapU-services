<?php
/**
 * OTP verification endpoint.
 * Returns plain text: empty, invalid, or valid.
 */
header('Content-Type: text/plain; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$userOtp = trim($_POST['otp'] ?? '');

if ($userOtp === '') {
    echo 'empty';
    exit();
}

if (!isset($_SESSION['otp'])) {
    echo 'invalid';
    exit();
}

if ($userOtp === $_SESSION['otp']) {
    echo 'valid';
} else {
    echo 'invalid';
}
?>