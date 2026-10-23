import { expect, type Page, test } from '@playwright/test';

// Îlot de la visite (G3, ADR-004) : entrée volontaire, choix sonore, player, version légère, mouvement
// réduit et CSP. Ces tests ne supposent pas de GPU : sans WebGL, la visite doit rester complète.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const violations: string[] = [];
    Object.assign(window, { __violations: violations });
    document.addEventListener('securitypolicyviolation', (event) => {
      violations.push(`${event.violatedDirective} ${event.blockedURI || 'inline'}`);
    });
  });
});

const violationsCsp = (page: Page) =>
  page.evaluate(() => (window as unknown as { __violations: string[] }).__violations);

async function entrer(page: Page) {
  await page.goto('/visite');
  await page.getByRole('button', { name: 'Démarrer la visite' }).click();
  await page.getByRole('button', { name: 'Continuer en silence' }).click();
  return page.getByRole('group', { name: 'Lecteur de la visite' });
}

test('rien ne démarre avant le geste d’entrée', async ({ page }) => {
  await page.goto('/visite');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('group', { name: 'Lecteur de la visite' })).toHaveCount(0);
  await expect(page.locator('canvas')).toBeHidden();
  expect(page.url()).not.toContain('#');
});

test('choix sonore : dialogue nommé, focus sur le premier choix, Échap revient au déclencheur', async ({
  page,
}) => {
  await page.goto('/visite');
  const demarrer = page.getByRole('button', { name: 'Démarrer la visite' });
  await demarrer.click();
  const dialogue = page.getByRole('dialog', { name: 'Comment souhaitez-vous entrer ?' });
  await expect(dialogue).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrer avec le son — recommandé' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialogue).toBeHidden();
  await expect(demarrer).toBeFocused();
});

test('player : pause, chapitres et fragment stable, sans violation CSP', async ({ page }) => {
  const player = await entrer(page);
  await expect(player).toBeVisible({ timeout: 15_000 });
  await expect(player).toContainText('01/12');
  await player.getByRole('button', { name: 'Suivant' }).click();
  await expect(player).toContainText('02/12');
  // Un saut se pose en pause et ne reprend que sur action.
  await expect(player.getByRole('button', { name: 'Reprendre' })).toBeVisible();
  await expect(page).toHaveURL(/#base-237-source$/);
  await player.getByRole('button', { name: 'Suivant' }).click();
  // Belvédère : caméra posée, panneau lisible avec rôle, preuve et une seule action.
  const ilot = page.getByRole('region', { name: 'Visite guidée' });
  await expect(ilot.getByRole('heading', { name: 'Fast Shipping logistique' })).toBeVisible();
  await expect(ilot.getByText(/^Preuve : /)).toBeVisible();
  await expect(ilot.getByRole('link', { name: /^Approfondir/ })).toHaveAttribute(
    'href',
    '/projets/fast-shipping-logistics',
  );
  await expect(player.getByRole('link')).toHaveCount(0);
  await player.getByRole('button', { name: 'Menu' }).click();
  await player.getByRole('button', { name: 'Quitter la visite' }).click();
  await expect(page.getByRole('button', { name: 'Démarrer la visite' })).toBeVisible();
  expect(await violationsCsp(page)).toEqual([]);
});

test('WebGL indisponible : version légère annoncée, mêmes chapitres et actions', async ({ page }) => {
  await page.addInitScript(() => {
    const origine = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...reste: unknown[]
    ) {
      return type.startsWith('webgl')
        ? null
        : (origine as (...a: unknown[]) => unknown).call(this, type, ...reste);
    } as typeof origine;
  });
  const player = await entrer(page);
  await expect(page.getByText('Version légère active')).toBeVisible();
  await expect(player).toBeVisible();
  await expect(page.locator('canvas')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Fast Shipping logistique' })).toBeVisible();
});

test.describe('mouvement réduit', () => {
  test.use({ reducedMotion: 'reduce' });

  test('storyboard manuel : la visite s’ouvre en pause, sans caméra automatique', async ({ page }) => {
    const player = await entrer(page);
    await expect(player.getByRole('button', { name: 'Reprendre' })).toBeVisible({ timeout: 15_000 });
    await player.getByRole('button', { name: 'Suivant' }).click();
    await expect(player).toContainText('02/12');
  });
});

test('belvédère : un fragment partagé ouvre sur la pose stable, panneau lisible', async ({ page }) => {
  // Horloge figée : avec WebGL, la visite avancerait sinon jusqu'au retrait du panneau.
  await page.clock.install();
  await page.goto('/visite#project-ziris');
  await page.clock.pauseAt(Date.now() + 60_000);
  await page.getByRole('button', { name: 'Démarrer la visite' }).click();
  await page.getByRole('button', { name: 'Continuer en silence' }).click();
  const player = page.getByRole('group', { name: 'Lecteur de la visite' });
  await expect(player).toBeVisible({ timeout: 15_000 });
  const panneau = page.locator('[data-etape]');
  // Un fragment partagé ouvre sur la pose stable du chapitre, contenu visible.
  await expect(panneau).toHaveAttribute('data-etape', 'lecture');
  await expect(
    page.getByRole('region', { name: 'Visite guidée' }).getByRole('heading', { name: /^ZIRIS/ }),
  ).toBeVisible();
  expect(await violationsCsp(page)).toEqual([]);
});

test('menu du player : disclosure, index des douze chapitres, Échap le referme sans quitter', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/visite');
  await page.clock.pauseAt(Date.now() + 60_000);
  await page.getByRole('button', { name: 'Démarrer la visite' }).click();
  await page.getByRole('button', { name: 'Continuer en silence' }).click();
  const player = page.getByRole('group', { name: 'Lecteur de la visite' });
  await expect(player).toBeVisible({ timeout: 15_000 });
  const menu = player.getByRole('button', { name: 'Menu' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menu')).toHaveCount(0);
  const chapitres = page.locator('#menu-visite ol').getByRole('button');
  await expect(chapitres).toHaveCount(12);
  await expect(chapitres.first()).toHaveAttribute('aria-current', 'step');
  await chapitres.filter({ hasText: 'Parcours' }).focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(player).toBeVisible();
  // Un chapitre choisi dans l'index se pose en pause sur son image stable.
  await menu.click();
  await chapitres.filter({ hasText: 'Parcours' }).click();
  await expect(player).toContainText('10/12');
  await expect(player.getByRole('button', { name: 'Reprendre' })).toBeVisible();
  await expect(menu).toBeFocused();
  await expect(page).toHaveURL(/#career$/);
  expect(await violationsCsp(page)).toEqual([]);
});
