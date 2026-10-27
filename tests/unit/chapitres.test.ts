// Chapitres de la visite : contigus, 107 secondes, fragments stables et projets dans l'ordre du storyboard.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  CHAPITRES,
  DUREE_TOTALE,
  approche,
  chapitreA,
  chapitreDuFragment,
  etapeA,
} from '../../src/visite/chapitres.ts';

test('12 chapitres contigus pour 107 secondes', () => {
  assert.equal(CHAPITRES.length, 12);
  assert.equal(DUREE_TOTALE, 107);
  CHAPITRES.forEach((chapitre, i) => {
    const precedent = CHAPITRES[i - 1];
    assert.equal(chapitre.debut, precedent ? precedent.debut + precedent.duree : 0, chapitre.id);
  });
});

test('six fenêtres projet de 8 secondes exactement, dans l’ordre chronologique', () => {
  const projets = CHAPITRES.filter((chapitre) => chapitre.projet);
  assert.deepEqual(
    projets.map((chapitre) => chapitre.projet),
    ['fast-shipping-logistics', 'batobaye-market', 'mboamarkets', 'ziris', 'shopitech', 'artvibe-cameroun'],
  );
  assert.ok(projets.every((chapitre) => chapitre.duree === 8));
});

test('temps et fragments mènent au bon chapitre', () => {
  assert.equal(chapitreA(0), 0);
  assert.equal(chapitreA(46.5), 5);
  assert.equal(chapitreA(200), 11);
  assert.equal(chapitreDuFragment('#project-ziris'), 5);
  assert.equal(chapitreDuFragment('#inconnu'), null);
});

test('fenêtre projet : 1,5 s d’approche, 5,5 s de lecture, 1 s de sortie', () => {
  const ziris = CHAPITRES.findIndex((chapitre) => chapitre.id === 'project-ziris');
  const { debut } = CHAPITRES[ziris]!;
  assert.equal(approche(ziris), 1.5);
  assert.equal(etapeA(debut), 'approche');
  assert.equal(etapeA(debut + 1.49), 'approche');
  assert.equal(etapeA(debut + 1.5), 'lecture');
  assert.equal(etapeA(debut + 6.99), 'lecture');
  assert.equal(etapeA(debut + 7), 'sortie');
  assert.equal(etapeA(debut + 8), 'approche');
});

test('l’ouverture se lit dès l’image 0', () => {
  assert.equal(etapeA(0), 'lecture');
});
