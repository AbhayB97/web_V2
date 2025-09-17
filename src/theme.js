// Theme + Wallpaper utilities

const themeOrder = ['dark', 'light', 'terminal'];

export const applyTheme = (theme) => {
  const next = themeOrder.includes(theme) ? theme : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  return next;
};

const normalizeWallpaper = (wallpaper) => {
  // Accept string (css), object ({ css, size, position, animation, id }), or null
  if (!wallpaper) return null;
  if (typeof wallpaper === 'string') return { css: wallpaper };
  if (typeof wallpaper === 'object') return { ...wallpaper };
  return null;
};

export const applyWallpaper = (input) => {
  const data = normalizeWallpaper(input);
  const style = document.documentElement.style;

  if (data?.css) style.setProperty('--wallpaper', data.css);
  else style.removeProperty('--wallpaper');

  if (data?.size) style.setProperty('--wallpaper-size', data.size);
  else style.removeProperty('--wallpaper-size');

  if (data?.position) style.setProperty('--wallpaper-position', data.position);
  else style.removeProperty('--wallpaper-position');

  if (data?.animation) style.setProperty('--wallpaper-animation', data.animation);
  else style.removeProperty('--wallpaper-animation');

  if (data?.id) document.documentElement.setAttribute('data-wallpaper', data.id);
  else document.documentElement.removeAttribute('data-wallpaper');

  return data;
};

export function initTheme({ themeToggle } = {}) {
  // Theme: prefer stored, else system
  const prefersLight = matchMedia('(prefers-color-scheme: light)').matches;
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = applyTheme(storedTheme || (prefersLight ? 'light' : 'dark'));
  if (!storedTheme) localStorage.setItem('theme', initialTheme);

  // Wallpaper: support old (string) and new (JSON) formats
  const savedWallpaper = localStorage.getItem('wallpaper');
  if (savedWallpaper) {
    try {
      applyWallpaper(JSON.parse(savedWallpaper));
    } catch {
      // was a plain css string
      applyWallpaper(savedWallpaper);
    }
  }

  const setTheme = (theme) => {
    const next = applyTheme(theme);
    localStorage.setItem('theme', next);
  };

  const setWallpaper = (wallpaper) => {
    const data = applyWallpaper(wallpaper);
    if (data) localStorage.setItem('wallpaper', JSON.stringify(data));
    else localStorage.removeItem('wallpaper');
  };

  // Toggle cycles through dark → light → terminal
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const idx = themeOrder.indexOf(current);
      const next = themeOrder[(idx + 1) % themeOrder.length];
      setTheme(next);
    });
  }

  // Programmatic events
  window.addEventListener('set-theme', (e) => {
    const t = e.detail?.theme;
    if (t) setTheme(t);
  });

  window.addEventListener('set-wallpaper', (e) => {
    // Back-compat:
    // - old: { css: '...' }
    // - new: { wallpaper: <string|object> } OR direct object with css/size/animation/position/id
    const detail = e.detail || {};
    if (detail.wallpaper !== undefined) {
      setWallpaper(detail.wallpaper);
    } else if (
      detail.css ||
      detail.size ||
      detail.position ||
      detail.animation ||
      detail.id
    ) {
      setWallpaper(detail);
    }
  });

  return { setTheme, setWallpaper };
}
