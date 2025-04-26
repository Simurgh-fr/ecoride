export function createHeader() {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="navbar">
      <div class="logo">
        <img src="../src/assets/images/Logo.svg" alt="EcoRide Logo">
        <span>EcoRide</span>
      </div>
      <nav class="desktop-menu">
        <a href="#">Accueil</a>
        <a href="#">Trajets</a>
        <a href="#">Mon profil</a>
        <button class="btn-login">Connexion</button>
      </nav>
      <div class="mobile-menu-icon">
        <span class="menu-toggle">&#9776;</span>
      </div>
    </div>
    <div class="mobile-menu">
      <a href="#">Accueil</a>
      <a href="#">Trajets</a>
      <a href="#">Mon profil</a>
      <button class="btn-login">Connexion</button>
    </div>
  `;

  document.body.prepend(header);

  const toggle = header.querySelector('.menu-toggle');
  const mobileMenu = header.querySelector('.mobile-menu');

  toggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    toggle.classList.toggle('open');
  });

  // Fermer automatiquement le menu mobile si on agrandit la fenêtre
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      mobileMenu.classList.remove('active');
    }
  });
}