(() => {
  'use strict';

  const legacyAnchors = new Map([
    ['conteudo', 'main-content'],
    ['destaques', 'featured'],
    ['projetos', 'catalog'],
    ['sobre', 'about'],
    ['midia', 'media'],
    ['o-que-ele-faz', 'overview'],
    ['mecanicas', 'mechanics'],
    ['recursos', 'features'],
    ['instalacao', 'install'],
    ['como-jogar', 'how-to-play'],
    ['perguntas', 'faq'],
    ['contato', 'contact']
  ]);

  function restoreLegacyAnchor() {
    const id = legacyAnchors.get(location.hash.slice(1));
    if (!id) return;
    const section = document.getElementById(id);
    if (!section) return;

    history.replaceState(history.state, '', `#${id}`);
    section.scrollIntoView();
  }

  restoreLegacyAnchor();
  window.addEventListener('hashchange', restoreLegacyAnchor);
})();

(() => {
  'use strict';

  const menu = document.querySelector('.mobile-menu');
  if (!menu) return;

  menu.addEventListener('click', event => {
    if (event.target.closest('a')) menu.open = false;
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary').focus();
  });
})();

(() => {
  'use strict';

  const scrolling = document.scrollingElement;
  if (!scrolling) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  let destination = 0;
  let previousTime;
  let lastPreciseWheel = -Infinity;

  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = undefined;
  }

  function advance(time) {
    destination = Math.min(destination, scrolling.scrollHeight - scrolling.clientHeight);
    const current = scrolling.scrollTop;
    const remaining = destination - current;
    if (Math.abs(remaining) <= 1) {
      scrolling.scrollTo({ top: destination, behavior: 'instant' });
      stop();
      return;
    }

    const elapsed = Math.min(32, time - (previousTime ?? time - 16));
    const fraction = 1 - Math.exp(-elapsed / 62);
    const step = Math.sign(remaining) * Math.max(1, Math.abs(remaining) * fraction);
    scrolling.scrollTo({ top: current + step, behavior: 'instant' });
    previousTime = time;
    frame = requestAnimationFrame(advance);
  }

  function hasScrollableParent(target) {
    for (let element = target; element && element !== document.body; element = element.parentElement) {
      if (element === scrolling) break;
      if (element.scrollHeight > element.clientHeight + 1 && /^(auto|scroll)$/.test(getComputedStyle(element).overflowY)) return true;
    }
    return false;
  }

  window.addEventListener('wheel', event => {
    const mode = event.deltaMode;
    const amount = event.deltaY;
    const target = event.target instanceof Element ? event.target : null;
    const precise = mode === WheelEvent.DOM_DELTA_PIXEL && (Math.abs(amount) < 60 || !Number.isInteger(amount) || event.deltaX !== 0);
    if (precise) lastPreciseWheel = event.timeStamp;

    // Let precision gestures keep their native momentum even as their deltas grow.
    const precisionGesture = mode === WheelEvent.DOM_DELTA_PIXEL && event.timeStamp - lastPreciseWheel < 160;
    const modified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
    if (motion.matches || !event.cancelable || event.defaultPrevented || event.deltaX || !amount || modified || precisionGesture
      || target?.closest('input, textarea, select, [contenteditable]') || hasScrollableParent(target)) {
      stop();
      return;
    }

    const unit = mode === WheelEvent.DOM_DELTA_LINE ? 16 : (mode === WheelEvent.DOM_DELTA_PAGE ? scrolling.clientHeight : 1);
    const current = scrolling.scrollTop;
    const sameDirection = Math.sign(destination - current) === Math.sign(amount);
    const start = frame !== null && sameDirection ? destination : current;
    destination = Math.min(scrolling.scrollHeight - scrolling.clientHeight, Math.max(0, start + amount * unit));
    if (destination === current) {
      stop();
      return;
    }

    event.preventDefault();
    if (frame === null) frame = requestAnimationFrame(advance);
  }, { passive: false });

  window.addEventListener('pointerdown', stop, { passive: true });
  window.addEventListener('keydown', stop);
  motion.addEventListener('change', stop);
})();
