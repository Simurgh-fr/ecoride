<?php
require_once '../../backend/config/session.php';

if (!isset($_SESSION['utilisateur_id'])) {
  header("Location: connexion.html?message=unauthorized");
  exit;
}

readfile("../templates/trajets.html");