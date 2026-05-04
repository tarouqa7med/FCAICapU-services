<?php
header('Content-Type: application/json');
require_once 'protect.php'; // Admin only


// Dashboard stats
if ($_GET['stats'] === '1') {
    $stats = [];
    $stats['users'] = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $stats['projects'] = $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
    $stats['donations'] = $pdo->query("SELECT SUM(amount) FROM donations")->fetchColumn() ?: 0;
    $stats['contacts'] = $pdo->query("SELECT COUNT(*) FROM contacts")->fetchColumn();
    echo json_encode($stats);
    exit;
}

// GET - list users
if (!$_POST) {
    $stmt = $pdo->query("SELECT id, username, full_name, email, role, mobile, image, created_at FROM users ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}


// POST actions

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $input['action'] ?? '';


switch ($action) {
    case 'create':
        $username = strtolower(trim($input['username']));
        $full_name = trim($input['full_name']);
        $email = trim($input['email']);
        $password = password_hash($input['password'] ?? 'temp123@', PASSWORD_DEFAULT);
        

        $stmt = $pdo->prepare("INSERT INTO users (username, full_name, email, password, role, mobile, image) VALUES (?, ?, ?, ?, ?, '', '')");
        $stmt->execute([$username, $full_name, $email, $password, $input['role'] ?? 'user']);

        echo json_encode(['success' => true]);
        break;
        
    case 'update':
        $user_id = (int)$input['user_id'];
        $field = $input['field'];
        $value = $input['value'];
        
        $allowed = ['username', 'full_name', 'email', 'role', 'mobile', 'image'];
        if (!in_array($field, $allowed)) {
            echo json_encode(['success' => false, 'message' => 'Invalid field']);
            break;
        }
        
        $stmt = $pdo->prepare("UPDATE users SET $field = ? WHERE id = ?");
        $stmt->execute([$value, $user_id]);
        echo json_encode(['success' => true]);
        break;
        
    case 'delete':
        $user_id = (int)$input['user_id'];
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'");
        $stmt->execute([$user_id]);
        echo json_encode(['success' => true]);
        break;
        
    case 'user_activities':
        $user_id = (int)$input['user_id'];
        $stmt = $pdo->prepare("
            SELECT d.id, d.amount, d.created_at, p.name as project 
            FROM donations d 
            LEFT JOIN projects p ON d.project_id = p.id 
            WHERE d.user_id = ? 
            ORDER BY d.created_at DESC
        ");
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>

