
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-connexion");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("../../backend/api/connexion.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "profil.html";
      } else {
        alert(data.message || "Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur serveur. Veuillez réessayer plus tard.");
    }
  });
});