// Arrange these card IDs in OFFER_CARD_ORDER in order.js.
// On wide screens, the first card in each group of three gets the large tile.
// Set visible: false on a card to hide it without removing its settings.
// A card can use an app's banner, square, or coverScreen artwork.
// Use image for a custom path or image: false for a text-only card.
// Optional fields: title, description, period, and pricing ({ discount, original, current }).
// Write period and pricing as display text, such as "Até 30 de novembro" or "R$ 19,90".
// Each card's link.page points to a product page in this store, relative to index.html.
// The optional moreLink uses href and supports newTab.
const OFFERS_SECTION = {
  title: 'Mais Procurados',
  // Set moreLink to null to hide the link next to the title.
  moreLink: { label: 'Ver catálogo', href: '#catalog' },
  cards: {
    'pixel-browser': {
      projectId: 'pixel',
      label: 'No navegador',
      description: 'Escolha seu time e dispute uma partida rápida ou uma temporada de futebol americano universitário em pixel art.',
      artwork: 'square',
      link: { label: 'Ver detalhes', page: 'projects/pixel-college-deluxe/index.html' }
    },
    'dump-demo': {
      projectId: 'dump',
      label: 'Demo interativa',
      description: 'Experimente filtros e monte carrosséis com fotos de exemplo.',
      artwork: 'banner',
      link: { label: 'Ver detalhes', page: 'projects/dump-studio/index.html' }
    },
    'markdown-editor': {
      projectId: 'markdown',
      label: 'Editor no navegador',
      description: 'Escreva em blocos, organize suas notas em pastas e comece projetos com modelos prontos.',
      artwork: 'square',
      link: { label: 'Ver detalhes', page: 'projects/markdown-live-editor/index.html' }
    }
  }
};

module.exports = OFFERS_SECTION;
