document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-inscription");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pseudo = document.getElementById("pseudo").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const telephone = document.getElementById("telephone").value.trim();
    const adresse = document.getElementById("adresse").value.trim();
    const date_naissance = document.getElementById("date_naissance").value.trim();

    // Validation simple
    if (!pseudo || !nom || !prenom || !email || !password || !telephone || !adresse || !date_naissance) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Veuillez entrer un email valide.");
      return;
    }

    if (password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    console.log("Formulaire soumis");

    try {
      const response = await fetch("/api/inscription.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, nom, prenom, email, password, telephone, adresse, date_naissance }),
      });

      const data = await response.json();

      console.log(data);
      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("utilisateur_id", data.utilisateur_id);
        sessionStorage.setItem("pseudo", data.pseudo);
        sessionStorage.setItem("nom", data.nom);
        sessionStorage.setItem("prenom", data.prenom);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("credit", data.credit);
        sessionStorage.setItem("telephone", data.telephone);
        sessionStorage.setItem("adresse", data.adresse);
        sessionStorage.setItem("date_naissance", data.date_naissance);
        window.location.replace("profil.php");
      } else {
        alert(data.message || "Erreur lors de la création du compte.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  });
});