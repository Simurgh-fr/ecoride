import { baseUrl } from './config.js';

function afficherAvis(utilisateurId, containerSelector) {
  fetch(`${baseUrl}getAvis.php?utilisateur_cible_id=${utilisateurId}`)
    .then(res => res.json())
    .then(avisData => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      if (!Array.isArray(avisData) || avisData.length === 0) {
        container.innerHTML = "<p>Aucun avis disponible.</p>";
        return;
      }

      const avisHTML = avisData.map(a => `
        <div class="avis">
          <p><strong>Note :</strong> ${a.note ?? '-'} / 5</p>
          <p><strong>Commentaire :</strong> ${a.commentaire ?? 'Aucun commentaire'}</p>
        </div>
      `).join('');

      container.innerHTML = avisHTML;
    })
    .catch(err => {
      console.error("Erreur chargement avis MongoDB :", err);
      const container = document.querySelector(containerSelector);
      if (container) {
        container.innerHTML = "<p>Erreur lors du chargement des avis.</p>";
      }
    });
}

export { afficherAvis };

document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('btn-voir-avis')) {
    const utilisateurId = e.target.getAttribute('data-utilisateur-id');
    if (!utilisateurId) return alert("ID utilisateur manquant pour les avis.");

    const containerAvis = document.createElement('div');
    containerAvis.classList.add('zone-avis');
    e.target.parentElement.appendChild(containerAvis);

    afficherAvis(utilisateurId, '.zone-avis');
  }
});