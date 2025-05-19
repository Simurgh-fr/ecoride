document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/profil.php")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du profil utilisateur.");
      }
      return response.json();
    })
    .then(data => {
      document.getElementById("pseudo").textContent = data.pseudo;
      document.getElementById("credit").textContent = data.credit;
    })
    .catch(error => {
      console.error("Erreur : ", error);
    });
});