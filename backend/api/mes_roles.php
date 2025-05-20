<?php
require_once '../config/session.php';
require_once '../config/connexion.php';

header('Content-Type: application/json');

if (!isset($_SESSION['utilisateur_id'])) {
    echo json_encode([]);
    exit;
}

$utilisateur_id = $_SESSION['utilisateur_id'];

try {
    $stmt = $pdo->prepare("SELECT role_id FROM possede WHERE utilisateur_id = ?");
    $stmt->execute([$utilisateur_id]);
    $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode($roles);
} catch (PDOException $e) {
    echo json_encode([]);
}