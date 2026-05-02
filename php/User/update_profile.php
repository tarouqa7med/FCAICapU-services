<?php
header('Content-Type: application/json');
require_once '../../config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first.', 'loggedIn' => false]);
    exit;
}

if ($_POST) {
    $username = trim($_POST['username']);
    $full_name = trim($_POST['full_name']);
    $image = $_POST['image'] ?? null;

    if (!$username || !$full_name) {
        echo json_encode(['success' => false, 'message' => 'Username and full name required.']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE users SET username = ?, full_name = ? " . ($image ? ", image = ?" : "") . " WHERE id = ?");
    $params = [$username, $full_name, $_SESSION['user_id']];
    if ($image) $params[] = $image; // Insert before id

    $stmt->execute($params);
    echo json_encode(['success' => true, 'message' => 'Profile updated!', 'user' => [
        'username' => $username,
        'full_name' => $full_name,
        'image' => $image
    ]]);
} else {
    // GET: check login + user data
    $stmt = $pdo->prepare("SELECT username, full_name, image FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    echo json_encode(['loggedIn' => true, 'user' => $user ?: []]);
}
?>

