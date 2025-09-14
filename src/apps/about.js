const AboutApp = {
  id: 'about',
  title: 'About Abhay',
  icon: '👤',
  render() {
    const el = document.createElement('div');
    el.className = 'prose';
    el.innerHTML = `
      <h1>Hi, I’m <span style="color: var(--accent)">Abhay Bhingradia</span> 👋</h1>
      <p>Welcome to my desktop‑style portfolio. I’m a Cybersecurity professional currently working as a SOC Analyst in Mississauga. I enjoy building things on the web and tinkering with open‑source.</p>

      <h3>Highlights</h3>
      <ul>
        <li>Graduated Sheridan College (2024), Bachelors in Cyber Security</li>
        <li>Student Director, Sheridan Student Union</li>
        <li>Peer Mentor supporting studies and campus life</li>
      </ul>

      <h3>Recent Writing</h3>
      <p>
        “Missing Link: Why government should consolidate cybersecurity and privacy regulations” —
        <a href="https://github.com/AbhayB97/The-Missing-Link" target="_blank" rel="noreferrer">Read on GitHub</a>
      </p>

      <p>Explore my <a href="#" data-open="projects">Projects</a>, view my <a href="#" data-open="resume">Resume</a>, or <a href="#" data-open="contact">Contact</a> me.</p>
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
