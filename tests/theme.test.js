import { describe, it, beforeEach, expect } from 'vitest';
import { applyTheme, applyWallpaper, initTheme } from '../src/theme.js';

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-wallpaper');
  const style = document.documentElement.style;
  style.removeProperty('--wallpaper');
  style.removeProperty('--wallpaper-size');
  style.removeProperty('--wallpaper-animation');
  style.removeProperty('--wallpaper-position');
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
    applyWallpaper({ id: 'gridwave', css: 'foo', size: '120%', animation: 'spin 1s' });
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--wallpaper')).toBe('foo');
    expect(style.getPropertyValue('--wallpaper-size')).toBe('120%');
    expect(style.getPropertyValue('--wallpaper-animation')).toBe('spin 1s');
    expect(document.documentElement.getAttribute('data-wallpaper')).toBe('gridwave');
  });

  it('initTheme loads saved prefs and toggles theme', () => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('wallpaper', JSON.stringify({ id: 'nebula', css: 'bar', size: '200%' }));
    const btn = document.createElement('button');
    initTheme({ themeToggle: btn });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-wallpaper')).toBe('nebula');
    expect(document.documentElement.style.getPropertyValue('--wallpaper')).toBe('bar');
    btn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('terminal');
    btn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('responds to set-theme and set-wallpaper events', () => {
    initTheme();
    window.dispatchEvent(new CustomEvent('set-theme', { detail: { theme: 'light' } }));
    expect(localStorage.getItem('theme')).toBe('light');
    window.dispatchEvent(
      new CustomEvent('set-wallpaper', {
        detail: { wallpaper: { id: 'gridwave', css: 'baz', size: '180%' } },
      })
    );
    const stored = JSON.parse(localStorage.getItem('wallpaper'));
    expect(stored.id).toBe('gridwave');
    expect(stored.css).toBe('baz');
    expect(stored.size).toBe('180%');
  });
});
