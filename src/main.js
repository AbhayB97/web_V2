// Desktop-style portfolio (Phase 1 scaffold)
// Minimal window manager + basic apps

import AboutApp from './apps/about.js';
import ProjectsApp from './apps/projects.js';
import ContactApp from './apps/contact.js';
import SettingsApp from './apps/settings.js';
import ResumeApp from './apps/resume.js';

const apps = [AboutApp, ProjectsApp, ContactApp, SettingsApp, ResumeApp];

class WindowManager {
  constructor({ desktopEl, taskbarAppsEl }) {
    this.desktopEl = desktopEl;
    this.taskbarAppsEl = taskbarAppsEl;
    this.z = 10;
    this.windows = new Map(); // id -> { el, taskButton }
  }

  bringToFront(el) {
    this.z += 1;
    el.style.zIndex = String(this.z);
    el.classList.add('active');
    // Deactivate others
    for (const { el: other } of this.windows.values()) {
      if (other !== el) other.classList.remove('active');
    }
    // Update task buttons
    for (const { el: w, taskButton } of this.windows.values()) {
      taskButton.classList.toggle('active', w === el);
    }
  }

  createWindow({ id, title, icon, content }) {
    if (this.windows.has(id)) {
      // Restore existing window
      const w = this.windows.get(id);
      w.el.style.display = 'grid';
      w.taskButton.classList.add('active');
      this.bringToFront(w.el);
      return w.el;
    }

    const el = document.createElement('div');
    el.className = 'window';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', title);
    el.style.left = Math.round(60 + Math.random() * 120) + 'px';
    el.style.top = Math.round(60 + Math.random() * 80) + 'px';
    el.style.zIndex = String(++this.z);

    // Titlebar
    const titlebar = document.createElement('div');
    titlebar.className = 'titlebar';
    const titleBox = document.createElement('div');
    titleBox.className = 'title';
    const iconEl = document.createElement('div');
    iconEl.className = 'icon';
    iconEl.textContent = icon || '🗔';
    const textEl = document.createElement('div');
    textEl.className = 'text';
    textEl.textContent = title;
    titleBox.append(iconEl, textEl);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const minBtn = document.createElement('button');
    minBtn.className = 'title-btn btn-min';
    minBtn.title = 'Minimize';
    minBtn.setAttribute('aria-label', 'Minimize');
    minBtn.textContent = '—';
    const maxBtn = document.createElement('button');
    maxBtn.className = 'title-btn btn-max';
    maxBtn.title = 'Maximize';
    maxBtn.setAttribute('aria-label', 'Maximize');
    maxBtn.textContent = '▢';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'title-btn btn-close';
    closeBtn.title = 'Close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';
    actions.append(minBtn, maxBtn, closeBtn);

    titlebar.append(titleBox, actions);
    el.append(titlebar);

    // Content
    const contentEl = document.createElement('div');
    contentEl.className = 'content';
    if (typeof content === 'function') contentEl.append(content());
    else if (content instanceof Node) contentEl.append(content);
    else if (typeof content === 'string') contentEl.innerHTML = content;
    el.append(contentEl);

    // Resize handle
    const resize = document.createElement('div');
    resize.className = 'resize-handle';
    el.append(resize);

    // Dragging
    let drag = null;
    titlebar.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const rect = el.getBoundingClientRect();
      drag = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
      this.bringToFront(el);
      e.preventDefault();
    });
    // Double-click to toggle maximize
    titlebar.addEventListener('dblclick', () => toggleMaximize());
    window.addEventListener('mousemove', (e) => {
      if (!drag) return;
      const maxX = window.innerWidth - el.offsetWidth - 6;
      const maxY = window.innerHeight - el.offsetHeight - 56; // taskbar area
      let x = Math.min(Math.max(6, e.clientX - drag.dx), Math.max(6, maxX));
      let y = Math.min(Math.max(6, e.clientY - drag.dy), Math.max(6, maxY));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });
    window.addEventListener('mouseup', () => { drag = null; });

    // Resize
    let res = null;
    resize.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const rect = el.getBoundingClientRect();
      res = { w: rect.width, h: rect.height, x: e.clientX, y: e.clientY };
      this.bringToFront(el);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!res) return;
      const minW = 280, minH = 200;
      const w = Math.max(minW, res.w + (e.clientX - res.x));
      const h = Math.max(minH, res.h + (e.clientY - res.y));
      el.style.width = w + 'px';
      el.style.height = h + 'px';
    });
    window.addEventListener('mouseup', () => { res = null; });

    // Maximize / Minimize / Close
    let prevRect = null;
    const toggleMaximize = () => {
      if (!el.classList.contains('maximized')) {
        const rect = el.getBoundingClientRect();
        prevRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        el.classList.add('maximized');
        el.style.left = '8px';
        el.style.top = '8px';
        el.style.width = 'calc(100vw - 24px)';
        el.style.height = 'calc(100vh - 68px)';
        maxBtn.title = 'Restore';
        maxBtn.setAttribute('aria-label', 'Restore');
        resize.style.display = 'none';
      } else {
        el.classList.remove('maximized');
        if (prevRect) {
          el.style.left = prevRect.left + 'px';
          el.style.top = prevRect.top + 'px';
          el.style.width = prevRect.width + 'px';
          el.style.height = prevRect.height + 'px';
        }
        maxBtn.title = 'Maximize';
        maxBtn.setAttribute('aria-label', 'Maximize');
        resize.style.display = '';
      }
    };
    maxBtn.addEventListener('click', toggleMaximize);
    minBtn.addEventListener('click', () => {
      if (el.style.display !== 'none') {
        el.style.display = 'none';
        taskButton.classList.remove('active');
      } else {
        el.style.display = 'grid';
        this.bringToFront(el);
        taskButton.classList.add('active');
      }
    });
    closeBtn.addEventListener('click', () => this.closeWindow(id));

    // Focus on mousedown
    el.addEventListener('mousedown', () => this.bringToFront(el));

    // Taskbar button
    const taskButton = document.createElement('button');
    taskButton.className = 'task-button active';
    taskButton.innerHTML = `<span class="icon">${icon || '🗔'}</span><span class="label">${title}</span>`;
    taskButton.addEventListener('click', () => {
      if (el.style.display === 'none') {
        el.style.display = 'grid';
        this.bringToFront(el);
        taskButton.classList.add('active');
      } else if (parseInt(el.style.zIndex || '0', 10) < this.z) {
        this.bringToFront(el);
        taskButton.classList.add('active');
      } else {
        el.style.display = 'none';
        taskButton.classList.remove('active');
      }
    });

    this.taskbarAppsEl.append(taskButton);
    this.desktopEl.append(el);

    this.windows.set(id, { el, taskButton });
    return el;
  }

  closeWindow(id) {
    const w = this.windows.get(id);
    if (!w) return;
    w.el.remove();
    w.taskButton.remove();
    this.windows.delete(id);
  }
}

