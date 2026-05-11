<?php
header('Content-Type: application/json');
require_once '../config.php';

try {
    $category = 'graduationProjects';
    
    // Get total collected money for this category from projects table
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(collected_money), 0) as total_collected
        FROM projects
        WHERE category = ?
    ");
    $stmt->execute([$category]);
    $totalRow = $stmt->fetch();
    $totalCollected = (int)$totalRow['total_collected'];
    
    // Get total backers for this category from projects table
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(backers), 0) as backer_count
        FROM projects
        WHERE category = ?
    ");
    $stmt->execute([$category]);
    $backerRow = $stmt->fetch();
    $backerCount = (int)$backerRow['backer_count'];
    
    // Get total pledged goal for this category from projects table
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(pledged_goal), 0) as total_pledged
        FROM projects
        WHERE category = ?
    ");
    $stmt->execute([$category]);
    $pledgedRow = $stmt->fetch();
    $totalPledged = (int)$pledgedRow['total_pledged'];
    
    // Get count of projects in this category
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as project_count
        FROM projects
        WHERE category = ?
    ");
    $stmt->execute([$category]);
    $projectRow = $stmt->fetch();
    $projectCount = (int)$projectRow['project_count'];
    
    // Get all projects in this category
    $stmt = $pdo->prepare("
        SELECT id, project_name, collected_money, pledged_goal, backers, days_to_go, image, description
        FROM projects
        WHERE category = ?
        ORDER BY id ASC
    ");
    $stmt->execute([$category]);
    $projects = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'totalCollected' => $totalCollected,
        'totalPledged' => $totalPledged,
        'backers' => $backerCount,
        'projectCount' => $projectCount,
        'projects' => $projects
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
