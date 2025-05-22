import { baseUrl } from './config.js';

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');

  // Forcer la bonne mise en forme initiale du bouton écologie
  const ecologieBtn = document.getElementById('filtre-ecologique');
  if (ecologieBtn && ecologieBtn.classList.contains('selected')) {
    ecologieBtn.classList.add('tag-ok');
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    let url = ''; // initialise url en dehors du try pour qu'elle soit accessible dans le catch

    const villeDepart = document.getElementById('ville-depart').value;
    const villeArrivee = document.getElementById('ville-arrivee').value;
    const dateTrajet = document.getElementById('date-trajet').value;

    if (!villeDepart || !villeArrivee) {
      console.warn("Ville de départ ou d’arrivée manquante.");
      return;
    }

    // Récupération des nouveaux filtres
    const filtreEcologiqueBtn = document.getElementById('filtre-ecologique');
    const filtreFumeurBtn = document.getElementById('filtre-fumeur');
    const filtreAnimauxBtn = document.getElementById('filtre-animaux');
    const filtreEcologique = filtreEcologiqueBtn?.classList.contains('tag-ok');
    const filtrePrixMax = document.getElementById('filtre-prix-max')?.value;
    const filtreDureeMax = document.getElementById('filtre-duree-max')?.value;
    const filtreNoteMin = document.getElementById('filtre-note-min')?.value || '';
    const filtreFumeur = filtreFumeurBtn?.classList.contains('tag-ok');
    const filtreAnimaux = filtreAnimauxBtn?.classList.contains('tag-ok');

    try {
      url = `${baseUrl}trajets.php?lieu_depart=${villeDepart}&lieu_arrivee=${villeArrivee}`;
      if (dateTrajet) url += `&date_trajet=${dateTrajet}`;
      if (filtreEcologique) url += `&ecologique=1`;
      if (filtrePrixMax) url += `&prix_max=${encodeURIComponent(filtrePrixMax)}`;
      if (filtreDureeMax) url += `&duree_max=${encodeURIComponent(filtreDureeMax)}`;
      if (filtreNoteMin) url += `&note_min=${encodeURIComponent(filtreNoteMin)}`;
      if (filtreFumeur) url += `&fumeur=1`;
      if (filtreAnimaux) url += `&animaux=1`;

      const resultContainer = document.getElementById('resultats-trajets');
      if (!resultContainer) {
        console.error("Élément #resultats-trajets introuvable dans le DOM.");
        return;
      }

      console.log("🔗 URL finale construite :", url);
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Réponse non JSON : " + text);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur backend (statut HTTP) :", response.status);
        console.error("Détail réponse backend :", errorText);
        resultContainer.innerHTML = `
          <div class="message-erreur">
            <p><strong>Erreur serveur :</strong><br>${errorText || "Impossible de récupérer les trajets."}</p>
          </div>`;
        return;
      }

      const data = await response.json();
      const trajets = data.trajets ?? [];
      const suggestions = data.suggestions ?? false;

      if (!Array.isArray(trajets)) {
        console.error("Erreur backend : données inattendues", trajets);
        resultContainer.innerHTML = '<p>Réponse invalide reçue. Veuillez réessayer plus tard.</p>';
        return;
      }

      let html = '';
      if (suggestions) {
        html += '<div class="message-suggestion"><p>Pas de trajet à la date ou aux critères demandés.<br><strong>Suggestions d\'autres trajets :</strong></p></div>';
      }
      resultContainer.innerHTML = html;

      afficherTrajets(trajets, true);
    } catch (err) {
      console.error("Erreur attrapée dans le bloc catch :", err.message);
      console.log("🔗 URL de la requête ayant échoué :", url);
      console.error("Erreur JS lors de la récupération des trajets :", err);
      const resultContainer = document.getElementById('resultats-trajets') || document.body;
      if (resultContainer) {
        resultContainer.innerHTML = '<p>Erreur technique lors de la récupération des trajets. Détail : ' + err.message + '</p>';
      }
    }
  });

  // Gestion des tags de filtre façon ajout-trajet.php
  const tagFumeur = document.getElementById("filtre-fumeur");
  const tagAnimaux = document.getElementById("filtre-animaux");
  const tagEco = document.getElementById("filtre-ecologique");

  const inputFumeur = document.getElementById("input_fumeur");
  const inputAnimaux = document.getElementById("input_animaux");
  const inputEco = document.getElementById("input_ecologique");

  const toggleTag = (tag, input) => {
    input.checked = !input.checked;
    if (input.checked) {
      tag.classList.remove("tag-off");
      tag.classList.add("tag-on", "selected");
    } else {
      tag.classList.remove("tag-on", "selected");
      tag.classList.add("tag-off");
    }
  };

  if (tagFumeur && inputFumeur) tagFumeur.addEventListener("click", () => toggleTag(tagFumeur, inputFumeur));
  if (tagAnimaux && inputAnimaux) tagAnimaux.addEventListener("click", () => toggleTag(tagAnimaux, inputAnimaux));
  if (tagEco && inputEco) tagEco.addEventListener("click", () => toggleTag(tagEco, inputEco));

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
      conteneur.style.display = 'none';
    } else {
      conteneur.style.display = 'block';
    }

    if (trajets.length === 0) {
      const villeDepart = document.getElementById('ville-depart').value;
      const villeArrivee = document.getElementById('ville-arrivee').value;
      const dateTrajet = document.getElementById('date-trajet').value;

      const tousTrajets = await fetch(`${baseUrl}trajets.php?lieu_depart=${villeDepart}&lieu_arrivee=${villeArrivee}&date_trajet=`)
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
      const trajetDiv = document.createElement('div');
      trajetDiv.className = 'card-trajet';
      console.log("🔍 Clés du trajet :", Object.keys(trajet));

      const voitureTexte = trajet.marque && trajet.modele
        ? `${trajet.marque} ${trajet.modele}`
        : trajet.marque || trajet.modele || 'Modèle inconnu';

      trajetDiv.innerHTML = `
        <h3>${trajet.lieu_depart} ➔ ${trajet.lieu_arrivee}</h3>
        <img src="${trajet.photo_chauffeur || '/src/assets/images/default-avatar.png'}" alt="Photo de ${trajet.pseudo_chauffeur}" class="photo-chauffeur"/>
        <p><strong>Chauffeur :</strong> ${trajet.pseudo_chauffeur}</p>
        <p><strong>Voiture :</strong> ${voitureTexte}</p>
        <p><strong>Note :</strong> ${trajet.note_chauffeur} ⭐ / 5</p>
        <p><strong>Départ :</strong> ${trajet.date_depart ? formaterDate(trajet.date_depart, trajet.heure_depart) : 'Non défini'}</p>
        <p><strong>Arrivée :</strong> ${trajet.date_arrivee && trajet.heure_arrivee ? formaterDate(trajet.date_arrivee, trajet.heure_arrivee) : 'Non défini'}</p>
        <p><strong>Prix :</strong> ${trajet.prix} €</p>
        <p><strong>Places restantes :</strong> ${trajet.nb_places_disponibles}</p>
        ${(trajet.est_ecologique == 1 || trajet.type_voiture?.toLowerCase() === 'électrique') ? '<p class="eco-label">🌿 Voyage écologique</p>' : ''}
        ${trajet.fumeur === 1 ? '<p class="tag-option tag-ok">🚬 Fumeur accepté</p>' : '<p class="tag-option">🚫 Fumeur refusé</p>'}
        ${trajet.animaux === 1 ? '<p class="tag-option tag-ok">🐾 Animaux acceptés</p>' : '<p class="tag-option">🚫 Animaux refusés</p>'}
        <button class="btn-voir-avis" data-utilisateur-id="${trajet.utilisateur_id}">Voir avis</button>
      `;
      conteneur.appendChild(trajetDiv);
    });
    conteneur.style.display = 'block';
  }
});