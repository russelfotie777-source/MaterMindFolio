import type { Plateforme } from '@/lib/faits/projets';

// Libellés d'interface des valeurs codées des faits, repris de l'aperçu CR-0 visé par Russel.
export const PLATEFORMES: Record<Plateforme, string> = {
  web: 'Web',
  'web-admin': 'Administration web',
  pwa: 'PWA',
  android: 'Android',
  ios: 'iOS',
};

export function rangSurSix(rang: number): string {
  return `${String(rang).padStart(2, '0')} / 06`;
}
