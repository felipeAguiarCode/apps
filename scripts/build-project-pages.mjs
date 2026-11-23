// Gera o catálogo e as páginas estáticas para o GitHub Pages.
import { projectAssets, syncProjectAssets } from './project-assets.mjs';

const fs = await import('node:fs');
const path = await import('node:path');
const vm = await import('node:vm');
const { fileURLToPath } = await import('node:url');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteURL = 'https://felipeaguiarcode.github.io/apps/';
const github = 'https://github.com/felipeAguiarCode';
const catalog = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/projects.js'), 'utf8'), catalog);
const projects = catalog.window.PORTFOLIO_PROJECTS;
const projectsById = new Map(projects.map(project => [project.id, project]));
const args = process.argv.slice(2);
const check = args[0] === '--check';
if (args[0] === '--sync' && args.length === 3 && projectsById.has(args[1])) {
  syncProjectAssets(root, projectsById.get(args[1]), path.resolve(args[2]));
} else if (args.length && !(check && args.length === 1)) {
  throw new Error('Uso: node scripts/build-project-pages.mjs [--check | --sync <id-do-projeto> <checkout>]');
}
const assets = new Map(projects.map(project => [project, projectAssets(root, project)]));
const dump = projectsById.get('dump');
const ps5 = projectsById.get('ps5');
const homeConfig = JSON.parse(fs.readFileSync(path.join(root, 'home.config.json'), 'utf8'));
const gridIcon = '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>';
const personIcon = '<circle cx="12" cy="8" r="3"/><path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/>';
const sectionLinks = {
  featured: ['destaques', 'Destaques', '<path d="m12 3 2.8 5.7 6.3.9-4.5 4.5 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.5 6.3-.9Z"/>'],
  catalog: ['projetos', 'Todos os apps', gridIcon],
  about: ['sobre', 'Sobre mim', personIcon]
};
const tabIds = new Set(homeConfig.tabs.map(tab => tab.id));
if (!tabIds.has('all') || tabIds.size !== homeConfig.tabs.length) {
  throw new Error('As abas em home.config.json devem incluir o ID all e usar IDs únicos.');
}

function configuredProjects(entries) {
  const seen = new Set();
  return entries.map(({ id, ...settings }) => {
    const project = projectsById.get(id);
    if (!project || seen.has(id)) throw new Error(`Projeto desconhecido ou repetido em home.config.json: ${id}`);
    seen.add(id);
    return { project, ...settings };
  });
}

