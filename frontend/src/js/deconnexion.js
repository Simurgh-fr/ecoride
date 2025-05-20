export function logout() {
  console.log("Déconnexion en cours...");
  fetch(`${window.location.origin}/ecoride/backend/api/deconnexion.php`)
    .then((response) => {
      if (response.ok) {
        // Nettoyage avant redirection
        sessionStorage.clear();
        localStorage.setItem('isAuthenticated', 'false');
        console.log("SessionStorage vidé et isAuthenticated = false");

        // Redirection simple après mise à jour
        window.location.href = "/ecoride/connexion.html";
      } else {
        throw new Error("Erreur côté serveur lors de la déconnexion.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Erreur lors de la déconnexion.");
    });
}