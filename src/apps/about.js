const AboutApp = {
  id: 'about',
  title: 'About Me',
  icon: '👤',
  render() {
    const el = document.createElement('div');
    el.className = 'prose';
    el.innerHTML = `
      <h1>Hi, I’m <span style="color: var(--accent)">Your Name</span> 👋</h1>
      <p>Full‑stack developer focused on building delightful, pragmatic products. This portfolio takes inspiration from Dustin Brett’s daedalOS — a desktop‑style interface to discover my work.</p>
      <h3>What I enjoy</h3>
      <ul>
        <li>TypeScript, Node.js, React/Next.js</li>
        <li>Design systems and DX tooling</li>
        <li>Shipping fast with quality and empathy</li>
      </ul>
      <p>Open the <a href="#" data-open="projects">Projects</a> app to explore case studies, or the <a href="#" data-open="contact">Contact</a> app to reach out.</p>
    `;
    // In-app router hooks
    el.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-open]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute('data-open');
      const evt = new CustomEvent('open-app', { detail: { id } });
      window.dispatchEvent(evt);
    });
    return el;
  },
};

export default AboutApp;

