<?php
session_start();
header('Content-Type: application/json');

// مسار ملف الـ contacts
$contactsFile = '../contact/contacts.txt';

// معالجة نموذج الاتصال
if ($_POST) {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message_text = htmlspecialchars(trim($_POST['message']));
    
    // حفظ في ملف نصي
    $data = date('Y-m-d H:i:s') . " | Name: $name | Email: $email | Message: $message_text\n";
    file_put_contents($contactsFile, $data, FILE_APPEND | LOCK_EX);
    
    echo json_encode([
        'success' => true,
        'message' => 'تم إرسال رسالتك بنجاح! شكراً لك 😊'
    ]);
    exit();
}

// التحقق من حالة المستخدم
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'loggedIn' => true,
        'userImage' => $_SESSION['user_image'] ?? 'attachments/logos/default_user.jpg'
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>