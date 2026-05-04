<?php
session_start();
require_once '../../php/config.php';

if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    header('Location: ../../index.html');
    exit();
}

$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user || $user['role'] !== 'admin') {
    // Normal user or invalid session
    header('Location: ../../index.html');
    exit();
}
?>

