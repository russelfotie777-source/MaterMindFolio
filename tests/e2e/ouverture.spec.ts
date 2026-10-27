import { expect, type Page, test } from '@playwright/test';

// Chorégraphie de l'ouverture (amendement 4 de Codex), image par image : horloge simulée de Playwright et
// WebGL logiciel de Chromium (projet « chromium-webgl » de la configuration). Aucune vraie seconde n'est
// attendue : chaque instant du storyboard est atteint en avançant l'horloge de la page.
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

test.describe('ouverture 0–10 s', () => {
  test('coupes franches : identité, monogramme, pierre à 3 s, index à 6 s, monde complet', async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto('/visite');
    await page.clock.pauseAt(Date.now() + 60_000);
    await page.getByRole('button', { name: 'Démarrer la visite' }).click();
    await page.getByRole('button', { name: 'Continuer en silence' }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible({ timeout: 15_000 });
    test.skip(
      await page.getByRole('region', { name: 'Visite guidée' }).locator('canvas').isHidden(),
      'WebGL2 indisponible sur cette machine',
    );

    const ouverture = page.locator('[data-couche]');
    const etapes: [number, string][] = [
      [300, 'identite'],
      [1_200, 'monogramme'],
      [1_700, 'scene'],
      [3_300, 'index'],
      [1_500, 'scene'],
    ];
    for (const [duree, couche] of etapes) {
      await page.clock.runFor(duree);
      await expect(ouverture).toHaveAttribute('data-couche', couche);
    }
    // Ni l'identité ni le monogramme ne restent apparents sous la scène.
    await expect(ouverture.locator('svg')).toBeHidden();
    expect(await violationsCsp(page)).toEqual([]);
  });
});
