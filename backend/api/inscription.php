
<?php
header('Content-Type: application/json');

$__log_start = error_log("🚩 Début du script trajets.php");
// Connexion SQL (PDO)
require_once '../config/connexion.php'; // Fichier contenant $pdo
// Connexion MongoDB
require_once __DIR__ . '/../../vendor/autoload.php'; // Fichier contenant $mongoClient

use MongoDB\Client;
use MongoDB\Database;
use MongoDB\Collection;

$mongoClient = new Client("mongodb://localhost:27017");
$mongoDb = $mongoClient->selectDatabase('ecoride_nosql');

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $pseudo = trim($data['pseudo'] ?? '');
    $nom = trim($data['nom'] ?? '');
    $prenom = trim($data['prenom'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $telephone = trim($data['telephone'] ?? '');
    $adresse = trim($data['adresse'] ?? '');
    $date_naissance = trim($data['date_naissance'] ?? '');

    file_put_contents("log.txt", json_encode([
      'pseudo' => $pseudo ?? null,
      'nom' => $nom ?? null,
      'prenom' => $prenom ?? null,
      'email' => $email ?? null,
      'password' => $password ?? null,
      'telephone' => $telephone ?? null,
      'adresse' => $adresse ?? null,
      'date_naissance' => $date_naissance ?? null,
      'pdo' => isset($pdo),
      'mongoDb' => isset($mongoDb)
    ]));

    if (!$pseudo || !$nom || !$prenom || !$email || !$password || !$telephone || !$adresse || !$date_naissance) {
        echo json_encode(['success' => false, 'message' => 'Champs manquants.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM utilisateur WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email déjà utilisé.']);
        exit;
    }

    // Hash du mot de passe
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Insertion SQL dans la table utilisateur
    $stmt = $pdo->prepare("INSERT INTO utilisateur (pseudo, nom, prenom, email, password, telephone, adresse, date_naissance, credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 20)");
    $stmt->execute([$pseudo, $nom, $prenom, $email, $hash, $telephone, $adresse, $date_naissance]);

    // Récupérer l'ID du dernier utilisateur inséré
    $userId = $pdo->lastInsertId();

    // Démarrer la session et enregistrer les données utilisateur
    session_start();
    $_SESSION['utilisateur_id'] = $userId;
    $_SESSION['pseudo'] = $pseudo;
    $_SESSION['nom'] = $nom;
    $_SESSION['prenom'] = $prenom;
    $_SESSION['email'] = $email;
    $_SESSION['telephone'] = $telephone;
    $_SESSION['adresse'] = $adresse;
    $_SESSION['date_naissance'] = $date_naissance;
    $_SESSION['credit'] = 20;

    // Insertion MongoDB
    $mongoDb->users_infos->insertOne([
        'utilisateur_id' => (int)$userId,
        'pseudo' => $pseudo,
        'nom' => $nom,
        'prenom' => $prenom,
        'email' => $email,
        'telephone' => $telephone,
        'adresse' => $adresse,
        'date_naissance' => $date_naissance,
        'preferences' => new stdClass(),
        'avis' => []
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}
