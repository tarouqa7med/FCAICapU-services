<?php
session_start();
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

$contactsDir = '../contact/';
$contactsFile = $contactsDir . 'contacts.txt';

if (!is_dir($contactsDir)) {
    mkdir($contactsDir, 0755, true);
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Please sign in first.',
        'loginRequired' => true
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));
    
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode([
            'success' => false,
            'message' => 'Please fill in all fields.'
        ]);
        exit();
    }
    
    $user_name = $_SESSION['user_name'] ?? 'user_' . $_SESSION['user_id'];
    $data = date('Y-m-d H:i:s') . "\n\tUsername : $user_name\n\tName     : $name\n\tEmail    : $email\n\tMessage  : $message\n---------------------------------------------------------------------------------------\n\n";

    $savedToFile = file_put_contents($contactsFile, $data, FILE_APPEND | LOCK_EX) !== false;
    $savedToDb = false;

    try {
        $stmt = $pdo->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
        $savedToDb = $stmt->execute([$name, $email, $message]);
    } catch (Exception $e) {
        error_log('Contact DB save error: ' . $e->getMessage());
    }

    if ($savedToFile || $savedToDb) {
        echo json_encode([
            'success' => true,
            'message' => '✅ Your feedback has been submitted successfully! Thank you 😊'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error saving feedback. Please try again later.'
        ]);
    }
    exit();
}

// حالة المستخدم
echo json_encode([
    'loggedIn' => true,
    'userImage' => $_SESSION['user_image'] ?? 'attachments/logos/default_user.jpg'
]);
?>