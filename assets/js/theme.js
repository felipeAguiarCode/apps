(() => {
  'use strict';

  const root = document.documentElement;
  const storageKey = 'portfolio-theme';
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const colors = { dark: '#101016', light: '#ffffff' };
  const labels = { dark: 'Ativar tema claro', light: 'Ativar tema escuro' };

  function readTheme() {
    try {
      return localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
    } catch {
      return root.dataset.theme ?? 'dark';
    }
  }

  function renderTheme(theme) {
    root.dataset.theme = theme;
    themeColor.content = colors[theme];
  }

  renderTheme(readTheme());

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let switching = false;

    function updateButton(theme) {
      toggle.setAttribute('aria-label', labels[theme]);
      toggle.title = labels[theme];
    }

    function applyTheme(theme) {
      renderTheme(theme);
      updateButton(theme);
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        // Keep the selected theme for this page even without storage.
      }
    }

    updateButton(root.dataset.theme);
    toggle.hidden = false;
    window.addEventListener('pageshow', event => {
      if (!event.persisted) return;
      const theme = readTheme();
      renderTheme(theme);
      updateButton(theme);
    });
    toggle.addEventListener('click', async () => {
      if (switching) return;
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (motion.matches || !document.startViewTransition) {
        applyTheme(nextTheme);
        return;
      }

      const box = toggle.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

      switching = true;
      root.classList.add('theme-switching');
      try {
        const transition = document.startViewTransition(() => applyTheme(nextTheme));
        await transition.ready;
        root.animate({
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
        }, {
          duration: 800,
          easing: 'ease-in-out',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)'
        });
        await transition.finished;
      } catch {
        applyTheme(nextTheme);
      } finally {
        root.classList.remove('theme-switching');
        switching = false;
      }
    });
  }, { once: true });
})();
