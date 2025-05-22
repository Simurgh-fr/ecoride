<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once '../../backend/config/session.php';

if (!isset($_SESSION['utilisateur_id'])) {
  header("Location: connexion.html?message=unauthorized");
  exit;
}

if (!in_array('conducteur', array_map('strtolower', (array) $_SESSION['role']))) {
  readfile(__DIR__ . '/../templates/trajets.html');
  exit;
}

// Si utilisateur est conducteur → version avec bouton
readfile(__DIR__ . '/../templates/trajets_conducteur.html');
exit;