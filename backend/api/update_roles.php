<?php
define('MONGO_DISABLED', true);
require_once '../config/session.php';
require_once '../config/connexion.php';

header('Content-Type: application/json');

if (!isset($_SESSION['utilisateur_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit;
}

$utilisateur_id = $_SESSION['utilisateur_id'];
$roles = $_POST['role'] ?? [];

try {
    // Supprimer les rôles existants pour cet utilisateur
    $stmt = $pdo->prepare("DELETE FROM possede WHERE utilisateur_id = ?");
    $stmt->execute([$utilisateur_id]);

    // Réinsérer les nouveaux rôles
    $stmt_insert = $pdo->prepare("INSERT INTO possede (utilisateur_id, role_id) VALUES (?, ?)");
    foreach ($roles as $role_id) {
        $stmt_insert->execute([$utilisateur_id, $role_id]);
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}