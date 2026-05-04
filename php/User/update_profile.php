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
        $stmt = $pdo->prepare("SELECT id, username, full_name, email, mobile, COALESCE(image, 'attachments/logos/default_user.jpg') as image, role FROM users WHERE id = ?");
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
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$new_password = $_POST['password'] ?? '';
$image_url = trim($_POST['image_url'] ?? '');


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

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Valid email is required'
    ]);
    exit();
}

if (!empty($new_password) && strlen($new_password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 6 characters'
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
// Check if username already taken
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
    $stmt->execute([$username, $user_id]);
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Username is already taken'
        ]);
        exit();
    }

    // Check if email already taken by other user
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$email, $user_id]);
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Email is already taken'
        ]);
        exit();
    }

    $set_parts = ['username = ?, full_name = ?, email = ?, mobile = ?'];
    $params = [$username, $full_name, $email, $phone];

    $new_image = null;
    // Handle profile picture upload
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['profile_pic'];
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        $max_size = 2 * 1024 * 1024; // 2MB
        if (!in_array($file['type'], $allowed_types) || $file['size'] > $max_size) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid file type or size. Only JPG, PNG, GIF up to 2MB'
            ]);
            exit();
        }
        $upload_dir = '../attachments/profiles/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = $user_id . '_' . time() . '.' . $ext;
        $upload_path = $upload_dir . $filename;
        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
            $new_image = 'attachments/profiles/' . $filename;
            $set_parts[] = 'image = ?';
            $params[] = $new_image;
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to upload file'
            ]);
            exit();
        }
    } else if (!empty($image_url)) {
        $new_image = $image_url;
        $set_parts[] = 'image = ?';
        $params[] = $new_image;
    }

    if (!empty($new_password)) {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $set_parts[] = 'password = ?';
        $params[] = $hashed_password;
    }

    $set_sql = implode(', ', $set_parts);
    $sql = "UPDATE users SET $set_sql WHERE id = ?";
    $params[] = $user_id;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params); 

    // Get updated user data
    $stmt = $pdo->prepare("SELECT id, username, full_name, email, mobile, COALESCE(image, 'attachments/logos/default_user.jpg') as image, role FROM users WHERE id = ?");
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
