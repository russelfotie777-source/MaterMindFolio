// Chapitres de la visite : contigus, 107 secondes, fragments stables et projets dans l'ordre du storyboard.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CHAPITRES, DUREE_TOTALE, chapitreA, chapitreDuFragment } from '../../src/visite/chapitres.ts';

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
