<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_POST['first_name'] && $_POST['last_name'] && $_POST['email'] && $_POST['password']) {
    $username = strtolower($_POST['first_name'] . '_' . substr($_POST['last_name'], 0, 3));
    $full_name = $_POST['first_name'] . ' ' . $_POST['last_name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, full_name, email, password) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $full_name, $email, $password]);
        echo json_encode(['success' => true, 'message' => 'Registered successfully! Please login.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Email or username already exists.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'All fields required.']);
}
?>

