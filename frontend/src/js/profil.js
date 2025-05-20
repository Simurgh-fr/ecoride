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
        document.getElementById("photo-profil").src = "/src/assets/images/default-avatar.png";
      }
    })
    .catch(error => {
      console.error("Erreur : ", error);
      window.location.href = "connexion.html?message=unauthorized";
    });
});

// Gestion de la popup de modification de photo
document.getElementById("open-popup").addEventListener("click", () => {
  document.getElementById("popup-photo").style.display = "flex";
});

document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("popup-photo").style.display = "none";
});

// Rafraîchissement automatique après upload
const formPhoto = document.getElementById("form-photo");
formPhoto.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formPhoto);

  fetch(formPhoto.action, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        window.location.reload(); // rechargement complet de la page
      } else {
        alert("Erreur : " + result.message);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'upload de la photo :", error);
    });
});