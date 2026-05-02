<?php
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Login required']);
    exit;
}

// Get user support history
if (!$_POST) {
    $stmt = $pdo->prepare("SELECT * FROM contacts WHERE username = (SELECT username FROM users WHERE id = ?) ORDER BY created_at DESC");
    $stmt->execute([$_SESSION['user_id']]);
    echo json_encode($stmt->fetchAll());
    exit;
}

// Submit support ticket
if ($_POST['action'] === 'submit' && $_POST['subject'] && $_POST['message']) {
    $userStmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $userStmt->execute([$_SESSION['user_id']]);
    $username = $userStmt->fetchColumn();
    
    $stmt = $pdo->prepare("INSERT INTO contacts (username, name, email, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $_POST['subject'], $_POST['email'] ?? '', $_POST['message']]);
    echo json_encode(['success' => true, 'message' => 'Ticket submitted']);
    exit;
}

echo json_encode(['success' => false]);
?>

