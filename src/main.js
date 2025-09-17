// Desktop-style portfolio (Phase 1 scaffold)
// Minimal window manager + basic apps

import WindowManager from './windowManager.js';
import {
  iconUser,
  iconBriefcase,
  iconMail,
  iconGear,
  iconDoc,
  iconFolder,
  iconNote,
  iconChart,
  iconTerminal,
  iconPalette,
} from './icons.js';
import { createProcessStore } from './store.js';
import { initTheme } from './theme.js';
import {
  initFileSystem,
  listDir as fsListDir,
  writeFile as fsWriteFile,
  moveFile as fsMoveFile,
  restoreDefaults as fsRestoreDefaults,
  stat as fsStat,
  DesktopDir,
} from './fs.js';

// Application metadata with lazy loaders for improved performance
const apps = [
  { id: 'about', title: 'About Abhay', icon: iconUser, loader: () => import('./apps/about.js') },
  { id: 'projects', title: 'Projects Hub', icon: iconBriefcase, loader: () => import('./apps/projects.js') },
  { id: 'contact', title: 'Contact', icon: iconMail, loader: () => import('./apps/contact.js') },
  { id: 'settings', title: 'Settings', icon: iconGear, loader: () => import('./apps/settings.js') },
  { id: 'resume', title: 'Resume', icon: iconDoc, loader: () => import('./apps/resume.js') },
  { id: 'notes', title: 'Notes', icon: iconNote, loader: () => import('./apps/notes.js') },
  { id: 'explorer', title: 'File Explorer', icon: iconFolder, loader: () => import('./apps/explorer.js') },
  { id: 'edr-viewer', title: 'EDR Viewer', icon: iconChart, loader: () => import('./apps/edrViewer.js') },
  { id: 'terminal', title: 'Security Terminal', icon: iconTerminal, loader: () => import('./apps/terminal.js') },
  { id: 'wallpapers', title: 'Wallpapers', icon: iconPalette, loader: () => import('./apps/wallpapers.js') },
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
initTheme({ themeToggle });
const fsReady = initFileSystem();

// Clock
const updateClock = () => {
  const d = new Date();
  const opts = { hour: '2-digit', minute: '2-digit' };
  clock.textContent = d.toLocaleTimeString([], opts);
};
updateClock();
setInterval(updateClock, 10000);

// Window manager
const procStore = createProcessStore();
const wm = new WindowManager({
  desktopEl: desktop,
  taskbarAppsEl: taskbarApps,
  onChange: (id, data) => procStore.update(id, data),
  onClose: (id) => procStore.close(id),
});

// Helper to load and open an app on demand
const loadApp = async (meta) => (await meta.loader()).default;
async function openApp(idOrMeta, restoring = false) {
  const meta = typeof idOrMeta === 'string' ? apps.find((a) => a.id === idOrMeta) : idOrMeta;
  if (!meta) return;
  const app = await loadApp(meta);
  const el = wm.createWindow({ id: app.id, title: app.title, icon: app.icon, content: app.render });
  if (!restoring) {
    const rect = el.getBoundingClientRect();
    procStore.launch({
      id: app.id,
      title: app.title,
      icon: app.icon,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      minimized: false,
      maximized: false,
    });
  }
  return el;
}

async function openFile(path) {
  if (!path) return;
  await fsReady;
  const entry = await fsStat(path);
  if (!entry) return;
  if (entry.type === 'folder') {
    await openApp('explorer');
    window.dispatchEvent(new CustomEvent('explorer-navigate', { detail: { path: entry.path } }));
    return;
  }
  const meta = entry.meta || {};
  if (meta.openWith === 'app' && meta.appId) {
    await openApp(meta.appId);
    return;
  }
  if (meta.openWith === 'url' && meta.href) {
    window.open(meta.href, '_blank', 'noopener,noreferrer');
    return;
  }
  await openApp('notes');
  window.dispatchEvent(new CustomEvent('open-file', { detail: { path: entry.path } }));
}

// Start menu population: pinned grid + all apps
const pinned = [
  'projects',
  'edr-viewer',
  'terminal',
  'explorer',
  'notes',
  'resume',
  'wallpapers',
  'settings',
];
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
const desktopState = { entries: [] };
const isFsDrag = (event) => event.dataTransfer?.types?.includes('application/x-fs-path');
const notify = (message) => {
  if (typeof alert === 'function') alert(message);
  else console.error(message); // eslint-disable-line no-console
};

const getEntryIcon = (entry) => {
  if (entry.type === 'folder') return iconFolder;
  if (entry.meta?.openWith === 'notes') return iconNote;
  return iconDoc;
};

const renderDesktopIcons = () => {
  desktopIcons.innerHTML = '';
  // App tiles
  apps.forEach((app) => {
    const tile = document.createElement('button');
    tile.className = 'desktop-icon app-icon';
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

  // File/Folder tiles
  desktopState.entries.forEach((entry) => {
    const tile = document.createElement('button');
    tile.className = 'desktop-icon file-icon';
    tile.dataset.path = entry.path;
    tile.innerHTML = `<div class="icon">${getEntryIcon(entry)}</div><div class="label">${entry.name}</div>`;
    tile.draggable = entry.type === 'file';
    tile.setAttribute('aria-label', `${entry.name} file icon`);
    tile.tabIndex = 0;
    tile.addEventListener('dblclick', () => {
      openFile(entry.path);
    });
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFile(entry.path);
      }
    });
    tile.addEventListener('dragstart', (event) => {
      if (!event.dataTransfer) return;
      event.dataTransfer.setData('application/x-fs-path', entry.path);
      event.dataTransfer.effectAllowed = 'move';
    });
    desktopIcons.append(tile);
  });
};

