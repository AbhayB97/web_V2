export function createProcessStore() {
  const saved = JSON.parse(localStorage.getItem('procs') || '[]');
  let procs = Array.isArray(saved) ? saved : [];

  const persist = () => localStorage.setItem('procs', JSON.stringify(procs));

  const launch = (proc) => {
    procs = [...procs, proc];
    persist();
  };

  const update = (id, data) => {
    procs = procs.map((p) => (p.id === id ? { ...p, ...data } : p));
    persist();
  };

  const close = (id) => {
    procs = procs.filter((p) => p.id !== id);
    persist();
  };

  const toggleMin = (id) => {
    const p = procs.find((p) => p.id === id);
    if (p) update(id, { minimized: !p.minimized });
  };

  const moveResize = (id, rect) => update(id, rect);
  const focus = (id) => update(id, { lastFocus: Date.now() });

  const getAll = () => procs;

  return { launch, update, close, toggleMin, moveResize, focus, getAll };
}
