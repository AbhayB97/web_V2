const ContactApp = {
  id: 'contact',
  title: 'Contact',
  icon: '✉️',
  render() {
    const el = document.createElement('div');
    el.className = 'prose';
    el.innerHTML = `
      <h1>Get in Touch</h1>
      <p>Always happy to chat about opportunities, collaboration, and ideas.</p>
      <div class="grid">
        <a class="card" href="mailto:you@example.com">Email: you@example.com</a>
        <a class="card" href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        <a class="card" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        <a class="card" href="https://twitter.com" target="_blank" rel="noreferrer">Twitter / X</a>
      </div>
    `;
    return el;
  },
};

export default ContactApp;

