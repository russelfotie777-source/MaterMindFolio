import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { ROUTES } from './routes';

// Relève les violations CSP dès le premier script de la page, avant ceux de Next.js.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const violations: string[] = [];
    Object.assign(window, { __violations: violations });
    document.addEventListener('securitypolicyviolation', (event) => {
      violations.push(`${event.violatedDirective} ${event.blockedURI || 'inline'}`);
    });
  });
});

async function violationsCsp(page: import('@playwright/test').Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __violations: string[] }).__violations);
}

for (const route of ROUTES) {
  test(`${route} : CSP, titre, URL canonique et axe`, async ({ page }) => {
    const reponse = await page.goto(route);
    expect(reponse?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const canonique = await page
      .locator('link[rel="canonical"]')
      .evaluate((lien: HTMLLinkElement) => new URL(lien.href).pathname);
    expect(canonique).toBe(route);
    await page.waitForLoadState('networkidle');
    expect(await violationsCsp(page)).toEqual([]);

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations.map(({ id, nodes }) => `${id} (${nodes.length})`)).toEqual([]);
  });
}

test('une adresse inconnue rend une vraie 404, sans violation CSP', async ({ page }) => {
  for (const route of ['/nexiste-pas', '/projets/inconnu']) {
    const reponse = await page.goto(route);
    expect(reponse?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
    expect(await violationsCsp(page)).toEqual([]);
  }
});

test.describe('sans JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const route of ROUTES) {
    test(`${route} : HTML complet`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
    });
  }
});

test('clavier : le lien d’évitement mène au contenu', async ({ page, browserName }) => {
  // Safari (WebKit) ne parcourt les liens au clavier qu'avec Option+Tab, son réglage par défaut :
  // le test emploie donc la touche que l'utilisateur de Safari emploie réellement.
  const suivant = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.goto('/');
  await page.keyboard.press(suivant);
  const evitement = page.getByRole('link', { name: 'Aller au contenu' });
  await expect(evitement).toBeFocused();
  await expect(evitement).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#contenu')).toBeFocused();
  await page.keyboard.press(suivant);
  await expect(page.getByRole('link', { name: 'Commencer la visite' })).toBeFocused();
});

test('accueil : portrait et décor viennent des dérivés, en cache immuable', async ({ page, request }) => {
  await page.goto('/');
  const portrait = page.getByRole('img', { name: 'Portrait de MASTERMIND' });
  await expect(portrait).toBeVisible();
  await expect
    .poll(() => portrait.evaluate((img: HTMLImageElement) => (img.complete ? img.naturalWidth : 0)))
    .toBeGreaterThan(0);
  const source = await portrait.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
  expect(source).toMatch(/^\/media\/approved\/portrait-buste-\d+-[0-9a-f]{8}\.(avif|webp)$/);
  expect((await request.get(source)).headers()['cache-control']).toContain('immutable');
  // Le décor est décoratif : alt vide, hors de l'arbre d'accessibilité.
  await expect(page.locator('img[src*="/media/approved/aube-"]')).toHaveAttribute('alt', '');
});

test('étude de cas : un seul média visible, décrit par son texte alternatif', async ({ page }) => {
  await page.goto('/projets/fast-shipping-logistics');
  const media = page.locator('main figure').getByRole('img');
  await expect(media).toHaveCount(1);
  await expect(media).toHaveAccessibleName(/^Page de suivi Fast Shipping/);
  await expect
    .poll(() => media.evaluate((img: HTMLImageElement) => (img.complete ? img.naturalWidth : 0)))
    .toBeGreaterThan(0);
});

test('morceaux de référence : aucune requête YouTube avant le clic (ADR-001)', async ({ page }) => {
  const youtube: string[] = [];
  page.on('request', (requete) => {
    if (/youtube|ytimg|googlevideo/.test(new URL(requete.url()).hostname)) youtube.push(requete.url());
  });
  await page.goto('/fabrication');
  await page.waitForLoadState('networkidle');
  expect(youtube).toEqual([]);

  const ecouter = page.getByRole('link', { name: /^Écouter sur YouTube/ });
  test.skip((await ecouter.count()) === 0, 'Références musicales en attente du visa de Russel.');
  await ecouter.first().click();
  const lecteur = page.locator('iframe[src^="https://www.youtube-nocookie.com/embed/"]');
  await expect(lecteur).toBeVisible();
  await expect(lecteur).toBeFocused();
  const { width, height } = (await lecteur.boundingBox())!;
  expect(Math.min(width, height)).toBeGreaterThanOrEqual(200);
  expect(await violationsCsp(page)).toEqual([]);
});

test('l’îlot « Copier l’adresse » est hydraté et annonce son résultat', async ({ page }) => {
  await page.goto('/contact');
  const statut = page.getByRole('status');
  await expect(statut).toBeEmpty();
  await page.getByRole('button', { name: 'Copier l’adresse' }).click();
  await expect(statut).not.toBeEmpty();
});

test('le résumé recruteur s’imprime sans en-tête ni pied de page', async ({ page }) => {
  await page.goto('/resume-recruteur');
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('banner')).toBeHidden();
  await expect(page.getByRole('contentinfo')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Imprimer cette page' })).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