const refreshDesktopFiles = async () => {
  await fsReady;
  const { entries } = await fsListDir(DesktopDir);
  desktopState.entries = entries;
  renderDesktopIcons();
};

const createDesktopEntry = async (type) => {
  await fsReady;
  const { entries } = await fsListDir(DesktopDir);
  const existing = new Set(entries.map((entry) => entry.name.toLowerCase()));
  const defaultName = type === 'folder' ? 'New Folder' : 'New Note.txt';
  const label = type === 'folder' ? 'Folder name' : 'File name';
  const input = typeof prompt === 'function' ? prompt(label, defaultName) : defaultName;
  if (input === null) return;
  let name = (input || '').trim() || defaultName;
  if (type === 'file' && !/\.[^./\s]{2,}$/i.test(name)) {
    name += '.txt';
  }
  const splitIndex = type === 'file' ? name.lastIndexOf('.') : -1;
  const base = splitIndex > 0 ? name.slice(0, splitIndex) : name;
  const ext = splitIndex > 0 ? name.slice(splitIndex) : '';
  let candidate = name;
  let index = 1;
  while (existing.has(candidate.toLowerCase())) {
    candidate = `${base} (${index++})${ext}`;
  }
  const path = `${DesktopDir}/${candidate}`;
  try {
    if (type === 'folder') {
      await fsWriteFile(path, { type: 'folder', overwrite: false });
    } else {
      await fsWriteFile(path, { content: '', meta: { openWith: 'notes' }, overwrite: false });
    }
  } catch (err) {
    notify(err.message || 'Unable to create item');
  }
};

renderDesktopIcons();
refreshDesktopFiles();

window.addEventListener('fs-changed', (event) => {
  const parent = event.detail?.parent;
  if (!parent || parent === DesktopDir || parent.startsWith(`${DesktopDir}/`)) {
    refreshDesktopFiles();
  }
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

// Desktop context menu + drag-drop
desktop.addEventListener('dragover', (event) => {
  if (isFsDrag(event)) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }
});

desktop.addEventListener('drop', async (event) => {
  if (!isFsDrag(event)) return;
  event.preventDefault();
  const from = event.dataTransfer?.getData('application/x-fs-path');
  if (!from) return;
  await fsReady;
  try {
    await fsMoveFile(from, DesktopDir);
  } catch (err) {
    notify(err.message || 'Unable to move file');
  }
});

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
    case 'new-file':
      createDesktopEntry('file');
      break;
    case 'new-folder':
      createDesktopEntry('folder');
      break;
    case 'restore-defaults':
      fsRestoreDefaults()
        .then(() => refreshDesktopFiles())
        .catch((err) => notify(err.message || 'Unable to restore files'));
      break;
    case 'open-settings':
      openApp('settings');
      break;
    case 'change-wallpaper':
      openApp('wallpapers');
      break;
    case 'open-explorer':
      openApp('explorer');
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
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    if (e.repeat) return;
    openApp('notes').then(() => {
      window.dispatchEvent(new CustomEvent('notes-new'));
    });
    return;
  }
  if (e.altKey && e.key === 'Tab') {
    e.preventDefault();
    if (e.repeat) return;
    wm.cycleWindows(!e.shiftKey);
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

// Restore previous session or show About on first visit
const savedProcs = procStore.getAll();
if (savedProcs.length) {
  savedProcs.forEach((p) => {
    openApp(p.id, true).then((el) => {
      el.style.left = p.left + 'px';
      el.style.top = p.top + 'px';
      el.style.width = p.width + 'px';
      el.style.height = p.height + 'px';
      if (p.maximized) {
        const maxBtn = el.querySelector('.btn-max');
        maxBtn && maxBtn.click();
      }
      if (p.minimized) {
        el.style.display = 'none';
      }
    });
  });
} else {
  setTimeout(() => openApp('about'), 300);
}

// Cross-app open events (e.g., links from About -> Projects)
window.addEventListener('open-app', (e) => {
  const { id } = e.detail || {};
  openApp(id);
});

window.addEventListener('fs-open', (e) => {
  const path = e.detail?.path;
  if (path) openFile(path);
});

// Preload app modules when the browser is idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => apps.forEach((a) => a.loader()));
} else {
  setTimeout(() => apps.forEach((a) => a.loader()), 2000);
}
