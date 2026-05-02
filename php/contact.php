<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please sign in first.']);
    exit;
}

// Get user info
$stmt = $pdo->prepare("SELECT username, full_name FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();
if (!$user || $user['role'] === 'admin') {
    echo json_encode(['success' => false, 'message' => 'Admin cannot use contact form.']);
    exit;
}

if ($_POST['name'] && $_POST['email'] && $_POST['message']) {
    // Save to DB
    $stmt = $pdo->prepare("INSERT INTO contacts (username, name, email, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user['username'], $_POST['name'], $_POST['email'], $_POST['message']]);
    
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'All fields required.']);
}
?>

