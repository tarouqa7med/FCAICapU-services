<?php
header('Content-Type: application/json');
require_once 'protect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT d.id, d.user_id, d.project_id, d.amount, d.card_number, d.backer_name, d.created_at, u.username AS user_name, u.email AS user_email, p.project_name AS project_name FROM donations d LEFT JOIN users u ON d.user_id = u.id LEFT JOIN projects p ON d.project_id = p.id ORDER BY d.created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $input['action'] ?? '';

switch ($action) {
    case 'create':
        $userId = (int)($input['user_id'] ?? 0);
        $projectId = (int)($input['project_id'] ?? 0);
        $amount = is_numeric($input['amount'] ?? null) ? floatval($input['amount']) : 0;
        $cardNumber = trim($input['card_number'] ?? '');
        $backerName = trim($input['backer_name'] ?? '');

        if (!$userId || !$projectId || $amount <= 0) {
            echo json_encode(['success' => false, 'message' => 'Missing donation information']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO donations (user_id, project_id, amount, card_number, backer_name, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$userId, $projectId, $amount, $cardNumber, $backerName]);

        $update = $pdo->prepare("UPDATE projects SET collected_money = collected_money + ?, backers = backers + 1 WHERE id = ?");
        $update->execute([$amount, $projectId]);

        echo json_encode(['success' => true]);
        break;

    case 'update':
        $donationId = (int)($input['donation_id'] ?? 0);
        $field = $input['field'] ?? '';
        $value = $input['value'] ?? '';
        $allowed = ['amount', 'card_number', 'backer_name'];

        if (!$donationId || !in_array($field, $allowed, true)) {
            echo json_encode(['success' => false, 'message' => 'Invalid update request']);
            exit;
        }

        if ($field === 'amount') {
            $newAmount = is_numeric($value) ? floatval($value) : 0;
            $stmt = $pdo->prepare("SELECT project_id, amount FROM donations WHERE id = ?");
            $stmt->execute([$donationId]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$record) {
                echo json_encode(['success' => false, 'message' => 'Donation not found']);
                exit;
            }
            $diff = $newAmount - floatval($record['amount']);
            $stmt = $pdo->prepare("UPDATE donations SET amount = ? WHERE id = ?");
            $stmt->execute([$newAmount, $donationId]);
            if ($diff !== 0) {
                $update = $pdo->prepare("UPDATE projects SET collected_money = collected_money + ? WHERE id = ?");
                $update->execute([$diff, $record['project_id']]);
            }
        } else {
            $stmt = $pdo->prepare("UPDATE donations SET $field = ? WHERE id = ?");
            $stmt->execute([$value, $donationId]);
        }

        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $donationId = (int)($input['donation_id'] ?? 0);
        if (!$donationId) {
            echo json_encode(['success' => false, 'message' => 'Invalid donation ID']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT project_id, amount FROM donations WHERE id = ?");
        $stmt->execute([$donationId]);
        $record = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$record) {
            echo json_encode(['success' => false, 'message' => 'Donation not found']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM donations WHERE id = ?");
        $stmt->execute([$donationId]);

        $update = $pdo->prepare("UPDATE projects SET collected_money = GREATEST(collected_money - ?, 0), backers = GREATEST(backers - 1, 0) WHERE id = ?");
        $update->execute([$record['amount'], $record['project_id']]);

        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
