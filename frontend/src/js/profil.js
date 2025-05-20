document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/profil.php")
    .then(response => {
      if (response.status === 401) {
        localStorage.setItem("isAuthenticated", "false");
        window.location.href = "connexion.html?message=unauthorized";
        return;
      }
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du profil utilisateur.");
      }
      return response.json();
    })
    .then(data => {
      if (!data || data.success === false || !data.utilisateur_id) {
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

  // Chargement des rôles actuels
  fetch("/api/mes_roles.php")
    .then(res => res.json())
    .then(roles => {
      roles.forEach(roleId => {
        const checkbox = document.querySelector(`input[name='role[]'][value='${roleId}']`);
        if (checkbox) checkbox.checked = true;
        if (roleId === "1" || roleId === 1) {
          document.getElementById("conducteur-fields").style.display = "block";
          // Préremplissage automatique des infos conducteur
          fetch("/api/get_conducteur.php")
            .then(res => res.json())
            .then(res => {
              if (res.success && res.data) {
                const d = res.data;
                if (d.immatriculation) document.getElementById("immatriculation").value = d.immatriculation;
                if (d.modele) document.getElementById("modele").value = d.modele;
                if (d.couleur) document.getElementById("couleur").value = d.couleur;
                if (d.energie) document.getElementById("energie").value = d.energie;
                if (d.date_premiere_immatriculation) document.getElementById("date_immatriculation").value = d.date_premiere_immatriculation;
                if (d.marque) document.getElementById("marque").value = d.marque;
                if (d.nb_places) document.getElementById("places").value = d.nb_places;
                if (d.fumeur == 1) document.querySelector("input[value='fumeur']").checked = true;
                if (d.animaux == 1) document.querySelector("input[value='animaux']").checked = true;
              }
            })
            .catch(err => console.error("Erreur chargement infos conducteur :", err));
        }
      });
    })
    .catch(err => console.error("Erreur chargement rôles :", err));

  // Mise à jour des rôles à chaque changement de case à cocher
  const formRole = document.getElementById("form-role");
  const roleCheckboxes = document.querySelectorAll("input[name='role[]']");
  roleCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const formData = new FormData(formRole);
      fetch("/api/update_roles.php", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(result => {
          if (!result.success) {
            alert("Erreur lors de la mise à jour : " + result.message);
          }
        })
        .catch(err => {
          console.error("Erreur lors de la mise à jour des rôles :", err);
        });
    });
  });

  const conducteurCheckbox = document.querySelector(`input[name='role[]'][value='1']`);
  conducteurCheckbox.addEventListener("change", function () {
    const conducteurFields = document.getElementById("conducteur-fields");
    conducteurFields.style.display = this.checked ? "block" : "none";
  });

  // Mise à jour automatique des infos conducteur
  const formConducteur = document.getElementById("form-conducteur");
  if (formConducteur) {
    const conducteurInputs = formConducteur.querySelectorAll("input");
    conducteurInputs.forEach(input => {
      input.addEventListener("change", () => {
        const formData = new FormData(formConducteur);
        fetch("/api/update_conducteur.php", {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(result => {
            if (!result.success) {
              console.error("Erreur mise à jour conducteur :", result.message);
            }
          })
          .catch(err => {
            console.error("Erreur requête update_conducteur.php :", err);
          });
      });
    });
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