export function createFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-desktop">
      <div class="footer-logo">
        <img src="src/assets/images/Logo.svg" alt="EcoRide Logo">
        <span>EcoRide</span>
      </div>
      <div class="footer-links">
        <a href="apropos.html">À propos</a>
        <a href="mentionslegales.html">Mentions légales</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-copy">
        &copy; 2025 EcoRide - Tous droits réservés
      </div>
    </div>
    <div class="footer-mobile">
      <div class="footer-logo">
        <img src="src/assets/images/Logo.svg" alt="EcoRide Logo">
        <span>EcoRide</span>
      </div>
      <div class="footer-links-mobile">
        <a href="apropos.html">À propos</a>
        <a href="mentionslegales.html">Mentions légales</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-copy">
        &copy; 2025 EcoRide - Tous droits réservés
      </div>
    </div>
  `;
  const currentPage = window.location.pathname.split('/').pop();
  footer.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
  document.body.appendChild(footer);
}