<?php
session_start();

if (!isset($_SESSION['utilisateur_id'])) {
    // Rediriger si l'utilisateur n'est pas connecté
    header('Location: /ecoride/connexion.html');
    exit;
}
?>