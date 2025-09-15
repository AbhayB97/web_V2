export default class WindowManager {
  constructor({ desktopEl, taskbarAppsEl, onChange, onClose }) {
    this.desktopEl = desktopEl;
    this.taskbarAppsEl = taskbarAppsEl;
    this.onChange = onChange;
    this.onClose = onClose;
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

    for (const [id, { el: w }] of this.windows.entries()) {
      if (w === el) this.onChange?.(id, { lastFocus: Date.now() });
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

    const emitState = () => {
      const rect = el.getBoundingClientRect();
      this.onChange?.(id, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        minimized: el.style.display === 'none',
        maximized: el.classList.contains('maximized'),
      });
    };

    // Titlebar
    const titlebar = document.createElement('div');
    titlebar.className = 'titlebar';
    const titleBox = document.createElement('div');
    titleBox.className = 'title';
    const iconEl = document.createElement('div');
    iconEl.className = 'icon';
    if (icon && typeof icon === 'string' && icon.trim().startsWith('<svg')) {
      iconEl.innerHTML = icon;
    } else {
      iconEl.textContent = icon || '🗔';
    }
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
      const maxY = window.innerHeight - el.offsetHeight - 56; // taskbar height
      let x = Math.min(Math.max(6, e.clientX - drag.dx), Math.max(6, maxX));
      let y = Math.min(Math.max(6, e.clientY - drag.dy), Math.max(6, maxY));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });

    window.addEventListener('mouseup', () => {
      if (drag) {
        // Snap to top to maximize
        const topNow = parseInt(el.style.top || '0', 10);
        if (topNow <= 8 && !el.classList.contains('maximized')) {
          toggleMaximize();
        }
        emitState();
      }
      drag = null;
    });

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

    window.addEventListener('mouseup', () => {
      if (res) emitState();
      res = null;
    });

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
      emitState();
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
      emitState();
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
      emitState();
    });

    this.taskbarAppsEl.append(taskButton);
    this.desktopEl.append(el);
    this.windows.set(id, { el, taskButton });
    emitState();

    return el;
  }

  closeWindow(id) {
    const w = this.windows.get(id);
    if (!w) return;
    w.el.remove();
    w.taskButton.remove();
    this.windows.delete(id);
    this.onClose?.(id);
  }
}
