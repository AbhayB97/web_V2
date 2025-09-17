import { iconPalette } from '../icons.js';

const wallpaperOptions = [
  {
    id: 'aurora',
    name: 'Aurora Glow',
    description: 'Iridescent blues and greens inspired by polar skies.',
    css:
      'radial-gradient(60vw 60vh at 80% -10%, rgba(62,84,172,0.55) 0, transparent 70%),\
radial-gradient(40vw 40vh at -10% 80%, rgba(34,143,184,0.45) 0, transparent 60%),\
var(--bg)',
  },
  {
    id: 'sunset',
    name: 'Sundown Mirage',
    description: 'Warm gradients that fade from amber to magenta.',
    css:
      'radial-gradient(60vw 50vh at 82% 0%, rgba(255,140,66,0.55) 0, transparent 70%),\
radial-gradient(50vw 40vh at 0% 90%, rgba(255,72,120,0.45) 0, transparent 65%),\
var(--bg)',
  },
  {
    id: 'matrix',
    name: 'Matrix Grid',
    description: 'Hackery scanlines drifting through neon code.',
    css:
      'repeating-linear-gradient(90deg, rgba(10,20,18,0.95), rgba(10,20,18,0.95) 2px, rgba(13,31,24,0.95) 2px, rgba(13,31,24,0.95) 4px),\
radial-gradient(35vw 35vh at 20% 10%, rgba(10, 140, 60, 0.2) 0, transparent 70%),\
radial-gradient(30vw 30vh at 90% 80%, rgba(10, 140, 60, 0.2) 0, transparent 70%)',
    size: '120% 120%',
    animation: 'wallpaper-scan 18s linear infinite',
  },
  {
    id: 'nebula',
    name: 'Nebula Drift',
    description: 'Animated noise clouds with subtle color shifts.',
    css:
      'radial-gradient(140% 120% at 20% 10%, rgba(134,72,255,0.35), transparent 70%),\
radial-gradient(120% 120% at 80% 80%, rgba(0,194,255,0.35), transparent 65%),\
radial-gradient(100% 100% at 50% 50%, rgba(255,115,168,0.25), transparent 70%),\
var(--bg)',
    size: '200% 200%',
    animation: 'wallpaper-nebula 24s ease-in-out infinite alternate',
  },
  {
    id: 'gridwave',
    name: 'Grid Wave',
    description: 'Synthwave cyan grid rippling across the desktop.',
    css:
      'linear-gradient(120deg, rgba(0, 118, 255, 0.25), rgba(0, 0, 0, 0.35)),\
radial-gradient(140% 100% at 50% 120%, rgba(0, 255, 204, 0.18), transparent 70%),\
var(--bg)',
    size: '180% 180%',
    animation: 'wallpaper-grid 14s ease-in-out infinite alternate',
  },
];

const getSavedId = () => {
  try {
    const raw = localStorage.getItem('wallpaper');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id || null;
  } catch (err) {
    return null;
  }
};

const WallpapersApp = {
  id: 'wallpapers',
  title: 'Wallpapers',
  icon: iconPalette,
  render() {
    const root = document.createElement('div');
    root.className = 'wallpaper-app';

    const header = document.createElement('header');
    header.className = 'wallpaper-header';
    header.innerHTML = '<h1>Wallpaper Gallery</h1><p>Switch between static gradients or animated vibes.</p>';

    const grid = document.createElement('div');
    grid.className = 'wallpaper-grid';

    const status = document.createElement('p');
    status.className = 'wallpaper-status';
    status.textContent = 'Select a wallpaper to apply instantly.';

    let selected = getSavedId();

    const updateActive = () => {
      grid.querySelectorAll('.wallpaper-tile').forEach((tile) => {
        tile.classList.toggle('active', tile.dataset.id === selected);
        tile.setAttribute('aria-pressed', tile.dataset.id === selected ? 'true' : 'false');
      });
    };

    wallpaperOptions.forEach((option) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wallpaper-tile';
      btn.dataset.id = option.id;
      btn.setAttribute('aria-pressed', 'false');

      const preview = document.createElement('div');
      preview.className = 'preview';
      preview.style.background = option.css;
      if (option.size) preview.style.backgroundSize = option.size;
      if (option.animation) preview.style.animation = option.animation;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML = `<strong>${option.name}</strong><span>${option.description}</span>`;

      btn.append(preview, meta);
      btn.addEventListener('click', () => {
        const payload = { ...option };
        window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { wallpaper: payload } }));
        selected = option.id;
        status.textContent = `${option.name} applied.`;
        updateActive();
      });

      grid.append(btn);
    });

    updateActive();

    const actions = document.createElement('div');
    actions.className = 'wallpaper-actions';

    const randomButton = document.createElement('button');
    randomButton.className = 'wallpaper-random';
    randomButton.textContent = 'Surprise me';
    randomButton.addEventListener('click', () => {
      const choice = wallpaperOptions[Math.floor(Math.random() * wallpaperOptions.length)];
      const payload = { ...choice };
      window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { wallpaper: payload } }));
      selected = choice.id;
      status.textContent = `${choice.name} applied.`;
      updateActive();
    });

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to Aurora';
    resetButton.addEventListener('click', () => {
      const [first] = wallpaperOptions;
      if (!first) return;
      const payload = { ...first };
      window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { wallpaper: payload } }));
      selected = first.id;
      status.textContent = `${first.name} applied.`;
      updateActive();
    });

    actions.append(randomButton, resetButton);

    root.append(header, status, grid, actions);
    return root;
  },
};

export default WallpapersApp;
