import { existsSync, readFileSync } from 'node:fs';

import type { NextConfig } from 'next';

// Empreintes des scripts en ligne relevées par la passe 1 de scripts/build.ts (ADR-003).
const scriptHashes: string[] = existsSync('.next-csp/script-hashes.json')
  ? (JSON.parse(readFileSync('.next-csp/script-hashes.json', 'utf8')) as string[])
  : [];

// Politique de départ du contrat (section 3.1, point 1). Toute ouverture passe par un ADR.
const contentSecurityPolicy = [
  "default-src 'none'",
  ["script-src 'self' 'wasm-unsafe-eval'", ...scriptHashes].join(' '),
  "worker-src 'self' blob:",
  "style-src-elem 'self'",
  "style-src-attr 'none'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  // ADR-001 : seul le lecteur officiel des morceaux de référence, inséré après un clic.
  'frame-src https://www.youtube-nocookie.com',
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  // En local, `next start` sert en HTTP : la montée forcée vers HTTPS casserait les ressources.
  ...(process.env.VERCEL ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  // `next dev` exécute des scripts en ligne et eval : la CSP ne s'applique qu'au build de production.
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Content-Security-Policy', value: contentSecurityPolicy }]
    : []),
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Identifiant commun aux deux passes du build, présent dans les données RSC en ligne.
  generateBuildId: async () => process.env.H237_BUILD_ID ?? null,
  experimental: {
    sri: { algorithm: 'sha256' },
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Seuls les fichiers dont le nom porte l'empreinte du contenu sont servis en cache immuable.
      {
        source: '/fonts/:file(dm-sans-fr-[0-9a-f]{8}\\.woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/media/approved/:file([a-z0-9-]+-[0-9a-f]{8}\\.(?:avif|webp))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
