// Routes publiques du socle G2 ; les études de cas suivent l'ordre du storyboard.
export const SLUGS = [
  'fast-shipping-logistics',
  'batobaye-market',
  'mboamarkets',
  'ziris',
  'shopitech',
  'artvibe-cameroun',
];

export const ROUTES = [
  '/',
  '/visite',
  '/projets',
  ...SLUGS.map((slug) => `/projets/${slug}`),
  '/parcours',
  '/resume-recruteur',
  '/contact',
  '/fabrication',
  '/mentions',
];
