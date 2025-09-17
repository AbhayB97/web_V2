import { iconGear } from '../icons.js';

const themes = [
  { id: 'light', name: 'Daylight' },
  { id: 'dark', name: 'Midnight' },
  { id: 'terminal', name: 'Terminal Green' },
];

const SettingsApp = {
  id: 'settings',
  title: 'Settings',
  icon: iconGear,
  render() {
    const el = document.createElement('div');
    el.className = 'prose settings-app';

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const wallpaperId = document.documentElement.getAttribute('data-wallpaper') || 'aurora';

    el.innerHTML = `
      <h1>Settings</h1>
      <p>Personalize the desktop experience with themes and animated wallpapers.</p>
      <section>
        <h3>Theme</h3>
        <div class="theme-grid"></div>
        <p class="current current-theme">Current theme: <strong>${currentTheme}</strong></p>
      </section>
      <section class="wallpaper-section">
        <h3>Wallpapers</h3>
        <p>Launch the wallpaper gallery to pick static gradients or animated scenes.</p>
        <button class="wallpaper-launch">Open Wallpaper Gallery</button>
        <p class="current current-wallpaper">Active wallpaper preset: <strong>${wallpaperId}</strong></p>
      </section>
    `;

    const themeGrid = el.querySelector('.theme-grid');
    const themeStatus = el.querySelector('.current-theme strong');
    const wallpaperStatus = el.querySelector('.current-wallpaper strong');

    const applyTheme = (theme) => {
      window.dispatchEvent(new CustomEvent('set-theme', { detail: { theme } }));
      themeStatus.textContent = theme;
      themeGrid.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
      });
    };

    themes.forEach((theme) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.theme = theme.id;
      btn.className = 'theme-card';
      btn.innerHTML = `<strong>${theme.name}</strong><span>${theme.id}</span>`;
      btn.classList.toggle('active', theme.id === currentTheme);
      btn.addEventListener('click', () => applyTheme(theme.id));
      themeGrid.append(btn);
    });

    const launchButton = el.querySelector('.wallpaper-launch');
    launchButton.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-app', { detail: { id: 'wallpapers' } }));
    });

    const handleThemeEvent = (event) => {
      const theme = event.detail?.theme;
      if (!theme) return;
      themeStatus.textContent = theme;
      themeGrid.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
      });
    };

    const handleWallpaperEvent = (event) => {
      const detail = event.detail || {};
      const wallpaper = detail.wallpaper || null;
      if (wallpaper?.id) {
        wallpaperStatus.textContent = wallpaper.id;
      } else if (detail.id) {
        wallpaperStatus.textContent = detail.id;
      } else if (detail.css) {
        wallpaperStatus.textContent = 'custom';
      }
    };

    if (window.__settingsThemeListener) {
      window.removeEventListener('set-theme', window.__settingsThemeListener);
    }
    window.__settingsThemeListener = handleThemeEvent;
    window.addEventListener('set-theme', handleThemeEvent);

    if (window.__settingsWallpaperListener) {
      window.removeEventListener('set-wallpaper', window.__settingsWallpaperListener);
    }
    window.__settingsWallpaperListener = handleWallpaperEvent;
    window.addEventListener('set-wallpaper', handleWallpaperEvent);

    return el;
  },
};

export default SettingsApp;
