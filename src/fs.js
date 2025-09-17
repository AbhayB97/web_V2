const DB_NAME = 'portfolio-fs';
const STORE = 'nodes';
const DB_VERSION = 1;

let dbPromise;

const DEFAULT_ENTRIES = [
  { path: '/', type: 'folder' },
  { path: '/Desktop', type: 'folder' },
  { path: '/Documents', type: 'folder' },
  { path: '/Documents/Notes', type: 'folder' },
  { path: '/Projects', type: 'folder' },
  {
    path: '/Documents/Welcome.txt',
    type: 'file',
    content: `Welcome to the Portfolio OS file system!\n\nFeel free to create your own notes or rearrange files. Changes stay in your browser using IndexedDB so you can safely explore without affecting the live site.`,
    meta: { openWith: 'notes' },
  },
  {
    path: '/Documents/Notes/Ideas.txt',
    type: 'file',
    content: '• Polish the Portfolio OS experience\n• Add keyboard shortcuts\n• Integrate contact form API',
    meta: { openWith: 'notes' },
  },
  {
    path: '/Desktop/Read Me.txt',
    type: 'file',
    content: 'Double-click to open in Notes. Drag files from the explorer onto the desktop to create shortcuts.',
    meta: { openWith: 'notes' },
  },
  {
    path: '/Desktop/Resume.link',
    type: 'file',
    content: '',
    meta: { openWith: 'app', appId: 'resume', description: 'Launches the Resume viewer app.' },
  },
  {
    path: '/Projects/Portfolio.md',
    type: 'file',
    content: '# Portfolio OS\n\nBuilt with vanilla JavaScript, IndexedDB persistence, and a custom window manager.',
    meta: { openWith: 'notes' },
  },
];

const changeEvent = (detail) =>
  typeof window !== 'undefined' && window.dispatchEvent
    ? window.dispatchEvent(new CustomEvent('fs-changed', { detail }))
    : undefined;

const normalizePath = (path) => {
  if (!path) return '/';
  let normalized = String(path).trim().replace(/\\/g, '/');
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  normalized = normalized.replace(/\/+/g, '/');
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || '/';
};

const ensureDirPath = (path) => {
  const norm = normalizePath(path);
  return norm === '/' ? '/' : norm.replace(/\/+$/, '');
};

const ensureFilePath = (path) => {
  const norm = normalizePath(path);
  return norm === '/' ? '/untitled' : norm;
};

const parentOf = (path) => {
  if (path === '/' || !path) return '/';
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return parts.length ? `/${parts.join('/')}` : '/';
};

const nameOf = (path) => {
  if (path === '/' || !path) return '/';
  const parts = path.split('/').filter(Boolean);
  return parts.pop() || '/';
};

const joinPath = (dir, name) => {
  const base = dir === '/' ? '' : dir;
  return normalizePath(`${base}/${name}`);
};

const splitName = (name) => {
  const idx = name.lastIndexOf('.');
  if (idx <= 0) return [name, ''];
  return [name.slice(0, idx), name.slice(idx)];
};

const getDb = async () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'path' });
        store.createIndex('by_parent', 'parent', { unique: false });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
};

const runTx = (mode, fn) =>
  getDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        let result;
        Promise.resolve(fn(store, tx))
          .then((value) => {
            result = value;
          })
          .catch((err) => {
            try {
              tx.abort();
            } catch (abortErr) {
              console.error(abortErr); // eslint-disable-line no-console
            }
            reject(err);
          });
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      })
  );

const getAllEntries = async () =>
  runTx('readonly', (store) =>
    new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    })
  );

const getEntry = async (path) => {
  const normalized = normalizePath(path);
  return runTx('readonly', (store) =>
    new Promise((resolve, reject) => {
      const req = store.get(normalized);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    })
  );
};

const putEntry = async (entry) =>
  runTx('readwrite', (store) =>
    new Promise((resolve, reject) => {
      const req = store.put(entry);
      req.onsuccess = () => resolve(entry);
      req.onerror = () => reject(req.error);
    })
  );

const deleteEntry = async (path) =>
  runTx('readwrite', (store) =>
    new Promise((resolve, reject) => {
      const req = store.delete(path);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    })
  );

const ensureDefaults = async () => {
  const db = await getDb();
  const count = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.count();
    req.onsuccess = () => resolve(req.result || 0);
    req.onerror = () => reject(req.error);
  });
  if (count > 0) return;
  const now = Date.now();
  const seeded = DEFAULT_ENTRIES.map((entry, idx) => {
    const normalizedPath =
      entry.type === 'folder' ? ensureDirPath(entry.path) : ensureFilePath(entry.path);
    return {
      ...entry,
      path: normalizedPath,
      parent: parentOf(normalizedPath),
      name: nameOf(normalizedPath),
      createdAt: now + idx,
      updatedAt: now + idx,
    };
  });
  await runTx('readwrite', (store) => {
    seeded.forEach((entry) => store.put(entry));
  });
};

const cleanEntry = (entry) => {
  if (!entry) return null;
  return {
    path: entry.path,
    name: entry.name,
    type: entry.type,
    meta: entry.meta || {},
    content: entry.content,
  };
};

const ensureDirExists = async (dir) => {
  const normalized = ensureDirPath(dir);
  if (normalized === '/') return;
  const existing = await getEntry(normalized);
  if (existing) {
    if (existing.type !== 'folder') throw new Error('Path exists and is not a folder');
    return;
  }
  await ensureDirExists(parentOf(normalized));
  const now = Date.now();
  await putEntry({
    path: normalized,
    parent: parentOf(normalized),
    name: nameOf(normalized),
    type: 'folder',
    content: '',
    meta: {},
    createdAt: now,
    updatedAt: now,
  });
};

