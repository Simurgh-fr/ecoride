document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-connexion");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
        const response = await fetch('/api/connexion.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Réponse API connexion :", data);

      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("utilisateur_id", data.session.utilisateur_id);
        sessionStorage.setItem("pseudo", data.session.pseudo);
        sessionStorage.setItem("nom", data.session.nom);
        sessionStorage.setItem("prenom", data.session.prenom);
        sessionStorage.setItem("email", data.session.email);
        sessionStorage.setItem("credit", data.session.credit);
        sessionStorage.setItem("photo", data.session.photo);
        window.location.replace("profil.php");
      } else {
        alert(data.message || "Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur serveur. Veuillez réessayer plus tard.");
    }
  });
});