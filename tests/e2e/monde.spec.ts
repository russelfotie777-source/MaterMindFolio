import { expect, type Page, test } from '@playwright/test';

// Monde 3D de l'accueil (décision de Russel du 24 octobre 2026), sous WebGL logiciel de Chromium
// (projet « chromium-webgl »). Le HTML reste le contenu : le monde n'est qu'un décor animé.
// Sous WebGL logiciel, chaque monde occupe un cœur entier : les tests de ce fichier passent l'un après
// l'autre, pour ne pas affamer la visite rendue à côté d'eux.
test.describe.configure({ mode: 'default', timeout: 60_000 });
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

test('le cartouche se lève à l’arrivée devant l’île, relié à l’écran par le trait', async ({ page }) => {
  // Deux trajets de caméra sous WebGL logiciel : l'aller vers l'île, puis le retour à l'ouverture.
  test.setTimeout(90_000);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-monde', 'actif', { timeout: 30_000 });
  const cartouche = page
    .getByRole('region', { name: 'Fast Shipping logistique' })
    .locator('[data-cartouche]');
  // Pendant le trajet, le texte attend la caméra ; sans carte ni fond.
  await expect(cartouche).toHaveCSS('opacity', '0');
  await expect(cartouche).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.getByRole('link', { name: 'Entrer dans le monde' }).click();
  await expect(cartouche).toHaveCSS('opacity', '1', { timeout: 20_000 });
  const trait = page.locator('body > div[aria-hidden="true"] svg');
  await expect(trait).toHaveCSS('opacity', '1', { timeout: 10_000 });
  await expect(trait.locator('polyline')).toHaveAttribute('points', /\d/);
  // De retour à l'ouverture, le cartouche s'efface et le trait disparaît.
  await page.evaluate(() => scrollTo(0, 0));
  await expect(cartouche).toHaveCSS('opacity', '0', { timeout: 20_000 });
  await expect(trait).toHaveCSS('opacity', '0');
});

test('le clavier rend visible le cartouche qu’il atteint, sans attendre la caméra', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-monde', 'actif', { timeout: 30_000 });
  const region = page.getByRole('region', { name: 'ZIRIS' });
  await region.getByRole('link', { name: /^Étude de cas/ }).focus();
  await expect(region.locator('[data-cartouche]')).toHaveCSS('opacity', '1', { timeout: 3_000 });
});

test('une étude de cas vit dans le monde : en-tête sans fond, relié à l’écran 3D du projet', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto('/projets/ziris');
  const racine = page.locator('html');
  await expect(racine).toHaveAttribute('data-monde', 'actif', { timeout: 30_000 });
  await expect(racine).toHaveAttribute('data-page-monde', 'etude');
  await expect(page.locator('[data-etude]')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByRole('heading', { level: 1, name: 'ZIRIS' })).toBeVisible();
  // La caméra se pose face à l'écran, le cadre se trace, puis le trait rejoint le rang du projet.
  const trait = page.locator('body > div[aria-hidden="true"] svg');
  await expect(trait).toHaveCSS('opacity', '1', { timeout: 40_000 });
  // L'en-tête dépassé, le voile de nuit couvre tout le cadre.
  await page.evaluate(() => scrollTo(0, innerHeight));
  await expect(racine).toHaveAttribute('data-voile', 'plein');
  await expect(trait).toHaveCSS('opacity', '0');
});

test.describe('sans mouvement', () => {
  test.use({ reducedMotion: 'reduce' });

  test('mouvement réduit : aucun monde, captures réelles et décor d’aube', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).not.toHaveAttribute('data-monde', /.*/);
    await expect(page.locator('section[data-monde-section] figure').first()).toBeVisible();
    await expect(page.locator('img[src*="/media/approved/aube-"]')).toBeVisible();
    // Sans monde, le cartouche est simplement affiché, nom compris.
    const region = page.getByRole('region', { name: 'Fast Shipping logistique' });
    await expect(region.locator('[data-cartouche]')).toHaveCSS('opacity', '1');
    await expect(region.getByRole('heading', { level: 2, name: 'Fast Shipping logistique' })).toBeVisible();
  });
});
