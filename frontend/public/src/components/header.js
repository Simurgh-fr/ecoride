import { logout } from '../js/deconnexion.js';

export function createHeader() {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="navbar">
      <div class="logo">
        <img src="src/assets/images/Logo.svg" alt="EcoRide Logo">
        <span>EcoRide</span>
      </div>
      <nav class="desktop-menu">
       <a href="index.html">Accueil</a>
       <a href="trajets.php">Trajets</a>
       <a href="profil.php">Mon profil</a>
       <span class="auth-button"></span>
      </nav>
      <div class="mobile-menu-icon">
        <span class="menu-toggle">&#9776;</span>
      </div>
    </div>
    <div class="mobile-menu">
      <a href="index.html">Accueil</a>
      <a href="trajets.php">Trajets</a>
      <a href="profil.php">Mon profil</a>
      <span class="auth-button"></span>
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

  // Ajouter la classe active au lien correspondant à la page actuelle
  const currentPage = window.location.pathname.split('/').pop();
  header.querySelectorAll('nav a, .mobile-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  const authSpans = header.querySelectorAll('.auth-button');

  function renderAuthButton() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    authSpans.forEach(span => {
      span.innerHTML = '';
      if (isAuthenticated) {
        const logoutButton = document.createElement('button');
        logoutButton.classList.add('btn-login');
        logoutButton.id = 'logout-button';
        logoutButton.textContent = 'Déconnexion';
        logoutButton.addEventListener('click', () => {
          logout();
        });
        span.appendChild(logoutButton);
      } else {
        const loginButton = document.createElement('button');
        loginButton.classList.add('btn-login');
        loginButton.textContent = 'Connexion';
        loginButton.onclick = () => window.location.href = 'connexion.html';
        span.appendChild(loginButton);
      }
    });
  }

  renderAuthButton();
  window.addEventListener('storage', renderAuthButton); // écoute les changements de localStorage
}