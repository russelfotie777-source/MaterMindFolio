// Mesures de l'Integration Release IR-0 (contrat, section 8 ; plan G2, étape 10) sur une URL déployée.
// Pour chaque route et chaque viewport de la DR-1 : chargement à froid, octets réellement transférés par
// type, LCP, violations CSP, puis capture pleine page en WebP. L'accueil est chargé cinq fois pour le LCP
// médian. Usage : node scripts/ir0.ts https://preview.example [dossier]
// Une preview protégée se mesure avec H237_BYPASS (jeton de contournement Vercel, temporaire).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { chromium, type Page } from '@playwright/test';
import sharp from 'sharp';

const [base, dossier = 'docs/quality/IR-0'] = process.argv.slice(2);
if (!base) throw new Error('Usage : node scripts/ir0.ts https://preview.example [dossier]');

const ROUTES = [
  '/',
  '/visite',
  '/projets',
  '/projets/fast-shipping-logistics',
  '/projets/batobaye-market',
  '/projets/mboamarkets',
  '/projets/ziris',
  '/projets/shopitech',
  '/projets/artvibe-cameroun',
  '/parcours',
  '/resume-recruteur',
  '/contact',
  '/fabrication',
  '/mentions',
];
const VIEWPORTS = [
  { nom: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
  { nom: 'mobile', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true },
] as const;

type Mesure = {
  route: string;
  viewport: string;
  statut: number | null;
  octets: Record<string, number>;
  total: number;
  lcp: { ms: number; element: string; url: string } | null;
  violations: string[];
};

const OBSERVATEURS = `
  window.__violations = [];
  document.addEventListener('securitypolicyviolation', (e) =>
    window.__violations.push(e.violatedDirective + ' ' + (e.blockedURI || 'inline')));
  window.__lcp = null;
  new PerformanceObserver((liste) => {
    const e = liste.getEntries().at(-1);
    window.__lcp = { ms: Math.round(e.startTime), element: e.element ? e.element.tagName : '', url: e.url || '' };
  }).observe({ type: 'largest-contentful-paint', buffered: true });
`;

async function mesurer(page: Page, route: string, viewport: string): Promise<Mesure> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const types = new Map<string, string>();
  const octets: Record<string, number> = {};
  cdp.on('Network.responseReceived', (e) => types.set(e.requestId, e.type));
  cdp.on('Network.loadingFinished', (e) => {
    const type = types.get(e.requestId) ?? 'Other';
    octets[type] = (octets[type] ?? 0) + e.encodedDataLength;
  });
  const reponse = await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const { lcp, violations } = await page.evaluate(() => {
    const w = globalThis as unknown as { __lcp: Mesure['lcp']; __violations: string[] };
    return { lcp: w.__lcp, violations: w.__violations };
  });
  await cdp.detach();
  const total = Object.values(octets).reduce((a, b) => a + b, 0);
  return { route, viewport, statut: reponse?.status() ?? null, octets, total, lcp, violations };
}

const navigateur = await chromium.launch();
const entetes = process.env.H237_BYPASS
  ? { 'x-vercel-protection-bypass': process.env.H237_BYPASS }
  : undefined;
const mesures: Mesure[] = [];
const lcpAccueil: Record<string, number[]> = {};
mkdirSync(join(dossier, 'captures'), { recursive: true });

for (const { nom, ...viewport } of VIEWPORTS) {
  const contexte = await navigateur.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: viewport.isMobile,
    ...(entetes && { extraHTTPHeaders: entetes }),
  });
  await contexte.addInitScript(OBSERVATEURS);
  for (const route of ROUTES) {
    const page = await contexte.newPage();
    const mesure = await mesurer(page, route, nom);
    mesures.push(mesure);
    const capture = await page.screenshot({ fullPage: true });
    const fichier = `${route === '/' ? 'accueil' : route.slice(1).replaceAll('/', '-')}-${nom}.webp`;
    // WebP plafonne à 16 383 px : la capture garde au plus deux pixels par pixel CSS.
    await sharp(capture)
      .resize({ width: 2 * viewport.width, height: 16383, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(dossier, 'captures', fichier));
    await page.close();
    console.log(
      `${nom} ${route} : ${mesure.statut}, ${Math.round(mesure.total / 1000)} Ko, LCP ${mesure.lcp?.ms ?? '?'} ms, ${mesure.violations.length} violation(s) CSP`,
    );
  }
  for (let i = 0; i < 5; i++) {
    const page = await contexte.newPage();
    const { lcp } = await mesurer(page, '/', nom);
    if (lcp) (lcpAccueil[nom] ??= []).push(lcp.ms);
    await page.close();
  }
  await contexte.close();
}
await navigateur.close();

const mediane = (valeurs: number[]) =>
  [...valeurs].sort((a, b) => a - b)[Math.floor(valeurs.length / 2)] ?? null;
const synthese = {
  base,
  date: new Date().toISOString(),
  lcpMedianAccueil: Object.fromEntries(Object.entries(lcpAccueil).map(([nom, v]) => [nom, mediane(v)])),
  violationsCsp: mesures.reduce((n, m) => n + m.violations.length, 0),
  mesures,
};
writeFileSync(join(dossier, 'mesures.json'), `${JSON.stringify(synthese, null, 2)}\n`);
console.log(
  `LCP médian de l'accueil : ${JSON.stringify(synthese.lcpMedianAccueil)} ; ${synthese.violationsCsp} violation(s) CSP.`,
);
