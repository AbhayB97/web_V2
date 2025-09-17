// WindowManager with snapping/grid, focus cycling, and taskbar sync

const SNAP_SPACING = 12;
const SNAP_MARGIN = 16;
const DESKTOP_PADDING = 8;
const TASKBAR_CLEARANCE = 56;

export default class WindowManager {
  constructor({ desktopEl, taskbarAppsEl, onChange, onClose }) {
    this.desktopEl = desktopEl;
    this.taskbarAppsEl = taskbarAppsEl;
    this.onChange = onChange;
    this.onClose = onClose;
    this.z = 10;
    this.windows = new Map(); // id -> { el, taskButton }
    this.focusOrder = [];
    this.activeId = null;
  }

  bringToFront(el, idHint) {
    this.z += 1;
    el.style.zIndex = String(this.z);
    let activeId = idHint || null;

    for (const [id, { el: other, taskButton }] of this.windows.entries()) {
      const isActive = other === el;
      other.classList.toggle('active', isActive);
      taskButton.classList.toggle('active', isActive);
      if (isActive) activeId = id;
    }

    if (activeId) {
      this.activeId = activeId;
      this.focusOrder = this.focusOrder.filter((v) => v !== activeId);
      this.focusOrder.push(activeId);
      this.onChange?.(activeId, { lastFocus: Date.now() });
    }
  }

  snapWindow(el) {
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const maxLeft = Math.max(
      DESKTOP_PADDING,
      window.innerWidth - width - DESKTOP_PADDING
    );
    const maxTop = Math.max(
      DESKTOP_PADDING,
      window.innerHeight - height - TASKBAR_CLEARANCE
    );

    const rawLeft = parseFloat(el.style.left) || rect.left;
    const rawTop = parseFloat(el.style.top) || rect.top;

    let left = Math.round(rawLeft / SNAP_SPACING) * SNAP_SPACING;
    let top = Math.round(rawTop / SNAP_SPACING) * SNAP_SPACING;

    if (Math.abs(left - DESKTOP_PADDING) <= SNAP_MARGIN) left = DESKTOP_PADDING;
    if (Math.abs(left - maxLeft) <= SNAP_MARGIN) left = maxLeft;
    if (Math.abs(top - DESKTOP_PADDING) <= SNAP_MARGIN) top = DESKTOP_PADDING;
    if (Math.abs(top - maxTop) <= SNAP_MARGIN) top = maxTop;

    left = Math.min(Math.max(DESKTOP_PADDING, left), maxLeft);
    top = Math.min(Math.max(DESKTOP_PADDING, top), maxTop);

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }

