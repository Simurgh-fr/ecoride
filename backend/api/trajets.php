<?php
define('MONGO_DISABLED', true);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
// if (php_sapi_name() !== 'cli') {
//     echo "<pre>";
// }

if (!isset($_GET['lieu_depart'], $_GET['lieu_arrivee'])) {
    echo json_encode([]);
    exit;
}

$lieu_depart = htmlspecialchars($_GET['lieu_depart']);
$lieu_arrivee = htmlspecialchars($_GET['lieu_arrivee']);
$date_trajet = !empty($_GET['date_trajet']) ? htmlspecialchars($_GET['date_trajet']) : null;

$__log_start = error_log("🚩 Début du script trajets.php");
require_once '../config/connexion.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use MongoDB\Client;
use MongoDB\Database;
use MongoDB\Collection;

$mongoClient = new Client("mongodb://localhost:27017");
$mongoDb = $mongoClient->selectDatabase('ecoride_nosql');

$avisCollection = null;
if ($mongoDb instanceof Database) {
    $avisCollection = $mongoDb->selectCollection('avis');
}

if (!($avisCollection instanceof Collection)) {
    error_log("❌ avisCollection n’est pas valide (type incorrect)");
    http_response_code(500);
    echo json_encode(['error' => 'avisCollection invalide']);
    exit;
}
// error_log("📌 Type de retour de mongoClient.php : " . gettype($avisCollection));

// if (!($avisCollection instanceof MongoDB\Collection)) {
//     error_log("❌ avisCollection n’est pas valide");
//     echo json_encode(['error' => 'Erreur interne : avisCollection invalide']);
//     http_response_code(500);
//     exit;
// }

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

// Calcul de la durée en minutes
$duree_sql = 'TIMESTAMPDIFF(MINUTE, CONCAT(c.date_depart, " ", c.heure_depart), CONCAT(c.date_arrivee, " ", c.heure_arrivee))';
if ($duree_max !== null && $duree_max !== '') {
    $conditions[] = "($duree_sql <= :duree_max)";
    $params[':duree_max'] = $duree_max;
}

$where = implode(' AND ', $conditions);

$sql = "
    SELECT 
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
        u.utilisateur_id AS utilisateur_id,
        v.energie AS type_voiture,
        m.libelle AS marque,
        v.modele AS modele,
        CASE WHEN LOWER(v.energie) = 'électrique' THEN 1 ELSE 0 END AS est_ecologique,
        c.fumeur,
        c.animaux,
        $duree_sql AS duree
    FROM covoiturage c
    INNER JOIN utilise uvc ON c.covoiturage_id = uvc.covoiturage_id
    INNER JOIN voiture v ON uvc.voiture_id = v.voiture_id
    INNER JOIN detient d ON v.voiture_id = d.voiture_id
    INNER JOIN marque m ON d.marque_id = m.marque_id
    INNER JOIN gere g ON v.voiture_id = g.voiture_id
    INNER JOIN utilisateur u ON g.utilisateur_id = u.utilisateur_id
    WHERE $where
";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $results_directs = $trajets;
    error_log("Résultats SQL : " . json_encode($results_directs));
    error_log("✅ SQL exécutée, résultats récupérés");

    foreach ($results_directs as &$trajet) {
        try {
            $chauffeurDoc = $avisCollection->aggregate([
                ['$match' => ['utilisateur_cible_id' => (int) $trajet['utilisateur_id']]],
                ['$group' => ['_id' => null, 'note_moyenne' => ['$avg' => '$note']]]
            ])->toArray();
            $trajet['note_chauffeur'] = isset($chauffeurDoc[0]['note_moyenne']) ? round($chauffeurDoc[0]['note_moyenne'], 1) : null;
            if ($trajet['note_chauffeur'] === null) $trajet['note_chauffeur'] = 0;
        } catch (Exception $e) {
            error_log("Erreur MongoDB (directs) : " . $e->getMessage());
            error_log("❌ Exception attrapée : " . $e->getMessage());
            $trajet['note_chauffeur'] = null;
        }
    }
    unset($trajet);

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
                u.utilisateur_id AS utilisateur_id,
                v.energie AS type_voiture,
                m.libelle AS marque,
                v.modele AS modele,
                CASE WHEN LOWER(v.energie) = 'électrique' THEN 1 ELSE 0 END AS est_ecologique,
                c.fumeur,
                c.animaux,
                $duree_sql AS duree
            FROM covoiturage c
            INNER JOIN utilise uvc ON c.covoiturage_id = uvc.covoiturage_id
            INNER JOIN voiture v ON uvc.voiture_id = v.voiture_id
            INNER JOIN detient d ON v.voiture_id = d.voiture_id
            INNER JOIN marque m ON d.marque_id = m.marque_id
            INNER JOIN gere g ON v.voiture_id = g.voiture_id
            INNER JOIN utilisateur u ON g.utilisateur_id = u.utilisateur_id
            WHERE $where_sans_date
            ORDER BY CONCAT(c.date_depart, ' ', c.heure_depart) ASC
        ";

        $stmt = $pdo->prepare($sql_prochains);
        $stmt->execute($params_sans_date);
        $trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($trajets as &$trajet) {
            try {
                $chauffeurDoc = $avisCollection->aggregate([
                    ['$match' => ['utilisateur_cible_id' => (int) $trajet['utilisateur_id']]],
                    ['$group' => ['_id' => null, 'note_moyenne' => ['$avg' => '$note']]]
                ])->toArray();
                $trajet['note_chauffeur'] = isset($chauffeurDoc[0]['note_moyenne']) ? round($chauffeurDoc[0]['note_moyenne'], 1) : null;
                if ($trajet['note_chauffeur'] === null) $trajet['note_chauffeur'] = 0;
            } catch (Exception $e) {
                error_log("Erreur MongoDB (prochains) : " . $e->getMessage());
                error_log("❌ Exception attrapée : " . $e->getMessage());
                $trajet['note_chauffeur'] = null;
            }
        }
        unset($trajet);
    }

    if (empty($results_directs) || empty($trajets)) {
        error_log("✅ Fin script trajets.php atteinte");
        echo json_encode([
            'suggestions' => true,
            'trajets' => $trajets
        ]);
    } else {
        error_log("✅ Fin script trajets.php atteinte");
        echo json_encode([
            'suggestions' => false,
            'trajets' => $results_directs
        ]);
    }

    if ($note_min !== null && $note_min !== '') {
        $note_min = floatval($note_min);
        $results_directs = array_filter($results_directs, function($t) use ($note_min) {
            return ($t['note_chauffeur'] === null || $t['note_chauffeur'] >= $note_min);
        });
    }

    error_log("✅ Fichier trajets.php terminé sans erreur");
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
} catch (Exception $e) {
    error_log("❌ Exception attrapée : " . $e->getMessage());
    error_log("🛑 Exception complète : " . var_export($e, true));
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}