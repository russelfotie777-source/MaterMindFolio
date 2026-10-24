import { expect, type Page, test } from '@playwright/test';

// Monde 3D de l'accueil (décision de Russel du 24 octobre 2026), sous WebGL logiciel de Chromium
// (projet « chromium-webgl »). Le HTML reste le contenu : le monde n'est qu'un décor animé.
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

test('le monde s’allume dès l’entrée, décoratif et sans violation CSP', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-monde', 'actif', { timeout: 30_000 });
  // Un seul canvas, dans un conteneur masqué aux technologies d'assistance et sans pointeur.
  const univers = page.locator('body > div[aria-hidden="true"]').filter({ has: page.locator('canvas') });
  await expect(univers).toHaveCount(1);
  await expect(univers.locator('canvas')).toHaveCount(1);
  await expect(univers).toHaveCSS('pointer-events', 'none');
  // Le titre, l'identité et les actions restent du HTML au-dessus du monde.
  await expect(page.getByRole('heading', { level: 1, name: 'MASTERMIND' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Entrer dans le monde' })).toBeVisible();
  // Avec le monde, l'écran flottant remplace la capture de secours.
  await expect(page.locator('section[data-monde-section] figure').first()).toBeHidden();
  expect(await violationsCsp(page)).toEqual([]);
});

test('chaque île a son panneau : rôle, preuve et étude de cas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-monde', 'actif', { timeout: 30_000 });
  await page.getByRole('link', { name: 'Entrer dans le monde' }).click();
  const premier = page.getByRole('region', { name: 'Fast Shipping logistique' });
  await expect(premier.getByRole('link', { name: /^Étude de cas/ })).toBeInViewport();
  await expect(premier.getByText(/^Preuve : /)).toBeVisible();
  await expect(page.locator('section[data-monde-section]')).toHaveCount(8);
});

test.describe('sans mouvement', () => {
  test.use({ reducedMotion: 'reduce' });

  test('mouvement réduit : aucun monde, captures réelles et décor d’aube', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).not.toHaveAttribute('data-monde', /.*/);
    await expect(page.locator('section[data-monde-section] figure').first()).toBeVisible();
    await expect(page.locator('img[src*="/media/approved/aube-"]')).toBeVisible();
  });
});
