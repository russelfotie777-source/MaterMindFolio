'use client';

import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import pageStyles from '@/styles/page.module.css';

import { CHAPITRES, chapitreDuFragment } from './chapitres';
import { Monogramme } from './Monogramme';
import type { Scene } from './scene/demarrer';
import { creerStoreVisite } from './store';

import styles from './IlotVisite.module.css';

function webgl2Disponible(): boolean {
  try {
    return Boolean(
      document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

// Îlot de la visite (ADR-004, section 2, point 6) : seul composant client du lot G3. Le DOM porte
// chapitres, actions et player ; le canvas est décoratif, masqué aux technologies d'assistance et
// sans élément focalisable. Three.js, R3F et GSAP ne sont chargés qu'après le geste d'entrée.
// Le moteur audio arrive au lot G6 : d'ici là, le choix sonore est mémorisé mais la visite est muette.
//
// Belvédère neutre (DR-1, vue A05) : média et panneau sont rendus côté serveur pour chaque projet ; l'îlot
// les monte dès l'approche, invisibles et inertes, pour que le média soit chargé avant l'arrêt de la caméra.
//
// Ouverture (storyboard, section 2) : identité, monogramme et index égal des six projets sont des couches
// DOM décoratives posées sur le canvas, montées au geste d'entrée seulement, et dont la scène choisit la
// couche visible à chaque image. Leur contenu reste disponible dans la page.
export type Belvedere = { nom: string; media: ReactNode; texte: ReactNode };

const NOMS_PROJETS = CHAPITRES.filter((chapitre) => chapitre.projet).map((chapitre) => chapitre.libelle);

export function IlotVisite({
  ciel,
  identite,
  belvederes,
  children,
}: {
  ciel: { mobile: string; bureau: string };
  identite: ReactNode;
  belvederes: Readonly<Record<string, Belvedere>>;
  children: ReactNode;
}) {
  const [store] = useState(() => creerStoreVisite());
  const etat = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const canvas = useRef<HTMLCanvasElement>(null);
  const dialogue = useRef<HTMLDialogElement>(null);
  const demarrer = useRef<HTMLButtonElement>(null);
  const scene = useRef<Scene | null>(null);
  const ilot = useRef<HTMLElement>(null);
  const ouverture = useRef<HTMLDivElement>(null);
  // L'ouverture n'est montée que pour une visite immersive qui part de l'image 0 : ses images se
  // chargent pendant le choix sonore, et rien n'est téléchargé avant le geste.
  const [ouvertureMontee, setOuvertureMontee] = useState(false);

  // Préférences et environnement : mouvement réduit, onglet masqué, réseau, fragment partagé.
  useEffect(() => {
    const reduit = matchMedia('(prefers-reduced-motion: reduce)');
    const surMouvement = () => store.envoyer({ type: 'REDUCED_MOTION', actif: reduit.matches });
    const surVisibilite = () => document.hidden && store.envoyer({ type: 'TAB_HIDDEN' });
    const surReseau = () => store.envoyer({ type: 'NETWORK', enLigne: navigator.onLine });
    surMouvement();
    const fragment = chapitreDuFragment(location.hash);
    if (fragment !== null) store.setState({ chapitre: fragment });
    reduit.addEventListener('change', surMouvement);
    document.addEventListener('visibilitychange', surVisibilite);
    addEventListener('online', surReseau);
    addEventListener('offline', surReseau);
    return () => {
      reduit.removeEventListener('change', surMouvement);
      document.removeEventListener('visibilitychange', surVisibilite);
      removeEventListener('online', surReseau);
      removeEventListener('offline', surReseau);
    };
  }, [store]);

  // Choix sonore : <dialog> natif, focus initial sur le premier choix, retour du focus au déclencheur.
  useEffect(() => {
    const boite = dialogue.current;
    if (!boite) return;
    if (etat.phase === 'sound-choice' && !boite.open) boite.showModal();
    if (etat.phase !== 'sound-choice' && boite.open) boite.close();
  }, [etat.phase]);

  // Chargement : WebGL2 vérifié, puis scène importée à la demande ; sinon version légère.
  useEffect(() => {
    if (etat.phase !== 'loading') return;
    if (scene.current) {
      store.envoyer({ type: 'READY' });
      return;
    }
    if (etat.rendu === 'leger' || !webgl2Disponible()) {
      store.envoyer({ type: 'WEBGL_UNAVAILABLE' });
      store.envoyer({ type: 'READY' });
      return;
    }
    let annule = false;
    // L'image 0 doit être prête avant la lecture : le portrait n'apparaît jamais en fondu.
    const imagesOuverture = [...(ouverture.current?.querySelectorAll('img') ?? [])];
    import('./scene/demarrer')
      .then(({ demarrerScene }) =>
        demarrerScene(
          canvas.current!,
          store,
          matchMedia('(max-width: 767px)').matches ? ciel.mobile : ciel.bureau,
          ouverture.current,
        ),
      )
      .then(async (monte) => {
        await Promise.all(imagesOuverture.map((image) => image.decode().catch(() => undefined)));
        return monte;
      })
      .then((monte) => {
        if (annule) return monte.detruire();
        scene.current = monte;
        store.envoyer({ type: 'READY' });
      })
      .catch(() => store.envoyer({ type: 'FAIL' }));
    return () => {
      annule = true;
    };
  }, [etat.phase, etat.rendu, store, ciel]);

  // Perte du contexte WebGL en cours de visite : canvas retiré, faits et actions conservés.
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const surPerte = () => {
      scene.current?.detruire();
      scene.current = null;
      store.envoyer({ type: 'WEBGL_UNAVAILABLE' });
    };
    element.addEventListener('webglcontextlost', surPerte);
    return () => element.removeEventListener('webglcontextlost', surPerte);
  }, [store]);

  useEffect(() => () => scene.current?.detruire(), []);

  // Le fragment nomme le chapitre courant, jamais un instant ; Échap quitte vers la vue libre.
  const enVisite = etat.phase === 'playing' || etat.phase === 'paused';
  useEffect(() => {
    if (!enVisite) return;
    history.replaceState(null, '', `#${CHAPITRES[etat.chapitre]!.id}`);
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') store.envoyer({ type: 'EXIT' });
    };
    addEventListener('keydown', surTouche);
    return () => removeEventListener('keydown', surTouche);
  }, [enVisite, etat.chapitre, store]);

  useEffect(() => {
    if (etat.phase === 'idle') demarrer.current?.focus({ preventScroll: true });
    // La scène entière doit être visible quand la visite commence.
    if (etat.phase === 'loading') ilot.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [etat.phase]);

  const chapitre = CHAPITRES[etat.chapitre]!;
  const belvedere = enVisite && chapitre.projet ? belvederes[chapitre.projet] : undefined;
  // Mouvement → immobilité → information : le panneau n'est lisible que caméra arrêtée.
  const lisible = etat.etape === 'lecture';
  const sceneVisible = etat.rendu === 'webgl' && etat.phase !== 'idle' && etat.phase !== 'sound-choice';

  return (
    <section ref={ilot} className={styles.ilot} aria-label="Visite guidée">
      <div className={styles.scene}>
        {!sceneVisible && <div className={styles.poster}>{children}</div>}
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" hidden={!sceneVisible} />
        {ouvertureMontee && (
          <div ref={ouverture} className={styles.ouverture} aria-hidden="true" hidden={!sceneVisible}>
            <div className={styles.identite}>{identite}</div>
            <div className={styles.monogramme}>
              <Monogramme />
            </div>
            <ol role="list" className={styles.index}>
              {NOMS_PROJETS.map((nom) => (
                <li key={nom}>{nom}</li>
              ))}
            </ol>
          </div>
        )}
        {belvedere && (
          <div
            key={chapitre.id}
            className={styles.belvedere}
            data-etape={etat.etape}
            inert={!lisible}
            aria-hidden={!lisible}
          >
            {belvedere.media && <div className={styles.media}>{belvedere.media}</div>}
            <div className={styles.panneau}>
              {belvedere.texte}
              <p>
                {/* Approfondir fige d'abord la visite ; le fragment garde le chapitre pour le retour. */}
                <a
                  className={pageStyles.bouton}
                  href={`/projets/${chapitre.projet}`}
                  onClick={() => store.envoyer({ type: 'OPEN_CASE', projet: chapitre.projet! })}
                >
                  Approfondir<span className="visuellement-cache"> : {belvedere.nom}</span>
                </a>
              </p>
            </div>
          </div>
        )}
        {etat.rendu === 'leger' && (
          <p className={`${pageStyles.etiquette} ${styles.leger}`}>Version légère active</p>
        )}
      </div>

      {(etat.phase === 'idle' || etat.phase === 'completed') && (
        <p className={styles.entree}>
          <button
            ref={demarrer}
            type="button"
            className={pageStyles.boutonClair}
            onClick={() => {
              const { phase, chapitre, mouvement, rendu } = store.getState();
              if (phase === 'idle' && chapitre === 0 && mouvement === 'immersif' && rendu === 'webgl') {
                setOuvertureMontee(true);
              }
              store.envoyer({ type: 'START' });
            }}
          >
            {etat.phase === 'completed' ? 'Revoir la visite' : 'Démarrer la visite'}
          </button>
        </p>
      )}

      {etat.phase === 'loading' && <p className={styles.attente}>Préparation de la visite…</p>}

      {etat.phase === 'error' && (
        <div className={styles.erreur} role="alert">
          <p>La scène n’a pas chargé. Les projets restent accessibles ci-dessous.</p>
          <button
            type="button"
            className={pageStyles.boutonClair}
            onClick={() => store.envoyer({ type: 'RETRY' })}
          >
            Réessayer
          </button>
        </div>
      )}

      {enVisite && (
        <div className={styles.player} role="group" aria-label="Lecteur de la visite">
          <button
            type="button"
            className={styles.commande}
            onClick={() => store.envoyer({ type: etat.phase === 'playing' ? 'PAUSE' : 'RESUME' })}
          >
            {etat.phase === 'playing' ? 'Pause' : 'Reprendre'}
          </button>
          <p className={styles.progression}>
            <span className={styles.numero}>
              {String(etat.chapitre + 1).padStart(2, '0')}/{CHAPITRES.length}
            </span>{' '}
            {chapitre.libelle}
            <span className="visuellement-cache">
              , chapitre {etat.chapitre + 1} sur {CHAPITRES.length}
            </span>
          </p>
          <button
            type="button"
            className={styles.commande}
            disabled={etat.chapitre === 0}
            onClick={() => store.envoyer({ type: 'SEEK_CHAPTER', chapitre: etat.chapitre - 1 })}
          >
            Précédent
          </button>
          <button
            type="button"
            className={styles.commande}
            disabled={etat.chapitre === CHAPITRES.length - 1}
            onClick={() => store.envoyer({ type: 'SEEK_CHAPTER', chapitre: etat.chapitre + 1 })}
          >
            Suivant
          </button>
          <button type="button" className={styles.commande} onClick={() => store.envoyer({ type: 'EXIT' })}>
            Quitter
          </button>
        </div>
      )}

      <dialog
        ref={dialogue}
        className={styles.dialogue}
        aria-labelledby="titre-choix-sonore"
        onCancel={(evenement) => {
          evenement.preventDefault();
          store.envoyer({ type: 'EXIT' });
        }}
      >
        <h2 id="titre-choix-sonore">Comment souhaitez-vous entrer ?</h2>
        <div className={styles.choix}>
          {/* Focus initial sur le premier choix, jamais sur « Fermer » (DR-1, 04, section 8). */}
          <button
            type="button"
            className={pageStyles.boutonClair}
            autoFocus
            onClick={() => store.envoyer({ type: 'CHOOSE_SOUND', avecSon: true })}
          >
            Entrer avec le son — recommandé
          </button>
          <button
            type="button"
            className={pageStyles.boutonClair}
            onClick={() => store.envoyer({ type: 'CHOOSE_SOUND', avecSon: false })}
          >
            Continuer en silence
          </button>
        </div>
        <button type="button" className={styles.fermer} onClick={() => store.envoyer({ type: 'EXIT' })}>
          Fermer et rester ici
        </button>
      </dialog>
    </section>
  );
}
