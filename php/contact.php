<?php
/**
 * Contact form handler.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Please sign in first.',
        'loginRequired' => true
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'POST method required']);
    exit();
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
    exit();
}

$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$contactDir = __DIR__ . '/../contact/';
$contactFile = $contactDir . 'contacts.txt';
if (!is_dir($contactDir)) {
    mkdir($contactDir, 0755, true);
}

$logEntry = date('Y-m-d H:i:s') . "\n";
$logEntry .= "\tUsername : " . ($_SESSION['user_name'] ?? 'guest') . "\n";
$logEntry .= "\tName     : $name\n";
$logEntry .= "\tEmail    : $email\n";
$logEntry .= "\tMessage  : $message\n";
$logEntry .= str_repeat('-', 90) . "\n\n";

$savedToFile = file_put_contents($contactFile, $logEntry, FILE_APPEND | LOCK_EX) !== false;
$savedToDb = false;

try {
    $stmt = $pdo->prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)');
    $savedToDb = $stmt->execute([$name, $email, $message]);
} catch (Exception $e) {
    error_log('contact.php DB error: ' . $e->getMessage());
}

if ($savedToFile || $savedToDb) {
    echo json_encode(['success' => true, 'message' => 'Your feedback has been submitted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving feedback. Please try again later.']);
}
?>