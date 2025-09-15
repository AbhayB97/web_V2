import { describe, it, beforeEach, expect } from 'vitest';
import { applyTheme, applyWallpaper, initTheme } from '../src/theme.js';

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.removeProperty('--wallpaper');
  localStorage.clear();
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, addListener: () => {}, removeListener: () => {} }));
});

describe('theme helpers', () => {
  it('applyTheme sets attribute', () => {
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('applyWallpaper sets css variable', () => {
    applyWallpaper('foo');
    expect(document.documentElement.style.getPropertyValue('--wallpaper')).toBe('foo');
  });

  it('initTheme loads saved prefs and toggles theme', () => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('wallpaper', 'bar');
    const btn = document.createElement('button');
    initTheme({ themeToggle: btn });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.style.getPropertyValue('--wallpaper')).toBe('bar');
    btn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('responds to set-theme and set-wallpaper events', () => {
    initTheme();
    window.dispatchEvent(new CustomEvent('set-theme', { detail: { theme: 'light' } }));
    expect(localStorage.getItem('theme')).toBe('light');
    window.dispatchEvent(new CustomEvent('set-wallpaper', { detail: { css: 'baz' } }));
    expect(localStorage.getItem('wallpaper')).toBe('baz');
  });
});
