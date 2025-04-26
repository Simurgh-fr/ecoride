import { createHeader } from '../components/header.js';
import { createFooter } from '../components/footer.js';

document.addEventListener('DOMContentLoaded', function() {
  createHeader();
  createFooter();

  // Rendre visibles toutes les sections avec fade-in
  const fadeInSections = document.querySelectorAll('.fade-in-section');
  fadeInSections.forEach(section => {
    section.classList.add('visible');
  });

  const form = document.getElementById('search-form');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Recherche envoyée ! 🚗🌿');
    // Ici plus tard on branchera vraiment la logique de recherche ;)
  });
});