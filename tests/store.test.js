import { createProcessStore } from '../src/store.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('process store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('launches and closes processes', () => {
    const s = createProcessStore();
    s.launch({ id: 'about' });
    expect(s.getAll().length).toBe(1);
    s.close('about');
    expect(s.getAll().length).toBe(0);
  });

  it('toggles minimize and moves', () => {
    const s = createProcessStore();
    s.launch({ id: 'app', minimized: false, left: 0 });
    s.toggleMin('app');
    expect(s.getAll()[0].minimized).toBe(true);
    s.moveResize('app', { left: 100 });
    expect(s.getAll()[0].left).toBe(100);
  });
});
