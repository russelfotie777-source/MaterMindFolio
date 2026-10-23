// Pages d'erreur (DR-1, 03_ECRANS_ETATS, section 5) : on ne peut pas faire échouer une page statique
// en production, donc les composants sont rendus et actionnés ici. Lancé par `pnpm test:composants`.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Erreur from '@/app/error';
import ErreurGlobale from '@/app/global-error';

// Erreur serveur telle que Next.js la transmet : un message interne et une empreinte.
const erreur = Object.assign(new Error('détail interne du serveur'), { digest: '3127410896' });

function bouton(noeud: ReactNode): ReactElement<{ onClick: () => void }> | null {
  if (!isValidElement<{ children?: ReactNode; onClick?: () => void }>(noeud)) {
    return Array.isArray(noeud) ? (noeud.map(bouton).find(Boolean) ?? null) : null;
  }
  if (noeud.type === 'button') return noeud as ReactElement<{ onClick: () => void }>;
  return bouton(noeud.props.children);
}

for (const [nom, Composant, titre] of [
  ['error.tsx', Erreur, 'Cette page n’a pas pu s’afficher'],
  ['global-error.tsx', ErreurGlobale, 'Le site n’a pas pu s’afficher'],
] as const) {
  test(`${nom} : titre, identifiant non sensible, aucun style en ligne`, () => {
    const html = renderToStaticMarkup(<Composant error={erreur} retry={() => {}} />);
    assert.match(html, new RegExp(`<h1[^>]*>${titre}</h1>`));
    assert.match(html, /Identifiant : 3127410896/);
    assert.doesNotMatch(html, /détail interne/);
    assert.doesNotMatch(html, /\sstyle=/);
  });

  test(`${nom} : « Réessayer » relance le rendu`, () => {
    let appels = 0;
    const element = Composant({ error: erreur, retry: () => (appels += 1) });
    const reessayer = bouton(element);
    assert.ok(reessayer, 'bouton absent');
    reessayer.props.onClick();
    assert.equal(appels, 1);
  });
}

test('error.tsx : routes alternatives vers les projets et le résumé', () => {
  const html = renderToStaticMarkup(<Erreur error={erreur} retry={() => {}} />);
  assert.match(html, /href="\/projets"/);
  assert.match(html, /href="\/resume-recruteur"/);
});

test('global-error.tsx : document autonome en français, sans feuille de style', () => {
  const html = renderToStaticMarkup(<ErreurGlobale error={erreur} retry={() => {}} />);
  assert.match(html, /^<html lang="fr">/);
  assert.doesNotMatch(html, /<link|<style/);
  assert.match(html, /href="\/"/);
});

test('une erreur sans empreinte n’affiche pas d’identifiant', () => {
  const html = renderToStaticMarkup(<Erreur error="valeur levée côté client" retry={() => {}} />);
  assert.doesNotMatch(html, /Identifiant/);
});
