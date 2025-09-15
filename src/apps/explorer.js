import { listDir, writeFile, deleteFile, moveFile, restoreDefaults } from '../fs.js';
import {
  iconFolder,
  iconDoc,
  iconNote,
  iconPlus,
  iconTrash,
  iconArrowRight,
} from '../icons.js';

const join = (dir, name) => {
  const base = dir === '/' ? '' : dir;
  return `${base}/${name}`.replace(/\/+$/, '').replace(/\/+/g, '/');
};

const isFsDrag = (event) => event.dataTransfer?.types?.includes('application/x-fs-path');
const safePrompt = (message, fallback) => (typeof prompt === 'function' ? prompt(message, fallback) : fallback);
const safeConfirm = (message) => (typeof confirm === 'function' ? confirm(message) : true);
const safeAlert = (message) => {
  if (typeof alert === 'function') alert(message);
  else console.error(message);
};

const ExplorerApp = {
  id: 'explorer',
  title: 'File Explorer',
  icon: iconFolder,
  render() {
    const state = {
      currentPath: '/Documents',
      entries: [],
      selected: null,
    };

    const root = document.createElement('div');
    root.className = 'explorer-app';

    const toolbar = document.createElement('div');
    toolbar.className = 'explorer-toolbar';

    const locationBar = document.createElement('div');
    locationBar.className = 'explorer-location';

    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'explorer-breadcrumb';

    locationBar.append(breadcrumb);

    const actions = document.createElement('div');
    actions.className = 'explorer-actions';

    const makeButton = (label, icon, handler) => {
      const btn = document.createElement('button');
      btn.className = 'explorer-button';
      btn.innerHTML = `<span class="icon">${icon}</span><span>${label}</span>`;
      btn.addEventListener('click', handler);
      return btn;
    };

    const newFile = async () => {
      const name = safePrompt('New file name', 'New Document.txt');
      if (!name) return;
      try {
        await writeFile(join(state.currentPath, name), {
          content: '',
          meta: { openWith: 'notes' },
          overwrite: false,
        });
      } catch (err) {
        safeAlert(err.message || 'Unable to create file');
      }
    };

    const newFolder = async () => {
      const name = safePrompt('New folder name', 'New Folder');
      if (!name) return;
      try {
        await writeFile(join(state.currentPath, name), { type: 'folder', overwrite: false });
      } catch (err) {
        safeAlert(err.message || 'Unable to create folder');
      }
    };

    const removeSelected = async () => {
      if (!state.selected) return;
      const ok = safeConfirm(`Delete "${state.selected.name}"?`);
      if (!ok) return;
      await deleteFile(state.selected.path);
      state.selected = null;
    };

    const resetFs = async () => {
      const ok = safeConfirm('Restore default files? This removes your changes.');
      if (ok) await restoreDefaults();
    };

    actions.append(
      makeButton('New File', iconPlus, newFile),
      makeButton('New Folder', iconFolder, newFolder),
      makeButton('Delete', iconTrash, removeSelected),
      makeButton('Reset', iconArrowRight, resetFs)
    );

    toolbar.append(locationBar, actions);

    const grid = document.createElement('div');
    grid.className = 'explorer-grid';

    const info = document.createElement('div');
    info.className = 'explorer-info';

    const updateBreadcrumb = () => {
      breadcrumb.innerHTML = '';
      const parts = state.currentPath.split('/').filter(Boolean);
      const segments = [{ label: 'Home', path: '/' }];
      let acc = '';
      parts.forEach((part) => {
        acc = `${acc}/${part}`;
        segments.push({ label: part, path: acc || '/' });
      });
      segments.forEach((segment, idx) => {
        const btn = document.createElement('button');
        btn.className = 'breadcrumb-item';
        btn.textContent = segment.label;
        btn.disabled = idx === segments.length - 1;
        btn.addEventListener('click', () => {
          if (segment.path !== state.currentPath) load(segment.path || '/');
        });
        breadcrumb.append(btn);
        if (idx < segments.length - 1) {
          const sep = document.createElement('span');
          sep.className = 'breadcrumb-sep';
          sep.textContent = '›';
          breadcrumb.append(sep);
        }
      });
    };

    const setSelected = (path) => {
      state.selected = state.entries.find((entry) => entry.path === path) || null;
      grid.querySelectorAll('.explorer-item').forEach((item) => {
        item.classList.toggle('selected', item.dataset.path === path);
      });
      info.textContent = state.selected
        ? `${state.selected.type === 'folder' ? 'Folder' : 'File'} · ${state.selected.name}`
        : 'No item selected';
    };

    const openFile = (entry) => {
      if (entry.type === 'folder') {
        load(entry.path);
      } else {
        window.dispatchEvent(new CustomEvent('fs-open', { detail: { path: entry.path } }));
      }
    };

    const renderEntries = () => {
      grid.innerHTML = '';
      state.entries.forEach((entry) => {
        const item = document.createElement('button');
        item.className = 'explorer-item';
        item.dataset.path = entry.path;
        item.draggable = entry.type === 'file';
        const icon = entry.type === 'folder' ? iconFolder : entry.meta?.openWith === 'notes' ? iconNote : iconDoc;
        item.innerHTML = `<span class="icon">${icon}</span><span class="label">${entry.name}</span>`;
        item.addEventListener('click', () => setSelected(entry.path));
        item.addEventListener('dblclick', () => openFile(entry));
        item.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            openFile(entry);
          }
        });
        item.addEventListener('dragstart', (event) => {
          if (entry.type === 'folder') return;
          event.dataTransfer.setData('application/x-fs-path', entry.path);
          event.dataTransfer.effectAllowed = 'move';
        });
        item.addEventListener('dragover', (event) => {
          if (entry.type === 'folder' && isFsDrag(event)) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }
        });
        item.addEventListener('drop', async (event) => {
          if (!isFsDrag(event)) return;
          event.preventDefault();
          const from = event.dataTransfer.getData('application/x-fs-path');
          if (!from || from === entry.path) return;
          await moveFile(from, entry.path);
        });
        grid.append(item);
      });
    };

    grid.addEventListener('dragover', (event) => {
      if (isFsDrag(event)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }
    });
    grid.addEventListener('drop', async (event) => {
      if (!isFsDrag(event)) return;
      event.preventDefault();
      const from = event.dataTransfer.getData('application/x-fs-path');
      if (!from) return;
      await moveFile(from, state.currentPath);
    });

    const load = async (path) => {
      state.currentPath = path || '/';
      const { entries } = await listDir(state.currentPath);
      state.entries = entries;
      updateBreadcrumb();
      renderEntries();
      setSelected(state.selected?.path || null);
    };

    const fsListener = (event) => {
      const { detail } = event;
      if (!detail) {
        load(state.currentPath);
        return;
      }
      const parent = detail.parent || '/';
      if (parent === state.currentPath || state.currentPath.startsWith(parent) || parent.startsWith(state.currentPath)) {
        load(state.currentPath);
      }
    };

    const navigateListener = (event) => {
      const path = event.detail?.path;
      if (path) load(path);
    };

    if (window.__explorerFsListener) {
      window.removeEventListener('fs-changed', window.__explorerFsListener);
    }
    window.__explorerFsListener = fsListener;
    window.addEventListener('fs-changed', fsListener);

    if (window.__explorerNavListener) {
      window.removeEventListener('explorer-navigate', window.__explorerNavListener);
    }
    window.__explorerNavListener = navigateListener;
    window.addEventListener('explorer-navigate', navigateListener);

    root.append(toolbar, grid, info);

    load(state.currentPath);

    return root;
  },
};

export default ExplorerApp;
