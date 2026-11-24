import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../data/projects.mjs';
import offers from '../settings/offers.js';
import order from '../settings/order.js';
import visibility from '../settings/visibility.js';
import { projectAssets, syncProjectAssets } from './project-assets.mjs';

const {
  HOME_SECTION_ORDER,
  FEATURED_APP_ORDER,
  CATALOG_TAB_ORDER,
  CATALOG_APP_ORDER,
  RECOMMENDED_APP_ORDER,
  OFFER_CARD_ORDER,
  ABOUT_CONTENT_ORDER,
  ABOUT_SOCIAL_ORDER
} = order;
const { HOME_SECTION_VISIBILITY, HIDDEN_CATALOG_APPS } = visibility;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteURL = 'https://felipeaguiarcode.github.io/apps/';
const github = 'https://github.com/felipeAguiarCode';
const projectsById = new Map(projects.map(project => [project.id, project]));
const args = process.argv.slice(2);
const check = args[0] === '--check';
if (args[0] === '--sync' && args.length === 3 && projectsById.has(args[1])) {
  syncProjectAssets(root, projectsById.get(args[1]), path.resolve(args[2]));
} else if (args.length && !(check && args.length === 1)) {
  throw new Error('Usage: node scripts/build-project-pages.mjs [--check | --sync <project-id> <checkout>]');
}
const assets = new Map(projects.map(project => [project, projectAssets(root, project)]));
const dump = projectsById.get('dump');
const ps5 = projectsById.get('ps5');
const gridIcon = '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>';
const personIcon = '<circle cx="12" cy="8" r="3"/><path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/>';
const followIcon = '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M19 8v6m-3-3h6"/>';
const sectionLinks = {
  featured: ['featured', 'Destaques', '<path d="m12 3 2.8 5.7 6.3.9-4.5 4.5 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.5 6.3-.9Z"/>'],
  offers: null,
  catalog: ['catalog', 'Todos os apps', gridIcon],
  recommendations: null,
  about: ['about', 'Sobre mim', personIcon]
};
const tabIds = new Set(CATALOG_TAB_ORDER.map(tab => tab.id));
if (!tabIds.has('all') || tabIds.size !== CATALOG_TAB_ORDER.length) {
  throw new Error('CATALOG_TAB_ORDER must include the all ID and have unique IDs.');
}

function configuredProjects(entries, setting) {
  const seen = new Set();
  return entries.map(({ id, ...settings }) => {
    const project = projectsById.get(id);
    if (!project || seen.has(id)) throw new Error(`Unknown or duplicate project in ${setting}: ${id}`);
    seen.add(id);
    return { project, ...settings };
  });
}

const featuredProjects = configuredProjects(FEATURED_APP_ORDER, 'FEATURED_APP_ORDER');
for (const { project, durationMs } of featuredProjects) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    throw new Error(`Provide a positive duration in milliseconds for featured project ${project.id}.`);
  }
}
const catalogEntries = configuredProjects(CATALOG_APP_ORDER, 'CATALOG_APP_ORDER')
  .filter(({ project }) => !HIDDEN_CATALOG_APPS.includes(project.id));
for (const { project, tab } of catalogEntries) {
  if (tab === 'all' || !tabIds.has(tab)) throw new Error(`Invalid tab for ${project.id} in CATALOG_APP_ORDER: ${tab}`);
}
const visibleProjects = new Set(catalogEntries.map(({ project }) => project));
const recommendedProjects = configuredProjects(RECOMMENDED_APP_ORDER.map(id => ({ id })), 'RECOMMENDED_APP_ORDER')
  .map(({ project }) => project)
  .filter(project => visibleProjects.has(project));
const offerCards = [...new Set(OFFER_CARD_ORDER)].filter(id => {
  if (!Object.hasOwn(offers.cards, id)) throw new Error(`Unknown card in OFFER_CARD_ORDER: ${id}`);
  return offers.cards[id].visible !== false;
});

function isHomeSectionVisible(section, device) {
  const setting = HOME_SECTION_VISIBILITY[section];
  return typeof setting === 'boolean' ? setting : setting?.[device] !== false;
}

function homeVisibilityAttribute(section) {
  const desktop = isHomeSectionVisible(section, 'desktop');
  const mobile = isHomeSectionVisible(section, 'mobile');
  return desktop === mobile ? '' : ` data-home-visibility="${desktop ? 'desktop' : 'mobile'}"`;
}