  createWindow({ id, title, icon, content }) {
    if (this.windows.has(id)) {
      const existing = this.windows.get(id);
      existing.el.style.display = 'grid';
      this.bringToFront(existing.el, id);
      return existing.el;
    }

    const el = document.createElement('div');
    el.className = 'window';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', title);
    el.style.left = Math.round(60 + Math.random() * 120) + 'px';
    el.style.top = Math.round(60 + Math.random() * 80) + 'px';
    el.style.zIndex = String(++this.z);

    let taskButton = null;

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
      if (el.classList.contains('maximized')) return;
      const rect = el.getBoundingClientRect();
      drag = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
      this.bringToFront(el, id);
      e.preventDefault();
    });

    // Double-click to toggle maximize
    titlebar.addEventListener('dblclick', () => toggleMaximize());

    window.addEventListener('mousemove', (e) => {
      if (!drag) return;
      const maxX = Math.max(
        DESKTOP_PADDING,
        window.innerWidth - el.offsetWidth - DESKTOP_PADDING
      );
      const maxY = Math.max(
        DESKTOP_PADDING,
        window.innerHeight - el.offsetHeight - TASKBAR_CLEARANCE
      );
      let x = Math.min(Math.max(DESKTOP_PADDING, e.clientX - drag.dx), maxX);
      let y = Math.min(Math.max(DESKTOP_PADDING, e.clientY - drag.dy), maxY);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    });

    window.addEventListener('mouseup', () => {
      if (drag) {
        const topNow = parseInt(el.style.top || '0', 10);
        if (topNow <= DESKTOP_PADDING + 2 && !el.classList.contains('maximized')) {
          toggleMaximize();
        } else if (!el.classList.contains('maximized')) {
          this.snapWindow(el);
          emitState();
        }
      }
      drag = null;
    });

    // Resize
    let res = null;
    resize.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const rect = el.getBoundingClientRect();
      res = { w: rect.width, h: rect.height, x: e.clientX, y: e.clientY };
      this.bringToFront(el, id);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!res) return;
      const minW = 280;
      const minH = 200;
      const w = Math.max(minW, res.w + (e.clientX - res.x));
      const h = Math.max(minH, res.h + (e.clientY - res.y));
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
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
        el.style.left = `${DESKTOP_PADDING}px`;
        el.style.top = `${DESKTOP_PADDING}px`;
        el.style.width = 'calc(100vw - 24px)';
        el.style.height = 'calc(100vh - 68px)';
        maxBtn.title = 'Restore';
        maxBtn.setAttribute('aria-label', 'Restore');
        resize.style.display = 'none';
      } else {
        el.classList.remove('maximized');
        if (prevRect) {
          el.style.left = `${prevRect.left}px`;
          el.style.top = `${prevRect.top}px`;
          el.style.width = `${prevRect.width}px`;
          el.style.height = `${prevRect.height}px`;
          this.snapWindow(el);
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
        taskButton?.classList.remove('active');
      } else {
        el.style.display = 'grid';
        this.bringToFront(el, id);
        taskButton?.classList.add('active');
      }
      emitState();
    });

    closeBtn.addEventListener('click', () => this.closeWindow(id));

    // Focus on mousedown
    el.addEventListener('mousedown', () => this.bringToFront(el, id));

    // Taskbar button
    taskButton = document.createElement('button');
    taskButton.className = 'task-button active';
    taskButton.innerHTML = `<span class="icon">${icon || '🗔'}</span><span class="label">${title}</span>`;
    taskButton.addEventListener('click', () => {
      if (el.style.display === 'none') {
        el.style.display = 'grid';
        this.bringToFront(el, id);
      } else if (parseInt(el.style.zIndex || '0', 10) < this.z) {
        this.bringToFront(el, id);
      } else {
        el.style.display = 'none';
        taskButton.classList.remove('active');
      }
      emitState();
    });

    this.taskbarAppsEl.append(taskButton);
    this.desktopEl.append(el);
    this.windows.set(id, { el, taskButton });
    this.bringToFront(el, id);
    this.snapWindow(el);
    emitState();
    return el;
  }

  cycleWindows(forward = true) {
    if (!this.focusOrder.length) return;
    const order = this.focusOrder.slice();
    const active = this.activeId ?? order[order.length - 1];
    const index = order.indexOf(active);
    const nextIndex = forward
      ? (index + 1) % order.length
      : (index - 1 + order.length) % order.length;
    const nextId = order[nextIndex];
    const nextWindow = this.windows.get(nextId);
    if (!nextWindow) return;
    nextWindow.el.style.display = 'grid';
    this.bringToFront(nextWindow.el, nextId);
  }

  closeWindow(id) {
    const target = this.windows.get(id);
    if (!target) return;
    target.el.remove();
    target.taskButton.remove();
    this.windows.delete(id);
    this.focusOrder = this.focusOrder.filter((v) => v !== id);
    if (this.activeId === id) {
      this.activeId = this.focusOrder[this.focusOrder.length - 1] || null;
      if (this.activeId) {
        const next = this.windows.get(this.activeId);
        if (next) this.bringToFront(next.el, this.activeId);
      }
    }
    this.onClose?.(id);
  }
}
