<?php
define('MONGO_DISABLED', true);
session_start();
session_unset();
session_destroy();

// Supprimer le cookie PHPSESSID
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
    'expires' => time() - 42000,
    'path' => $params['path'],
    'domain' => $params['domain'],
    'secure' => $params['secure'],
    'httponly' => $params['httponly'],
    'samesite' => 'Lax' // ou 'Strict' selon ton paramétrage
]);
}

// Redirection ou réponse JSON
header('Content-Type: application/json');
http_response_code(200);
echo json_encode(['success' => true]);
exit;