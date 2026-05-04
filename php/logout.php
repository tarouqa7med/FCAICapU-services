<?php
session_start();
require_once 'config.php';

// Destroy all session data
session_unset();
session_destroy();

// Clear session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time(), '/');
}

// Smart redirect based on referrer/current path
$redirectUrl = '/index.html'; // Default

// Detect current location
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$currentPath = parse_url($requestUri, PHP_URL_PATH);

// Smart redirect logic
if (strpos($currentPath, '/html/') !== false) {
    // From HTML subfolder - go up to root
    $redirectUrl = '../index.html';
} elseif (strpos($currentPath, 'index.html') === false) {
    // Not on index - go to root index
    $redirectUrl = '/index.html';
} else {
    // Already on index - just reload (handled client-side)
    $redirectUrl = './index.html';
}

header('Content-Type: application/json');
echo json_encode([
    'success' => true, 
    'message' => 'Logged out successfully',
    'redirect' => $redirectUrl,
    'currentPath' => $currentPath
]);
session_destroy();
echo json_encode(['success' => true, 'message' => 'Logged out']);
?>

