<?php
header('Content-Type: application/json');

if (!isset($_GET['lieu_depart'], $_GET['lieu_arrivee'], $_GET['date_trajet'])) {
    echo json_encode([]);
    exit;
}

$lieu_depart = htmlspecialchars($_GET['lieu_depart']);
$lieu_arrivee = htmlspecialchars($_GET['lieu_arrivee']);
$date_trajet = !empty($_GET['date_trajet']) ? htmlspecialchars($_GET['date_trajet']) : null;

require_once '../config/connexion.php';

// Calcule de la moyenne des notes laissées à l'utilisateur (chauffeur)
try {
    $stmt = $pdo->prepare('
        SELECT 
            c.covoiturage_id AS id,
            c.lieu_depart,
            c.lieu_arrivee,
            CONCAT(c.date_depart, " ", c.heure_depart) AS date_depart,
            c.date_arrivee,
            c.heure_arrivee,
            c.nb_places AS nb_places_disponibles,
            c.prix_personne AS prix,
            u.nom AS pseudo_chauffeur,
            u.photo AS photo_chauffeur,
            (
              SELECT ROUND(AVG(CAST(a.note AS DECIMAL(3,1))), 1)
              FROM avis a
              WHERE a.utilisateur_cible_id = u.utilisateur_id
            ) AS note_chauffeur,
            v.energie AS type_voiture,
            CASE 
              WHEN v.energie = "électrique" THEN 1
              ELSE 0
            END AS est_ecologique
        FROM covoiturage c
        INNER JOIN utilise uvc ON c.covoiturage_id = uvc.covoiturage_id
        INNER JOIN voiture v ON uvc.voiture_id = v.voiture_id
        INNER JOIN gere g ON v.voiture_id = g.voiture_id
        INNER JOIN utilisateur u ON g.utilisateur_id = u.utilisateur_id
        WHERE c.lieu_depart = :lieu_depart
          AND c.lieu_arrivee = :lieu_arrivee
          AND (:date_trajet IS NULL OR :date_trajet = \'\' OR c.date_depart = :date_trajet)
          AND c.nb_places > 0
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
