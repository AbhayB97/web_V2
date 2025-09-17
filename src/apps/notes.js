import { listDir, readFile, writeFile, deleteFile, stat, NotesDir } from '../fs.js';
import { iconNote, iconPlus, iconTrash, iconDoc } from '../icons.js';

const isTextFile = (name) => /\.((txt|md|log))$/i.test(name);
const join = (dir, name) => (dir === '/' ? `/${name}` : `${dir}/${name}`).replace(/\/+/g, '/');
const safePrompt = (message, fallback) => (typeof prompt === 'function' ? prompt(message, fallback) : fallback);
const safeConfirm = (message) => (typeof confirm === 'function' ? confirm(message) : true);
const safeAlert = (message) => {
  if (typeof alert === 'function') alert(message);
  else console.error(message);
};

const NotesApp = {
  id: 'notes',
  title: 'Notes',
  icon: iconNote,
  render() {
    const state = {
      notes: [],
      currentPath: null,
      currentName: '',
      dirty: false,
    };

    const root = document.createElement('div');
    root.className = 'notes-app';

    const sidebar = document.createElement('aside');
    sidebar.className = 'notes-sidebar';

    const sidebarHeader = document.createElement('div');
    sidebarHeader.className = 'notes-sidebar-header';

    const newButton = document.createElement('button');
    newButton.className = 'notes-button primary';
    newButton.innerHTML = `<span class="icon">${iconPlus}</span><span>New Note</span>`;

    sidebarHeader.append(newButton);

    const list = document.createElement('div');
    list.className = 'notes-list';

    sidebar.append(sidebarHeader, list);

    const editor = document.createElement('section');
    editor.className = 'notes-editor';

    const editorTop = document.createElement('div');
    editorTop.className = 'notes-editor-top';

    const title = document.createElement('div');
    title.className = 'notes-title';
    title.textContent = 'Select a note to begin';

    const editorActions = document.createElement('div');
    editorActions.className = 'notes-editor-actions';

    const saveButton = document.createElement('button');
    saveButton.className = 'notes-button';
    saveButton.textContent = 'Save';
    saveButton.disabled = true;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'notes-button';
    deleteButton.innerHTML = `<span class="icon">${iconTrash}</span>`;
    deleteButton.title = 'Delete note';
    deleteButton.disabled = true;

    editorActions.append(saveButton, deleteButton);
    editorTop.append(title, editorActions);

    const textarea = document.createElement('textarea');
    textarea.className = 'notes-textarea';
    textarea.disabled = true;
    textarea.placeholder = 'Write your thoughts…';

    editor.append(editorTop, textarea);

    root.append(sidebar, editor);

    const renderList = () => {
      list.innerHTML = '';
      if (!state.notes.length) {
        const empty = document.createElement('div');
        empty.className = 'notes-empty';
        empty.innerHTML = `<div class="icon">${iconDoc}</div><p>No notes yet</p>`;
        list.append(empty);
        return;
      }
      state.notes.forEach((note) => {
        const item = document.createElement('button');
        item.className = 'notes-item';
        item.dataset.path = note.path;
        item.innerHTML = `<span class="name">${note.name}</span>`;
        item.classList.toggle('active', note.path === state.currentPath);
        item.addEventListener('click', async () => {
          if (note.path === state.currentPath) return;
          if (state.dirty) {
            const discard = safeConfirm('Discard unsaved changes?');
            if (!discard) return;
          }
          await openNote(note.path);
        });
        list.append(item);
      });
    };

    const refreshList = async () => {
      const { files } = await listDir(NotesDir);
      state.notes = files.filter((file) => isTextFile(file.name) || file.meta?.openWith === 'notes');
      renderList();
    };

    const setDirty = (dirty) => {
      state.dirty = dirty;
      saveButton.disabled = !dirty || !state.currentPath;
    };

    const updateTitle = () => {
      if (!state.currentPath) {
        title.textContent = 'Select a note to begin';
      } else {
        title.textContent = state.currentName;
      }
    };

    const openNote = async (path) => {
      const entry = await stat(path);
      if (!entry || entry.type !== 'file') return;
      state.currentPath = entry.path;
      state.currentName = entry.name;
      textarea.disabled = false;
      textarea.value = await readFile(entry.path);
      setDirty(false);
      deleteButton.disabled = false;
      updateTitle();
      list.querySelectorAll('.notes-item').forEach((item) => {
        item.classList.toggle('active', item.dataset.path === entry.path);
      });
    };

    textarea.addEventListener('input', () => {
      if (!state.currentPath) return;
      setDirty(true);
    });

    saveButton.addEventListener('click', async () => {
      if (!state.currentPath) return;
      const entry = await stat(state.currentPath);
      await writeFile(state.currentPath, {
        content: textarea.value,
        meta: { ...(entry?.meta || {}), openWith: 'notes' },
      });
      setDirty(false);
      refreshList();
    });

    deleteButton.addEventListener('click', async () => {
      if (!state.currentPath) return;
      const confirmDelete = safeConfirm(`Delete "${state.currentName}"?`);
      if (!confirmDelete) return;
      await deleteFile(state.currentPath);
      state.currentPath = null;
      state.currentName = '';
      textarea.value = '';
      textarea.disabled = true;
      deleteButton.disabled = true;
      setDirty(false);
      updateTitle();
      refreshList();
    });

    newButton.addEventListener('click', async () => {
      if (state.dirty) {
        const discard = safeConfirm('Discard unsaved changes?');
        if (!discard) return;
      }
      const name = safePrompt('Note name', 'New Note.txt');
      if (!name) return;
      const finalName = isTextFile(name) ? name : `${name}.txt`;
      const path = join(NotesDir, finalName);
      try {
        await writeFile(path, { content: '', meta: { openWith: 'notes' }, overwrite: false });
        await refreshList();
        await openNote(path);
      } catch (err) {
        safeAlert(err.message || 'Unable to create note');
      }
    });

    const fsListener = (event) => {
      const parent = event.detail?.parent;
      if (!parent || parent === NotesDir || parent.startsWith(`${NotesDir}/`)) {
        refreshList();
      }
    };

    const openListener = (event) => {
      const path = event.detail?.path;
      if (!path) return;
      const lower = path.toLowerCase();
      if (isTextFile(lower)) {
        openNote(path);
      } else {
        stat(path).then((entry) => {
          if (entry?.meta?.openWith === 'notes') openNote(path);
        });
      }
    };

    if (window.__notesFsListener) {
      window.removeEventListener('fs-changed', window.__notesFsListener);
    }
    window.__notesFsListener = fsListener;
    window.addEventListener('fs-changed', fsListener);

    if (window.__notesOpenListener) {
      window.removeEventListener('open-file', window.__notesOpenListener);
    }
    window.__notesOpenListener = openListener;
    window.addEventListener('open-file', openListener);

    refreshList();

    return root;
  },
};

export default NotesApp;
