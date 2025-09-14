const wallpapers = {
  Aurora: `radial-gradient(60vw 60vh at 80% -10%, rgba(62,84,172,0.6) 0, transparent 70%),
           radial-gradient(40vw 40vh at -10% 80%, rgba(34,143,84,0.6) 0, transparent 60%),
           var(--bg)`,
  Sunset: `radial-gradient(60vw 50vh at 80% 0%, rgba(255,140,66,0.55) 0, transparent 70%),
           radial-gradient(50vw 40vh at 0% 90%, rgba(255,72,120,0.45) 0, transparent 65%),
           var(--bg)`,
  Matrix: `repeating-linear-gradient(90deg, #0e0f13, #0e0f13 2px, #0f171a 2px, #0f171a 4px),
           radial-gradient(35vw 35vh at 20% 10%, rgba(10, 140, 60, 0.25) 0, transparent 70%),
           radial-gradient(30vw 30vh at 90% 80%, rgba(10, 140, 60, 0.25) 0, transparent 70%)`,
};

import { iconGear } from '../icons.js';

const SettingsApp = {
  id: 'settings',
  title: 'Settings',
  icon: iconGear,
  render() {
    const el = document.createElement('div');
    el.className = 'prose';
    const curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const header = `<h1>Settings</h1><p>Adjust theme and wallpaper.</p>`;
    const themeCtl = `
      <h3>Theme</h3>
      <div class="grid">
        <button class="card" data-theme="light">Light</button>
        <button class="card" data-theme="dark">Dark</button>
      </div>
      <p>Current: <strong>${curTheme}</strong></p>
    `;
    const wallCtl = `
      <h3>Wallpaper</h3>
      <div class="grid projects" id="wall-grid"></div>
    `;
    el.innerHTML = header + themeCtl + wallCtl;

    // Theme handlers
    el.querySelectorAll('[data-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        const evt = new CustomEvent('set-theme', { detail: { theme } });
        window.dispatchEvent(evt);
        el.querySelector('p strong').textContent = theme;
      });
    });

    // Wallpaper grid
    const grid = el.querySelector('#wall-grid');
    Object.entries(wallpapers).forEach(([name, css]) => {
      const btn = document.createElement('button');
      btn.className = 'card';
      btn.style.backgroundImage = css.includes('var(--bg)') ? undefined : css;
      btn.style.background = css;
      btn.style.height = '64px';
      btn.style.border = '1px solid var(--window-border)';
      btn.innerHTML = `<strong>${name}</strong>`;
      btn.addEventListener('click', () => {
        const evt = new CustomEvent('set-wallpaper', { detail: { css } });
        window.dispatchEvent(evt);
      });
      grid.append(btn);
    });

    return el;
  },
};

export default SettingsApp;
