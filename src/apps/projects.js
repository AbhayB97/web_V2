const ProjectsApp = {
  id: 'projects',
  title: 'Projects',
  icon: '💼',
  render() {
    const container = document.createElement('div');
    container.className = 'prose';
    container.innerHTML = `
      <h1>Highlighted Projects</h1>
      <div class="grid projects">
        ${[
          {
            name: 'Portfolio OS',
            desc: 'This desktop‑style portfolio UI inspired by daedalOS.',
            link: '#',
          },
          {
            name: 'Project Alpha',
            desc: 'A performant data viz dashboard with React and D3.',
            link: '#',
          },
          {
            name: 'Dev Toolkit',
            desc: 'CLI + library for scaffolding and shipping microservices.',
            link: '#',
          },
        ]
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

