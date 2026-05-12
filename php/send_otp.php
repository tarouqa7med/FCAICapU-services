<?php
/**
 * OTP generator for password reset.
 * Returns JSON: { success: bool, message: string, otp?: string }
 */

header('Content-Type: application/json; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$email = trim($input['email'] ?? '');
if ($email === '') {
    echo json_encode(['success' => false, 'message' => 'invalid_email']);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'invalid_email']);
        exit();
    }

    $otp = strval(rand(100000, 999999));
    $_SESSION['reset_password'] = [
        'email' => $email,
        'otp' => $otp,
        'verified' => false,
        'created_at' => time(),
    ];

    echo json_encode(['success' => true, 'message' => 'otp_sent', 'otp' => $otp]);
} catch (Exception $e) {
    error_log('send_otp.php error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'error']);
}
?>