const featuredProjects = configuredProjects(homeConfig.featured);
for (const { project, durationMs } of featuredProjects) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    throw new Error(`Informe uma duração positiva em milissegundos para o destaque ${project.id}.`);
  }
}
const catalogEntries = configuredProjects(homeConfig.catalog).filter(entry => entry.visible !== false);
for (const { project, tab } of catalogEntries) {
  if (tab === 'all' || !tabIds.has(tab)) throw new Error(`Aba inválida para ${project.id} em home.config.json: ${tab}`);
}
const homeSections = [...new Set(homeConfig.sections)].filter(section => section !== 'featured' || featuredProjects.length > 0);
for (const section of homeSections) {
  if (!Object.hasOwn(sectionLinks, section)) throw new Error(`Seção desconhecida em home.config.json: ${section}`);
}

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const route = project => `projetos/${project.slug}/`;
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
const searchIcon = '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>';
const controllerIcon = '<path d="M7 7h10a4 4 0 0 1 3.9 3.3l1 5.3a2.6 2.6 0 0 1-4.4 2.3L15 15H9l-2.5 2.9a2.6 2.6 0 0 1-4.4-2.3l1-5.3A4 4 0 0 1 7 7Z"/><path d="M8 9.5v4M6 11.5h4M16 11.5h.01m2-2h.01"/>';
const screenIcon = '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v3m-4 0h8"/>';
const checklistIcon = '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m7 9 1 1 2-2m-3 7 1 1 2-2m3-5h4m-4 6h4"/>';
const linkIcon = '<path d="M10 13a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-5.7-5.7L12 6m2 5a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 5.7 5.7L12 18"/>';
const alertIcon = '<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>';
const factIcons = {
  Plataforma: screenIcon,
  Distribuição: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9m-4-15.75 8 4.5"/>',
  Sistema: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M10 3v18"/>',
  Processador: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
  Memória: '<rect x="3" y="7" width="18" height="9" rx="1"/><path d="M6 16v3m4-3v3m4-3v3m4-3v3M7 11h2m2 0h2m2 0h2"/>',
  Vídeo: screenIcon,
  Armazenamento: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 15h16m-12 2.5h.01m3 0h.01"/>',
  Controles: controllerIcon,
  Jogadores: '<circle cx="9" cy="8" r="3"/><path d="M3 19v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1m.5-14a3 3 0 0 1 0 6m1.5 2a5 5 0 0 1 4 5v1"/>',
  Idiomas: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  Equipes: '<path d="M3 21V4m0 1c4-3 8 3 12 0v10c-4 3-8-3-12 0"/><path d="M18 9h3v9h-6v-2"/>',
  Progresso: '<path d="M5 4h12l2 2v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4Z"/><path d="M8 4v6h7V4m-6 16v-5h6v5"/>',
  Projetos: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
  Exportação: '<path d="M12 4v11m-4-4 4 4 4-4M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  Desenvolvedor: personIcon
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
  const menuLinks = (withIcons = false) => homeSections.map(section => {
    const [anchor, label, icon] = sectionLinks[section];
    return `<a href="${homePath}#${anchor}">${withIcons ? lineIcon(icon, 17) : ''}${label}</a>`;
  }).join(withIcons ? '\n        ' : '\n      ');
  const creditLinks = project?.credits?.map(([name, url]) => `<a href="${url.startsWith('https://') ? url : base + url}" ${external}>${name}</a>`).join('') || '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#101016">
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
<title>${escape(title)}</title>
</head>
<body${project ? ` class="theme-${project.id}"` : ''}>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header">
  <div class="shell header-inner">
    ${brand(base)}
    ${homeSections.length ? `<nav class="site-nav" aria-label="Menu principal">
      ${menuLinks()}
    </nav>` : ''}
    <details class="mobile-menu">
      <summary aria-label="Menu principal">${lineIcon('<path d="M4 6h16M4 12h16M4 18h16"/>', 23)}</summary>
      <nav class="mobile-menu-links" aria-label="Navegação mobile">
        ${menuLinks(true)}
        <a href="${github}" ${external}>${lineIcon(githubLogo, 17)}Meu GitHub</a>
      </nav>
    </details>
    <div class="header-actions">
      ${homeSections.includes('catalog') ? `<form class="search-field site-search" role="search" aria-label="Busca principal" action="${base}index.html#projetos" method="get">
        <input type="search" name="q" placeholder="Buscar apps" aria-label="Buscar apps" enterkeyhint="search">
        <button type="submit" aria-label="Pesquisar">${lineIcon(searchIcon, 18)}</button>
      </form>` : ''}
      <a class="header-source" href="${github}" ${external}>${lineIcon(githubLogo, 17)}<span>Meu GitHub</span></a>
    </div>
  </div>
</header>
${content}
<footer class="site-footer" id="contato">
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
        ${homeSections.includes('catalog') ? `<a href="${homePath}#projetos">Todos meus Apps</a>` : ''}
        ${homeSections.includes('about') ? `<a href="${homePath}#sobre">Quem faz</a>` : ''}
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
        ${projects.filter(app => app.playUrl).map(app => `<a href="${app.playUrl}" ${external}>Jogar ${app.name}</a>`).join('\n        ')}
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
          <a class="catalog-image" href="${destination}${screens.length || video ? '#midia' : ''}" aria-label="${screens.length || video ? 'Ver galeria de' : 'Ver app'} ${escape(name)}">${previewImages.map((image, index) => `
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

function homeActions(project, editorLabel = 'Conhecer o editor') {
  const detailLabel = project.playUrl ? 'Conhecer o jogo' : (project === dump ? editorLabel : 'Conhecer o launcher');
  const actionLabel = project.playUrl ? project.cta : (project === dump ? 'Ver download' : 'Ver último release');
  return `<div class="actions">
                <a class="button primary" href="${route(project)}index.html">${detailLabel}</a>
                <a class="button secondary" href="${project.playUrl ?? project.download}" ${external}>${actionLabel}</a>
              </div>`;
}

function featuredSlide({ project, durationMs }, index) {
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
              ${homeActions(project, 'Conhecer o Editor')}
            </div>${artwork}
            <div class="app-strip">
              <span class="strip-brand">${icon ? `<img src="${icon}" alt="" width="30" height="30"> ` : ''}${project.edition}</span>
              <span>${platform}</span>
              <span>${tags}</span>
            </div>
          </article>`;
}

function homeFeatured() {
  return `  <section class="home-featured" id="destaques" aria-labelledby="featured-section-title">
    <div class="section-heading"><h2 id="featured-section-title">Destaques e recomendados</h2></div>
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

function homeCatalog() {
  const tabIcons = {
    grid: gridIcon,
    edit: '<path d="m15 5 4 4M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11L4 20z"/>',
    game: controllerIcon
  };
  const total = catalogEntries.length;
  return `  <section class="home-catalog" id="projetos" aria-labelledby="catalog-title" data-catalog>
    <div class="section-heading catalog-heading">
      <h2 id="catalog-title">Todos meus Apps</h2>
      <form class="search-field catalog-search" role="search" aria-label="Busca no catálogo" action="index.html#projetos" method="get">
        ${lineIcon(searchIcon, 18)}
        <input type="search" name="q" placeholder="Buscar no catálogo" aria-label="Buscar no catálogo" enterkeyhint="search" aria-controls="catalog-list">
      </form>
    </div>
    <div class="catalog-toolbar">
      <div class="catalog-filters" role="group" aria-label="Filtrar aplicativos" hidden>
        ${homeConfig.tabs.map(({ id, label, icon }) => {
          const count = id === 'all' ? total : catalogEntries.filter(entry => entry.tab === id).length;
          const glyph = Object.hasOwn(tabIcons, icon) ? tabIcons[icon] : tabIcons.grid;
          return `<button type="button" data-filter="${escape(id)}" aria-pressed="${id === 'all'}" aria-controls="catalog-list">${lineIcon(glyph, 17)}<span>${escape(label)}</span> <span class="catalog-tab-count" data-tab-count>${count}</span></button>`;
        }).join('\n        ')}
      </div>
      <p class="sr-only" data-catalog-count role="status">${total} ${total === 1 ? 'app' : 'apps'}</p>
    </div>
    <p class="catalog-query" data-catalog-query hidden>Resultados para “<span></span>”. <a href="index.html#projetos">Limpar busca</a></p>
    <p class="catalog-empty" data-catalog-empty hidden>Nenhum app encontrado.</p>
    <div class="catalog-list" id="catalog-list">
      ${catalogEntries.map(catalogCard).join('\n      ')}
    </div>
  </section>`;
}

function homeAbout() {
  return `  <section class="about-me" id="sobre" aria-labelledby="about-me-title">
    <div class="about-avatar" data-avatar-ring>
      <img class="about-photo" src="assets/felipe-aguiar.jpg" width="192" height="192" loading="lazy" alt="Foto de Felipe Aguiar">
    </div>
    <div class="about-copy">
      <p class="kicker">Quem faz</p>
      <h2 id="about-me-title">Felipe Aguiar</h2>
      <span class="about-handle">@${instagramHandle}</span>
      <p>Sou desenvolvedor full stack e instrutor de tecnologia. Trabalho com TypeScript, Node.js, interfaces web e IA aplicada.<span class="about-bio-details"> Gosto de entender o problema, pensar na arquitetura e transformar a solução em algo que as pessoas possam usar.</span></p>
      <p class="about-bio-details">No GitHub e no YouTube, compartilho código, experimentos e conteúdo técnico. O objetivo é mostrar o que construí, explicar as escolhas e trocar conhecimento com outros desenvolvedores.</p>
      <div class="about-profile-actions">
        <a class="button primary" href="${instagram}" ${external} aria-label="Seguir Felipe Aguiar no Instagram">Seguir</a>
        ${homeSections.includes('catalog') ? '<a class="button secondary" href="#projetos">Ver apps</a>' : ''}
      </div>
      <nav class="actions" aria-label="Redes sociais de Felipe Aguiar">
        ${socialLinks.map(([name, url, paths]) => {
          const isYouTube = name === 'YouTube';
          return `<a class="${isYouTube ? 'button secondary' : 'text-link'}" href="${url}" ${external} aria-label="${isYouTube ? 'Assistir ao Dev Águia no YouTube' : name}">${lineIcon(paths, 17)}<span>${isYouTube ? 'Assistir ao Dev Águia' : name}</span></a>`;
        }).join('\n        ')}
      </nav>
    </div>
  </section>`;
}

function home() {
  const sections = { featured: homeFeatured, catalog: homeCatalog, about: homeAbout };
  return layout({
    title: 'My App Store',
    description: 'Explore editores, launchers e jogos de navegador criados por Felipe Aguiar. Veja os vídeos, as capturas e onde jogar ou baixar.',
    canonical: siteURL,
    image: featuredProjects.map(({ project }) => assets.get(project).banner).find(Boolean),
    content: `  <main id="conteudo" class="shell home">
  <h1 class="sr-only">Meus Aplicativos</h1>
${homeSections.map(section => sections[section]()).join('\n\n')}
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
  return `<figure class="gallery" data-gallery id="midia" aria-label="Galeria de ${project.name}">
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
  return `<a class="button primary" href="${project.playUrl ?? project.download}" ${external}>${project.cta}</a>`;
}

function factsList(items, base) {
  return `<dl class="facts">${items.map(([name, value, avatar]) => {
    const content = avatar
      ? `<dd class="fact-person"><img src="${base + avatar}" width="30" height="30" alt="" loading="lazy">${escape(value)}</dd>`
      : `<dd>${escape(value)}</dd>`;
    const icon = factIcons[name] ?? '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>';
    return `<div><dt>${lineIcon(icon, 16)}<span>${escape(name)}</span></dt>${content}</div>`;
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
  const setupSection = project.playUrl ? 'como-jogar' : 'instalacao';
  return layout({
    title: `${project.name} | Apps de Felipe Aguiar`,
    description: project.description,
    canonical: new URL(route(project), siteURL),
    image: coverScreen ?? banner ?? square,
    project,
    content: `  <main id="conteudo" class="shell project">
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
    <a href="#o-que-ele-faz">O que ele faz</a><a href="#sobre">Sobre</a>${project.mechanics ? '<a href="#mecanicas">Mecânicas</a>' : ''}<a href="#recursos">Recursos</a><a href="#${setupSection}">${project.playUrl ? 'Como jogar' : 'Instalação'}</a><a href="#perguntas">Perguntas frequentes</a>
  </nav>

  <div class="project-body">
    <div class="project-story">
      <section class="story-intro" id="o-que-ele-faz" aria-labelledby="product-purpose-title">
        <h2 id="product-purpose-title">O que ele faz</h2>
        <p>${escape(project.whatItDoes ?? project.description)}</p>
      </section>
      <section class="story-intro" id="sobre">
        <h2>${project.aboutTitle}</h2>
        <p>${project.about}</p>
      </section>${project.mechanics ? `
      <section class="game-mechanics" id="mecanicas" aria-labelledby="mechanics-title">
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
      <section class="feature-list" id="recursos" aria-labelledby="features-title">
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
        <h2>${mobileInfoIcon(factIcons.Processador)}Requisitos do launcher</h2>
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

  <section class="install" id="${setupSection}" aria-labelledby="install-title">
    <div class="install-copy">
      <h2 id="install-title">${mobileInfoIcon(project.playUrl ? controllerIcon : factIcons.Exportação)}${project.installTitle}</h2>
      <p>${project.install}</p>
      <div class="actions">${projectAction(project)}${project.demo ? `<a class="button secondary" href="${project.demo}" ${external}>${project.demoLabel}</a>` : ''}</div>
    </div>
    <div class="install-steps">
      <h3>${mobileInfoIcon(checklistIcon)}${project.stepsTitle || 'Da criação à exportação'}</h3>
      <ol>${project.steps.map(([title, body]) => `<li><strong>${title}</strong><p>${escape(body)}</p></li>`).join('')}</ol>
    </div>
  </section>

  <section class="faq" id="perguntas" aria-labelledby="faq-title">
    <h2 id="faq-title">Perguntas frequentes</h2>
    <div>${project.questions.map(([question, answer]) => `<details><summary>${question}</summary><p>${escape(answer)}</p></details>`).join('\n        ')}</div>
  </section>

  <nav class="other-project" aria-label="Outro app do portfólio">
    <span>${mobileInfoIcon(linkIcon)}Veja também</span><a href="../${other.slug}/index.html">${other.name}</a>
  </nav>
</main>`
  });
}

const files = new Map([['index.html', home()], ...projects.map(project => [
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
  console.error(`Páginas desatualizadas: ${outdated.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`${files.size} páginas ${check ? 'verificadas' : 'geradas'} (${outdated.length} atualizadas).`);
}
