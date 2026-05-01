<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'يجب استخدام POST']);
    exit();
}

// التحقق من البيانات
if (empty(trim($_POST['email'] ?? ''))) {
    echo json_encode(['success' => false, 'message' => 'Please enter your email.']);
    exit();
}

if (empty(trim($_POST['password'] ?? ''))) {
    echo json_encode(['success' => false, 'message' => 'Please enter your password.']);
    exit();
}

$email = trim($_POST['email']);
$password = $_POST['password'];

try {
    // 1️⃣ التحقق من وجود الإيميل
    $stmt = $pdo->prepare("SELECT id, username, email, password, full_name, image, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        // الإيميل مش موجود
        sleep(1); // حماية من Brute Force
        echo json_encode([
            'success' => false, 
            'message' => 'The email is not registered. Please check the email.'
        ]);
        exit();
    }
    
    // 2️⃣ التحقق من الباسورد
    if (!password_verify($password, $user['password'])) {
        sleep(1); // حماية من Brute Force
        echo json_encode([
            'success' => false, 
            'message' => 'Wrong password. Please check your password.'
        ]);
        exit();
    }
    
    // 3️⃣ Login ناجح ✅
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['username'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful! 🎉',
        'user' => [
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'role' => $user['role']
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'خطأ في الخادم']);
}
?>