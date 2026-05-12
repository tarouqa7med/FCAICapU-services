<?php
/**
 * OTP verification endpoint.
 * Returns plain text: empty, invalid, expired, or valid.
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

if (!isset($_SESSION['reset_password']['email'], $_SESSION['reset_password']['otp'], $_SESSION['reset_password']['created_at'])) {
    echo 'invalid';
    exit();
}

$resetData = &$_SESSION['reset_password'];
$age = time() - ($resetData['created_at'] ?? 0);
if ($age > 900) {
    $resetData['verified'] = false;
    echo 'expired';
    exit();
}

require_once __DIR__ . '/config.php';
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$resetData['email']]);
$user = $stmt->fetch();
if (!$user) {
    echo 'invalid';
    exit();
}

if ($userOtp === $resetData['otp']) {
    $resetData['verified'] = true;
    echo 'valid';
} else {
    $resetData['verified'] = false;
    echo 'invalid';
}
?>