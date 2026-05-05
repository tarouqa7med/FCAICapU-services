<?php
header('Content-Type: application/json');
require_once '../config.php';

$category = $_GET['category'] ?? 'activities';

try {
// Get stats
$stats = $pdo->prepare("SELECT 
        SUM(collected_money) as total_pledged,
        SUM(backers) as total_backers,
        COUNT(*) as project_count
        FROM projects WHERE category = ?");
    $stats->execute([$category]);
    $stats = $stats->fetch();
    
    // Get projects
    $stmt = $pdo->prepare("SELECT * FROM projects 
        WHERE category = ? 
        ORDER BY collected_money DESC 
        LIMIT 4");
    $stmt->execute([$category]);
    $projects = $stmt->fetchAll();

    // Add progress
    foreach ($projects as &$project) {
        $progress = $project['pledged_goal'] > 0 ? min(150, ($project['collected_money'] / $project['pledged_goal'] * 100)) : 0;
        $project['progress'] = round($progress, 0);
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

