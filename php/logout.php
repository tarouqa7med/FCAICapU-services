<?php
/**
 * Logout endpoint.
 * Destroys the current session and returns a JSON response.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

session_unset();
session_destroy();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$currentPath = parse_url($requestUri, PHP_URL_PATH);
$redirectUrl = '/index.html';

if (strpos($currentPath, '/html/') !== false) {
    $redirectUrl = '../index.html';
} elseif (strpos($currentPath, 'index.html') === false) {
    $redirectUrl = '/index.html';
} else {
    $redirectUrl = './index.html';
}

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully',
    'redirect' => $redirectUrl,
    'currentPath' => $currentPath
]);
?>

