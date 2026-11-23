(() => {
  'use strict';

  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const stage = gallery.querySelector('[data-stage]');
  const media = gallery.querySelector('[data-media]');
  const caption = gallery.querySelector('[data-caption]');
  const strip = gallery.querySelector('[data-thumbs]');
  const thumbs = [...strip.querySelectorAll('button')];
  const expand = gallery.querySelector('[data-expand]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;

  function select(index) {
    const nextIndex = (index + thumbs.length) % thumbs.length;
    if (activeIndex === nextIndex) return;

    media.querySelector('video')?.pause();
    thumbs[activeIndex].setAttribute('aria-pressed', 'false');
    activeIndex = nextIndex;

    const thumb = thumbs[activeIndex];
    const label = thumb.getAttribute('aria-label');
    const { video, image } = thumb.dataset;
    const element = document.createElement(video ? 'video' : 'img');

    if (video) {
      element.poster = image;
      element.controls = true;
      element.autoplay = true;
      element.defaultMuted = true;
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.preload = 'metadata';
      element.setAttribute('aria-label', label);
      element.src = video;
    } else {
      element.src = image;
      element.alt = label;
    }

    media.replaceChildren(element);
    thumb.setAttribute('aria-pressed', 'true');
    caption.textContent = label;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  }

  gallery.querySelectorAll('[data-step]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => select(activeIndex + Number(button.dataset.step)));
  });

  strip.hidden = false;
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => select(index)));
  strip.addEventListener('keydown', event => {
    const index = thumbs.indexOf(event.target);
    if (index < 0) return;

    let nextIndex;
    switch (event.key) {
      case 'ArrowLeft': nextIndex = (index - 1 + thumbs.length) % thumbs.length; break;
      case 'ArrowRight': nextIndex = (index + 1) % thumbs.length; break;
      case 'Home': nextIndex = 0; break;
      case 'End': nextIndex = thumbs.length - 1; break;
      default: return;
    }

    event.preventDefault();
    thumbs[nextIndex].focus({ preventScroll: true });
    select(nextIndex);
  });

  if (document.fullscreenEnabled && stage.requestFullscreen) {
    expand.hidden = false;
    expand.addEventListener('click', () => stage.requestFullscreen().catch(() => {}));
  }

  window.addEventListener('pagehide', () => media.querySelector('video')?.pause());
})();
