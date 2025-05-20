<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=ecoride;charset=utf8', 'root', 'Psdapa0208');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur lors de la connexion à la base de données.']);
    exit;
}
?>
