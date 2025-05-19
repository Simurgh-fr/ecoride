export function logout() {
  console.log("Déconnexion en cours...");
  fetch(`${window.location.origin}/ecoride/backend/api/deconnexion.php`)
    .then((response) => {
      if (response.ok) {
        sessionStorage.clear();
        console.log("SessionStorage vidé");
        window.location.href = 'index.html';
      } else {
        throw new Error("Erreur côté serveur lors de la déconnexion.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Erreur lors de la déconnexion.");
    });
}

// Ajout d'un écouteur global pour capturer dynamiquement les clics
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'logout-button') {
    logout();
  }
});