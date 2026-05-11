<?php
/**
 * Admin protection middleware.
 * Redirects non-logged-in or non-admin users back to the public page.
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once '../../php/config.php';

if (empty($_SESSION['user_id'])) {
    header('Location: ../../index.html');
    exit();
}

$stmt = $pdo->prepare('SELECT role FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user || $user['role'] !== 'admin') {
    header('Location: ../../index.html');
    exit();
}
?>

