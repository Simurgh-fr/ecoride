
<?php
require_once '../config/session.php';

header('Content-Type: application/json');

if (!isset($_SESSION['utilisateur_id'])) {
  http_response_code(401);
  echo json_encode(['success' => false, 'message' => 'Non authentifié']);
  exit;
}

$response = [
  'utilisateur_id' => $_SESSION['utilisateur_id'],
  'pseudo' => $_SESSION['pseudo'],
  'credit' => $_SESSION['credit'],
  'nom' => $_SESSION['nom'],
  'prenom' => $_SESSION['prenom'],
  'email' => $_SESSION['email'],
  'photo' => $_SESSION['photo'],
  'adresse' => $_SESSION['adresse'],
  'date_naissance' => $_SESSION['date_naissance'],
  'telephone' => $_SESSION['telephone'],
];

echo json_encode($response);
?>
