export function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
      <p>Contact : <a href="mailto:contact@ecoride.com">contact@ecoride.com</a></p>
      <p><a href="#">Mentions légales</a></p>
    `;
    document.body.appendChild(footer);
  }