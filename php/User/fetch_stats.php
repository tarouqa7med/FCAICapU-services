<?php
/**
 * Fetch user-specific statistics
 */
header('Content-Type: application/json');
require_once '../../php/config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    // Total donations (assuming donations table exists with amount)
    $stmt = $pdo->prepare("
        SELECT 
            COALESCE(SUM(amount), 0) as total_donations,
            COUNT(DISTINCT project_id) as total_projects
        FROM donations 
        WHERE user_id = ?
    ");
    $stmt->execute([$user_id]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    $totalDonated = (float)($stats['total_donations'] ?? 0);
    $totalProjects = (int)($stats['total_projects'] ?? 0);

    // Compute rank based on total donated
    $rank = 'Bronze';
    if ($totalDonated >= 1000) $rank = 'Gold';
    else if ($totalDonated >= 500) $rank = 'Silver';

    echo json_encode([
        'total_donations' => $totalDonated,
        'total_projects' => $totalProjects,
        'user_rank' => $rank,
        'success' => true
    ]);

} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to fetch stats', 'success' => false]);
}
?>

