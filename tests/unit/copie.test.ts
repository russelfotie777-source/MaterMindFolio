// Allowlist mdast de la copy (contrat, section 3.2). Lancé par `pnpm test:unit`, sans dépendance de test.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { analyserCopie, CopieInvalide, lienAutorise } from '../../src/lib/copie/markdown.ts';

test('accepte paragraphes, emphase, gras, listes, code en ligne et liens admis', () => {
  const arbre = analyserCopie(
    'Un *besoin* **réel**, du `code` et [une preuve](https://exemple.cm).\n\n- un\n- deux\n\n1. premier\n',
    'ok.md',
  );
  assert.equal(arbre.children.length, 3);
});

for (const [cas, source] of [
  ['HTML brut en bloc', '<div>x</div>'],
  ['HTML brut en ligne', 'du <b>gras</b>'],
  ['titre ATX', '# Titre'],
  ['titre Setext', 'Titre\n====='],
  ['frontmatter', '---\ntitre: x\n---\n'],
  ['image', '![alt](https://exemple.cm/x.png)'],
  ['bloc de code', '```\ncode\n```'],
  ['citation', '> citation'],
  ['saut de ligne forcé', 'ligne  \nsuite'],
  ['lien par référence', '[x][ref]\n\n[ref]: https://exemple.cm'],
] as const) {
  test(`refuse : ${cas}`, () => {
    assert.throws(() => analyserCopie(source, 'refus.md'), CopieInvalide);
  });
}

test('refuse une copy vide ou de plus de 32 Kio', () => {
  assert.throws(() => analyserCopie('', 'vide.md'), CopieInvalide);
  assert.throws(() => analyserCopie('a'.repeat(32 * 1024 + 1), 'long.md'), CopieInvalide);
});

test('liens : https, relatif et fragment seulement', () => {
  for (const url of ['https://exemple.cm', '/projets/ziris', 'parcours', '#preuve']) {
    assert.ok(lienAutorise(url), url);
  }
  for (const url of [
    'http://exemple.cm',
    'mailto:a@b.cm',
    'javascript:alert(1)',
    '//exemple.cm',
    'data:text/html,x',
  ]) {
    assert.ok(!lienAutorise(url), url);
  }
  assert.throws(() => analyserCopie('[x](mailto:a@b.cm)', 'mail.md'), CopieInvalide);
  assert.throws(() => analyserCopie('<javascript:alert(1)>', 'auto.md'), CopieInvalide);
});
