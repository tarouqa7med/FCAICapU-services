<?php
header('Content-Type: application/json');
require_once __DIR__ . '/protect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT id, project_name, category, collected_money, pledged_goal, backers, days_to_go, image, description FROM projects ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $input['action'] ?? '';

switch ($action) {
    case 'create':
        $projectName = trim($input['project_name'] ?? '');
        $category = trim($input['category'] ?? 'activities');
        $pledgedGoal = is_numeric($input['pledged_goal'] ?? null) ? floatval($input['pledged_goal']) : 0;
        $daysToGo = is_numeric($input['days_to_go'] ?? null) ? (int)$input['days_to_go'] : 30;
        $image = trim($input['image'] ?? '');
        $description = trim($input['description'] ?? '');

        if ($projectName === '') {
            echo json_encode(['success' => false, 'message' => 'Project name is required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO projects (project_name, category, collected_money, pledged_goal, backers, days_to_go, image, description) VALUES (?, ?, 0, ?, 0, ?, ?, ?)");
        $stmt->execute([$projectName, $category, $pledgedGoal, $daysToGo, $image, $description]);
        echo json_encode(['success' => true]);
        break;

    case 'update':
        $projectId = (int)($input['project_id'] ?? 0);
        $field = $input['field'] ?? '';
        $value = $input['value'] ?? '';
        $allowed = ['project_name', 'category', 'collected_money', 'pledged_goal', 'backers', 'days_to_go', 'image', 'description'];

        if (!$projectId || !in_array($field, $allowed, true)) {
            echo json_encode(['success' => false, 'message' => 'Invalid update request']);
            exit;
        }

        if (in_array($field, ['collected_money', 'pledged_goal'], true)) {
            $value = is_numeric($value) ? floatval($value) : 0;
        }
        if (in_array($field, ['backers', 'days_to_go'], true)) {
            $value = is_numeric($value) ? (int)$value : 0;
        }

        $stmt = $pdo->prepare("UPDATE projects SET $field = ? WHERE id = ?");
        $stmt->execute([$value, $projectId]);

        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $projectId = (int)($input['project_id'] ?? 0);
        if (!$projectId) {
            echo json_encode(['success' => false, 'message' => 'Invalid project ID']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM donations WHERE project_id = ?");
        $stmt->execute([$projectId]);

        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$projectId]);

        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
