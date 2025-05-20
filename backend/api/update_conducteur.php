<?php
require_once '../config/session.php';
require_once '../config/connexion.php';

header('Content-Type: application/json');

if (!isset($_SESSION['utilisateur_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit;
}

$utilisateur_id = $_SESSION['utilisateur_id'];
$data = $_POST;

// Récupération ou création de la voiture de l’utilisateur
try {
    // Vérifie si une voiture est déjà liée à l’utilisateur via `gere`
    $stmt = $pdo->prepare("SELECT v.voiture_id FROM voiture v 
                           INNER JOIN gere g ON g.voiture_id = v.voiture_id 
                           WHERE g.utilisateur_id = ?");
    $stmt->execute([$utilisateur_id]);
    $voiture_id = $stmt->fetchColumn();

    if (!$voiture_id) {
        // Création d’une nouvelle voiture
        $stmt = $pdo->prepare("INSERT INTO voiture (immatriculation, modele, couleur, energie, date_premiere_immatriculation) 
                               VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['immatriculation'] ?? '',
            $data['modele'] ?? '',
            $data['couleur'] ?? '',
            $data['energie'] ?? '',
            $data['date_immatriculation'] ?? null
        ]);
        $voiture_id = $pdo->lastInsertId();

        // Liaison utilisateur <-> voiture
        $stmt = $pdo->prepare("INSERT INTO gere (utilisateur_id, voiture_id) VALUES (?, ?)");
        $stmt->execute([$utilisateur_id, $voiture_id]);
    } else {
        // Mise à jour de la voiture existante
        $stmt = $pdo->prepare("UPDATE voiture 
                               SET immatriculation = ?, modele = ?, couleur = ?, energie = ?, date_premiere_immatriculation = ? 
                               WHERE voiture_id = ?");
        $stmt->execute([
            $data['immatriculation'] ?? '',
            $data['modele'] ?? '',
            $data['couleur'] ?? '',
            $data['energie'] ?? '',
            $data['date_immatriculation'] ?? null,
            $voiture_id
        ]);
    }

    // Traitement de la marque
    if (!empty($data['marque'])) {
        // Vérifie si la marque existe
        $stmt = $pdo->prepare("SELECT marque_id FROM marque WHERE libelle = ?");
        $stmt->execute([$data['marque']]);
        $marque_id = $stmt->fetchColumn();

        if (!$marque_id) {
            $stmt = $pdo->prepare("INSERT INTO marque (libelle) VALUES (?)");
            $stmt->execute([$data['marque']]);
            $marque_id = $pdo->lastInsertId();
        }

        // Lier voiture à marque via `detient`
        $stmt = $pdo->prepare("SELECT * FROM detient WHERE voiture_id = ?");
        $stmt->execute([$voiture_id]);
        if ($stmt->rowCount() > 0) {
            $stmt = $pdo->prepare("UPDATE detient SET marque_id = ? WHERE voiture_id = ?");
            $stmt->execute([$marque_id, $voiture_id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO detient (voiture_id, marque_id) VALUES (?, ?)");
            $stmt->execute([$voiture_id, $marque_id]);
        }
    }

    // Préférences covoiturage
    $places = isset($data['places']) && is_numeric($data['places']) ? intval($data['places']) : 0;
    $fumeur = in_array('fumeur', $data['preferences'] ?? []) ? 1 : 0;
    $animaux = in_array('animaux', $data['preferences'] ?? []) ? 1 : 0;

    // Récupérer ou créer un covoiturage pour cette voiture
    $stmt = $pdo->prepare("SELECT c.covoiturage_id FROM covoiturage c
                           INNER JOIN utilise u ON u.covoiturage_id = c.covoiturage_id
                           WHERE u.voiture_id = ? LIMIT 1");
    $stmt->execute([$voiture_id]);
    $covoiturage_id = $stmt->fetchColumn();

    if ($covoiturage_id) {
        $stmt = $pdo->prepare("UPDATE covoiturage 
                               SET nb_places = ?, fumeur = ?, animaux = ?
                               WHERE covoiturage_id = ?");
        $stmt->execute([$places, $fumeur, $animaux, $covoiturage_id]);
    }

    if (!$covoiturage_id) {
        $stmt = $pdo->prepare("INSERT INTO covoiturage (nb_places, fumeur, animaux) VALUES (?, ?, ?)");
        $stmt->execute([$places, $fumeur, $animaux]);
        $covoiturage_id = $pdo->lastInsertId();
        $stmt = $pdo->prepare("INSERT INTO utilise (voiture_id, covoiturage_id) VALUES (?, ?)");
        $stmt->execute([$voiture_id, $covoiturage_id]);
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}