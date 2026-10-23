import { defineConfig, devices } from '@playwright/test';

// Parcours sur le build de production, CSP comprise (contrat, T17 ; plan G2, étape 9).
// `pnpm build` précède toujours `pnpm test:e2e` : le serveur sert le dernier build.
const PORT = 3237;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /ouverture/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: /ouverture/ },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: /ouverture/ },
    // Scène 3D réelle sans GPU : WebGL logiciel (SwiftShader), pour la chorégraphie de l'ouverture.
    {
      name: 'chromium-webgl',
      testMatch: /ouverture/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
        },
      },
    },
  ],
  webServer: {
    command: `node_modules/.bin/next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
