<?php
session_start();
session_unset();
session_destroy();

// Rediriger vers la page d'accueil après déconnexion
// header("Location: /ecoride/index.html");
// exit;

http_response_code(200);
echo json_encode(["message" => "Déconnexion réussie"]);
exit;