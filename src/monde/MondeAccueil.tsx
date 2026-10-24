'use client';

import { useEffect, useRef } from 'react';

import type { Monde, TexturesMonde } from './scene/monter';

import styles from './MondeAccueil.module.css';

type Paire = { mobile: string; bureau: string };
export type TexturesAccueil = {
  cartes: Record<keyof TexturesMonde['cartes'], Paire>;
  ecrans: string[];
  liens: string[];
};

function webgl2Disponible(): boolean {
  try {
    return Boolean(
      document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

// Le monde 3D de l'accueil (décision de Russel du 24 octobre 2026) : un canvas fixe plein écran derrière
// toute la page, monté dès l'hydratation. Le HTML reste le contenu, lisible sans lui : mouvement réduit,
// économie de données, WebGL absent ou perdu laissent la version statique, complète.
export function MondeAccueil({ textures }: { textures: TexturesAccueil }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const connexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (
      !element ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      connexion?.saveData ||
      !webgl2Disponible()
    ) {
      return;
    }
    const racine = document.documentElement;
    const format = matchMedia('(max-width: 767px)').matches ? 'mobile' : 'bureau';
    const cartes = Object.fromEntries(
      Object.entries(textures.cartes).map(([id, paire]) => [id, paire[format]]),
    ) as TexturesMonde['cartes'];
    const sections = [...document.querySelectorAll<HTMLElement>('[data-monde-section]')];
    let monde: Monde | null = null;
    let annule = false;
    const eteindre = () => {
      monde?.detruire();
      monde = null;
      delete racine.dataset.monde;
    };
    element.addEventListener('webglcontextlost', eteindre);
    import('./scene/monter')
      .then(({ monterMonde }) =>
        monterMonde(element, sections, { cartes, ecrans: textures.ecrans, liens: textures.liens }, () => {
          racine.dataset.monde = 'actif';
        }),
      )
      .then((monte) => {
        if (annule) monte.detruire();
        else monde = monte;
      })
      .catch(eteindre);
    return () => {
      annule = true;
      element.removeEventListener('webglcontextlost', eteindre);
      eteindre();
    };
  }, [textures]);

  return <canvas ref={canvas} className={styles.monde} aria-hidden="true" />;
}
