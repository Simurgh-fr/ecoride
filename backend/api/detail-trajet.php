<?php
if (ob_get_length()) {
    ob_clean();
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['erreur' => 'ID de trajet invalide']);
    exit;
}

$id = intval($_GET['id']);

// Connexion à la base
require_once __DIR__ . '/../config/connexion.php'; // Connexion déjà définie ici

if (!isset($pdo) || !$pdo) {
    http_response_code(500);
    echo json_encode(['erreur' => 'Connexion à la base de données échouée']);
    exit;
}

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
    $stmt = $pdo->prepare("
        SELECT 
            t.covoiturage_id AS id,
            t.lieu_depart, t.lieu_arrivee, t.date_depart, t.heure_depart,
            t.date_arrivee, t.heure_arrivee, t.nb_places AS nb_places_disponibles,
            u.pseudo AS pseudo_chauffeur,
            t.fumeur, t.animaux, t.prix_personne AS prix, t.statut
        FROM covoiturage t
        JOIN utilisateur u ON u.utilisateur_id = 1 -- ⚠️ à remplacer par une vraie relation si disponible
        WHERE t.covoiturage_id = :id
        LIMIT 1
    ");
    $stmt->execute(['id' => $id]);
    $trajet = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($trajet) {
        echo json_encode($trajet, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        http_response_code(404);
        echo json_encode(['erreur' => 'Trajet non trouvé']);
    }               
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'erreur' => 'Erreur SQL',
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
        'trace' => $e->getTraceAsString()
    ]);
}
exit;
?>