document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
  
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      console.log("Formulaire déclenché");
  
      const villeDepart = document.getElementById('ville-depart').value;
      const villeArrivee = document.getElementById('ville-arrivee').value;
      const dateTrajet = document.getElementById('date-trajet').value;
  
      try {
        const response = await fetch(`http://dev.local/ecoride-backend/api/trajets.php?lieu_depart=${villeDepart}&lieu_arrivee=${villeArrivee}&date_trajet=${dateTrajet}`);
        const trajets = await response.json();
        console.log("Trajets reçus :", trajets);
        afficherTrajets(trajets);
        console.log("HTML généré :", document.getElementById('resultats-trajets').innerHTML);
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
          <h3>${trajet.lieu_depart} ➔ ${trajet.lieu_arrivee}</h3>
          <p><strong>Date :</strong> ${trajet.date_depart}</p>
          <p><strong>Prix :</strong> ${trajet.prix} €</p>
          <p><strong>Places restantes :</strong> ${trajet.nb_places_disponibles}</p>
          <button class="btn-detail-trajet">Voir détails</button>
        `;
        conteneur.appendChild(trajetDiv);
      });
    }
  });