// Bootstrapping
const $ = (id) => document.getElementById(id);
const desktop = $('desktop');
const taskbarApps = $('taskbar-apps');
const startButton = $('start-button');
const startMenu = $('start-menu');
const startList = $('start-menu-list');
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

// Start menu population (pin common apps first)
const pinned = ['settings', 'resume', 'projects'];
const order = [
  ...apps.filter((a) => pinned.includes(a.id)),
  ...apps.filter((a) => !pinned.includes(a.id)),
];
order.forEach((app) => {
  const li = document.createElement('li');
  li.className = 'start-item';
  li.innerHTML = `<span class="icon">${app.icon}</span><span>${app.title}</span>`;
  li.addEventListener('click', () => {
    wm.createWindow({ id: app.id, title: app.title, icon: app.icon, content: app.render });
    startMenu.classList.add('hidden');
  });
  startList.append(li);
});

// Desktop icons
const desktopIcons = $('desktop-icons');
apps.forEach((app) => {
  const tile = document.createElement('button');
  tile.className = 'desktop-icon';
  tile.innerHTML = `<div class="icon">${app.icon}</div><div class="label">${app.title}</div>`;
  tile.addEventListener('dblclick', () => {
    wm.createWindow({ id: app.id, title: app.title, icon: app.icon, content: app.render });
  });
  tile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      wm.createWindow({ id: app.id, title: app.title, icon: app.icon, content: app.render });
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
      wm.createWindow({ id: SettingsApp.id, title: SettingsApp.title, icon: SettingsApp.icon, content: SettingsApp.render });
      break;
    case 'toggle-theme':
      themeToggle.click();
      break;
    case 'open-resume':
      wm.createWindow({ id: ResumeApp.id, title: ResumeApp.title, icon: ResumeApp.icon, content: ResumeApp.render });
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

// Open About on first load for a nice touch
setTimeout(() => wm.createWindow({ id: AboutApp.id, title: AboutApp.title, icon: AboutApp.icon, content: AboutApp.render }), 300);

// Cross-app open events (e.g., links from About -> Projects)
window.addEventListener('open-app', (e) => {
  const { id } = e.detail || {};
  const app = apps.find((a) => a.id === id);
  if (app) wm.createWindow({ id: app.id, title: app.title, icon: app.icon, content: app.render });
});