const homeSections = [...new Set(HOME_SECTION_ORDER)].filter(section => {
  if (!Object.hasOwn(sectionLinks, section)) throw new Error(`Unknown section in HOME_SECTION_ORDER: ${section}`);
  if (!isHomeSectionVisible(section, 'desktop') && !isHomeSectionVisible(section, 'mobile')) return false;
  if (section === 'featured') return featuredProjects.length > 0;
  if (section === 'offers') return offerCards.length > 0;
  if (section === 'recommendations') return recommendedProjects.length > 0;
  return true;
});

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const route = project => `projects/${project.slug}/`;
const productPageURLs = new Set(projects.flatMap(project => {
  const page = new URL(route(project), siteURL).href;
  return [page, `${page}index.html`];
}));
const projectLaunchURL = project => project.webUrl ?? project.playUrl ?? project.download;
const tagList = tags => `<ul class="tags">${tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul>`;
const chevron = '<span class="chevron" aria-hidden="true"></span>';
const play = '<span class="play-icon" aria-hidden="true"></span>';
const external = 'target="_blank" rel="noopener noreferrer"';
const githubLogo = '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.3 4.3 0 0 0-.1-3.3s-1-.3-3.4 1.3a12.6 12.6 0 0 0-6.2 0C6.3 2.9 5.3 3.2 5.3 3.2a4.3 4.3 0 0 0-.1 3.3A4.7 4.7 0 0 0 4 9.8c0 4.7 2.8 5.7 5.5 6a2.9 2.9 0 0 0-.8 2.2v3.3"/>';
const instagramHandle = 'felipeaguiar.exe';
const instagram = `https://www.instagram.com/${instagramHandle}/`;
const socialLinks = [
  ['YouTube', 'https://www.youtube.com/@devaguia/videos', '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>'],
  ['GitHub', github, githubLogo],
  ['LinkedIn', 'https://www.linkedin.com/in/felipeaguiar-exe/', '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v6m0-10v.1M12 17v-6m0 2a2 2 0 0 1 4 0v4"/>'],
  ['Instagram', instagram, '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.6h.01"/>']
];
const aboutSocialLinks = [...new Set(ABOUT_SOCIAL_ORDER)].map(name => {
  const link = socialLinks.find(([label]) => label === name);
  if (!link) throw new Error(`Unknown social network in ABOUT_SOCIAL_ORDER: ${name}`);
  return link;
});
const searchIcon = '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>';
const sunIcon = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>';
const moonIcon = '<path d="M20.9 13.5a9 9 0 0 1-10.4-10.4A9 9 0 1 0 20.9 13.5Z"/>';
const controllerIcon = '<path d="M7 7h10a4 4 0 0 1 3.9 3.3l1 5.3a2.6 2.6 0 0 1-4.4 2.3L15 15H9l-2.5 2.9a2.6 2.6 0 0 1-4.4-2.3l1-5.3A4 4 0 0 1 7 7Z"/><path d="M8 9.5v4M6 11.5h4M16 11.5h.01m2-2h.01"/>';
const screenIcon = '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v3m-4 0h8"/>';
const checklistIcon = '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m7 9 1 1 2-2m-3 7 1 1 2-2m3-5h4m-4 6h4"/>';
const linkIcon = '<path d="M10 13a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-5.7-5.7L12 6m2 5a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 5.7 5.7L12 18"/>';
const alertIcon = '<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>';
const processorIcon = '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>';
const exportIcon = '<path d="M12 4v11m-4-4 4 4 4-4M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>';
const factDetails = {
  platform: ['Plataforma', screenIcon],
  distribution: ['Distribuição', '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9m-4-15.75 8 4.5"/>'],
  system: ['Sistema', '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M10 3v18"/>'],
  processor: ['Processador', processorIcon],
  memory: ['Memória', '<rect x="3" y="7" width="18" height="9" rx="1"/><path d="M6 16v3m4-3v3m4-3v3m4-3v3M7 11h2m2 0h2m2 0h2"/>'],
  video: ['Vídeo', screenIcon],
  storage: ['Armazenamento', '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 15h16m-12 2.5h.01m3 0h.01"/>'],
  controls: ['Controles', controllerIcon],
  players: ['Jogadores', '<circle cx="9" cy="8" r="3"/><path d="M3 19v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1m.5-14a3 3 0 0 1 0 6m1.5 2a5 5 0 0 1 4 5v1"/>'],
  languages: ['Idiomas', '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'],
  teams: ['Equipes', '<path d="M3 21V4m0 1c4-3 8 3 12 0v10c-4 3-8-3-12 0"/><path d="M18 9h3v9h-6v-2"/>'],
  progress: ['Progresso', '<path d="M5 4h12l2 2v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4Z"/><path d="M8 4v6h7V4m-6 16v-5h6v5"/>'],
  projects: ['Projetos', '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>'],
  export: ['Exportação', exportIcon],
  developer: ['Desenvolvedor', personIcon]
};

function lineIcon(paths, size = 19) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function mobileInfoIcon(paths) {
  return `<span class="mobile-info-icon" aria-hidden="true">${lineIcon(paths, 16)}</span>`;
}

function brand(base) {
  return `<a class="brand" href="${base}index.html"><span class="brand-mark" aria-hidden="true">fa.</span><span>Felipe Aguiar <small>Meus Aplicativos</small></span></a>`;
}

