<?php
require_once '/srv/dev/Studi/ECF/ecoride/vendor/autoload.php'; // Assure que Composer est bien chargé

use MongoDB\Client;

try {
    $mongoClient = new Client('mongodb://192.168.1.112:27017');
    $mongoDb = $mongoClient->selectDatabase('ecoride_nosql');
    $collectionAvis = $mongoDb->avis;
    return $collectionAvis;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à MongoDB : ' . $e->getMessage()]);
    exit;
}