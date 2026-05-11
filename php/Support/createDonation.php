<?php
header('Content-Type: application/json');
require_once '../config.php';

// NOTE: this endpoint is called from support JS after payment click.

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit();
}

$userId = (int)$_SESSION['user_id'];

// Accept JSON body OR GET/POST form
$payload = [];
$raw = file_get_contents('php://input');
if (!empty($raw)) {
    $json = json_decode($raw, true);
    if (is_array($json)) $payload = $json;
}

if (empty($payload)) {
    // Fallback to query params
    $payload = $_POST ?: $_GET;
}

$projectId = isset($payload['projectId']) ? (int)$payload['projectId'] : 0;
$amount = isset($payload['amount']) ? (float)$payload['amount'] : 0;
$backerName = isset($payload['backerName']) ? trim((string)$payload['backerName']) : '';
$cardNumber = isset($payload['cardNumber']) ? trim((string)$payload['cardNumber']) : '';

if ($projectId <= 0 || $amount <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid fields']);
    exit();
}


try {
    // Get backer name from DB to ensure it matches user's full_name
    $stmt = $pdo->prepare('SELECT full_name FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $userRow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userRow) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit();
    }

    $backerNameDb = $userRow['full_name'];

    // Ensure project exists
    $stmt = $pdo->prepare('SELECT id FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $projectRow = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$projectRow) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Project not found']);
        exit();
    }

    // Check if user has already backed this project
    $stmt = $pdo->prepare('SELECT COUNT(*) as count FROM donations WHERE user_id = ? AND project_id = ?');
    $stmt->execute([$userId, $projectId]);
    $existingDonation = $stmt->fetch(PDO::FETCH_ASSOC);
    $isNewBacker = ($existingDonation['count'] == 0);

    // Insert donation
    $stmt = $pdo->prepare('INSERT INTO donations (user_id, project_id, amount, created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$userId, $projectId, $amount]);

    // Update projects table: add to collected_money
    $stmt = $pdo->prepare('UPDATE projects SET collected_money = collected_money + ? WHERE id = ?');
    $stmt->execute([$amount, $projectId]);

    // Update backers count only if this is the first donation from this user to this project
    if ($isNewBacker) {
        $stmt = $pdo->prepare('UPDATE projects SET backers = backers + 1 WHERE id = ?');
        $stmt->execute([$projectId]);
    }

    // Card number requirement: donations table in this repo currently doesn't store card number.
    // To avoid breaking schema, we store it in a separate field if present.
    // If not present, we just ignore.
    $colsStmt = $pdo->query('SHOW COLUMNS FROM donations');
    $cols = $colsStmt->fetchAll(PDO::FETCH_COLUMN);

    if (in_array('card_number', $cols, true)) {
        $donationId = (int)$pdo->lastInsertId();
        $upd = $pdo->prepare('UPDATE donations SET card_number = ? WHERE id = ?');
        $upd->execute([$cardNumber, $donationId]);
    }

    // If there's a backer_name column in donations, store it.
    if (in_array('backer_name', $cols, true)) {
        $donationId = (int)$pdo->lastInsertId();
        $upd = $pdo->prepare('UPDATE donations SET backer_name = ? WHERE id = ?');
        $upd->execute([$backerNameDb, $donationId]);
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);}