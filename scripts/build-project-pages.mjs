// Gera o catálogo e as páginas estáticas para o GitHub Pages.
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
const [dump, ps5] = projects;

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const media = (project, file) => `assets/projects/${project.id}/${file}`;
const route = project => `projetos/${project.slug}/`;
const tagList = tags => `<ul class="tags">${tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul>`;
const chevron = '<span class="chevron" aria-hidden="true"></span>';
const play = '<span class="play-icon" aria-hidden="true"></span>';
const external = 'target="_blank" rel="noopener noreferrer"';
const githubLogo = '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.3 4.3 0 0 0-.1-3.3s-1-.3-3.4 1.3a12.6 12.6 0 0 0-6.2 0C6.3 2.9 5.3 3.2 5.3 3.2a4.3 4.3 0 0 0-.1 3.3A4.7 4.7 0 0 0 4 9.8c0 4.7 2.8 5.7 5.5 6a2.9 2.9 0 0 0-.8 2.2v3.3"/>';
const socialLinks = [
  ['YouTube', 'https://www.youtube.com/@devaguia/videos', '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>'],
  ['GitHub', github, githubLogo],
  ['LinkedIn', 'https://www.linkedin.com/in/felipeaguiar-exe/', '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v6m0-10v.1M12 17v-6m0 2a2 2 0 0 1 4 0v4"/>'],
  ['Instagram', 'https://www.instagram.com/felipeaguiar.exe/', '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.6h.01"/>']
];
const searchIcon = '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>';

function lineIcon(paths, size = 19) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function brand(base) {
  return `<a class="brand" href="${base}index.html"><span class="brand-mark" aria-hidden="true">fa.</span><span>Felipe Aguiar <small>Meus Aplicativos</small></span></a>`;
}

