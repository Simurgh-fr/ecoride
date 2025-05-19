document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isAuthenticated") === "true") {
    // Si les données session sont manquantes, tenter une récupération ou redirection
    if (
      !sessionStorage.getItem("pseudo") ||
      !sessionStorage.getItem("utilisateur_id")
    ) {
      // Rediriger l'utilisateur vers le profil si auth mais pas de session (par exemple après rafraîchissement)
      window.location.replace("profil.html");
    }
  }
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
        sessionStorage.setItem("utilisateur_id", data.utilisateur_id);
        sessionStorage.setItem("pseudo", data.pseudo);
        sessionStorage.setItem("nom", data.nom);
        sessionStorage.setItem("prenom", data.prenom);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("credit", data.credit);
        window.location.replace("profil.html");
      } else {
        alert(data.message || "Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur serveur. Veuillez réessayer plus tard.");
    }
  });
});