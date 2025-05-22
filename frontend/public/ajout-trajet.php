<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once __DIR__ . '/../../backend/config/connexion.php';

$utilisateur_id = $_SESSION['utilisateur_id'];
$vehicules = [];

// Préférences par défaut (non cochées)
$_pref_fumeur = false;
$_pref_animaux = false;

// Récupérer les préférences utilisateur s'il existe un covoiturage associé
$prefStmt = $pdo->prepare("
    SELECT nb_places, fumeur, animaux
    FROM preference_utilisateur
    WHERE utilisateur_id = ?
    LIMIT 1
");
$prefStmt->execute([$utilisateur_id]);
$lastPref = $prefStmt->fetch(PDO::FETCH_ASSOC);

if ($lastPref) {
    $_pref_fumeur = (bool) $lastPref['fumeur'];
    $_pref_animaux = (bool) $lastPref['animaux'];
    $nb_places = isset($lastPref['nb_places']) ? (int) $lastPref['nb_places'] : '';
}

if ($utilisateur_id) {
    $stmt = $pdo->prepare("
        SELECT voiture.voiture_id, voiture.modele, voiture.couleur, voiture.energie, voiture.immatriculation, marque.libelle AS marque
        FROM voiture
        INNER JOIN gere ON voiture.voiture_id = gere.voiture_id
        INNER JOIN detient ON voiture.voiture_id = detient.voiture_id
        INNER JOIN marque ON detient.marque_id = marque.marque_id
        WHERE gere.utilisateur_id = ?
    ");
    $stmt->execute([$utilisateur_id]);
    $vehicules = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Créer un trajet</title>
    <link rel="stylesheet" href="/src/css/style.css">
</head>
<body>
    <main>
        <h1>Créer un nouveau trajet</h1>

            <form id="create-trajet-form" action="/api/creer_trajet.php" method="POST">            <label for="ville_depart">Ville de départ :</label>
            <input type="text" id="ville_depart" name="ville_depart" required><br>

            <label for="ville_arrivee">Ville d’arrivée :</label>
            <input type="text" id="ville_arrivee" name="ville_arrivee" required><br>

            <label for="date_depart">Date de départ :</label>
            <input type="date" id="date_depart" name="date_depart" required><br>

            <label for="heure_depart">Heure de départ :</label>
            <input type="time" id="heure_depart" name="heure_depart" required><br>
            
            <label for="vehicule">Véhicule utilisé :</label>
            <select id="vehicule" name="vehicule_id" required>
                <?php foreach ($vehicules as $v) : ?>
                                    <option value="<?= $v['voiture_id'] ?>"><?= $v['marque'] . ' ' . $v['modele'] ?></option>
                <?php endforeach; ?>
            </select>
            <a href="../profil.php">+ Ajouter un nouveau véhicule</a><br>

            <!-- Préférences conducteur -->
            <div class="form-group">
                <label><strong>Préférences :</strong></label>
                <div id="preferences-toggle" class="tag-toggle-wrapper">
                    <label class="tag-toggle tag-off" for="pref_fumeur" id="tag-fumeur">
                        🚬
                        <input type="hidden" name="pref_fumeur" value="0">
                        <input type="checkbox" name="pref_fumeur" id="pref_fumeur" value="1" hidden>
                    </label>
                    <label class="tag-toggle tag-off" for="pref_animaux" id="tag-animaux">
                        🐾
                        <input type="hidden" name="pref_animaux" value="0">
                        <input type="checkbox" name="pref_animaux" id="pref_animaux" value="1" hidden>
                    </label>
                </div>
            </div>

            <label for="nb_places">Nombre de places disponibles :</label>
            <input type="number" id="nb_places" name="nb_places" value="<?= htmlspecialchars($nb_places) ?>" required><br>

            <label for="prix">Prix par place (€) :</label>
            <input type="number" id="prix" name="prix" step="0.01" required><br>

            <p><strong>💡 Info :</strong> Une commission de <strong>2 crédits</strong> sera prélevée par la plateforme une fois le trajet validé.</p>

            <button type="submit">Publier le trajet</button>
        </form>
    </main>
</body>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const tagFumeur = document.getElementById("tag-fumeur");
    const tagAnimaux = document.getElementById("tag-animaux");
    const inputFumeur = document.getElementById("pref_fumeur");
    const inputAnimaux = document.getElementById("pref_animaux");

    const toggleTag = (tag, input) => {
        input.checked = !input.checked;
        tag.classList.toggle("tag-off", !input.checked);
        tag.classList.toggle("tag-on", input.checked);
        tag.classList.toggle("selected", input.checked);
    };

    tagFumeur.addEventListener("click", () => toggleTag(tagFumeur, inputFumeur));
    tagAnimaux.addEventListener("click", () => toggleTag(tagAnimaux, inputAnimaux));

    // Pré-remplissage : si les préférences sont connues côté PHP
    <?php if ($_pref_fumeur): ?>
        inputFumeur.checked = true;
        tagFumeur.classList.add("selected");
    <?php endif; ?>

    <?php if ($_pref_animaux): ?>
        inputAnimaux.checked = true;
        tagAnimaux.classList.add("selected");
    <?php endif; ?>
});

document.getElementById("create-trajet-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch("/api/creer_trajet.php", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Réponse réseau incorrecte.");
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            if (window.Notification && Notification.permission === "granted") {
                new Notification("✅ Trajet publié avec succès !");
            }

            // Réinitialise le formulaire
            form.reset();

            // Rafraîchit la page parente pour afficher le trajet ajouté et fermer la modale
            window.parent.location.reload();
        } else {
            alert("Erreur : " + (data.message || "Échec de la création du trajet."));
        }
    })
    .catch(err => {
        console.error("Erreur AJAX :", err);
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
});
</script>
</html>