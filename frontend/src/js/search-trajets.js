document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
  
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const villeDepart = document.getElementById('ville-depart').value;
      const villeArrivee = document.getElementById('ville-arrivee').value;
      const dateTrajet = document.getElementById('date-trajet').value;
  
      try {
        const response = await fetch(`/backend/api/trajets.php?ville_depart=${villeDepart}&ville_arrivee=${villeArrivee}&date_trajet=${dateTrajet}`);
        const trajets = await response.json();
        afficherTrajets(trajets);
      } catch (err) {
        console.error("Erreur lors de la récupération des trajets :", err);
      }
    });

    function formaterDate(dateStr, heureStr) {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const date = new Date(`${dateStr}T${heureStr}`);
      const dateFormatee = date.toLocaleDateString('fr-FR', options);
      const heureFormatee = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      return `${dateFormatee} à ${heureFormatee}`;
    }
  
    function afficherTrajets(trajets) {
      const conteneur = document.getElementById('resultats-trajets');
      conteneur.innerHTML = '';
  
      if (trajets.length === 0) {
        conteneur.innerHTML = '<p>Aucun trajet trouvé. Essayez une autre date.</p>';
        return;
      }
  
      trajets.forEach(trajet => {
        const trajetDiv = document.createElement('div');
        trajetDiv.className = 'card-trajet';
        trajetDiv.innerHTML = `
          <h3>${trajet.nom_chauffeur} - ${trajet.prix}€</h3>
          <p>Note : ${trajet.note}/5</p>
          <p>${trajet.ville_depart} ➔ ${trajet.ville_arrivee}</p>
          <p>${formaterDate(trajet.date_depart, trajet.heure_depart)}</p>
          <p>${trajet.places_restantes} places restantes</p>
          ${trajet.ecologique ? '<p>🚗 Voyage écologique</p>' : ''}
          <button class="btn-detail-trajet">Voir détails</button>
        `;
        conteneur.appendChild(trajetDiv);
      });
    }
  });