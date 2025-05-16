<?php
header('Content-Type: application/json');

if (!isset($_GET['lieu_depart'], $_GET['lieu_arrivee'])) {
    echo json_encode([]);
    exit;
}

$lieu_depart = htmlspecialchars($_GET['lieu_depart']);
$lieu_arrivee = htmlspecialchars($_GET['lieu_arrivee']);
$date_trajet = !empty($_GET['date_trajet']) ? htmlspecialchars($_GET['date_trajet']) : null;

require_once '../config/connexion.php';

// Lecture des paramètres supplémentaires
$ecologique = isset($_GET['ecologique']) ? $_GET['ecologique'] : null;
$prix_max = isset($_GET['prix_max']) ? $_GET['prix_max'] : null;
$duree_max = isset($_GET['duree_max']) ? $_GET['duree_max'] : null;
$note_min = isset($_GET['note_min']) ? $_GET['note_min'] : null;
$fumeur = isset($_GET['fumeur']) ? $_GET['fumeur'] : null;
$animaux = isset($_GET['animaux']) ? $_GET['animaux'] : null;

// Construction dynamique des conditions SQL et des paramètres
$conditions = [];
$params = [
    ':lieu_depart' => $lieu_depart,
    ':lieu_arrivee' => $lieu_arrivee
];
if ($date_trajet !== null && $date_trajet !== '') {
    $conditions[] = 'c.lieu_depart = :lieu_depart';
    $conditions[] = 'c.lieu_arrivee = :lieu_arrivee';
    $conditions[] = '(c.date_depart = :date_trajet)';
    $params[':date_trajet'] = $date_trajet;
} else {
    $conditions[] = 'c.lieu_depart = :lieu_depart';
    $conditions[] = 'c.lieu_arrivee = :lieu_arrivee';
}
$conditions[] = 'c.nb_places > 0';

if ($ecologique !== null && $ecologique !== '') {
    $conditions[] = 'LOWER(v.energie) = "électrique"';
}
if ($prix_max !== null && $prix_max !== '') {
    $conditions[] = 'c.prix_personne <= :prix_max';
    $params[':prix_max'] = $prix_max;
}
if ($fumeur !== null && $fumeur !== '') {
    $conditions[] = 'c.fumeur = :fumeur';
    $params[':fumeur'] = $fumeur;
}
if ($animaux !== null && $animaux !== '') {
    $conditions[] = 'c.animaux = :animaux';
    $params[':animaux'] = $animaux;
}

// Sous-requête pour la note du chauffeur
$note_chauffeur_sql = '(SELECT ROUND(AVG(CAST(a.note AS DECIMAL(3,1))), 1) FROM avis a WHERE a.utilisateur_cible_id = u.utilisateur_id)';
if ($note_min !== null && $note_min !== '') {
    $conditions[] = "($note_chauffeur_sql >= :note_min OR $note_chauffeur_sql IS NULL)";
    $params[':note_min'] = $note_min;
}

// Calcul de la durée en minutes
$duree_sql = 'TIMESTAMPDIFF(MINUTE, CONCAT(c.date_depart, " ", c.heure_depart), CONCAT(c.date_arrivee, " ", c.heure_arrivee))';
if ($duree_max !== null && $duree_max !== '') {
    $conditions[] = "($duree_sql <= :duree_max)";
    $params[':duree_max'] = $duree_max;
}

$where = implode(' AND ', $conditions);

$sql = "
    SELECT 
        c.covoiturage_id AS id,
        c.lieu_depart,
        c.lieu_arrivee,
        c.date_depart,
        c.heure_depart,
        c.date_arrivee,
        c.heure_arrivee,
        c.prix_personne AS prix,
        c.nb_places AS nb_places_disponibles,
        u.nom AS pseudo_chauffeur,
        u.photo AS photo_chauffeur,
        $note_chauffeur_sql AS note_chauffeur,
        v.energie AS type_voiture,
        CASE WHEN LOWER(v.energie) = 'électrique' THEN 1 ELSE 0 END AS est_ecologique,
        c.fumeur,
        c.animaux,
        $duree_sql AS duree
    FROM covoiturage c
    INNER JOIN utilise uvc ON c.covoiturage_id = uvc.covoiturage_id
    INNER JOIN voiture v ON uvc.voiture_id = v.voiture_id
    INNER JOIN gere g ON v.voiture_id = g.voiture_id
    INNER JOIN utilisateur u ON g.utilisateur_id = u.utilisateur_id
    WHERE $where
";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $results_directs = $trajets;

    if (empty($trajets)) {
        $conditions_sans_date = [
            'c.lieu_depart = :lieu_depart',
            'c.lieu_arrivee = :lieu_arrivee',
            'c.nb_places > 0'
        ];
        $params_sans_date = [
            ':lieu_depart' => $lieu_depart,
            ':lieu_arrivee' => $lieu_arrivee
        ];

        $where_sans_date = implode(' AND ', $conditions_sans_date);

        $sql_prochains = "
            SELECT 
                c.covoiturage_id AS id,
                c.lieu_depart,
                c.lieu_arrivee,
                c.date_depart,
                c.heure_depart,
                c.date_arrivee,
                c.heure_arrivee,
                c.prix_personne AS prix,
                c.nb_places AS nb_places_disponibles,
                u.nom AS pseudo_chauffeur,
                u.photo AS photo_chauffeur,
                $note_chauffeur_sql AS note_chauffeur,
                v.energie AS type_voiture,
                CASE WHEN LOWER(v.energie) = 'électrique' THEN 1 ELSE 0 END AS est_ecologique,
                c.fumeur,
                c.animaux,
                $duree_sql AS duree
            FROM covoiturage c
            INNER JOIN utilise uvc ON c.covoiturage_id = uvc.covoiturage_id
            INNER JOIN voiture v ON uvc.voiture_id = v.voiture_id
            INNER JOIN gere g ON v.voiture_id = g.voiture_id
            INNER JOIN utilisateur u ON g.utilisateur_id = u.utilisateur_id
            WHERE $where_sans_date
            ORDER BY CONCAT(c.date_depart, ' ', c.heure_depart) ASC
        ";

        $stmt = $pdo->prepare($sql_prochains);
        $stmt->execute($params_sans_date);
        $trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    if (empty($results_directs) || empty($trajets)) {
        echo json_encode([
            'suggestions' => true,
            'trajets' => $trajets
        ]);
    } else {
        echo json_encode([
            'suggestions' => false,
            'trajets' => $results_directs
        ]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
