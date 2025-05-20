<?php
header('Content-Type: application/json');

$__log_start = error_log("🚩 Début du script connexion.php");
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

    $stmt = $pdo->prepare("SELECT utilisateur_id, pseudo, password, nom, prenom, email, credit, photo FROM utilisateur WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        error_log("❌ Aucun utilisateur trouvé pour l'email : $email");
        echo json_encode(['success' => false, 'message' => 'Identifiants invalides.']);
        exit;
    }

    error_log("🔐 Hash en base : " . $user['password']);
    error_log("🔑 Mot de passe saisi : " . $password);

    if (!password_verify($password, $user['password'])) {
        error_log("❌ Mot de passe incorrect pour l'utilisateur : " . $user['email']);
        echo json_encode(['success' => false, 'message' => 'Mot de passe invalide.']);
        exit;
    }

    error_log("✅ Authentification réussie pour : " . $user['email']);

    session_start();
    $_SESSION = [
        'utilisateur_id' => $user['utilisateur_id'],
        'pseudo' => $user['pseudo'],
        'email' => $user['email'],
        'nom' => $user['nom'],
        'prenom' => $user['prenom'],
        'credit' => $user['credit'],
        'photo' => !empty($user['photo']) ? $user['photo'] : null
    ];

    echo json_encode([
        'success' => true,
        'session' => $_SESSION
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}