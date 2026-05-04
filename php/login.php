<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'POST method required']);
    exit();
}

// Validate input data
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your email']);
    exit();
}

if (empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your password']);
    exit();
}

try {
    // 1️⃣ Check if email exists
    $stmt = $pdo->prepare("SELECT id, username, email, password, full_name, image, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        sleep(1); // Brute force protection
        echo json_encode([
            'success' => false, 
            'message' => 'Email not registered. Please check your email address.'
        ]);
        exit();
    }
    
    // 2️⃣ Verify password
    if (!password_verify($password, $user['password'])) {
        sleep(1); // Brute force protection
        echo json_encode([
            'success' => false, 
            'message' => 'Incorrect password'
        ]);
        exit();
    }
    
    // 3️⃣ Login successful ✅
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
            'role' => $user['role'],
            'image' => $user['image']
        ]
    ]);
    
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
}
?>