export const initFileSystem = async () => {
  await ensureDefaults();
};

export const stat = async (path) => cleanEntry(await getEntry(path));

export const listDir = async (path = '/') => {
  const dir = ensureDirPath(path);
  await ensureDefaults();
  const db = await getDb();
  const entries = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const index = store.index('by_parent');
    const req = index.getAll(dir);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
  const normalized = entries
    .map((entry) => ({ ...entry, path: entry.path, name: entry.name, type: entry.type }))
    .sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    })
    .map(cleanEntry);
  return {
    path: dir,
    entries: normalized,
    folders: normalized.filter((entry) => entry.type === 'folder'),
    files: normalized.filter((entry) => entry.type === 'file'),
  };
};

export const readFile = async (path) => {
  const entry = await getEntry(path);
  if (!entry) throw new Error('File not found');
  if (entry.type !== 'file') throw new Error('Not a file');
  return entry.content || '';
};

const prepareEntry = async (path, options = {}) => {
  const type = options.type || 'file';
  const normalized = type === 'folder' ? ensureDirPath(path) : ensureFilePath(path);
  const parent = parentOf(normalized);
  if (parent) await ensureDirExists(parent);
  const existing = await getEntry(normalized);
  if (existing && options.overwrite === false) {
    throw new Error('File exists');
  }
  const now = Date.now();
  return {
    path: normalized,
    parent,
    name: nameOf(normalized),
    type,
    content: type === 'folder' ? '' : options.content ?? '',
    meta: options.meta ?? existing?.meta ?? {},
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
};

export const writeFile = async (path, contentOrOptions = '', maybeOptions = {}) => {
  const isString = typeof contentOrOptions === 'string';
  const options = isString ? { ...maybeOptions, content: contentOrOptions } : { ...contentOrOptions };
  const entry = await prepareEntry(path, options);
  await putEntry(entry);
  changeEvent({ path: entry.path, action: 'write', parent: entry.parent });
  return cleanEntry(entry);
};

const deleteRecursive = async (path) => {
  const entry = await getEntry(path);
  if (!entry) return;
  if (entry.type === 'folder') {
    const { entries } = await listDir(path);
    for (const child of entries) {
      await deleteRecursive(child.path);
    }
  }
  await deleteEntry(entry.path);
};

export const deleteFile = async (path) => {
  const entry = await getEntry(path);
  if (!entry) return false;
  await deleteRecursive(entry.path);
  changeEvent({ path: entry.path, action: 'delete', parent: entry.parent });
  return true;
};

const uniquePath = (dir, name, allEntries, ignore = new Set()) => {
  const [base, ext] = splitName(name);
  let index = 1;
  let candidate = name;
  while (allEntries.some((entry) => entry.path === joinPath(dir, candidate)) && !ignore.has(joinPath(dir, candidate))) {
    candidate = `${base} (${index++})${ext}`;
  }
  return joinPath(dir, candidate);
};

export const moveFile = async (from, to) => {
  const allEntries = await getAllEntries();
  const map = new Map(allEntries.map((entry) => [entry.path, entry]));
  const sourcePath = normalizePath(from);
  const entry = map.get(sourcePath);
  if (!entry) throw new Error('Path not found');
  const sourceParent = parentOf(sourcePath);
  const toEntry = map.get(normalizePath(to));
  let targetPath;
  if (toEntry && toEntry.type === 'folder') {
    targetPath = joinPath(toEntry.path, entry.name);
  } else {
    targetPath = entry.type === 'folder' ? ensureDirPath(to) : ensureFilePath(to);
  }
  if (targetPath === sourcePath) return cleanEntry(entry);
  const targetParent = parentOf(targetPath);
  await ensureDirExists(targetParent);
  const ignore = new Set();
  if (entry.type === 'folder') {
    ignore.add(targetPath);
    for (const node of allEntries) {
      if (node.path.startsWith(`${sourcePath}/`)) {
        ignore.add(targetPath + node.path.slice(sourcePath.length));
      }
    }
  }
  if (map.has(targetPath) && !ignore.has(targetPath)) {
    targetPath = uniquePath(targetParent, nameOf(targetPath), allEntries, ignore);
  }
  const updates = [];
  const now = Date.now();
  if (entry.type === 'folder') {
    for (const node of allEntries) {
      if (node.path === sourcePath || node.path.startsWith(`${sourcePath}/`)) {
        const suffix = node.path.slice(sourcePath.length);
        const nextPath = targetPath + suffix;
        updates.push({
          ...node,
          path: nextPath,
          parent: parentOf(nextPath),
          name: nameOf(nextPath),
          updatedAt: now,
        });
      }
    }
  } else {
    updates.push({
      ...entry,
      path: targetPath,
      parent: parentOf(targetPath),
      name: nameOf(targetPath),
      updatedAt: now,
    });
  }
  await runTx('readwrite', (store) => {
    if (entry.type === 'folder') {
      for (const node of allEntries) {
        if (node.path === sourcePath || node.path.startsWith(`${sourcePath}/`)) {
          store.delete(node.path);
        }
      }
    } else {
      store.delete(sourcePath);
    }
    updates.forEach((node) => store.put(node));
  });
  changeEvent({ path: targetPath, action: 'move', parent: targetParent });
  if (sourceParent !== targetParent) {
    changeEvent({ path: sourcePath, action: 'move-out', parent: sourceParent });
  }
  return cleanEntry(updates[0]);
};

export const restoreDefaults = async () => {
  await runTx('readwrite', (store) => store.clear());
  dbPromise = null;
  await initFileSystem();
  changeEvent({ path: '/', action: 'restore' });
};

export const DesktopDir = '/Desktop';
export const NotesDir = '/Documents/Notes';
