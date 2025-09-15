// Desktop-style portfolio (Phase 1 scaffold)
// Minimal window manager + basic apps

import WindowManager from './windowManager.js';
import { iconUser, iconBriefcase, iconMail, iconGear, iconDoc, iconFolder } from './icons.js';

// Application metadata with lazy loaders for improved performance
const apps = [
  { id: 'about', title: 'About Abhay', icon: iconUser, loader: () => import('./apps/about.js') },
  { id: 'projects', title: 'Projects', icon: iconBriefcase, loader: () => import('./apps/projects.js') },
  { id: 'contact', title: 'Contact', icon: iconMail, loader: () => import('./apps/contact.js') },
  { id: 'settings', title: 'Settings', icon: iconGear, loader: () => import('./apps/settings.js') },
  { id: 'resume', title: 'Resume', icon: iconDoc, loader: () => import('./apps/resume.js') },
  { id: 'explorer', title: 'File Explorer', icon: iconFolder, loader: () => import('./apps/explorer.js') },
];

// Bootstrapping
const $ = (id) => document.getElementById(id);
const desktop = $('desktop');
const taskbarApps = $('taskbar-apps');
const startButton = $('start-button');
const startMenu = $('start-menu');
const startList = $('start-menu-list');
const startPinned = $('start-pinned');
const startSearch = $('start-search');
const clock = $('clock');
const themeToggle = $('theme-toggle');
const contextMenu = $('context-menu');

// Theme
const applyTheme = (t) => document.documentElement.setAttribute('data-theme', t);
const applyWallpaper = (css) => document.documentElement.style.setProperty('--wallpaper', css);
const savedTheme = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
const savedWallpaper = localStorage.getItem('wallpaper');
applyTheme(savedTheme);
if (savedWallpaper) applyWallpaper(savedWallpaper);
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});
// External setters from Settings app
window.addEventListener('set-theme', (e) => {
  const t = e.detail?.theme;
  if (!t) return;
  applyTheme(t);
  localStorage.setItem('theme', t);
});
window.addEventListener('set-wallpaper', (e) => {
  const css = e.detail?.css;
  if (!css) return;
  applyWallpaper(css);
  localStorage.setItem('wallpaper', css);
});

// Clock
const updateClock = () => {
  const d = new Date();
  const opts = { hour: '2-digit', minute: '2-digit' };
  clock.textContent = d.toLocaleTimeString([], opts);
};
updateClock();
setInterval(updateClock, 10000);

// Window manager
const wm = new WindowManager({ desktopEl: desktop, taskbarAppsEl: taskbarApps });

// Helper to load and open an app on demand
const loadApp = async (meta) => (await meta.loader()).default;
async function openApp(idOrMeta) {
  const meta = typeof idOrMeta === 'string' ? apps.find((a) => a.id === idOrMeta) : idOrMeta;
  if (!meta) return;
  const app = await loadApp(meta);
  wm.createWindow({ id: app.id, title: app.title, icon: app.icon, content: app.render });
}

// Start menu population: pinned grid + all apps
const pinned = ['explorer', 'projects', 'resume', 'about', 'contact', 'settings'];
const order = [
  ...apps.filter((a) => pinned.includes(a.id)),
  ...apps.filter((a) => !pinned.includes(a.id)),
];

const createAppLauncher = (app, small = false) => {
  if (small) {
    const li = document.createElement('li');
    li.className = 'start-item';
    li.innerHTML = `<span class="icon">${app.icon}</span><span>${app.title}</span>`;
    li.addEventListener('click', () => {
      openApp(app);
      startMenu.classList.add('hidden');
    });
    return li;
  }
  const div = document.createElement('div');
  div.className = 'pinned-item';
  div.setAttribute('data-title', app.title.toLowerCase());
  div.innerHTML = `<div class="icon">${app.icon}</div><div class="label">${app.title}</div>`;
  div.addEventListener('click', () => {
    openApp(app);
    startMenu.classList.add('hidden');
  });
  return div;
};

apps.forEach((app) => startList.append(createAppLauncher(app, true)));
order.forEach((app) => startPinned.append(createAppLauncher(app, false)));

// Start search filtering
startSearch?.addEventListener('input', () => {
  const q = startSearch.value.trim().toLowerCase();
  const items = startPinned.querySelectorAll('.pinned-item');
  items.forEach((el) => {
    const t = el.getAttribute('data-title') || '';
    el.style.display = t.includes(q) ? '' : 'none';
  });
});

