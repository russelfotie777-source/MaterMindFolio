// Horloge unique de la visite : pause, saut et reprise sans dérive (ADR-004, section 2, point 3).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { bezier, DEPLACEMENT } from '../../src/visite/courbes.ts';
import { creerLecteurTemps } from '../../src/visite/temps.ts';

test('la position suit l’horloge en lecture et se fige en pause', () => {
  let maintenant = 100;
  const temps = creerLecteurTemps(() => maintenant);
  temps.jouer();
  maintenant = 104.5;
  assert.equal(temps.position(), 4.5);
  temps.pause();
  maintenant = 160;
  assert.equal(temps.position(), 4.5);
  temps.jouer();
  maintenant = 161;
  assert.equal(temps.position(), 5.5);
});

test('un saut repart de l’horloge courante, sans dérive accumulée', () => {
  let maintenant = 0;
  const temps = creerLecteurTemps(() => maintenant);
  temps.jouer();
  maintenant = 3;
  temps.aller(46);
  maintenant = 5;
  assert.equal(temps.position(), 48);
  for (let i = 0; i < 1000; i++) {
    temps.pause();
    temps.jouer();
  }
  assert.equal(temps.position(), 48);
});

test('courbes DR-1 : bornes exactes, monotones, symétrie de motion.approach', () => {
  assert.equal(DEPLACEMENT(0), 0);
  assert.equal(DEPLACEMENT(1), 1);
  assert.ok(Math.abs(DEPLACEMENT(0.5) - 0.5) < 1e-6);
  const focus = bezier(0.2, 0, 0, 1);
  let precedent = 0;
  for (let x = 0.01; x <= 1; x += 0.01) {
    const y = focus(x);
    assert.ok(y >= precedent - 1e-9);
    precedent = y;
  }
});
