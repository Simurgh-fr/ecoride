<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
require_once __DIR__ . '/../config/connexion.php';
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de connexion à la base de données"]);
    exit;
}

header('Content-Type: application/json');

if (!isset($_SESSION['utilisateur_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Non autorisé"]);
    exit;
}

$utilisateur_id = $_SESSION['utilisateur_id'];

// Vérification du fichier
if (
    isset($_FILES['photo']) &&
    $_FILES['photo']['error'] === UPLOAD_ERR_OK
) {
    $fileTmpPath = $_FILES['photo']['tmp_name'];
    $fileName = basename($_FILES['photo']['name']);
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($fileExtension, $allowedExtensions)) {
        http_response_code(400);
        echo json_encode(["error" => "Extension de fichier non autorisée"]);
        exit;
    }

    // Définir le répertoire cible
    $uploadDir = '../../frontend/public/uploads/photos/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Nouveau nom de fichier unique
    $newFileName = 'user_' . $utilisateur_id . '_' . time() . '.' . $fileExtension;
    $destPath = $uploadDir . $newFileName;
    $relativePath = '/uploads/photos/' . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        error_log("✅ Photo déplacée avec succès vers : " . $destPath);
        error_log("✅ Photo relative enregistrée : " . $relativePath);
        // Mettre à jour la base de données
        $stmt = $pdo->prepare("UPDATE utilisateur SET photo = ? WHERE utilisateur_id = ?");
        $stmt->execute([$relativePath, $utilisateur_id]);

        // Mettre à jour la session
        $_SESSION['photo'] = $relativePath;

        echo json_encode(["success" => true, "photo" => $relativePath]);
    } else {
        error_log("❌ Échec du move_uploaded_file vers : $destPath");
        http_response_code(500);
        echo json_encode(["error" => "Échec du téléchargement"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Aucun fichier reçu"]);
}
?>