<?php
require_once '../config/session.php';

header('Content-Type: application/json');

$response = [
  'utilisateur_id' => $_SESSION['utilisateur_id'],
  'pseudo' => $_SESSION['pseudo'],
  'credit' => $_SESSION['credit'],
  'nom' => $_SESSION['nom'],
  'prenom' => $_SESSION['prenom'],
  'email' => $_SESSION['email'],
  'photo' => $_SESSION['photo'],
];

echo json_encode($response);
?>