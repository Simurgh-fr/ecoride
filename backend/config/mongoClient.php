<?php
require_once __DIR__ . '/config.php';
require_once '/srv/dev/Studi/ECF/ecoride/vendor/autoload.php'; // Assure que Composer est bien chargé

use MongoDB\Client;

$mongoUri = getenv('MONGO_URI');

if (!$mongoUri) {
    // Pas de MongoDB disponible (ex : Heroku), on renvoie null
    return null;
}

try {
    $mongoClient = new Client($mongoUri);
    $mongoDb = $mongoClient->selectDatabase('ecoride_nosql');
    $collectionAvis = $mongoDb->avis;
    return $collectionAvis;
} catch (Exception $e) {
    // Silencieusement désactiver en prod, ou logguer si besoin
    return null;
}