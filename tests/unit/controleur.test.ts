// Contrôleur de la visite (contrat, section 4) : parcours nominal, reprises et branches.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { type EtatVisite, type Evenement, etatInitial, transition } from '../../src/visite/controleur.ts';

const jouer = (depart: EtatVisite, ...evenements: Evenement[]) => evenements.reduce(transition, depart);
const enLecture = () =>
  jouer(etatInitial(12), { type: 'START' }, { type: 'CHOOSE_SOUND', avecSon: true }, { type: 'READY' });

test('parcours nominal : choix du son, chargement, lecture, fin ouverte', () => {
  const etat = enLecture();
  assert.equal(etat.phase, 'playing');
  assert.equal(etat.son, 'actif');
  const fin = jouer(etat, { type: 'CHAPTER_REACHED', chapitre: 11 }, { type: 'COMPLETE' });
  assert.equal(fin.phase, 'completed');
  assert.equal(fin.chapitre, 11);
});

test('aucun son ni chapitre avant le geste d’entrée', () => {
  const etat = etatInitial(12);
  assert.equal(transition(etat, { type: 'READY' }), etat);
  assert.equal(transition(etat, { type: 'RESUME' }), etat);
  assert.equal(transition(etat, { type: 'CHAPTER_REACHED', chapitre: 3 }), etat);
});

test('le choix silencieux est mémorisé pour la session', () => {
  const silence = jouer(etatInitial(12), { type: 'START' }, { type: 'CHOOSE_SOUND', avecSon: false });
  assert.equal(silence.son, 'silence');
  const relance = jouer(silence, { type: 'READY' }, { type: 'EXIT' }, { type: 'START' });
  assert.equal(relance.phase, 'loading');
});

test('pause, onglet masqué et reprise manuelle seulement', () => {
  const pause = transition(enLecture(), { type: 'TAB_HIDDEN' });
  assert.equal(pause.phase, 'paused');
  assert.equal(transition(pause, { type: 'TAB_HIDDEN' }), pause);
  assert.equal(transition(pause, { type: 'RESUME' }).phase, 'playing');
});

test('un saut de chapitre se pose en pause, borné aux chapitres existants', () => {
  const saut = transition(enLecture(), { type: 'SEEK_CHAPTER', chapitre: 5 });
  assert.deepEqual([saut.phase, saut.chapitre], ['paused', 5]);
  assert.equal(transition(saut, { type: 'SEEK_CHAPTER', chapitre: 99 }).chapitre, 11);
  assert.equal(transition(saut, { type: 'SEEK_CHAPTER', chapitre: -3 }).chapitre, 0);
});

test('étude de cas : la visite s’arrête, le retour se fait au même chapitre, en pause', () => {
  const etude = jouer(
    enLecture(),
    { type: 'CHAPTER_REACHED', chapitre: 5 },
    { type: 'OPEN_CASE', projet: 'ziris' },
  );
  assert.deepEqual([etude.phase, etude.etude], ['deep-dive', 'ziris']);
  const retour = transition(etude, { type: 'CLOSE_CASE' });
  assert.deepEqual([retour.phase, retour.chapitre, retour.etude], ['paused', 5, null]);
});

test('audio bloqué : la visite continue en silence', () => {
  const etat = transition(enLecture(), { type: 'AUDIO_BLOCKED' });
  assert.deepEqual([etat.phase, etat.son], ['playing', 'bloque']);
});

test('mouvement réduit en cours de visite : état figé, position conservée', () => {
  const etat = jouer(
    enLecture(),
    { type: 'CHAPTER_REACHED', chapitre: 4 },
    { type: 'REDUCED_MOTION', actif: true },
  );
  assert.deepEqual([etat.phase, etat.chapitre, etat.mouvement], ['paused', 4, 'reduit']);
});

test('WebGL indisponible : version légère, sans changer la phase', () => {
  const etat = transition(enLecture(), { type: 'WEBGL_UNAVAILABLE' });
  assert.deepEqual([etat.phase, etat.rendu], ['playing', 'leger']);
});

test('erreur de chargement puis nouvel essai', () => {
  const erreur = jouer(
    etatInitial(12),
    { type: 'START' },
    { type: 'CHOOSE_SOUND', avecSon: false },
    { type: 'FAIL' },
  );
  assert.equal(erreur.phase, 'error');
  assert.equal(transition(erreur, { type: 'RETRY' }).phase, 'loading');
});

test('Échap mène à la vue libre et garde le chapitre comme point de reprise', () => {
  const sortie = jouer(enLecture(), { type: 'CHAPTER_REACHED', chapitre: 7 }, { type: 'EXIT' });
  assert.deepEqual([sortie.phase, sortie.chapitre], ['idle', 7]);
});

test('mouvement réduit dès l’entrée : storyboard manuel, ouvert en pause', () => {
  const etat = jouer(
    etatInitial(12, { mouvement: 'reduit' }),
    { type: 'START' },
    { type: 'CHOOSE_SOUND', avecSon: false },
    { type: 'READY' },
  );
  assert.equal(etat.phase, 'paused');
  assert.equal(transition(etat, { type: 'SEEK_CHAPTER', chapitre: 1 }).chapitre, 1);
});

test('étapes : un chapitre atteint repart en approche, un saut se pose en lecture', () => {
  const arrivee = transition(enLecture(), { type: 'CHAPTER_REACHED', chapitre: 2 });
  assert.equal(arrivee.etape, 'approche');
  const lecture = transition(arrivee, { type: 'STAGE_REACHED', etape: 'lecture' });
  assert.equal(lecture.etape, 'lecture');
  const saut = transition(arrivee, { type: 'SEEK_CHAPTER', chapitre: 4 });
  assert.equal(saut.etape, 'lecture');
  // Hors lecture, l'étape ne bouge plus : la pause fige ce qui est à l'écran.
  const pause = transition(arrivee, { type: 'PAUSE' });
  assert.equal(transition(pause, { type: 'STAGE_REACHED', etape: 'lecture' }), pause);
});

test('revoir la visite repart du premier chapitre', () => {
  const fin = jouer(enLecture(), { type: 'CHAPTER_REACHED', chapitre: 11 }, { type: 'COMPLETE' });
  const revoir = transition(fin, { type: 'START' });
  assert.equal(revoir.phase, 'loading');
  assert.equal(revoir.chapitre, 0);
});
