import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import WindowManager from '../src/windowManager.js';

describe('WindowManager', () => {
  let desktop;
  let taskbar;
  let originalRandom;
  beforeEach(() => {
    desktop = document.createElement('div');
    taskbar = document.createElement('div');
    originalRandom = Math.random;
    Math.random = () => 0;
  });

  afterEach(() => {
    Math.random = originalRandom;
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

  it('snaps windows to a 12px grid when dragging stops', () => {
    const wm = new WindowManager({ desktopEl: desktop, taskbarAppsEl: taskbar });
    const win = wm.createWindow({ id: 'snap', title: 'Snap', icon: 'S', content: '' });
    const titlebar = win.querySelector('.titlebar');
    const rect = win.getBoundingClientRect();
    titlebar.dispatchEvent(
      new MouseEvent('mousedown', { button: 0, clientX: rect.left + 20, clientY: rect.top + 10 })
    );
    window.dispatchEvent(
      new MouseEvent('mousemove', { clientX: rect.left + 110, clientY: rect.top + 130 })
    );
    window.dispatchEvent(new MouseEvent('mouseup'));
    const left = parseInt(win.style.left, 10);
    const top = parseInt(win.style.top, 10);
    expect(left % 12).toBe(0);
    expect(top % 12).toBe(0);
  });

  it('cycles focus order when cycleWindows is called', () => {
    const wm = new WindowManager({ desktopEl: desktop, taskbarAppsEl: taskbar });
    const w1 = wm.createWindow({ id: 'first', title: 'First', icon: 'F', content: '' });
    const w2 = wm.createWindow({ id: 'second', title: 'Second', icon: 'S', content: '' });
    expect(w2.classList.contains('active')).toBe(true);
    wm.cycleWindows(true);
    expect(w1.classList.contains('active')).toBe(true);
    expect(w2.classList.contains('active')).toBe(false);
    w2.style.display = 'none';
    wm.cycleWindows(true);
    expect(w2.style.display).toBe('grid');
    expect(w2.classList.contains('active')).toBe(true);
  });
});
