<?php
require_once 'config.php';

if (isset($_GET['check'])) {
    if (isset($_SESSION['user_id'])) {
        $stmt = $pdo->prepare("SELECT id, username, full_name, image, role FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'loggedIn' => true,
            'user' => $user
        ]);
    } else {
        echo json_encode(['loggedIn' => false]);
    }
    exit();
}
?>