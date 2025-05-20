<?php
require_once '../config/session.php';
require_once '../config/connexion.php';

header('Content-Type: application/json');

if (!isset($_SESSION['utilisateur_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit;
}

$utilisateur_id = $_SESSION['utilisateur_id'];

try {
    // Récupérer l'ID de la voiture liée à l'utilisateur
    $stmt = $pdo->prepare("SELECT v.voiture_id FROM voiture v
                           INNER JOIN gere g ON g.voiture_id = v.voiture_id
                           WHERE g.utilisateur_id = ?");
    $stmt->execute([$utilisateur_id]);
    $voiture_id = $stmt->fetchColumn();

    if (!$voiture_id) {
        echo json_encode(['success' => true, 'data' => []]);
        exit;
    }

    // Récupérer les infos de la voiture
    $stmt = $pdo->prepare("SELECT immatriculation, modele, couleur, energie, date_premiere_immatriculation FROM voiture WHERE voiture_id = ?");
    $stmt->execute([$voiture_id]);
    $voiture = $stmt->fetch(PDO::FETCH_ASSOC);

    // Récupérer la marque
    $stmt = $pdo->prepare("SELECT m.libelle FROM marque m
                           INNER JOIN detient d ON d.marque_id = m.marque_id
                           WHERE d.voiture_id = ?");
    $stmt->execute([$voiture_id]);
    $voiture['marque'] = $stmt->fetchColumn();

    // Récupérer les infos covoiturage
    $stmt = $pdo->prepare("SELECT c.nb_places, c.fumeur, c.animaux FROM covoiturage c
                           INNER JOIN utilise u ON u.covoiturage_id = c.covoiturage_id
                           WHERE u.voiture_id = ?");
    $stmt->execute([$voiture_id]);
    $covoit = $stmt->fetch(PDO::FETCH_ASSOC);

    $data = array_merge($voiture, $covoit ?: []);
    echo json_encode(['success' => true, 'data' => $data]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}