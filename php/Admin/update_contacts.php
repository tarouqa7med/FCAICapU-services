<?php
header('Content-Type: application/json');
require_once 'protect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $input['action'] ?? '';

switch ($action) {
    case 'update':
        $contactId = (int)($input['contact_id'] ?? 0);
        $field = $input['field'] ?? '';
        $value = $input['value'] ?? '';
        $allowed = ['name', 'email', 'message'];

        if (!$contactId || !in_array($field, $allowed, true)) {
            echo json_encode(['success' => false, 'message' => 'Invalid update request']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE contacts SET $field = ? WHERE id = ?");
        $stmt->execute([$value, $contactId]);
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $contactId = (int)($input['contact_id'] ?? 0);
        if (!$contactId) {
            echo json_encode(['success' => false, 'message' => 'Invalid contact ID']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM contacts WHERE id = ?");
        $stmt->execute([$contactId]);
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
