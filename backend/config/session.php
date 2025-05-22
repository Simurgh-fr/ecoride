<?php
// Initialisation sécurisée de la session

// Forcer le mode strict et une configuration sécurisée (utile sur Heroku)
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_httponly', 1);

// Démarrer la session si elle n'existe pas encore
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}