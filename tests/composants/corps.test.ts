// Corps célestes de la promenade (C3-R5, amendement 5 de Codex). Ce module importe les poses sans
// extension de fichier : il est donc regroupé par esbuild avec les composants, puis lancé par node:test.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CHAPITRES } from '@/visite/chapitres';
import { CORPS, CORPS_ACTIFS_MAXIMUM, corpsActifs } from '@/visite/corps';

test('au plus quatre corps actifs à chaque chapitre', () => {
  CHAPITRES.forEach((chapitre, i) => {
    assert.ok(corpsActifs(i).length <= CORPS_ACTIFS_MAXIMUM, chapitre.id);
  });
});

test('six repères de même rayon, chacun actif pendant sa seule station', () => {
  const projets = CHAPITRES.flatMap((chapitre, i) => (chapitre.projet ? [i] : []));
  const reperes = CORPS.filter((corps) => !corps.avecFirmament);
  assert.deepEqual(
    reperes.map((corps) => corps.id),
    ['lune', 'mars', 'jupiter', 'saturne', 'uranus', 'neptune'],
  );
  assert.equal(new Set(reperes.map((corps) => corps.rayon)).size, 1);
  // Un seul repère par station : le suivant n'apparaît qu'à sa propre station.
  reperes.forEach((corps, k) => assert.deepEqual(corps.chapitres, [projets[k]]));
});

test('tous les corps restent dans le cylindre du ciel', () => {
  for (const { id, position, rayon } of CORPS) {
    assert.ok(Math.hypot(position[0], position[2]) + rayon < 200, id);
  }
});
