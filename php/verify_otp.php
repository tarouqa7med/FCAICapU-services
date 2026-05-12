<?php
/**
 * OTP verification endpoint.
 * Returns JSON: { success: bool, message: string }
 */
header('Content-Type: application/json; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$userOtp = trim($input['otp'] ?? '');
if ($userOtp === '') {
    echo json_encode(['success' => false, 'message' => 'empty']);
    exit();
}

if (!isset($_SESSION['reset_password']['email'], $_SESSION['reset_password']['otp'], $_SESSION['reset_password']['created_at'])) {
    echo json_encode(['success' => false, 'message' => 'invalid']);
    exit();
}

$resetData = &$_SESSION['reset_password'];
$age = time() - ($resetData['created_at'] ?? 0);
if ($age > 900) {
    $resetData['verified'] = false;
    echo json_encode(['success' => false, 'message' => 'expired']);
    exit();
}

require_once __DIR__ . '/config.php';
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$resetData['email']]);
$user = $stmt->fetch();
if (!$user) {
    echo json_encode(['success' => false, 'message' => 'invalid']);
    exit();
}

if ($userOtp === $resetData['otp']) {
    $resetData['verified'] = true;
    echo json_encode(['success' => true, 'message' => 'valid']);
} else {
    $resetData['verified'] = false;
    echo json_encode(['success' => false, 'message' => 'invalid']);
}
?>