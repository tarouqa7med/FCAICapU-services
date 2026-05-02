<?php
header('Content-Type: application/json');
require_once 'config.php';

if (isset($_POST['email']) && isset($_POST['password'])) {
    $stmt = $pdo->prepare("SELECT id, email, password, role, username, full_name, image FROM users WHERE email = ?");
    $stmt->execute([$_POST['email']]);
    $user = $stmt->fetch();

    if ($user && password_verify($_POST['password'], $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful!',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'image' => $user['image'] ?: 'attachments/logos/default_user.jpg'
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email and password required.']);
}
?>

