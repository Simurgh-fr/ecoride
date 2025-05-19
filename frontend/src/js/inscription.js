document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-inscription");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pseudo = document.getElementById("pseudo").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validation simple
    if (!pseudo || !nom || !prenom || !email || !password) {
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
        body: JSON.stringify({ pseudo, nom, prenom, email, password }),
      });

      const data = await response.json();

      console.log(data);
      if (data.success) {
        window.location.href = "profil.html";
      } else {
        alert(data.message || "Erreur lors de la création du compte.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  });
});