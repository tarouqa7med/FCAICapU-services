<?php
header('Content-Type: application/json');
require_once 'config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit();
}

if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

$userId = (int)$_SESSION['user_id'];
$projectId = isset($_POST['projectId']) ? (int)$_POST['projectId'] : 0;
$amount = isset($_POST['amount']) ? (float)$_POST['amount'] : 0;
$backerName = isset($_POST['backerName']) ? trim((string)$_POST['backerName']) : '';
$cardNumber = isset($_POST['cardNumber']) ? trim((string)$_POST['cardNumber']) : '';

if ($projectId <= 0 || $amount < 25 || $backerName === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid fields']);
    exit();
}

try {
    $stmt = $pdo->prepare('SELECT id FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    if (!$project) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Project not found']);
        exit();
    }

    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM donations WHERE user_id = ? AND project_id = ?');
    $stmt->execute([$userId, $projectId]);
    $existing = $stmt->fetch();
    $isNewBacker = ($existing['count'] == 0);

    $stmt = $pdo->prepare('INSERT INTO donations (user_id, project_id, amount, card_number, backer_name, created_at) VALUES (?, ?, ?, ?, ?, NOW())');
    $stmt->execute([$userId, $projectId, $amount, $cardNumber, $backerName]);

    $updateStmt = $pdo->prepare('UPDATE projects SET collected_money = collected_money + ?, backers = backers + ? WHERE id = ?');
    $updateStmt->execute([$amount, $isNewBacker ? 1 : 0, $projectId]);

    echo json_encode(['success' => true, 'message' => 'Donation saved successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>