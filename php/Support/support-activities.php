<?php
header('Content-Type: application/json');
require_once '../config.php';

$category = $_GET['category'] ?? 'activities';

try {
    // Get stats
    $stats = $pdo->query("SELECT 
        SUM(pledged) as total_pledged,
        SUM(backers) as total_backers,
        COUNT(*) as project_count
        FROM projects WHERE category = '$category'")->fetch();
    
    // Get projects with user info
    $stmt = $pdo->prepare("SELECT p.*, u.full_name, u.email 
        FROM projects p 
        LEFT JOIN users u ON p.user_id = u.id 
        WHERE p.category = ? 
        ORDER BY p.pledged DESC 
        LIMIT 4");
    $stmt->execute([$category]);
    $projects = $stmt->fetchAll();

    // Add progress
    foreach ($projects as &$project) {
        $progress = $project['goal'] > 0 ? min(150, ($project['pledged'] / $project['goal'] * 100)) : 0;
        $project['progress'] = round($progress, 0);
        $project['pledged_formatted'] = number_format($project['pledged'], 0);
        $project['goal_formatted'] = number_format($project['goal'], 0);
    }

    echo json_encode([
        'success' => true,
        'stats' => $stats ?: ['total_pledged' => 0, 'total_backers' => 0, 'project_count' => 0],
        'projects' => $projects
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

