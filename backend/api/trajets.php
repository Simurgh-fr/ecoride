<?php
header('Content-Type: application/json');

if (!isset($_GET['lieu_depart'], $_GET['lieu_arrivee'], $_GET['date_trajet'])) {
    echo json_encode([]);
    exit;
}

$lieu_depart = htmlspecialchars($_GET['lieu_depart']);
$lieu_arrivee = htmlspecialchars($_GET['lieu_arrivee']);
$date_trajet = htmlspecialchars($_GET['date_trajet']);

require_once '../config/connexion.php';

try {
    $stmt = $pdo->prepare('
        SELECT id, lieu_depart, lieu_arrivee, date_depart, nb_places_disponibles, prix
        FROM trajets
        WHERE lieu_depart = :lieu_depart
          AND lieu_arrivee = :lieu_arrivee
          AND DATE(date_depart) = :date_trajet
          AND nb_places_disponibles > 0
    ');

    $stmt->execute([
        ':lieu_depart' => $lieu_depart,
        ':lieu_arrivee' => $lieu_arrivee,
        ':date_trajet' => $date_trajet
    ]);

    $trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($trajets);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
