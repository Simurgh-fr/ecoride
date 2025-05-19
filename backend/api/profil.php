<?php
require_once '../config/session.php';

header('Content-Type: application/json');

$response = [
  'utilisateur_id' => $_SESSION['utilisateur_id'],
  'pseudo' => $_SESSION['pseudo'],
  'credit' => $_SESSION['credit']
];

echo json_encode($response);
?>