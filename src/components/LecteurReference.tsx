'use client';

import { useEffect, useRef, useState } from 'react';

import pageStyles from '@/styles/page.module.css';

import styles from './LecteurReference.module.css';

// Façade du lecteur officiel (ADR-001) : aucune requête vers YouTube avant le clic. Sans JavaScript,
// le lien ouvre la vidéo sur YouTube ; avec, il est remplacé par le lecteur youtube-nocookie, visible
// et d'au moins 200 × 200 px, seul domaine admis par frame-src.
export function LecteurReference({ titre, videoId }: { titre: string; videoId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const lecteur = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (ouvert) lecteur.current?.focus();
  }, [ouvert]);

  if (ouvert) {
    return (
      <iframe
        ref={lecteur}
        className={styles.lecteur}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={`${titre} — lecteur YouTube`}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <a
      className={pageStyles.bouton}
      href={`https://www.youtube.com/watch?v=${videoId}`}
      onClick={(evenement) => {
        evenement.preventDefault();
        setOuvert(true);
      }}
    >
      Écouter sur YouTube<span className="visuellement-cache"> : {titre}</span>
    </a>
  );
}