// Desktop icons
const desktopIcons = $('desktop-icons');
apps.forEach((app) => {
  const tile = document.createElement('button');
  tile.className = 'desktop-icon';
  tile.innerHTML = `<div class="icon">${app.icon}</div><div class="label">${app.title}</div>`;
  tile.addEventListener('dblclick', () => {
    openApp(app);
  });
  tile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openApp(app);
    }
  });
  tile.setAttribute('aria-label', `${app.title} desktop icon`);
  tile.tabIndex = 0;
  desktopIcons.append(tile);
});

// Start menu toggle
const toggleStart = () => startMenu.classList.toggle('hidden');
startButton.addEventListener('click', toggleStart);
document.addEventListener('click', (e) => {
  if (!startMenu.classList.contains('hidden')) {
    const within = startMenu.contains(e.target) || startButton.contains(e.target);
    if (!within) startMenu.classList.add('hidden');
  }
  if (!contextMenu.classList.contains('hidden')) {
    if (!contextMenu.contains(e.target)) contextMenu.classList.add('hidden');
  }
});

// Start footer actions
startMenu.addEventListener('click', (e) => {
  const btn = e.target.closest('.start-foot');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  if (!action) return;
  switch (action) {
    case 'open-settings':
      openApp('settings');
      break;
    case 'open-about':
      openApp('about');
      break;
    case 'power-reload':
      location.reload();
      break;
  }
  startMenu.classList.add('hidden');
});

// Desktop context menu
desktop.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const x = Math.min(e.clientX, window.innerWidth - 220);
  const y = Math.min(e.clientY, window.innerHeight - 180);
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
  contextMenu.classList.remove('hidden');
});
contextMenu.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  const action = item.getAttribute('data-action');
  contextMenu.classList.add('hidden');
  switch (action) {
    case 'open-settings':
    case 'change-wallpaper':
      openApp('settings');
      break;
    case 'toggle-theme':
      themeToggle.click();
      break;
    case 'open-resume':
      openApp('resume');
      break;
    case 'open-about':
      openApp('about');
      break;
    case 'power-reload':
      location.reload();
      break;
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!startMenu.classList.contains('hidden')) startMenu.classList.add('hidden');
    if (!contextMenu.classList.contains('hidden')) contextMenu.classList.add('hidden');
  }
});

// Desktop selection rectangle + multi-select
(() => {
  let selecting = null;
  const selectionBox = document.createElement('div');
  selectionBox.className = 'selection-box';
  const icons = () => Array.from(desktopIcons.querySelectorAll('.desktop-icon'));

  desktop.addEventListener('mousedown', (e) => {
    const isIcon = e.target.closest('.desktop-icon');
    const isWindow = e.target.closest('.window');
    const isTaskbar = e.target.closest('#taskbar');
    if (e.button !== 0 || isIcon || isWindow || isTaskbar) return;
    selecting = { x: e.clientX, y: e.clientY };
    selectionBox.style.left = selecting.x + 'px';
    selectionBox.style.top = selecting.y + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    document.body.append(selectionBox);
    icons().forEach((el) => el.classList.remove('selected'));
  });

  const rectOf = (x1, y1, x2, y2) => ({
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    right: Math.max(x1, x2),
    bottom: Math.max(y1, y2),
  });

  window.addEventListener('mousemove', (e) => {
    if (!selecting) return;
    const r = rectOf(selecting.x, selecting.y, e.clientX, e.clientY);
    selectionBox.style.left = r.left + 'px';
    selectionBox.style.top = r.top + 'px';
    selectionBox.style.width = r.right - r.left + 'px';
    selectionBox.style.height = r.bottom - r.top + 'px';
    icons().forEach((el) => {
      const b = el.getBoundingClientRect();
      const hit = !(b.right < r.left || b.left > r.right || b.bottom < r.top || b.top > r.bottom);
      el.classList.toggle('selected', hit);
    });
  });

  window.addEventListener('mouseup', () => {
    if (!selecting) return;
    selecting = null;
    selectionBox.remove();
  });
})();

// Open About on first load for a nice touch
setTimeout(() => openApp('about'), 300);

// Cross-app open events (e.g., links from About -> Projects)
window.addEventListener('open-app', (e) => {
  const { id } = e.detail || {};
  openApp(id);
});

// Preload app modules when the browser is idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => apps.forEach((a) => a.loader()));
} else {
  setTimeout(() => apps.forEach((a) => a.loader()), 2000);
}
