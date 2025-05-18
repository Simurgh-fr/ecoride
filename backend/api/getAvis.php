<?php
require '../config/mongo_client.php'; // Contient la connexion MongoDB

header('Content-Type: application/json');

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $collection = $client->ecoride_nosql->avis;

    $trajetId = isset($_GET['trajet_id']) ? intval($_GET['trajet_id']) : null;
    $conducteurId = isset($_GET['utilisateur_cible_id']) ? intval($_GET['utilisateur_cible_id']) : null;

    if ($trajetId !== null) {
        $cursor = $collection->find(['trajet_id' => $trajetId]);
    } elseif ($conducteurId !== null) {
        $cursor = $collection->find(['utilisateur_cible_id' => $conducteurId]);
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

    echo json_encode($resultats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}