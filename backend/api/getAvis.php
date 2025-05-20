<?php
require_once __DIR__ . '/../../vendor/autoload.php';
use MongoDB\Client;
use MongoDB\Database;
use MongoDB\Collection;

header('Content-Type: application/json');

try {
    $mongoClient = new Client("mongodb://localhost:27017");
    $mongoDb = $mongoClient->selectDatabase('ecoride_nosql');
    $avisCollection = $mongoDb->selectCollection('avis');

    if (!($avisCollection instanceof Collection)) {
        throw new Exception("Connexion à la collection 'avis' invalide.");
    }

    $trajetId = isset($_GET['trajet_id']) ? intval($_GET['trajet_id']) : null;
    $conducteurId = isset($_GET['utilisateur_cible_id']) ? intval($_GET['utilisateur_cible_id']) : null;

    if ($trajetId !== null) {
        $cursor = $avisCollection->find(['trajet_id' => $trajetId]);
    } elseif ($conducteurId !== null) {
        $cursor = $avisCollection->find(['utilisateur_cible_id' => $conducteurId]);
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre 'trajet_id' ou 'utilisateur_cible_id' requis."]);
        exit;
    }

    $resultats = [];
    foreach ($cursor as $item) {
        $resultats[] = [
            "note" => $item["note"],
            "commentaire" => $item["commentaire"],
            "date" => $item["date"]->toDateTime()->format('Y-m-d'),
            "statut" => $item["statut"]
        ];
    }

    // Toujours retourner un tableau JSON, même vide
    echo json_encode($resultats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur : " . $e->getMessage()]);
}