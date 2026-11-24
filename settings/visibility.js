// Set desktop or mobile to false to hide a section on that layout.
// A single false hides the section on both layouts.
const HOME_SECTION_VISIBILITY = {
  featured: { desktop: true, mobile: true },
  offers: { desktop: true, mobile: true },
  catalog: { desktop: true, mobile: true },
  recommendations: { desktop: true, mobile: true },
  about: { desktop: true, mobile: true }
};

// Add app IDs here to hide their cards from the catalog and recommendations.
const HIDDEN_CATALOG_APPS = [];

module.exports = { HOME_SECTION_VISIBILITY, HIDDEN_CATALOG_APPS };
