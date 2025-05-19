<?php
session_start();

if (!isset($_SESSION['utilisateur_id'])) {
    header('Location: /ecoride/connexion.html');
    exit;
}
?>