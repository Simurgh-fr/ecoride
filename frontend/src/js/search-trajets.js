window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');

  // Forcer la bonne mise en forme initiale du bouton écologie
  const ecologieBtn = document.getElementById('filtre-ecologique');
  if (ecologieBtn && ecologieBtn.classList.contains('selected')) {
    ecologieBtn.classList.add('tag-ok');
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log("Formulaire déclenché");

    const villeDepart = document.getElementById('ville-depart').value;
    const villeArrivee = document.getElementById('ville-arrivee').value;
    const dateTrajet = document.getElementById('date-trajet').value;

    // Récupération des nouveaux filtres
    const filtreEcologiqueBtn = document.getElementById('filtre-ecologique');
    const filtreFumeurBtn = document.getElementById('filtre-fumeur');
    const filtreAnimauxBtn = document.getElementById('filtre-animaux');
    const filtreEcologique = filtreEcologiqueBtn?.classList.contains('selected');
    const filtrePrixMax = document.getElementById('filtre-prix-max')?.value;
    const filtreDureeMax = document.getElementById('filtre-duree-max')?.value;
    const filtreNoteMin = document.getElementById('filtre-note-min')?.value;
    const filtreFumeur = filtreFumeurBtn?.classList.contains('tag-ok');
    const filtreAnimaux = filtreAnimauxBtn?.classList.contains('tag-ok');

    try {
      let url = `http://dev.local/ecoride-backend/api/trajets.php?lieu_depart=${villeDepart}&lieu_arrivee=${villeArrivee}`;
      if (dateTrajet) {
        url += `&date_trajet=${dateTrajet}`;
      }
      if (filtreEcologique) url += `&ecologique=1`;
      if (filtrePrixMax) url += `&prix_max=${encodeURIComponent(filtrePrixMax)}`;
      if (filtreDureeMax) url += `&duree_max=${encodeURIComponent(filtreDureeMax)}`;
      if (filtreNoteMin) url += `&note_min=${encodeURIComponent(filtreNoteMin)}`;
      if (filtreFumeur) url += `&fumeur=1`;
      if (filtreAnimaux) url += `&animaux=1`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("Trajets reçus :", data.trajets);
      console.log("Premier trajet :", data.trajets[0]);
      const trajets = data.trajets ?? [];
      const suggestions = data.suggestions ?? false;
      console.log("Trajets reçus :", trajets);

      if (!Array.isArray(trajets)) {
        console.error("Erreur backend :", trajets);
        document.getElementById('resultats-trajets').innerHTML = '<p>Une erreur est survenue. Veuillez réessayer plus tard.</p>';
        return;
      }

      let html = '';
      if (suggestions) {
        html += '<div class="message-suggestion"><p>Pas de trajet à la date ou au critères demandés.<br><strong>Suggestion d\'autres trajets :</strong></p></div>';
      }
      document.getElementById('resultats-trajets').innerHTML = html;

      afficherTrajets(trajets, true);
      console.log("HTML généré :", document.getElementById('resultats-trajets').innerHTML);
    } catch (err) {
      console.error("Erreur lors de la récupération des trajets :", err);
    }
  });

  // Écouteurs de clic pour les trois boutons de filtre visibles dans le HTML
  document.querySelectorAll('#filtre-ecologique, #filtre-fumeur, #filtre-animaux').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Clic détecté sur :', btn.id);
      btn.classList.toggle('selected');

      if (btn.classList.contains('tag-ok')) {
        btn.classList.remove('tag-ok');
        btn.classList.add('tag-ko');
      } else {
        btn.classList.remove('tag-ko');
        btn.classList.add('tag-ok');
      }
    });
  });

  function formaterDate(dateStr, heureStr) {
    if (!dateStr || !heureStr) return 'Date non précisée';
    const date = new Date(`${dateStr}T${heureStr}`);
    if (isNaN(date)) return 'Date non valide';
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const dateFormatee = date.toLocaleDateString('fr-FR', options);
    const heureFormatee = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${dateFormatee} à ${heureFormatee}`;
  }

  async function afficherTrajets(trajets, append = false) {
    const conteneur = document.getElementById('resultats-trajets');
    if (!append) conteneur.innerHTML = '';

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
        <p><strong>Départ :</strong> ${trajet.date_depart ? formaterDate(trajet.date_depart, trajet.heure_depart) : 'Non défini'}</p>
        <p><strong>Arrivée :</strong> ${trajet.date_arrivee && trajet.heure_arrivee ? formaterDate(trajet.date_arrivee, trajet.heure_arrivee) : 'Non défini'}</p>
        <p><strong>Prix :</strong> ${trajet.prix} €</p>
        <p><strong>Places restantes :</strong> ${trajet.nb_places_disponibles}</p>
        ${(trajet.est_ecologique == 1 || trajet.type_voiture?.toLowerCase() === 'électrique') ? '<p class="eco-label">🌿 Voyage écologique</p>' : ''}
        ${trajet.fumeur === 1 ? '<p class="tag-option tag-ok">🚬 Fumeur accepté</p>' : '<p class="tag-option tag-ko">🚫 Fumeur refusé</p>'}
        ${trajet.animaux === 1 ? '<p class="tag-option tag-ok">🐾 Animaux acceptés</p>' : '<p class="tag-option tag-ko">🚫 Animaux refusés</p>'}
        <button class="btn-detail-trajet">Voir détails</button>
      `;
      conteneur.appendChild(trajetDiv);
    });
  }
});