function layout({ title, description, canonical, image, project, content }) {
  const base = project ? '../../' : '';
  const homePath = base ? base + 'index.html' : '';
  const menuLinks = device => homeSections.filter(section => sectionLinks[section] && isHomeSectionVisible(section, device)).map(section => {
    const [anchor, label, icon] = sectionLinks[section];
    return `<a href="${homePath}#${anchor}">${device === 'mobile' ? lineIcon(icon, 17) : ''}${label}</a>`;
  }).join(device === 'mobile' ? '\n        ' : '\n      ');
  const desktopLinks = menuLinks('desktop');
  const mobileLinks = menuLinks('mobile');
  const catalogVisibility = homeVisibilityAttribute('catalog');
  const aboutVisibility = homeVisibilityAttribute('about');
  const creditLinks = project?.credits?.map(([name, url]) => `<a href="${url.startsWith('https://') ? url : base + url}" ${external}>${name}</a>`).join('') || '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#101016">
<script src="${base}assets/js/theme.js"></script>
<meta name="description" content="${escape(description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${canonical}">${image ? `
<meta property="og:image" content="${escape(new URL(image, siteURL))}">` : ''}
<link rel="canonical" href="${canonical}">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/css/portfolio.css">
<link rel="stylesheet" href="${base}assets/css/light-theme.css">
<title>${escape(title)}</title>
</head>
<body${project ? ` class="theme-${project.id}"` : ''}>
<a class="skip-link" href="#main-content">Pular para o conteúdo</a>
<header class="site-header">
  <div class="shell header-inner">
    ${brand(base)}
    ${desktopLinks ? `<nav class="site-nav" aria-label="Menu principal">
      ${desktopLinks}
    </nav>` : ''}
    <details class="mobile-menu">
      <summary aria-label="Menu principal">${lineIcon('<path d="M4 6h16M4 12h16M4 18h16"/>', 23)}</summary>
      <nav class="mobile-menu-links" aria-label="Navegação mobile">
        ${mobileLinks}
        <a href="${github}" ${external}>${lineIcon(githubLogo, 17)}Meu GitHub</a>
      </nav>
    </details>
    <div class="header-actions">
      ${homeSections.includes('catalog') ? `<form class="search-field site-search" role="search" aria-label="Busca principal" action="${base}index.html#catalog" method="get"${catalogVisibility}>
        <input type="search" name="q" placeholder="Buscar apps" aria-label="Buscar apps" enterkeyhint="search">
        <button type="submit" aria-label="Pesquisar">${lineIcon(searchIcon, 18)}</button>
      </form>` : ''}
      <a class="header-source" href="${github}" ${external} aria-label="Meu GitHub">${lineIcon(githubLogo)}</a>
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Ativar tema claro" hidden>
        <span class="theme-icon-sun">${lineIcon(sunIcon)}</span>
        <span class="theme-icon-moon">${lineIcon(moonIcon)}</span>
      </button>
    </div>
  </div>
</header>
${content}
<footer class="site-footer" id="contact">
  <div class="shell">
    <div class="footer-grid">
      <div class="footer-brand">
        ${brand(base)}
        <p>Aplicativos para criar, jogar e explorar o código.</p>
        <nav class="footer-socials" aria-label="Redes sociais">
          ${socialLinks.map(([name, url, paths]) => `<a href="${url}" ${external} aria-label="${name}" title="${name}">${lineIcon(paths)}</a>`).join('\n          ')}
        </nav>
      </div>
      <nav class="footer-col" aria-label="Catálogo">
        <h2>Catálogo</h2>
        ${homeSections.includes('catalog') ? `<a href="${homePath}#catalog"${catalogVisibility}>Todos meus Apps</a>` : ''}
        ${homeSections.includes('about') ? `<a href="${homePath}#about"${aboutVisibility}>Quem faz</a>` : ''}
        <a href="mailto:felipeaguiar.social@gmail.com">Contato por e-mail</a>
      </nav>
      <nav class="footer-col" aria-label="Aplicativos">
        <h2>Apps</h2>
        ${projects.map(app => `<a href="${base}${route(app)}index.html">${app.name}<small>${app.category}</small></a>`).join('\n        ')}
      </nav>
      <nav class="footer-col" aria-label="Jogar e baixar">
        <h2>Jogar e baixar</h2>
        <a href="${dump.download}" ${external}>Download do ${dump.name}</a>
        <a href="${ps5.download}" ${external}>Último release do ${ps5.name}</a>
        ${projects.filter(app => app.playUrl || app.webUrl).map(app => `<a href="${projectLaunchURL(app)}" ${external}>${app.webUrl ? 'Abrir' : 'Jogar'} ${app.name}</a>`).join('\n        ')}
      </nav>
    </div>
    <div class="footer-bottom">
      <span>© Felipe Aguiar</span>
      ${creditLinks ? `<nav aria-label="Créditos da mídia">${creditLinks}</nav>` : '<span>Feito no Brasil</span>'}
    </div>
  </div>
</footer>
<script src="${base}assets/js/site.js" defer></script>
<script src="${base}assets/js/${project ? 'project' : 'home'}.js" defer></script>
</body>
</html>
`;
}

function catalogCard({ project, tab }) {
  const { name } = project;
  const destination = route(project) + 'index.html';
  const starsAPI = project.repo.replace('https://github.com/', 'https://api.github.com/repos/');
  const star = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>';
  const summary = project.summary ?? project.description;
  const { icon, square, coverScreen, screens, featureScreens, videos: [video] } = assets.get(project);
  const selectedScreens = featureScreens.filter(Boolean);
  const frames = (selectedScreens.length ? selectedScreens : screens).map(({ image }) => image);
  const previewImages = [...new Set([coverScreen, square, ...frames].filter(Boolean))];
  const hasPreview = Boolean(previewImages.length || video);
  const searchText = [name, project.repo.split('/').at(-1), project.slug, project.category, summary, ...project.tags].join(' ');
  return `<article class="catalog-entry theme-${project.id}${hasPreview ? ' has-catalog-preview' : ''}${icon ? ' has-catalog-icon' : ''}" data-category="${escape(tab)}" data-search-text="${escape(searchText)}">${icon ? `
        <a class="catalog-app-icon" href="${destination}" aria-label="Ver app ${escape(name)}"><img src="${icon}" width="64" height="64" alt="" loading="lazy"></a>` : ''}${hasPreview ? `
        <div class="catalog-preview" data-card-preview>
          <a class="catalog-image" href="${destination}${screens.length || video ? '#media' : ''}" aria-label="${screens.length || video ? 'Ver galeria de' : 'Ver app'} ${escape(name)}">${previewImages.map((image, index) => `
            <img class="preview-image${index === 0 ? ' is-current' : ''}" src="${image}" alt="" loading="lazy">`).join('')}${video ? `
            <video class="preview-video" src="${video}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ''}
            <span class="catalog-play">${screens.length || video ? 'Ver galeria' : 'Ver app'}</span>
          </a>${video ? `
          <button class="preview-toggle" type="button" data-preview-name="${escape(name)}" aria-label="Reproduzir prévia de ${escape(name)}" hidden><span aria-hidden="true"></span></button>` : ''}
        </div>` : ''}
        <div class="catalog-copy">
          <p class="kicker">${project.category}</p>
          <h3>${name}</h3>
          <p class="catalog-lede">${project.headline}</p>
          <p class="catalog-summary">${summary}</p>
          ${tagList(project.tags)}
          <div class="catalog-footer">
            ${homeActions(project)}
            <a class="catalog-mobile-action" href="${destination}" aria-label="Ver app ${name}">Ver app</a>
            <a class="repo-stars" href="${project.repo}" ${external} data-repo-stars="${starsAPI}" aria-label="Dar uma estrela a ${name} no GitHub" title="Dar uma estrela no GitHub">${star}<span data-star-count hidden></span></a>
          </div>
        </div>
      </article>`;
}

function homeActions(project, { editorLabel = 'Conhecer o editor', actionLabel } = {}) {
  const detailLabel = project.detailLabel ?? (project.playUrl ? 'Conhecer o jogo' : (project === dump ? editorLabel : 'Conhecer o launcher'));
  const secondaryLabel = actionLabel ?? (project.playUrl || project.webUrl ? project.cta : (project === dump ? 'Ver download' : 'Ver último release'));
  return `<div class="actions">
                <a class="button primary" href="${route(project)}index.html">${detailLabel}</a>
                <a class="button secondary" href="${projectLaunchURL(project)}" ${external}>${escape(secondaryLabel)}</a>
              </div>`;
}

function featuredSlide({ project, durationMs, actionLabel }, index) {
  const isDump = project === dump;
  const titleId = isDump ? 'featured-title' : (project === ps5 ? 'launcher-hero-title' : `featured-${project.id}-title`);
  const { banner, icon } = assets.get(project);
  const artwork = banner ? `
            <div class="hero-art" aria-hidden="true"><img src="${banner}" alt=""${index === 0 ? ' fetchpriority="high"' : ''}></div>` : '';
  const platform = isDump ? 'Editor desktop para Windows' : project.platform;
  const tags = isDump ? 'Colagens · Filtros · Carrosséis'
    : (project === ps5 ? 'ROMs · Recompilações · Jogos de PC' : project.tags.join(' · '));

  return `<article class="hero-slide theme-${project.id}${banner ? '' : ' hero-text-only'}${index === 0 ? ' is-current' : ''}" data-story data-duration="${durationMs}" aria-labelledby="${titleId}">${isDump ? `
            <span class="featured-ribbon"><span>Destaque</span></span>` : ''}
            <div class="hero-copy">${isDump ? '' : `
              <p class="kicker">${project.category}</p>`}
              <h2 id="${titleId}">${project.name}${isDump ? '<span class="title-period">.</span>' : ''}</h2>
              <p class="hero-lede">${project.headline}</p>
              <p class="hero-summary">${project.summary ?? project.description}</p>
              ${homeActions(project, { editorLabel: 'Conhecer o Editor', actionLabel })}
            </div>${artwork}
            <div class="app-strip">
              <span class="strip-brand">${icon ? `<img src="${icon}" alt="" width="30" height="30"> ` : ''}${project.edition}</span>
              <span>${platform}</span>
              <span>${tags}</span>
            </div>
          </article>`;
}

function homeFeatured(screenAttribute) {
  return `  <section class="home-featured" id="featured" aria-labelledby="featured-section-title"${screenAttribute}>
    <div class="section-heading"><h2 id="featured-section-title">Destaques</h2></div>
    <div class="home-hero" data-stories>
      <div class="story-stage">
        <div class="story-slides">
          ${featuredProjects.map(featuredSlide).join('\n          ')}
        </div>
        <button class="story-arrow previous" type="button" data-story-step="-1" aria-label="Destaque anterior" hidden>${chevron}</button>
        <button class="story-arrow next" type="button" data-story-step="1" aria-label="Próximo destaque" hidden>${chevron}</button>
      </div>
      <div class="story-controls" hidden>
        <div class="story-track" role="group" aria-label="Escolher app no banner">
          ${featuredProjects.map(({ project }, index) => `<button class="story-button" data-story-button type="button" aria-label="Mostrar ${project.name}" aria-pressed="${index === 0}"><span aria-hidden="true"></span></button>`).join('\n          ')}
        </div>
        <button class="story-toggle" type="button" aria-label="Pausar rotação dos banners"><span aria-hidden="true"></span></button>
      </div>
    </div>
  </section>`;
}

function homeCatalog(screenAttribute) {
  const tabIcons = {
    grid: gridIcon,
    edit: '<path d="m15 5 4 4M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11L4 20z"/>',
    tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-7 7a2.1 2.1 0 0 1-3-3l7-7a6 6 0 0 1 7.9-7.9Z"/>',
    game: controllerIcon
  };
  const total = catalogEntries.length;
  return `  <section class="home-catalog" id="catalog" aria-labelledby="catalog-title" data-catalog${screenAttribute}>
    <div class="section-heading catalog-heading">
      <h2 id="catalog-title">Todos meus Apps</h2>
      <form class="search-field catalog-search" role="search" aria-label="Busca no catálogo" action="index.html#catalog" method="get">
        ${lineIcon(searchIcon, 18)}
        <input type="search" name="q" placeholder="Buscar no catálogo" aria-label="Buscar no catálogo" enterkeyhint="search" aria-controls="catalog-list">
      </form>
    </div>
    <div class="catalog-toolbar">
      <div class="catalog-filters" role="group" aria-label="Filtrar aplicativos" hidden>
        ${CATALOG_TAB_ORDER.map(({ id, label, icon }) => {
          const count = id === 'all' ? total : catalogEntries.filter(entry => entry.tab === id).length;
          const glyph = Object.hasOwn(tabIcons, icon) ? tabIcons[icon] : tabIcons.grid;
          return `<button type="button" data-filter="${escape(id)}" aria-pressed="${id === 'all'}" aria-controls="catalog-list">${lineIcon(glyph, 17)}<span>${escape(label)}</span> <span class="catalog-tab-count" data-tab-count>${count}</span></button>`;
        }).join('\n        ')}
      </div>
      <p class="sr-only" data-catalog-count role="status">${total} ${total === 1 ? 'app' : 'apps'}</p>
    </div>
    <p class="catalog-query" data-catalog-query hidden>Resultados para “<span></span>”. <a href="index.html#catalog">Limpar busca</a></p>
    <p class="catalog-empty" data-catalog-empty hidden>Nenhum app encontrado.</p>
    <div class="catalog-list" id="catalog-list">
      ${catalogEntries.map(catalogCard).join('\n      ')}
    </div>
  </section>`;
}

function recommendationCard(project) {
  const { banner, coverScreen, square, screens, icon } = assets.get(project);
  const artwork = banner ?? coverScreen ?? square ?? screens[0]?.image;
  return `<li>
        <a class="recommendation-card theme-${project.id}" href="${route(project)}index.html">${artwork ? `
          <img class="recommendation-art" src="${artwork}" alt="" loading="lazy">` : ''}
          <div class="recommendation-copy">${icon ? `
            <img src="${icon}" width="42" height="42" alt="" loading="lazy">` : ''}
            <div>
              <h3>${escape(project.name)}</h3>
              <p>${escape(project.category)}</p>
            </div>
          </div>
        </a>
      </li>`;
}

function homeRecommendations(screenAttribute) {
  return `  <section class="home-recommendations" id="recommendations" aria-labelledby="recommendations-title" data-card-carousel${screenAttribute}>
    <div class="section-heading recommendations-heading">
      <h2 id="recommendations-title">Recomendados para você</h2>
      <div class="carousel-controls recommendations-controls" data-carousel-controls role="group" aria-label="Navegação dos recomendados" hidden>
        <button class="carousel-arrow recommendation-arrow previous" type="button" data-carousel-step="-1" aria-controls="recommendations-list" aria-label="Recomendação anterior">${chevron}</button>
        <button class="carousel-arrow recommendation-arrow next" type="button" data-carousel-step="1" aria-controls="recommendations-list" aria-label="Próxima recomendação">${chevron}</button>
      </div>
    </div>
    <ul class="recommendations-track" id="recommendations-list" data-carousel-track role="list">
      ${recommendedProjects.map(recommendationCard).join('\n      ')}
    </ul>
  </section>`;
}

function offerLinkAttributes(href, newTab) {
  if (!['https:', 'http:'].includes(new URL(href, siteURL).protocol)) {
    throw new Error(`Invalid link in offers.js: ${href}`);
  }
  const opensNewTab = newTab ?? /^(?:https?:)?\/\//i.test(href);
  return `href="${escape(href)}"${opensNewTab ? ` ${external}` : ''}`;
}

function offerCard(id) {
  const card = offers.cards[id];
  const project = projectsById.get(card.projectId);
  if (card.projectId && !project) throw new Error(`Unknown project in offers.js for ${id}: ${card.projectId}`);
  const projectMedia = assets.get(project);
  const artwork = card.image ?? projectMedia?.[card.artwork ?? 'banner'] ?? projectMedia?.banner
    ?? projectMedia?.square ?? projectMedia?.screens[0]?.image;
  const title = card.title ?? project?.name;
  const target = card.link?.page && new URL(card.link.page, siteURL);
  const productPage = target && target.origin + target.pathname;
  if (!productPageURLs.has(productPage)) {
    throw new Error(`Set link.page in offers.js for ${id} to a product page in this store.`);
  }
  if (!title || !card.link.label) throw new Error(`Provide a title and link label in offers.js for ${id}.`);
  const href = productPage.slice(siteURL.length) + target.search + target.hash;
  const { discount, original, current } = card.pricing ?? {};
  return `<li class="offer-entry">
        <a class="offer-card${project ? ` theme-${project.id}` : ''}${artwork ? ' has-offer-art' : ''}" href="${escape(href)}">${artwork ? `
          <div class="offer-art"><img src="${escape(artwork)}" alt="" loading="lazy"></div>` : ''}
          <div class="offer-copy">${card.label ? `
            <p class="offer-label">${escape(card.label)}</p>` : ''}
            <h3>${escape(title)}</h3>${card.description ? `
            <p class="offer-description">${escape(card.description)}</p>` : ''}${card.period ? `
            <p class="offer-period">${escape(card.period)}</p>` : ''}
            <div class="offer-footer">${discount || original || current ? `
              <span class="offer-pricing">${discount ? `<span class="offer-discount">${escape(discount)}</span>` : ''}${original ? `<s><span class="sr-only">Preço original </span>${escape(original)}</s>` : ''}${current ? `<strong><span class="sr-only">Preço atual </span>${escape(current)}</strong>` : ''}</span>` : ''}
              <span class="offer-action">${escape(card.link.label)}${chevron}</span>
            </div>
          </div>
        </a>
      </li>`;
}

function homeOffers(screenAttribute) {
  const { title, moreLink } = offers;
  const target = moreLink?.href && new URL(moreLink.href, siteURL);
  const anchor = target && [siteURL, `${siteURL}index.html`].includes(target.origin + target.pathname)
    ? target.hash.slice(1)
    : '';
  const showMore = moreLink?.href && moreLink.label && (!Object.hasOwn(sectionLinks, anchor) || homeSections.includes(anchor));
  return `  <section class="home-offers" id="offers" aria-labelledby="offers-title" data-card-carousel${screenAttribute}>
    <div class="section-heading offers-heading">
      <h2 id="offers-title">${escape(title)}</h2>
      <div class="offers-actions">
        <div class="carousel-controls" data-carousel-controls role="group" aria-label="Navegação da seção ${escape(title)}" hidden>
          <button class="carousel-arrow previous" type="button" data-carousel-step="-1" aria-controls="offers-list" aria-label="Cartão anterior">${chevron}</button>
          <button class="carousel-arrow next" type="button" data-carousel-step="1" aria-controls="offers-list" aria-label="Próximo cartão">${chevron}</button>
        </div>${showMore ? `
        <a class="offer-more" ${offerLinkAttributes(moreLink.href, moreLink.newTab)}${homeVisibilityAttribute(anchor)}>${escape(moreLink.label)}${chevron}</a>` : ''}
      </div>
    </div>
    <ul class="offers-track" id="offers-list" data-carousel-track role="list">
      ${offerCards.map(offerCard).join('\n      ')}
    </ul>
  </section>`;
}

function homeAbout(screenAttribute) {
  const blocks = {
    profile: `      <p class="kicker">Quem faz</p>
      <h2 id="about-me-title">Felipe Aguiar</h2>
      <span class="about-handle">@${instagramHandle}</span>`,
    bio: `      <p>Sou desenvolvedor full stack e instrutor de tecnologia. Trabalho com TypeScript, Node.js, interfaces web e IA aplicada.<span class="about-bio-details"> Gosto de entender o problema, pensar na arquitetura e transformar a solução em algo que as pessoas possam usar.</span></p>
      <p class="about-bio-details">No GitHub e no YouTube, compartilho código, experimentos e conteúdo técnico. O objetivo é mostrar o que construí, explicar as escolhas e trocar conhecimento com outros desenvolvedores.</p>`,
    actions: `      <div class="about-profile-actions">
        ${homeSections.includes('catalog') ? `<a class="button primary about-apps-action" href="#catalog"${homeVisibilityAttribute('catalog')}>Ver apps</a>` : ''}
        <a class="button secondary about-follow-action" href="${instagram}" ${external} aria-label="Seguir Felipe Aguiar no Instagram">${lineIcon(followIcon, 19)}</a>
      </div>`,
    socials: `      <nav class="actions" aria-label="Redes sociais de Felipe Aguiar">
        ${aboutSocialLinks.map(([name, url, paths]) => {
          const isYouTube = name === 'YouTube';
          return `<a class="${isYouTube ? 'button secondary' : 'text-link'}" href="${url}" ${external} aria-label="${isYouTube ? 'Assistir ao Dev Águia no YouTube' : name}">${lineIcon(paths, 17)}<span>${isYouTube ? 'Assistir ao Dev Águia' : name}</span></a>`;
        }).join('\n        ')}
      </nav>`
  };
  const blockOrder = [...new Set(ABOUT_CONTENT_ORDER)];
  const content = blockOrder.map(block => {
    if (!Object.hasOwn(blocks, block)) throw new Error(`Unknown block in ABOUT_CONTENT_ORDER: ${block}`);
    return blocks[block];
  }).join('\n');
  const label = blockOrder.includes('profile') ? 'aria-labelledby="about-me-title"' : 'aria-label="Quem faz"';
  return `  <section class="about-me" id="about" ${label}${screenAttribute}>
    <div class="about-avatar" data-avatar-ring>
      <img class="about-photo" src="assets/felipe-aguiar.jpg" width="192" height="192" loading="lazy" alt="Foto de Felipe Aguiar">
    </div>
    <div class="about-copy">
${content}
    </div>
  </section>`;
}

function home() {
  const sections = { featured: homeFeatured, offers: homeOffers, catalog: homeCatalog, recommendations: homeRecommendations, about: homeAbout };
  return layout({
    title: 'My App Store',
    description: 'Explore editores, launchers e jogos de navegador criados por Felipe Aguiar. Veja os vídeos, as capturas e onde jogar ou baixar.',
    canonical: siteURL,
    image: homeSections.includes('featured')
      ? featuredProjects.map(({ project }) => assets.get(project).banner).find(Boolean)
      : undefined,
    content: `  <main id="main-content" class="shell home">
  <h1 class="sr-only">Meus Aplicativos</h1>
${homeSections.map(section => sections[section](homeVisibilityAttribute(section))).join('\n\n')}
</main>`
  });
}

function gallery(project, base) {
  const { screens, videos } = assets.get(project);
  const poster = screens[0]?.image;
  const entries = [...videos.map((video, index) => ({
    label: videos.length > 1 ? `Vídeo de demonstração ${index + 1}` : 'Vídeo de demonstração', image: poster, video
  })), ...screens];
  if (!entries.length) return '';
  const [first] = entries;
  const firstMedia = first.video
    ? `<video src="${base + first.video}"${first.image ? ` poster="${base + first.image}"` : ''} controls autoplay muted loop playsinline preload="metadata" aria-label="${escape(first.label)}"></video>`
    : `<img src="${base + first.image}" alt="${escape(first.label)}">`;
  return `<figure class="gallery" data-gallery id="media" aria-label="Galeria de ${project.name}">
      <div class="gallery-stage" data-stage>
        <div class="gallery-media" data-media>
          ${firstMedia}
        </div>${entries.length > 1 ? `
        <button class="gallery-nav previous" type="button" data-step="-1" aria-label="Mídia anterior" hidden>${chevron}</button>
        <button class="gallery-nav next" type="button" data-step="1" aria-label="Próxima mídia" hidden>${chevron}</button>` : ''}
      </div>${entries.length > 1 ? `
      <div class="gallery-thumbs" data-thumbs role="group" aria-label="Vídeo e capturas" hidden>
        ${entries.map(({ label, image, video }, index) => `<button type="button" class="gallery-thumb"${image ? ` data-image="${base + image}"` : ''}${video ? ` data-video="${base + video}"` : ''} aria-label="${escape(label)}" aria-pressed="${index === 0}">${image ? `<img src="${base + image}" alt="" loading="lazy">` : ''}${video ? `<span class="thumb-play">${play}</span>` : ''}</button>`).join('\n          ')}
      </div>` : ''}
      <figcaption class="gallery-caption">
        <span data-caption aria-live="polite">${escape(first.label)}</span>
        <button class="text-button" type="button" data-expand hidden>Ampliar</button>
      </figcaption>
    </figure>`;
}

function projectAction(project) {
  return `<a class="button primary" href="${projectLaunchURL(project)}" ${external}>${project.cta}</a>`;
}

function factsList(items, base) {
  return `<dl class="facts">${items.map(([key, value, avatar]) => {
    const [label, icon] = Object.hasOwn(factDetails, key)
      ? factDetails[key]
      : [key, '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>'];
    const content = avatar
      ? `<dd class="fact-person"><img src="${base + avatar}" width="30" height="30" alt="" loading="lazy">${escape(value)}</dd>`
      : `<dd>${escape(value)}</dd>`;
    return `<div><dt>${lineIcon(icon, 16)}<span>${escape(label)}</span></dt>${content}</div>`;
  }).join('')}</dl>`;
}

function projectPage(project) {
  const base = '../../';
  const other = projects.find(app => app !== project);
  const isDump = project === dump;
  const { banner, square, coverScreen, featureScreens } = assets.get(project);
  const cover = coverScreen ?? square;
  const backdrop = banner ?? coverScreen;
  const galleryMarkup = gallery(project, base);
  const setup = project.webUrl
    ? { id: 'getting-started', label: 'Como usar', icon: screenIcon }
    : project.playUrl
      ? { id: 'how-to-play', label: 'Como jogar', icon: controllerIcon }
      : { id: 'install', label: 'Instalação', icon: exportIcon };
  return layout({
    title: `${project.name} | Apps de Felipe Aguiar`,
    description: project.description,
    canonical: new URL(route(project), siteURL),
    image: coverScreen ?? banner ?? square,
    project,
    content: `  <main id="main-content" class="shell project">
  <div class="project-hero">${backdrop ? `
      <img class="project-backdrop" src="${base + backdrop}" alt="">` : ''}
    <nav class="breadcrumb" aria-label="Caminho da página"><a href="${base}index.html">Biblioteca</a>${chevron}<span aria-current="page">${project.name}</span></nav>
    <div class="project-heading">
      <div><p class="kicker">${project.category}</p><h1>${project.name}</h1></div>
      <p>${project.headline}</p>
    </div>
  </div>

  <div class="showcase${galleryMarkup ? '' : ' showcase-text-only'}">${galleryMarkup ? `
    ${galleryMarkup}` : ''}
    <aside class="summary" aria-label="Resumo de ${project.name}">${cover ? `
      <div class="summary-art${coverScreen ? ' summary-art-capture' : isDump ? ' summary-art-dump' : ''}">
        <img src="${base + cover}" alt="">${coverScreen || isDump ? '' : `<span>${project.name}</span>`}
      </div>` : ''}
      <div class="summary-copy">
        <p>${project.description}</p>
        ${tagList(project.tags)}
        <p class="platform">${mobileInfoIcon(screenIcon)}<span>${project.platform} · ${isDump ? 'Edição local · ' : ''}${project.edition}</span></p>
        ${projectAction(project)}
        <a class="text-link" href="${project.repo}" ${external}>Ver repositório no GitHub</a>
      </div>
    </aside>
  </div>

  <nav class="section-nav" aria-label="Nesta página">
    <a href="#overview">O que ele faz</a><a href="#about">Sobre</a>${project.mechanics ? '<a href="#mechanics">Mecânicas</a>' : ''}<a href="#features">Recursos</a><a href="#${setup.id}">${setup.label}</a><a href="#faq">Perguntas frequentes</a>
  </nav>

  <div class="project-body">
    <div class="project-story">
      <section class="story-intro" id="overview" aria-labelledby="product-purpose-title">
        <h2 id="product-purpose-title">O que ele faz</h2>
        <p>${escape(project.whatItDoes ?? project.description)}</p>
      </section>
      <section class="story-intro" id="about">
        <h2>${project.aboutTitle}</h2>
        <p>${project.about}</p>
      </section>${project.mechanics ? `
      <section class="game-mechanics" id="mechanics" aria-labelledby="mechanics-title">
        <h2 id="mechanics-title">Mecânicas de jogo</h2>
        <div class="mechanics-grid">
          ${project.mechanics.map(({ title, body, screen }) => {
            const capture = featureScreens[screen];
            return `<article class="mechanic-card">${capture ? `
            <figure><img src="${base + capture.image}" width="1440" height="900" alt="" loading="lazy"><figcaption>${escape(capture.label)}</figcaption></figure>` : ''}
            <div class="mechanic-copy"><h3>${escape(title)}</h3><p>${escape(body)}</p></div>
          </article>`;
          }).join('\n          ')}
        </div>
      </section>` : ''}
      <section class="feature-list" id="features" aria-labelledby="features-title">
        <h2 id="features-title">Recursos</h2>
        ${project.features.map(({ title, body, screen }) => {
          const capture = featureScreens[screen];
          return `<article class="feature${capture ? '' : ' feature-text'}">${capture ? `
          <img src="${base + capture.image}" alt="${escape(capture.label)}" loading="lazy">` : ''}
          <div><h3>${title}</h3><p>${body}</p></div>
        </article>`;
        }).join('\n          ')}
      </section>
    </div>
    <aside class="project-facts" aria-label="Ficha técnica e documentação">
      <section class="info-card">
        <h2>${mobileInfoIcon(checklistIcon)}Ficha técnica</h2>
        ${factsList(project.facts, base)}
      </section>${project.requirements ? `
      <section class="info-card">
        <h2>${mobileInfoIcon(processorIcon)}Requisitos do launcher</h2>
        ${factsList(project.requirements, base)}
        <a class="text-link" href="${project.docs}" ${external}>${mobileInfoIcon(checklistIcon)}${project.docsLabel}</a>
      </section>` : ''}
      <section class="info-card">
        <h2>${mobileInfoIcon(linkIcon)}Links do projeto</h2>
        <a class="text-link" href="${project.repo}" ${external}>${mobileInfoIcon(githubLogo)}Código no GitHub</a>
        <a class="text-link" href="${project.requirements ? project.repo + '#instalação' : project.docs}" ${external}>${mobileInfoIcon(checklistIcon)}Documentação</a>
        <a class="text-link" href="${project.repo}/issues" ${external}>${mobileInfoIcon(alertIcon)}Reportar um problema</a>
      </section>
    </aside>
  </div>

  <section class="install" id="${setup.id}" aria-labelledby="install-title">
    <div class="install-copy">
      <h2 id="install-title">${mobileInfoIcon(setup.icon)}${project.installTitle}</h2>
      <p>${project.install}</p>
      <div class="actions">${projectAction(project)}${project.demo ? `<a class="button secondary" href="${project.demo}" ${external}>${project.demoLabel}</a>` : ''}</div>
    </div>
    <div class="install-steps">
      <h3>${mobileInfoIcon(checklistIcon)}${project.stepsTitle || 'Da criação à exportação'}</h3>
      <ol>${project.steps.map(([title, body]) => `<li><strong>${title}</strong><p>${escape(body)}</p></li>`).join('')}</ol>
    </div>
  </section>

  <section class="faq" id="faq" aria-labelledby="faq-title">
    <h2 id="faq-title">Perguntas frequentes</h2>
    <div>${project.questions.map(([question, answer]) => `<details><summary>${question}</summary><p>${escape(answer)}</p></details>`).join('\n        ')}</div>
  </section>

  <nav class="other-project" aria-label="Outro app do portfólio">
    <span>${mobileInfoIcon(linkIcon)}Veja também</span><a href="../${other.slug}/index.html">${other.name}</a>
  </nav>
</main>`
  });
}

function notFoundPage() {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Página não encontrada | My App Store</title>
<script>
  const projectSlugs = ${JSON.stringify(projects.map(project => project.slug))};
  const destination = new URL(location.href);
  const legacyProject = /\\/projetos\\/([^/]+)(?:\\/(?:index\\.html)?)?$/.exec(destination.pathname);
  if (legacyProject && projectSlugs.includes(legacyProject[1])) {
    destination.pathname = destination.pathname.slice(0, legacyProject.index) + '/projects/' + legacyProject[1] + '/';
    location.replace(destination.href);
  }
</script>
</head>
<body>
  <main>
    <h1>Página não encontrada</h1>
    <a href="${siteURL}">Voltar aos aplicativos</a>
  </main>
</body>
</html>
`;
}

const files = new Map([['index.html', home()], ['404.html', notFoundPage()], ...projects.map(project => [
  `${route(project)}index.html`, projectPage(project)
])]);
const outdated = [];
for (const [file, html] of files) {
  const destination = path.join(root, file);
  if (fs.existsSync(destination) && fs.readFileSync(destination, 'utf8').replaceAll('\r\n', '\n') === html) continue;
  outdated.push(file);
  if (!check) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, html);
  }
}
if (check && outdated.length) {
  console.error(`Outdated pages: ${outdated.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`${files.size} pages ${check ? 'checked' : 'generated'} (${outdated.length} updated).`);
}
