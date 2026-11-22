(() => {
  'use strict';

  const stories = document.querySelector('[data-stories]');
  if (!stories) return;

  const controls = stories.querySelector('.story-controls');
  const toggle = controls.querySelector('.story-toggle');
  const slides = [...stories.querySelectorAll('[data-story]')];
  const buttons = [...controls.querySelectorAll('[data-story-button]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let timer;
  let paused = motion.matches;
  let inView = true;

  function select(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      const selected = position === active;
      slide.classList.toggle('is-current', selected);
      slide.inert = !selected;
      buttons[position].setAttribute('aria-pressed', String(selected));
    });
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    toggle.dataset.paused = String(paused);
    toggle.setAttribute('aria-label', paused ? 'Retomar rotação dos banners' : 'Pausar rotação dos banners');

    const focusedLink = slides[active].contains(document.activeElement);
    if (paused || focusedLink || !inView || document.hidden) return;

    timer = setTimeout(() => select(active + 1), Number(slides[active].dataset.duration));
  }

  stories.querySelectorAll('[data-story-step]').forEach(arrow => {
    arrow.hidden = false;
    arrow.addEventListener('click', () => select(active + Number(arrow.dataset.storyStep)));
  });
  buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
  toggle.addEventListener('click', () => {
    paused = !paused;
    schedule();
  });
  stories.addEventListener('focusin', schedule);
  stories.addEventListener('focusout', () => queueMicrotask(schedule));
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => {
    paused = motion.matches;
    schedule();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      schedule();
    }, { threshold: .25 }).observe(stories);
  }

  controls.hidden = false;
  select(0);
})();

const appCatalog = document.querySelector('[data-catalog]');
if (appCatalog) {
  const filters = appCatalog.querySelector('.catalog-filters');
  const options = [...filters.querySelectorAll('[data-filter]')];
  const cards = appCatalog.querySelectorAll('[data-category]');
  const count = appCatalog.querySelector('[data-catalog-count]');
  const empty = appCatalog.querySelector('[data-catalog-empty]');
  const searchForm = appCatalog.querySelector('.catalog-search');
  const searchInput = searchForm.elements.q;
  const headerInput = document.querySelector('.site-search input');
  const summary = appCatalog.querySelector('[data-catalog-query]');
  const queryLabel = summary.querySelector('span');
  const params = new URLSearchParams(location.search);
  const normalize = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR');
  let activeOption = options[0];

  function filterApps(option = activeOption) {
    activeOption = option;
    const category = option.dataset.filter;
    const query = searchInput.value.trim();
    const terms = query ? normalize(query).split(/\s+/) : [];
    const matchesByCategory = new Map();
    let total = 0;
    let visible = 0;
    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const searchText = normalize(card.dataset.searchText);
      const matches = terms.every(term => searchText.includes(term));
      if (matches) {
        total++;
        matchesByCategory.set(cardCategory, (matchesByCategory.get(cardCategory) ?? 0) + 1);
      }
      card.hidden = !matches || (category !== 'all' && category !== cardCategory);
      if (!card.hidden) visible++;
    });
    options.forEach(button => {
      const filter = button.dataset.filter;
      button.setAttribute('aria-pressed', String(button === option));
      button.querySelector('[data-tab-count]').textContent = filter === 'all' ? total : (matchesByCategory.get(filter) ?? 0);
    });
    count.textContent = `${visible} ${visible === 1 ? 'app' : 'apps'}`;
    headerInput.value = query;
    queryLabel.textContent = query;
    summary.hidden = !query;
    empty.hidden = visible > 0;
  }

  options.forEach(button => button.addEventListener('click', () => filterApps(button)));
  searchInput.addEventListener('input', () => filterApps());
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    filterApps();
  });
  summary.querySelector('a').addEventListener('click', event => {
    if (params.has('q')) return;
    event.preventDefault();
    searchInput.value = '';
    filterApps();
    searchInput.focus();
  });
  searchInput.value = (params.get('q') || '').trim();
  filterApps();
  filters.hidden = false;
}

document.querySelectorAll('[data-card-preview]').forEach(preview => {
  'use strict';

  const frames = [...preview.querySelectorAll('.preview-image')];
  const video = preview.querySelector('video');
  const toggle = preview.querySelector('.preview-toggle');
  const name = toggle.dataset.previewName;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let visible = !('IntersectionObserver' in window);
  let hovered = false;
  let manual = false;
  let playing = false;
  let timer;

  function nextFrame() {
    const next = (current + 1) % frames.length;
    if (!frames[next].complete || !frames[next].naturalWidth) return;

    frames[current].classList.remove('is-current');
    frames[next].classList.add('is-current');
    current = next;
  }

  function syncPreview() {
    const onScreen = visible && !document.hidden;
    const requested = onScreen && (hovered || manual);
    clearInterval(timer);
    if (onScreen && !requested && !motion.matches) timer = setInterval(nextFrame, 3000);
    if (playing === requested) return;

    playing = requested;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', `${playing ? 'Pausar' : 'Reproduzir'} prévia de ${name}`);

    if (playing) {
      video.muted = true;
      video.play().catch(error => {
        if (!playing || error.name === 'AbortError') return;
        hovered = false;
        manual = false;
        syncPreview();
      });
    } else {
      video.pause();
      preview.classList.remove('is-playing');
      if (video.readyState) video.currentTime = 0;
    }
  }

  video.addEventListener('playing', () => {
    if (playing) preview.classList.add('is-playing');
  });
  preview.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || motion.matches) return;
    hovered = true;
    syncPreview();
  });
  preview.addEventListener('pointerleave', () => {
    hovered = false;
    syncPreview();
  });
  toggle.addEventListener('click', () => {
    manual = !playing;
    if (playing) hovered = false;
    syncPreview();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) hovered = false;
    syncPreview();
  });
  document.addEventListener('visibilitychange', syncPreview);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPreview();
    }, { threshold: .2 }).observe(preview);
  }
  toggle.setAttribute('aria-pressed', 'false');
  toggle.hidden = false;
  syncPreview();
});

document.querySelectorAll('[data-repo-stars]').forEach(async link => {
  try {
    const response = await fetch(link.dataset.repoStars, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return;

    const { stargazers_count: count } = await response.json();
    if (!Number.isInteger(count) || count < 0) return;

    const formatted = count.toLocaleString('pt-BR');
    const label = link.querySelector('[data-star-count]');
    label.textContent = formatted;
    label.hidden = false;
    link.setAttribute('aria-label', formatted + (count === 1 ? ' estrela no GitHub' : ' estrelas no GitHub'));
  } catch {
    // Keep the link available if GitHub is temporarily unreachable.
  }
});

const avatarRing = document.querySelector('[data-avatar-ring]');
if (avatarRing && 'IntersectionObserver' in window) {
  let progress = 0;
  avatarRing.style.setProperty('--avatar-progress', '0turn');

  const revealThreshold = 0.9;
  const thresholds = Array.from({ length: 19 }, (_, index) => index / 20);
  const revealRing = new IntersectionObserver((entries, observer) => {
    const next = Math.min(1, entries.at(-1).intersectionRatio / revealThreshold);
    if (next <= progress) return;

    progress = next;
    avatarRing.style.setProperty('--avatar-progress', `${progress}turn`);
    if (progress === 1) {
      avatarRing.classList.add('is-ring-complete');
      observer.disconnect();
    }
  }, { threshold: thresholds });

  revealRing.observe(avatarRing);
}
