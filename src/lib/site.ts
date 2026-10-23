// URL publique, base des URL canoniques et du plan du site. Sur Vercel, l'URL de production est fournie
// par la plateforme ; H237_SITE_URL la remplace quand le domaine final sera choisi.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = new URL(
  process.env.H237_SITE_URL ?? (vercel ? `https://${vercel}` : 'http://localhost:3000'),
);

export const NOM_DU_SITE = 'HORIZON 237 · TRACE SOLAIRE';
