function afficherFicheDetaillee(idTrajet) {
  fetch(`http://dev.local/ecoride-backend/api/detail-trajet.php?id=${idTrajet}`)    .then(response => response.json())
    .then(data => {
      if (data.erreur) {
        document.getElementById('contenu-detail').innerHTML = `<p>${data.erreur}</p>`;
      } else {
        const fiche = `
  <h2>Trajet de ${data.lieu_depart} à ${data.lieu_arrivee}</h2>
  <p><strong>Date départ :</strong> ${data.date_depart} à ${data.heure_depart}</p>
  <p><strong>Date arrivée :</strong> ${data.date_arrivee} à ${data.heure_arrivee}</p>
  <p><strong>Conducteur :</strong> ${data.pseudo_chauffeur}</p>
  <p><strong>Véhicule :</strong> ${data.marque} ${data.modele} (${data.energie})</p>
  <p><strong>Préférences :</strong> 
    ${data.fumeur ? "🚬 Fumeur accepté" : "🚭 Non fumeur"} | 
    ${data.animaux ? "🐾 Animaux OK" : "❌ Pas d’animaux"}
  </p>
  <p><strong>Prix :</strong> ${data.prix} €</p>
  <p><strong>Statut :</strong> ${data.statut}</p>
  <div><strong>Avis :</strong><ul>
    ${Array.isArray(data.avis) && data.avis.length > 0
      ? data.avis.map(a => `<li>${a.commentaire ?? 'Aucun commentaire'} (${a.note ?? '-'}/5)</li>`).join('')
      : "<li>Aucun avis disponible</li>"
    }
  </ul></div>
`;
        document.getElementById('contenu-detail').innerHTML = fiche;

        // Appel à l’API MongoDB pour charger les avis du conducteur
        const conducteurId = data.id_conducteur ?? data.conducteur_id ?? null;
        if (conducteurId) {
          fetch(`http://dev.local/ecoride-backend/api/getAvis.php?utilisateur_cible_id=${conducteurId}`)
            .then(res => res.json())
            .then(avisData => {
              const avisBloc = avisData.map(a => `<li>${a.commentaire ?? 'Aucun commentaire'} (${a.note ?? '-'}/5)</li>`).join('');
              document.querySelector('#contenu-detail ul').innerHTML = avisBloc || "<li>Aucun avis disponible</li>";
            })
            .catch(err => console.error("Erreur chargement avis Mongo :", err));
        }
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