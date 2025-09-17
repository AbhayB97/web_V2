import { iconBriefcase, iconChart, iconTerminal, iconFolder } from '../icons.js';

const showcase = [
  {
    id: 'vectorizer',
    title: 'Vectorizer',
    description: 'Transform messy indicators into actionable intelligence with one click.',
    icon: iconFolder,
    action: { type: 'link', href: 'https://abhay.bhingradia.com/vectorizer' },
  },
  {
    id: 'edr-viewer',
    title: 'EDR Viewer',
    description: 'Visualize detection coverage, risk trends, and anomaly counts.',
    icon: iconChart,
    action: { type: 'app', appId: 'edr-viewer' },
  },
  {
    id: 'terminal',
    title: 'Security Terminal',
    description: 'Run canned investigations and share canned responses with stakeholders.',
    icon: iconTerminal,
    action: { type: 'app', appId: 'terminal' },
  },
];

const ProjectsApp = {
  id: 'projects',
  title: 'Projects Hub',
  icon: iconBriefcase,
  render() {
    const root = document.createElement('div');
    root.className = 'prose projects-hub';
    root.innerHTML = `
      <h1>Projects Hub</h1>
      <p>Open flagship case studies and interactive demos that showcase Abhay&apos;s security tooling.</p>
    `;

    const grid = document.createElement('div');
    grid.className = 'projects-hub-grid';

    showcase.forEach((item) => {
      const card = document.createElement('button');
      card.className = 'project-card';
      card.setAttribute('data-id', item.id);
      card.innerHTML = `
        <span class="icon">${item.icon}</span>
        <span class="copy">
          <strong>${item.title}</strong>
          <span>${item.description}</span>
        </span>
      `;
      card.addEventListener('click', () => {
        if (item.action.type === 'link') {
          window.open(item.action.href, '_blank', 'noopener,noreferrer');
        } else if (item.action.type === 'app') {
          window.dispatchEvent(new CustomEvent('open-app', { detail: { id: item.action.appId } }));
        }
      });
      grid.append(card);
    });

    root.append(grid);
    return root;
  },
};

export default ProjectsApp;
