

<?php
header('Content-Type: application/json');

// Connexion SQL (PDO)
require_once '../config/sql.php'; // Fichier contenant $pdo
// Connexion MongoDB
require_once '../config/mongo.php'; // Fichier contenant $mongoClient

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $pseudo = trim($data['pseudo'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$pseudo || !$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Champs manquants.']);
        exit;
    }

    // Vérification de l'unicité de l'email
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email déjà utilisé.']);
        exit;
    }

    // Hash du mot de passe
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Insertion SQL
    $stmt = $pdo->prepare("INSERT INTO users (pseudo, email, password_hash, credit) VALUES (?, ?, ?, 20)");
    $stmt->execute([$pseudo, $email, $hash]);
    $userId = $pdo->lastInsertId();

    // Insertion MongoDB
    $mongoDb = $mongoClient->ecoride;
    $mongoDb->users_infos->insertOne([
        'id' => (int)$userId,
        'preferences' => new stdClass(),
        'avis' => []
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}