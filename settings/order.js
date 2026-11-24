// Each list is rendered from top to bottom. App IDs come from data/projects.mjs.
// Run node scripts/build-project-pages.mjs after updating the settings.
const HOME_SECTION_ORDER = ['featured', 'offers', 'catalog', 'recommendations', 'about'];

const FEATURED_APP_ORDER = [
  { id: 'dump', durationMs: 10500 },
  { id: 'markdown', durationMs: 8000, actionLabel: 'Usar Agorar' }
];

const CATALOG_TAB_ORDER = [
  { id: 'all', label: 'Todas', icon: 'grid' },
  { id: 'editing', label: 'Edição', icon: 'edit' },
  { id: 'utilities', label: 'Utilitários', icon: 'tools' },
  { id: 'entertainment', label: 'Entretenimento', icon: 'game' }
];

const CATALOG_APP_ORDER = [
  { id: 'dump', tab: 'editing' },
  { id: 'markdown', tab: 'utilities' },
  { id: 'ps5', tab: 'entertainment' },
  { id: 'pixel', tab: 'entertainment' }
];

const RECOMMENDED_APP_ORDER = ['pixel', 'dump', 'ps5'];

const OFFER_CARD_ORDER = ['dump-demo', 'pixel-browser', 'markdown-editor'];

const ABOUT_CONTENT_ORDER = ['profile', 'bio', 'actions', 'socials'];

const ABOUT_SOCIAL_ORDER = ['YouTube', 'GitHub', 'LinkedIn', 'Instagram'];

module.exports = {
  HOME_SECTION_ORDER,
  FEATURED_APP_ORDER,
  CATALOG_TAB_ORDER,
  CATALOG_APP_ORDER,
  RECOMMENDED_APP_ORDER,
  OFFER_CARD_ORDER,
  ABOUT_CONTENT_ORDER,
  ABOUT_SOCIAL_ORDER
};
