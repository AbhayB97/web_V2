export const applyTheme = (t) => {
  document.documentElement.setAttribute('data-theme', t);
};

export const applyWallpaper = (css) => {
  document.documentElement.style.setProperty('--wallpaper', css);
};

export function initTheme({ themeToggle } = {}) {
  const savedTheme =
    localStorage.getItem('theme') ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(savedTheme);
  const savedWallpaper = localStorage.getItem('wallpaper');
  if (savedWallpaper) applyWallpaper(savedWallpaper);

  const setTheme = (t) => {
    applyTheme(t);
    localStorage.setItem('theme', t);
  };
  const setWallpaper = (css) => {
    applyWallpaper(css);
    localStorage.setItem('wallpaper', css);
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next =
        document.documentElement.getAttribute('data-theme') === 'light'
          ? 'dark'
          : 'light';
      setTheme(next);
    });
  }

  window.addEventListener('set-theme', (e) => {
    const t = e.detail?.theme;
    if (t) setTheme(t);
  });

  window.addEventListener('set-wallpaper', (e) => {
    const css = e.detail?.css;
    if (css) setWallpaper(css);
  });

  return { setTheme, setWallpaper };
}
