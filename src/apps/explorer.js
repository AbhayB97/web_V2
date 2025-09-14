import { iconFolder, iconDoc, iconPaper, iconMonitor, iconGear } from '../icons.js';

const ExplorerApp = {
  id: 'explorer',
  title: 'File Explorer',
  icon: iconFolder,
  render() {
    const el = document.createElement('div');
    el.className = 'prose';
    const items = [
      { name: 'Resume.pdf', icon: iconDoc, action: () => window.dispatchEvent(new CustomEvent('open-app', { detail: { id: 'resume' } })) },
      { name: 'Projects', icon: iconMonitor, action: () => window.dispatchEvent(new CustomEvent('open-app', { detail: { id: 'projects' } })) },
      { name: 'Settings', icon: iconGear, action: () => window.dispatchEvent(new CustomEvent('open-app', { detail: { id: 'settings' } })) },
      { name: 'Research Paper', icon: iconPaper, href: 'https://github.com/AbhayB97/The-Missing-Link' },
      { name: 'Website', icon: iconMonitor, href: 'https://bhingradia.com' },
      { name: 'GitHub', icon: iconMonitor, href: 'https://github.com/AbhayB97' },
    ];

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';
    header.style.marginBottom = '8px';
    header.innerHTML = `<div style="display:grid;place-items:center;width:24px;height:24px">${iconFolder}</div><strong>This PC</strong><span style="color:var(--muted)">/ Home</span>`;
    el.append(header);

    const grid = document.createElement('div');
    grid.className = 'grid projects';
    items.forEach((it) => {
      const a = document.createElement('a');
      a.className = 'card';
      a.style.display = 'flex';
      a.style.alignItems = 'center';
      a.style.gap = '10px';
      a.innerHTML = `<span class="icon" style="width:24px;height:24px;display:grid;place-items:center">${it.icon}</span><span>${it.name}</span>`;
      if (it.href) {
        a.href = it.href;
        a.target = '_blank';
        a.rel = 'noreferrer';
      } else if (it.action) {
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); it.action(); });
      }
      grid.append(a);
    });
    el.append(grid);
    return el;
  },
};

export default ExplorerApp;

