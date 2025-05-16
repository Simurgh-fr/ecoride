function afficherFicheDetaillee(idTrajet) {
  fetch(`http://dev.local/ecoride-backend/api/detail-trajet.php?id=${idTrajet}`)    .then(response => response.json())
    .then(data => {
      if (data.erreur) {
        document.getElementById('contenu-detail').innerHTML = `<p>${data.erreur}</p>`;
      } else {
        const fiche = `
          <h2>Trajet de ${data.ville_depart} à ${data.ville_arrivee}</h2>
          <p><strong>Conducteur :</strong> ${data.nom_conducteur}</p>
          <p><strong>Note :</strong> ${data.note} ⭐</p>
          <p><strong>Véhicule :</strong> ${data.marque} ${data.modele} (${data.energie})</p>
          <p><strong>Préférences :</strong> 
            ${data.fumeur ? "🚬 Fumeur accepté" : "🚭 Non fumeur"} | 
            ${data.animaux ? "🐾 Animaux OK" : "❌ Pas d’animaux"}
          </p>
          <p><strong>Avis :</strong> ${data.avis ?? "Aucun avis"}</p>
        `;
        document.getElementById('contenu-detail').innerHTML = fiche;
      }
      document.getElementById('fiche-detaillee').style.display = 'block';
    })
    .catch(error => {
      console.error("Erreur lors de la récupération du trajet :", error);
      document.getElementById('contenu-detail').innerHTML = "<p>Impossible de charger les détails du trajet.</p>";
      document.getElementById('fiche-detaillee').style.display = 'block';
    });
}

function fermerFiche() {
  document.getElementById('fiche-detaillee').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("button.btn-detail-trajet[data-id]")) {
      const id = e.target.getAttribute("data-id");
      console.log("✅ Bouton détail cliqué pour l’ID :", id);
      afficherFicheDetaillee(id);
    }
  });
});