<?php
session_start();
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$contactsDir = '../contact/';
$contactsFile = $contactsDir . 'contacts.txt';

if (!is_dir($contactsDir)) {
    mkdir($contactsDir, 0755, true);
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Please sign in, First!❌',
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
            'success' => true,
            'message' => 'Please fill in all fields❌'
        ]);
        exit();
    }
    
    $user_name = $_SESSION['user_name'] ?? 'user_' . $_SESSION['user_id'];
    $data = date('Y-m-d H:i:s') . "\n\nusername : $user_name \nName : $name \nEmail : $email\n Message : $message\n--------------------------------------------------------\n\n";
    
    if (file_put_contents($contactsFile, $data, FILE_APPEND | LOCK_EX) !== false) {
        echo json_encode([
            'success' => true,
            'message' => '✅ Your feedback has been submitted successfully! Thank you 😊'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Error saving data - please check permissions❌'
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