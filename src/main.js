// Desktop-style portfolio (Phase 1 scaffold)
// Minimal window manager + basic apps

import AboutApp from './apps/about.js';
import ProjectsApp from './apps/projects.js';
import ContactApp from './apps/contact.js';

const apps = [AboutApp, ProjectsApp, ContactApp];

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
    minBtn.title = 'Minimize';
    minBtn.setAttribute('aria-label', 'Minimize');
    minBtn.textContent = '—';
    const closeBtn = document.createElement('button');
    closeBtn.title = 'Close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';
    actions.append(minBtn, closeBtn);

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

    // Minimize / Close
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

// Theme
const applyTheme = (t) => document.documentElement.setAttribute('data-theme', t);
const savedTheme = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
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

// Start menu population
apps.forEach((app) => {
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
});

// Open About on first load for a nice touch
setTimeout(() => wm.createWindow({ id: AboutApp.id, title: AboutApp.title, icon: AboutApp.icon, content: AboutApp.render }), 300);

// Cross-app open events (e.g., links from About -> Projects)
window.addEventListener('open-app', (e) => {
  const { id } = e.detail || {};
  const app = apps.find((a) => a.id === id);
  if (app) wm.createWindow({ id: app.id, title: app.title, icon: app.icon, content: app.render });
});
