<?php
header('Content-Type: application/json');

$__log_start = error_log("🚩 Début du script trajets.php");
// Connexion SQL
require_once '../config/connexion.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Champs manquants.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, pseudo, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Identifiants invalides.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'pseudo' => $user['pseudo']
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}