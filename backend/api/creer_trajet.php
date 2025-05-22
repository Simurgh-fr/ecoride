
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/connexion.php';

if (
    isset($_POST['ville_depart'], $_POST['ville_arrivee'], $_POST['date_depart'], $_POST['heure_depart'], $_POST['vehicule_id'], $_POST['prix']) &&
    !empty($_POST['ville_depart']) && !empty($_POST['ville_arrivee']) && !empty($_POST['date_depart']) && !empty($_POST['heure_depart'])
)
 {
    $ville_depart = $_POST['ville_depart'];
    $ville_arrivee = $_POST['ville_arrivee'];
    $date_depart = $_POST['date_depart'];
    $heure_depart = $_POST['heure_depart'];
    $vehicule_id = $_POST['vehicule_id'];
    $prix = $_POST['prix'];
    $nb_places = $_POST['nb_places'];
    $pref_fumeur = isset($_POST['pref_fumeur']) ? 1 : 0;
    $pref_animaux = isset($_POST['pref_animaux']) ? 1 : 0;

    try {
        $utilisateur_id = $_SESSION['utilisateur_id'];

        $pdo->beginTransaction();

        // 1. Insérer le trajet dans la table covoiturage
        $stmt = $pdo->prepare("INSERT INTO covoiturage (lieu_depart, lieu_arrivee, date_depart, heure_depart, nb_places, prix_personne, fumeur, animaux, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$ville_depart, $ville_arrivee, $date_depart, $heure_depart, $nb_places, $prix, $pref_fumeur, $pref_animaux, 'ouvert']);
        $trajet_id = $pdo->lastInsertId();
        
        // 2. Associer le véhicule au trajet
        $stmt2 = $pdo->prepare("INSERT INTO utilise (voiture_id, covoiturage_id) VALUES (?, ?)");
        $stmt2->execute([$vehicule_id, $trajet_id]);

        // 3. Associer le l'utilisateur_id au covoiturage_id
        $stmt3 = $pdo->prepare("INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES (?, ?)");
        $stmt3->execute([$utilisateur_id, $trajet_id]);

        $pdo->commit();
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Trajet enregistré avec succès.']);
        exit;
    } catch (Exception $e) {
        $pdo->rollBack();
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
        exit;
    }
} else {
    echo "Tous les champs obligatoires n'ont pas été remplis.";
    exit;
}
