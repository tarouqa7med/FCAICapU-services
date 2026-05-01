<?php
/**
 * User Profile Update API
 * Handles updating user profile data in the database
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

// Check if user is logged in (session check)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check login status - return loggedIn status and redirect flag
if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'loggedIn' => false,
        'redirect' => true,
        'message' => 'You must login first to edit your profile'
    ]);
    exit();
}

// If GET request, return current user data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_SESSION['user_id'];
    try {
        $stmt = $pdo->prepare("SELECT id, username, full_name, email, COALESCE(image, 'attachments/logos/default_user.jpg') as image, role FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'loggedIn' => true,
            'user' => $user
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'loggedIn' => false,
            'message' => 'Error loading user data'
        ]);
    }
    exit();
}

// POST request - update profile
// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'POST method required'
    ]);
    exit();
}

// Get input data
$username = trim($_POST['username'] ?? '');
$full_name = trim($_POST['full_name'] ?? '');
$image = trim($_POST['image'] ?? '');

// Validate input
if (empty($username)) {
    echo json_encode([
        'success' => false,
        'message' => 'Username is required'
    ]);
    exit();
}

if (empty($full_name)) {
    echo json_encode([
        'success' => false,
        'message' => 'Full name is required'
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    // Check if username is already taken by another user
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
    $stmt->execute([$username, $user_id]);
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Username is already taken'
        ]);
        exit();
    }

    // Update user profile
    if (!empty($image)) {
        // Update with image
        $stmt = $pdo->prepare("UPDATE users SET username = ?, full_name = ?, image = ? WHERE id = ?");
        $stmt->execute([$username, $full_name, $image, $user_id]);
    } else {
        // Update without image (keep existing)
        $stmt = $pdo->prepare("UPDATE users SET username = ?, full_name = ? WHERE id = ?");
        $stmt->execute([$username, $full_name, $user_id]);
    }

    // Get updated user data
    $stmt = $pdo->prepare("SELECT id, username, full_name, email, COALESCE(image, 'attachments/logos/default_user.jpg') as image, role FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Update session
    $_SESSION['user_name'] = $user['username'];

    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'message' => 'Profile updated successfully!',
        'user' => $user
    ]);

} catch (Exception $e) {
    error_log('Profile update error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Server error. Please try again.'
    ]);
}
?>
