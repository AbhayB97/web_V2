import { describe, it, expect, beforeEach } from 'vitest';
import WindowManager from '../src/windowManager.js';

describe('WindowManager', () => {
  let desktop;
  let taskbar;
  beforeEach(() => {
    desktop = document.createElement('div');
    taskbar = document.createElement('div');
  });

  it('creates a new window and reuses existing ones', () => {
    const wm = new WindowManager({ desktopEl: desktop, taskbarAppsEl: taskbar });
    const w1 = wm.createWindow({ id: 'about', title: 'About', icon: '🙂', content: () => document.createElement('div') });
    expect(desktop.querySelectorAll('.window').length).toBe(1);
    const w2 = wm.createWindow({ id: 'about', title: 'About', icon: '🙂', content: () => document.createElement('div') });
    expect(desktop.querySelectorAll('.window').length).toBe(1);
    expect(w2).toBe(w1);
  });

  it('brings window to front and deactivates others', () => {
    const wm = new WindowManager({ desktopEl: desktop, taskbarAppsEl: taskbar });
    const w1 = wm.createWindow({ id: 'a', title: 'A', icon: 'A', content: '' });
    const w2 = wm.createWindow({ id: 'b', title: 'B', icon: 'B', content: '' });
    wm.bringToFront(w1);
    expect(w1.classList.contains('active')).toBe(true);
    expect(w2.classList.contains('active')).toBe(false);
    expect(Number(w1.style.zIndex)).toBeGreaterThan(Number(w2.style.zIndex));
  });
});
