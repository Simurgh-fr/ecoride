export function createFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-desktop">
      <div class="footer-logo">
        <img src="../src/assets/images/Logo.svg" alt="EcoRide Logo">
        <span>EcoRide</span>
      </div>
      <div class="footer-links">
        <a href="#">À propos</a>
        <a href="#">Mentions légales</a>
        <a href="#">Contact</a>
      </div>
      <div class="footer-copy">
        &copy; 2025 EcoRide - Tous droits réservés
      </div>
    </div>
    <div class="footer-mobile">
      <div class="footer-logo">
        <img src="../src/assets/images/Logo.svg" alt="EcoRide Logo">
        <span>EcoRide</span>
      </div>
      <div class="footer-links-mobile">
        <a href="#">À propos</a>
        <a href="#">Mentions légales</a>
        <a href="#">Contact</a>
      </div>
      <div class="footer-copy">
        &copy; 2025 EcoRide - Tous droits réservés
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}