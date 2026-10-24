'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { vueDeRoute } from './parcours';
import type { Monde, TexturesMonde } from './scene/monter';

import styles from './UniversSite.module.css';

type Paire = { mobile: string; bureau: string };
export type TexturesUnivers = {
  cartes: Record<keyof TexturesMonde['cartes'], Paire>;
  ecrans: string[];
  liens: string[];
  slugs: string[];
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

// L'univers du site (décision de Russel du 24 octobre 2026) : un seul monde 3D, monté une fois dans la
// mise en page et conservé d'une page à l'autre. Sur l'accueil, la caméra suit le défilement ; ailleurs,
// elle vole vers le point de vue de la route, derrière un voile qui garde le texte lisible. Le HTML reste
// le contenu : mouvement réduit, économie de données, WebGL absent ou perdu laissent le site statique.
export function UniversSite({ textures }: { textures: TexturesUnivers }) {
  const scene = useRef<HTMLDivElement>(null);
  const trait = useRef<SVGSVGElement>(null);
  const monde = useRef<Monde | null>(null);
  const [monte, setMonte] = useState(false);
  const chemin = usePathname();
  // Le routeur change d'identité au fil des rendus : la scène, montée une fois, lit toujours le dernier.
  const routeurCourant = useRouter();
  const routeur = useRef(routeurCourant);
  useEffect(() => {
    routeur.current = routeurCourant;
  }, [routeurCourant]);

  // La visite guidée a sa propre scène : l'univers n'y est pas monté, jamais deux contextes WebGL.
  const actif = !chemin.startsWith('/visite');

  useEffect(() => {
    const conteneur = scene.current;
    const ligne = trait.current;
    if (!actif || !ligne) return;
    const connexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (
      !conteneur ||
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
    // Un canvas neuf à chaque montage : un montage annulé (double effet du mode strict en
    // développement, retour sur une page) perd son contexte WebGL sans jamais éteindre le suivant.
    const element = document.createElement('canvas');
    conteneur.append(element);
    let annule = false;
    const eteindre = () => {
      monde.current?.detruire();
      monde.current = null;
      delete racine.dataset.monde;
    };
    element.addEventListener('webglcontextlost', eteindre);
    import('./scene/monter')
      .then(({ monterMonde }) =>
        monterMonde(
          element,
          { cartes, ecrans: textures.ecrans, liens: textures.liens },
          {
            pret: () => {
              racine.dataset.monde = 'actif';
            },
            naviguer: (lien) => routeur.current.push(lien),
            trait: ligne,
          },
        ),
      )
      .then((resultat) => {
        if (annule) return resultat.detruire();
        monde.current = resultat;
        setMonte(true);
      })
      .catch(eteindre);
    return () => {
      annule = true;
      element.removeEventListener('webglcontextlost', eteindre);
      eteindre();
      element.remove();
      setMonte(false);
    };
  }, [textures, actif]);

  // À chaque route, la caméra reçoit sa nouvelle page : les sections de l'accueil ou un point de vue.
  useEffect(() => {
    if (!monte || !monde.current || !actif) return;
    const racine = document.documentElement;
    const vue = vueDeRoute(chemin, textures.slugs, innerWidth < innerHeight);
    racine.dataset.pageMonde = vue === null ? 'accueil' : 'arret' in vue ? 'arret' : 'interieure';
    monde.current.definirPage(
      vue ?? { sections: [...document.querySelectorAll<HTMLElement>('[data-monde-section]')] },
    );
  }, [chemin, monte, actif, textures.slugs]);

  return (
    <>
      <div ref={scene} className={styles.monde} aria-hidden="true">
        {/* Trait de lumière qui relie l'écran 3D d'une île au cartouche de son projet. */}
        <svg ref={trait} className={styles.trait} focusable="false">
          <polyline />
          <circle r="4" />
          <circle r="4" className={styles.onde} />
          <circle r="3" />
        </svg>
      </div>
      <div className={styles.voile} aria-hidden="true" />
    </>
  );
}
