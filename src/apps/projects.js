import { iconBriefcase } from '../icons.js';

const ProjectsApp = {
  id: 'projects',
  title: 'Projects',
  icon: iconBriefcase,
  render() {
    const container = document.createElement('div');
    container.className = 'prose';
    const projects = [
      {
        name: 'The Missing Link (Research Paper)',
        desc: 'Why governments should consolidate cybersecurity and privacy regulations.',
        link: 'https://github.com/AbhayB97/The-Missing-Link',
      },
      {
        name: 'Secure Terminal Portfolio',
        desc: 'A terminal‑style portfolio with interactive commands.',
        link: 'https://abhay.bhingradia.com/terminal',
      },
      {
        name: 'GitHub Profile',
        desc: 'Explore public contributions and other projects.',
        link: 'https://github.com/AbhayB97',
      },
      {
        name: 'Portfolio OS (This Site)',
        desc: 'Desktop‑style portfolio inspired by daedalOS with draggable windows.',
        link: '#',
      },
    ];
    container.innerHTML = `
      <h1>Highlighted Projects</h1>
      <div class="grid projects">
        ${projects
          .map(
            (p) => `
            <a class="card" href="${p.link}" target="_blank" rel="noreferrer">
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
            </a>
          `
          )
          .join('')}
      </div>
    `;
    return container;
  },
};

export default ProjectsApp;
