const themeOrder = ['dark', 'light', 'terminal'];

export const applyTheme = (theme) => {
  const next = themeOrder.includes(theme) ? theme : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  return next;
};

const normalizeWallpaper = (wallpaper) => {
  if (!wallpaper) return null;
  if (typeof wallpaper === 'string') return { css: wallpaper };
  if (typeof wallpaper === 'object') return { ...wallpaper };
  return null;
};

export const applyWallpaper = (input) => {
  const data = normalizeWallpaper(input);
  const style = document.documentElement.style;
  if (data?.css) style.setProperty('--wallpaper', data.css);
  if (!data?.css) style.removeProperty('--wallpaper');
  if (data?.size) style.setProperty('--wallpaper-size', data.size);
  else style.removeProperty('--wallpaper-size');
  if (data?.animation) style.setProperty('--wallpaper-animation', data.animation);
  else style.removeProperty('--wallpaper-animation');
  if (data?.position) style.setProperty('--wallpaper-position', data.position);
  else style.removeProperty('--wallpaper-position');
  if (data?.id) document.documentElement.setAttribute('data-wallpaper', data.id);
  else document.documentElement.removeAttribute('data-wallpaper');
  return data;
};

export function initTheme({ themeToggle } = {}) {
  const prefersLight = matchMedia('(prefers-color-scheme: light)').matches;
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = applyTheme(storedTheme || (prefersLight ? 'light' : 'dark'));
  if (!storedTheme) localStorage.setItem('theme', initialTheme);

  const savedWallpaper = localStorage.getItem('wallpaper');
  if (savedWallpaper) {
    try {
      applyWallpaper(JSON.parse(savedWallpaper));
    } catch (err) {
      applyWallpaper(savedWallpaper);
    }
  }

  const setTheme = (theme) => {
    const next = applyTheme(theme);
    localStorage.setItem('theme', next);
  };
  const setWallpaper = (wallpaper) => {
    const data = applyWallpaper(wallpaper);
    if (data) {
      localStorage.setItem('wallpaper', JSON.stringify(data));
    } else {
      localStorage.removeItem('wallpaper');
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const idx = themeOrder.indexOf(current);
      const next = themeOrder[(idx + 1) % themeOrder.length];
      setTheme(next);
    });
  }

  window.addEventListener('set-theme', (e) => {
    const t = e.detail?.theme;
    if (t) setTheme(t);
  });

  window.addEventListener('set-wallpaper', (e) => {
    const detail = e.detail || {};
    if (detail.wallpaper) {
      setWallpaper(detail.wallpaper);
    } else if (detail.css || detail.size || detail.animation || detail.id) {
      setWallpaper(detail);
    }
  });

  return { setTheme, setWallpaper };
}