function layout({ title, description, canonical, image, project, content }) {
  const base = project ? '../../' : '';
  const homePath = base ? base + 'index.html' : '';
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
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${new URL(image, siteURL)}">
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
    <nav class="site-nav" aria-label="Menu principal">
      <a href="${homePath}#destaques">Destaques</a>
      <a href="${homePath}#projetos">Todos os apps</a>
      <a href="${homePath}#sobre">Sobre mim</a>
    </nav>
    <div class="header-actions">
      <form class="search-field site-search" role="search" aria-label="Busca principal" action="${base}index.html#projetos" method="get">
        <input type="search" name="q" placeholder="Buscar apps" aria-label="Buscar apps" enterkeyhint="search">
        <button type="submit" aria-label="Pesquisar">${lineIcon(searchIcon, 18)}</button>
      </form>
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
        <a href="${homePath}#projetos">Todos meus Apps</a>
        <a href="${homePath}#sobre">Quem faz</a>
        <a href="mailto:felipeaguiar.social@gmail.com">Contato por e-mail</a>
      </nav>
      <nav class="footer-col" aria-label="Aplicativos">
        <h2>Apps</h2>
        ${projects.map(app => `<a href="${base}${route(app)}index.html">${app.name}<small>${app.category}</small></a>`).join('\n        ')}
      </nav>
      <nav class="footer-col" aria-label="Downloads">
        <h2>Downloads</h2>
        <a href="${dump.download}" ${external}>Download do Dump Studio</a>
        <a href="${ps5.download}" ${external}>Último release do ${ps5.name}</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <span>© Felipe Aguiar</span>
      ${creditLinks ? `<nav aria-label="Créditos da mídia">${creditLinks}</nav>` : '<span>Feito no Brasil</span>'}
    </div>
  </div>
</footer>
<script src="${base}assets/js/${project ? 'project' : 'home'}.js" defer></script>
</body>
</html>
`;
}

function catalogCard(project) {
  const isDump = project === dump;
  const name = isDump ? 'My Dump Studio' : project.name;
  const destination = route(project) + 'index.html';
  const starsAPI = project.repo.replace('https://github.com/', 'https://api.github.com/repos/');
  const star = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>';
  const summary = project.summary ?? project.description;
  const searchText = [name, project.repo.split('/').at(-1), project.slug, project.category, summary, ...project.tags].join(' ');
  return `<article class="catalog-entry theme-${project.id}" data-category="${project.categoryId}" data-search-text="${escape(searchText)}">
        <div class="catalog-preview" data-card-preview>
          <a class="catalog-image" href="${destination}#midia" aria-label="Ver o vídeo e as capturas de ${name}">
            ${project.screens.map(([file], index) => `<img class="preview-image${index === 0 ? ' is-current' : ''}" src="${media(project, file)}" alt="" loading="lazy">`).join('\n            ')}
            <video class="preview-video" src="${media(project, project.video)}" muted loop playsinline preload="none" aria-hidden="true"></video>
            <span class="catalog-play">Ver galeria</span>
          </a>
          <button class="preview-toggle" type="button" data-preview-name="${name}" aria-label="Reproduzir prévia de ${name}" hidden><span aria-hidden="true"></span></button>
        </div>
        <div class="catalog-copy">
          <p class="kicker">${project.category}</p>
          <h3>${name}</h3>
          <p class="catalog-lede">${project.headline}</p>
          <p>${summary}</p>
          ${tagList(project.tags)}
          <div class="catalog-footer">
            <div class="actions">
              <a class="button primary" href="${destination}">${isDump ? 'Conhecer o editor' : 'Conhecer o launcher'}</a>
              <a class="button secondary" href="${project.download}" ${external}>${isDump ? 'Ver download' : 'Ver último release'}</a>
            </div>
            <a class="repo-stars" href="${project.repo}/stargazers" ${external} data-repo-stars="${starsAPI}" aria-label="Ver estrelas de ${name} no GitHub" title="Estrelas no GitHub">${star}<span data-star-count hidden></span></a>
          </div>
        </div>
      </article>`;
}

function home() {
  const filters = [
    ['all', 'Todas', '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'],
    ['edicao', 'Edição', '<path d="m15 5 4 4M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11L4 20z"/>'],
    ['entretenimento', 'Entretenimento', '<path d="M7 7h10a4 4 0 0 1 3.9 3.3l1 5.3a2.6 2.6 0 0 1-4.4 2.3L15 15H9l-2.5 2.9a2.6 2.6 0 0 1-4.4-2.3l1-5.3A4 4 0 0 1 7 7Z"/><path d="M8 9.5v4M6 11.5h4M16 11.5h.01m2-2h.01"/>']
  ];

  return layout({
    title: 'My App Store',
    description: `Monte carrosséis com o Dump Studio e jogue sua biblioteca pelo controle com o ${ps5.name}. Veja os vídeos, as capturas e onde baixar.`,
    canonical: siteURL,
    image: media(dump, dump.screens[0][0]),
    content: `  <main id="conteudo" class="shell home">
  <h1 class="sr-only">Meus Aplicativos</h1>
  <section class="home-featured" id="destaques" aria-labelledby="featured-section-title">
    <div class="section-heading"><h2 id="featured-section-title">Destaques e recomendados</h2></div>
    <div class="home-hero" data-stories>
      <div class="story-stage">
        <div class="story-slides">
          <article class="hero-slide theme-dump is-current" data-story data-duration="10500" aria-labelledby="featured-title">
            <div class="hero-copy">
              <p class="kicker"><span class="dot"></span> App em destaque</p>
              <h2 id="featured-title">Dump<br class="hero-break"> Studio<span class="title-period">.</span></h2>
              <p class="hero-lede">${dump.headline}</p>
              <p class="hero-summary">${dump.summary}</p>
              <div class="actions">
                <a class="button primary" href="${route(dump)}index.html">Conhecer o Dump Studio</a>
                <a class="button secondary" href="${dump.download}" ${external}>Ver download</a>
              </div>
            </div>
            <div class="hero-art" aria-hidden="true">
              <div class="art-grid"></div>
              <img class="print print-left" src="${media(dump, 'cafe-moment.jpg')}" alt="" fetchpriority="high">
              <img class="print print-right" src="${media(dump, 'city-romance.jpg')}" alt="" fetchpriority="high">
              <img class="print print-main" src="${media(dump, 'city-muse.jpg')}" alt="" fetchpriority="high">
              <span class="art-spark">✳</span>
              <div class="art-editor">
                <img src="${media(dump, dump.screens[0][0])}" alt="">
              </div>
            </div>
            <div class="app-strip">
              <span class="strip-brand"><img src="${media(dump, 'app-icon.png')}" alt="" width="30" height="30"> ${dump.edition}</span>
              <span>Editor desktop para Windows</span>
              <span>Colagens · Filtros · Carrosséis</span>
            </div>
          </article>
          <article class="hero-slide theme-ps5" data-story data-duration="8000" aria-labelledby="launcher-hero-title">
            <div class="hero-copy">
              <p class="kicker">${ps5.category}</p>
              <h2 id="launcher-hero-title">${ps5.name}</h2>
              <p class="hero-lede">${ps5.headline}</p>
              <p class="hero-summary">${ps5.description}</p>
              <div class="actions">
                <a class="button primary" href="${route(ps5)}index.html">Conhecer o launcher</a>
                <a class="button secondary" href="${ps5.download}" ${external}>Ver último release</a>
              </div>
            </div>
            <div class="hero-art launcher-art" aria-hidden="true"><img src="${media(ps5, ps5.screens[0][0])}" alt=""></div>
            <div class="app-strip">
              <span class="strip-brand">${ps5.edition}</span>
              <span>${ps5.platform}</span>
              <span>ROMs · Recompilações · Jogos de PC</span>
            </div>
          </article>
        </div>
        <button class="story-arrow previous" type="button" data-story-step="-1" aria-label="Destaque anterior" hidden>${chevron}</button>
        <button class="story-arrow next" type="button" data-story-step="1" aria-label="Próximo destaque" hidden>${chevron}</button>
      </div>
      <div class="story-controls" hidden>
        <div class="story-track" role="group" aria-label="Escolher app no banner">
          ${projects.map((app, index) => `<button class="story-button" data-story-button type="button" aria-label="Mostrar ${app.name}" aria-pressed="${index === 0}"><span aria-hidden="true"></span></button>`).join('')}
        </div>
        <button class="story-toggle" type="button" aria-label="Pausar rotação dos banners"><span aria-hidden="true"></span></button>
      </div>
    </div>
  </section>

  <section class="home-catalog" id="projetos" aria-labelledby="catalog-title" data-catalog>
    <div class="section-heading catalog-heading">
      <h2 id="catalog-title">Todos meus Apps</h2>
      <form class="search-field catalog-search" role="search" aria-label="Busca no catálogo" action="index.html#projetos" method="get">
        ${lineIcon(searchIcon, 18)}
        <input type="search" name="q" placeholder="Buscar no catálogo" aria-label="Buscar no catálogo" enterkeyhint="search" aria-controls="catalog-list">
      </form>
    </div>
    <div class="catalog-toolbar">
      <div class="catalog-filters" role="group" aria-label="Filtrar aplicativos" hidden>
        ${filters.map(([category, label, icon]) => {
          const count = category === 'all' ? projects.length : projects.filter(project => project.categoryId === category).length;
          return `<button type="button" data-filter="${category}" aria-pressed="${category === 'all'}" aria-controls="catalog-list">${lineIcon(icon, 17)}<span>${label}</span> <span class="catalog-tab-count" data-tab-count>${count}</span></button>`;
        }).join('\n        ')}
      </div>
      <p class="sr-only" data-catalog-count role="status">${projects.length} ${projects.length === 1 ? 'app' : 'apps'}</p>
    </div>
    <p class="catalog-query" data-catalog-query hidden>Resultados para “<span></span>”. <a href="index.html#projetos">Limpar busca</a></p>
    <p class="catalog-empty" data-catalog-empty hidden>Nenhum app encontrado.</p>
    <div class="catalog-list" id="catalog-list">
      ${[ps5, dump].map(catalogCard).join('\n      ')}
    </div>
  </section>

  <section class="about-me" id="sobre" aria-labelledby="about-me-title">
    <img class="about-photo" src="assets/felipe-aguiar.jpg" width="192" height="192" loading="lazy" alt="Foto de Felipe Aguiar">
    <div class="about-copy">
      <p class="kicker">Quem faz</p>
      <h2 id="about-me-title">Felipe Aguiar</h2>
      <p>Sou desenvolvedor full stack e instrutor de tecnologia. Trabalho com TypeScript, Node.js, interfaces web e IA aplicada. Gosto de entender o problema, pensar na arquitetura e transformar a solução em algo que as pessoas possam usar.</p>
      <p>No GitHub e no YouTube, compartilho código, experimentos e conteúdo técnico. O objetivo é mostrar o que construí, explicar as escolhas e trocar conhecimento com outros desenvolvedores.</p>
      <div class="actions">
        ${socialLinks.map(([name, url, paths]) => `<a class="${name === 'YouTube' ? 'button secondary' : 'text-link'}" href="${url}" ${external}>${lineIcon(paths, 17)}${name === 'YouTube' ? 'Assistir ao Dev Águia' : name}</a>`).join('\n        ')}
      </div>
    </div>
  </section>
</main>`
  });
}

function gallery(project, base) {
  const [poster, ...screens] = project.screens;
  const posterURL = base + media(project, poster[0]);
  const videoURL = base + media(project, project.video);
  const entries = [{ label: 'Vídeo de demonstração', image: posterURL, video: videoURL },
    ...[poster, ...screens].map(([file, label]) => ({ label, image: base + media(project, file) }))];
  return `<figure class="gallery" data-gallery id="midia" aria-label="Galeria de ${project.name}">
      <div class="gallery-stage" data-stage>
        <div class="gallery-media" data-media>
          <video src="${videoURL}" poster="${posterURL}" controls playsinline preload="none" aria-label="Vídeo de demonstração de ${project.name}"></video>
        </div>
        <button class="gallery-nav previous" type="button" data-step="-1" aria-label="Mídia anterior" hidden>${chevron}</button>
        <button class="gallery-nav next" type="button" data-step="1" aria-label="Próxima mídia" hidden>${chevron}</button>
      </div>
      <div class="gallery-thumbs" data-thumbs role="group" aria-label="Vídeo e capturas" hidden>
        ${entries.map(({ label, image, video }, index) => `<button type="button" class="gallery-thumb" data-image="${image}"${video ? ` data-video="${video}"` : ''} aria-label="${label}" aria-pressed="${index === 0}"><img src="${image}" alt="" loading="lazy">${video ? `<span class="thumb-play">${play}</span>` : ''}</button>`).join('\n          ')}
      </div>
      <figcaption class="gallery-caption">
        <span data-caption aria-live="polite">Vídeo de demonstração</span>
        <button class="text-button" type="button" data-expand hidden>Ampliar</button>
      </figcaption>
    </figure>`;
}

function downloadButton(project) {
  return `<a class="button primary" href="${project.download}" ${external}>${project.cta}</a>`;
}

function factsList(items, base) {
  return `<dl class="facts">${items.map(([name, value, avatar]) => {
    const content = avatar
      ? `<dd class="fact-person"><img src="${base + avatar}" width="30" height="30" alt="" loading="lazy">${escape(value)}</dd>`
      : `<dd>${escape(value)}</dd>`;
    return `<div><dt>${name}</dt>${content}</div>`;
  }).join('')}</dl>`;
}

function projectPage(project) {
  const base = '../../';
  const other = projects.find(app => app !== project);
  const isDump = project === dump;
  const cover = base + media(project, project.screens[0][0]);
  return layout({
    title: `${project.name} | Apps de Felipe Aguiar`,
    description: project.description,
    canonical: new URL(route(project), siteURL),
    image: media(project, project.screens[0][0]),
    project,
    content: `  <main id="conteudo" class="shell project">
  <div class="project-hero">
      <img class="project-backdrop" src="${cover}" alt="">
    <nav class="breadcrumb" aria-label="Caminho da página"><a href="${base}index.html">Biblioteca</a>${chevron}<span aria-current="page">${project.name}</span></nav>
    <div class="project-heading">
      <div><p class="kicker">${project.category}</p><h1>${project.name}</h1></div>
      <p>${project.headline}</p>
    </div>
  </div>

  <div class="showcase">
    ${gallery(project, base)}
    <aside class="summary" aria-label="Resumo de ${project.name}">
      <div class="summary-art ${isDump ? 'summary-art-dump' : ''}">
        ${isDump
          ? `<img src="${base + media(project, 'city-muse.jpg')}" alt=""><span><img src="${base + media(project, 'app-icon.png')}" alt="" width="38" height="38"> Cherry Pie<br>Version</span>`
          : `<img src="${cover}" alt=""><span>${project.name}</span>`}
      </div>
      <div class="summary-copy">
        <p>${project.description}</p>
        ${tagList(project.tags)}
        <p class="platform">${project.platform} · ${isDump ? 'Edição local' : project.edition}</p>
        ${downloadButton(project)}
        <a class="text-link" href="${project.repo}" ${external}>Ver repositório no GitHub</a>
      </div>
    </aside>
  </div>

  <nav class="section-nav" aria-label="Nesta página">
    <a href="#sobre">Sobre</a><a href="#recursos">Recursos</a><a href="#instalacao">Instalação</a><a href="#perguntas">Perguntas frequentes</a>
  </nav>

  <div class="project-body">
    <div class="project-story">
      <section class="story-intro" id="sobre">
        <h2>${project.aboutTitle}</h2>
        <p>${project.about}</p>
      </section>
      <section class="feature-list" id="recursos" aria-labelledby="features-title">
        <h2 id="features-title">Recursos</h2>
        ${project.features.map(({ title, body, screen }) => `<article class="feature${screen === undefined ? ' feature-text' : ''}">
          ${screen === undefined ? '' : `<img src="${base + media(project, project.screens[screen][0])}" alt="${project.screens[screen][1]}" loading="lazy">`}
          <div><h3>${title}</h3><p>${body}</p></div>
        </article>`).join('\n          ')}
      </section>
    </div>
    <aside class="project-facts" aria-label="Ficha técnica e documentação">
      <section class="info-card">
        <h2>Ficha técnica</h2>
        ${factsList(project.facts, base)}
      </section>${project.requirements ? `
      <section class="info-card"><h2>Requisitos do launcher</h2>${factsList(project.requirements, base)}<a class="text-link" href="${project.docs}" ${external}>${project.docsLabel}</a></section>` : ''}
      <section class="info-card">
        <h2>Links do projeto</h2>
        <a class="text-link" href="${project.repo}" ${external}>Código no GitHub</a>
        <a class="text-link" href="${project.requirements ? project.repo + '#instalação' : project.docs}" ${external}>Documentação</a>
        <a class="text-link" href="${project.repo}/issues" ${external}>Reportar um problema</a>
      </section>
    </aside>
  </div>

  <section class="install" id="instalacao" aria-labelledby="install-title">
    <div class="install-copy">
      <h2 id="install-title">${project.installTitle}</h2>
      <p>${project.install}</p>
      <div class="actions">${downloadButton(project)}${project.demo ? `<a class="button secondary" href="${project.demo}" ${external}>${project.demoLabel}</a>` : ''}</div>
    </div>
    <div class="install-steps">
      <h3>${project.stepsTitle || 'Da criação à exportação'}</h3>
      <ol>${project.steps.map(([title, body]) => `<li><strong>${title}</strong><p>${escape(body)}</p></li>`).join('')}</ol>
    </div>
  </section>

  <section class="faq" id="perguntas" aria-labelledby="faq-title">
    <h2 id="faq-title">Perguntas frequentes</h2>
    <div>${project.questions.map(([question, answer]) => `<details><summary>${question}</summary><p>${escape(answer)}</p></details>`).join('\n        ')}</div>
  </section>

  <nav class="other-project" aria-label="Outro app do portfólio">
    <span>Veja também</span><a href="../${other.slug}/index.html">${other.name}</a>
  </nav>
</main>`
  });
}

const files = new Map([['index.html', home()], ...projects.map(project => [
  `${route(project)}index.html`, projectPage(project)
])]);
const check = process.argv.includes('--check');
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
