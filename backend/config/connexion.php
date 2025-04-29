<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=ecoride;charset=utf8', 'root', 'Psdapa0208');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Erreur de connexion à la base de données : ' . $e->getMessage());
}
?>
