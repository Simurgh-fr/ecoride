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

        if (!Array.isArray(trajets)) {
          console.error("Erreur backend :", trajets);
          document.getElementById('resultats-trajets').innerHTML = '<p>Une erreur est survenue. Veuillez réessayer plus tard.</p>';
          return;
        }

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
  
    async function afficherTrajets(trajets) {
      const conteneur = document.getElementById('resultats-trajets');
      conteneur.innerHTML = '';
  
      if (trajets.length === 0) {
        const villeDepart = document.getElementById('ville-depart').value;
        const villeArrivee = document.getElementById('ville-arrivee').value;
        const dateTrajet = document.getElementById('date-trajet').value;

        const tousTrajets = await fetch(`http://dev.local/ecoride-backend/api/trajets.php?lieu_depart=${villeDepart}&lieu_arrivee=${villeArrivee}&date_trajet=`)
          .then(res => res.json())
          .catch(err => {
            console.error("Erreur lors de la récupération des trajets disponibles :", err);
            return [];
          });

        const prochainTrajet = Array.isArray(tousTrajets)
          ? tousTrajets
              .map(t => ({ ...t, parsedDate: new Date(t.date_depart) }))
              .filter(t => t.parsedDate >= new Date(dateTrajet))
              .sort((a, b) => a.parsedDate - b.parsedDate)[0]
          : null;

        if (prochainTrajet) {
          const dateProposee = new Date(prochainTrajet.date_depart);
          const dateStr = dateProposee.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          conteneur.innerHTML = `<p>Aucun trajet trouvé à cette date. Prochaine suggestion disponible : <strong>${dateStr}</strong></p>`;
          afficherTrajets([prochainTrajet]);
        } else {
          conteneur.innerHTML = '<p>Aucun trajet disponible pour cette recherche.</p>';
        }
        return;
      }
  
      trajets.forEach(trajet => {
        console.log("photo_chauffeur =", trajet.photo_chauffeur);
        const trajetDiv = document.createElement('div');
        trajetDiv.className = 'card-trajet';
        trajetDiv.innerHTML = `
          <h3>${trajet.lieu_depart} ➔ ${trajet.lieu_arrivee}</h3>
          <img src="${trajet.photo_chauffeur || '/src/assets/images/default-avatar.png'}" alt="Photo de ${trajet.pseudo_chauffeur}" class="photo-chauffeur"/>
          <p><strong>Chauffeur :</strong> ${trajet.pseudo_chauffeur}</p>
          <p><strong>Note :</strong> ${trajet.note_chauffeur} ⭐ / 5</p>
          <p><strong>Départ :</strong> ${trajet.date_depart ? formaterDate(trajet.date_depart.split(" ")[0], trajet.date_depart.split(" ")[1]) : 'Non défini'}</p>
          <p><strong>Arrivée :</strong> ${trajet.date_arrivee && trajet.heure_arrivee ? formaterDate(trajet.date_arrivee, trajet.heure_arrivee) : 'Non défini'}</p>
          <p><strong>Prix :</strong> ${trajet.prix} €</p>
          <p><strong>Places restantes :</strong> ${trajet.nb_places_disponibles}</p>
          ${trajet.type_voiture === 'électrique' ? '<p class="eco-label">🌿 Voyage écologique</p>' : ''}
          ${trajet.est_ecologique === 1 ? '<p class="eco-label">🌿 Voyage écologique</p>' : ''}
          <button class="btn-detail-trajet">Voir détails</button>
        `;
        conteneur.appendChild(trajetDiv);
      });
    }
  });