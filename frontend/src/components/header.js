export function createHeader() {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="navbar">
      <div class="logo">
        <img src="../src/assets/images/Logo.svg" alt="EcoRide Logo">
        <span>EcoRide</span>
      </div>
      <nav class="desktop-menu">
       <a href="index.html">Accueil</a>
       <a href="trajets.html">Trajets</a>
       <a href="profil.html">Mon profil</a>
       <span class="auth-button"></span>
      </nav>
      <div class="mobile-menu-icon">
        <span class="menu-toggle">&#9776;</span>
      </div>
    </div>
    <div class="mobile-menu">
      <a href="index.html">Accueil</a>
      <a href="trajets.html">Trajets</a>
      <a href="profil.html">Mon profil</a>
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

  // Auth button dynamic rendering
  const authSpans = header.querySelectorAll('.auth-button');
  setTimeout(() => {
    fetch('/api/profil.php')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Non connecté");
      })
      .then(data => {
        localStorage.setItem('isAuthenticated', 'true');
        authSpans.forEach(span => {
          const logoutButton = document.createElement('button');
          logoutButton.classList.add('btn-login');
          logoutButton.id = 'logout-button';
          logoutButton.textContent = 'Déconnexion';
          logoutButton.addEventListener('click', () => {
            fetch('/api/deconnexion.php')
              .then(() => {
                localStorage.setItem('isAuthenticated', 'false');
                window.location.href = 'connexion.html';
              });
          });
          span.innerHTML = '';
          span.appendChild(logoutButton);
        });
      })
      .catch(() => {
        authSpans.forEach(span => {
          localStorage.setItem('isAuthenticated', 'false');
          span.innerHTML = '<button class="btn-login" onclick="window.location.href=\'connexion.html\'">Connexion</button>';
        });
      });
  }, 100);
}