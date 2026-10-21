import type { Periode } from '@/lib/faits/projets';

// Dates des faits (AAAA-MM ou AAAA-MM-JJ) rendues en français, sans dépendre du fuseau du build.
const mois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const jour = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formaterMois(moisAnnee: string): string {
  return mois.format(new Date(`${moisAnnee}-01T00:00:00Z`));
}

export function formaterJour(date: string): string {
  return jour.format(new Date(`${date}T00:00:00Z`));
}

export function formaterPeriode({ debut, fin, enCours, approximative }: Periode): string {
  const depart = `${formaterMois(debut)}${approximative ? ' environ' : ''}`;
  if (enCours) return `depuis ${depart}`;
  if (!fin || fin === debut) return depart;
  return `de ${depart} à ${formaterMois(fin)}`;
}
