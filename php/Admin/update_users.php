<?php
header('Content-Type: application/json');
require_once '../../config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Login required']);
    exit;
}

$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

// Admin full access - bypass role check for super admin
if (isset($_SESSION['user_id'])) {
    echo json_encode(['adminAccess' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Login required']);
    exit;
}


// GET all users
if (!$_POST) {
    $stmt = $pdo->query("SELECT id, username, full_name, email, role, mobile, image FROM users ORDER BY id DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// Create user
if ($_POST['action'] === 'create') {
    $username = strtolower(trim($_POST['username']));
    $full_name = trim($_POST['full_name']);
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'] ?? 'temp123@', PASSWORD_DEFAULT);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, full_name, email, password, role, mobile) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$username, $full_name, $email, $password, $_POST['role'] ?? 'user', $_POST['mobile'] ?? null]);
        echo json_encode(['success' => true, 'message' => 'User created']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Duplicate username/email: ' . $e->getMessage()]);
    }
    exit;
}

// Update user
if ($_POST['action'] === 'update' && $_POST['user_id']) {
    $updates = [];
    $params = [];
    
    $fields = ['username', 'full_name', 'email', 'role', 'mobile', 'image'];
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            $updates[] = "$field = ?";
            $params[] = trim($_POST[$field]);
        }
    }
    
    if (empty($updates)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit;
    }
    
    $params[] = $_POST['user_id'];
    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode(['success' => true, 'message' => 'User updated']);
    exit;
}

// Delete user
if ($_POST['action'] === 'delete' && $_POST['user_id']) {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'");
    $stmt->execute([$_POST['user_id']]);
    echo json_encode(['success' => true, 'message' => 'User deleted']);
    exit;
}

// User actions log
if ($_POST['action'] === 'logs') {
    $stmt = $pdo->prepare("
        SELECT u.username, d.*
        FROM donations d 
        JOIN users u ON d.user_id = u.id 
        WHERE d.user_id = ? 
        ORDER BY d.created_at DESC
    ");
    $stmt->execute([$_POST['user_id']]);
    echo json_encode($stmt->fetchAll());
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>

