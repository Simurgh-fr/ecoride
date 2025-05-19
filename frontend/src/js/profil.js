document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/profil.php")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du profil utilisateur.");
      }
      return response.json();
    })
    .then(data => {
      if (!data.utilisateur_id) {
        // Si aucune session active côté serveur, redirection
        localStorage.setItem("isAuthenticated", "false");
        window.location.href = "connexion.html?message=unauthorized";
        return;
      }

      // Session valide, on stocke en sessionStorage (si page rechargée)
      sessionStorage.setItem("utilisateur_id", data.utilisateur_id);
      sessionStorage.setItem("pseudo", data.pseudo);
      sessionStorage.setItem("nom", data.nom);
      sessionStorage.setItem("prenom", data.prenom);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("credit", data.credit);
      localStorage.setItem("isAuthenticated", "true");

      document.getElementById("pseudo").textContent = data.pseudo;
      document.getElementById("credit").textContent = data.credit;
      document.getElementById("info-pseudo").textContent = data.pseudo;
      document.getElementById("info-prenom").textContent = data.prenom;
      document.getElementById("info-nom").textContent = data.nom;
      document.getElementById("info-email").textContent = data.email;
      document.getElementById("info-credit").textContent = data.credit;

      if (data.photo) {
        document.getElementById("photo-profil").src = data.photo;
      } else {
        document.getElementById("photo-profil").src = "../public/img/default-user.png"; // chemin par défaut
      }
    })
    .catch(error => {
      console.error("Erreur : ", error);
      window.location.href = "connexion.html?message=unauthorized";
    });
});