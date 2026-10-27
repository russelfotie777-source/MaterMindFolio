// Ouverture 0–10 s : coupes franches aux instants du storyboard et tracé à vitesse constante.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { instantStable } from '../../src/visite/chapitres.ts';
import { PRIMITIVES, VUE_MONOGRAMME } from '../../src/visite/monogramme.ts';
import { OUVERTURE, coucheA, segmenter } from '../../src/visite/ouverture.ts';

test('coupes de l’ouverture : identité, monogramme, pierre, index, monde', () => {
  assert.equal(coucheA(0), 'identite');
  assert.equal(coucheA(0.89), 'identite');
  assert.equal(coucheA(0.9), 'monogramme');
  assert.equal(coucheA(2.99), 'monogramme');
  assert.equal(coucheA(3), 'scene');
  assert.equal(coucheA(6), 'index');
  assert.equal(coucheA(7.79), 'index');
  assert.equal(coucheA(7.8), 'scene');
  assert.equal(coucheA(40), 'scene');
});

test('tracé révélé de 1,00 à 2,65 s puis 350 ms immobile, allumage d’au moins 400 ms', () => {
  assert.equal(OUVERTURE.trace.debut, 1);
  assert.equal(OUVERTURE.trace.fin, 2.65);
  assert.ok(OUVERTURE.matchCut - OUVERTURE.trace.fin >= 0.35 - 1e-9);
  assert.ok(OUVERTURE.allumage.duree >= 0.4);
});

test('l’image stable de l’ouverture est le monde complet, après l’exposition', () => {
  assert.equal(instantStable(0), OUVERTURE.exposition.fin);
  assert.equal(coucheA(instantStable(0)), 'scene');
});

test('les primitives du monogramme se révèlent l’une après l’autre, au prorata de leur longueur', () => {
  assert.deepEqual(segmenter(0, [100, 300]), [0, 0]);
  assert.deepEqual(segmenter(0.125, [100, 300]), [0.5, 0]);
  assert.deepEqual(segmenter(0.5, [100, 300]), [1, 1 / 3]);
  assert.deepEqual(segmenter(1, [100, 300]), [1, 1]);
  assert.deepEqual(segmenter(2, [100, 300]), [1, 1]);
});

test('le monogramme de l’îlot est exactement le master de Codex, dans son ordre', () => {
  const master = readFileSync('design/releases/DR-1/assets/trace-237-monogram.svg', 'utf8');
  const formes = [...master.matchAll(/<(path|circle) ([^>]*)\/>/g)].map(([, forme, attributs]) => {
    const attribut = (nom: string) => new RegExp(`\\b${nom}="([^"]*)"`).exec(attributs!)![1]!;
    return forme === 'path'
      ? { forme, d: attribut('d'), epaisseur: Number(attribut('stroke-width')) }
      : {
          forme,
          cx: Number(attribut('cx')),
          cy: Number(attribut('cy')),
          r: Number(attribut('r')),
          epaisseur: Number(attribut('stroke-width')),
        };
  });
  assert.deepEqual(formes, PRIMITIVES);
  assert.ok(master.includes(`viewBox="${VUE_MONOGRAMME}"`));
});
