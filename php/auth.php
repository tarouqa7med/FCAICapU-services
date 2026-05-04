<?php
require_once 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if (isset($_GET['check'])) {
    header('Content-Type: application/json');
    
    if (isset($_SESSION['user_id'])) {
        try {
            $stmt = $pdo->prepare("SELECT id, username, full_name, email, mobile, COALESCE(image, 'attachments/logos/default_user.jpg') as image, role FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'loggedIn' => true,
                'success' => true,
                'user' => $user
            ]);
        } catch (Exception $e) {
            error_log('auth.php error: ' . $e->getMessage());
            echo json_encode(['loggedIn' => false, 'success' => false, 'message' => 'Auth error']);
        }
    } else {
        echo json_encode(['loggedIn' => false, 'success' => false]);
    }
    exit();
}
?>
