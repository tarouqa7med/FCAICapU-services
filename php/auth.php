<?php
header('Content-Type: application/json');
require_once 'config.php';

if (isset($_GET['check'])) {
    if (isset($_SESSION['user_id'])) {
        $stmt = $pdo->prepare("
            SELECT id, username, email, full_name, COALESCE(image, 'attachments/logos/default_user.jpg') as image, role 
            FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Admin full access enhancement
        $user['isAdmin'] = ($user['role'] === 'admin');
        $user['superAccess'] = true;
        
        echo json_encode([
            'loggedIn' => true,
            'adminAccess' => ($user['role'] === 'admin'),
            'superAccess' => true,
            'user' => $user ?: ['username' => 'Admin', 'image' => 'attachments/logos/default_user.jpg', 'role' => 'admin']
        ]);
    } else {
        echo json_encode(['loggedIn' => false]);
    }

    exit;
}
?>

