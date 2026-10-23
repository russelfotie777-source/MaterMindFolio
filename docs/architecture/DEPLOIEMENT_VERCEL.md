# Déploiement Vercel — preview G2 et production

Russel crée le projet avec son compte ; Claude vérifie ensuite la preview et en tire l'IR-0. Rien dans le dépôt n'exige de configuration Vercel particulière : `package.json`, `.node-version` et `next.config.ts` portent tout.

## 1. Créer le projet (une fois)

1. Sur vercel.com : **Add New → Project**, importer `russelfotie777-source/MaterMindFolio`.
2. Framework : **Next.js** (détecté). Ne rien changer à Build Command, Install Command ni Output Directory : `pnpm build` lance `scripts/build.ts`, le build en deux passes de l'ADR-003.
3. **Environment Variables**, pour Production et Preview :
   - `ENABLE_EXPERIMENTAL_COREPACK` = `1` (contrat, section 3.1, point 7 : pnpm 12.14.0 tel que fixé par `packageManager`, intégrité comprise).
   - `H237_SITE_URL` : seulement quand le domaine final sera choisi, en Production, par exemple `https://mastermind.example` ; sans elle, les URL canoniques utilisent l'adresse de production Vercel.
4. **Deploy.**

## 2. Réglages à faire juste après

- **Settings → General → Node.js Version** : `24.x`, comme `engines.node`.
- **Settings → General → Vercel Toolbar** : désactivée pour les previews. La barre injecte des scripts de `vercel.live` que la CSP stricte bloque, ce qui fausserait le test « zéro violation » de G2.
- **Analytics et Speed Insights** : laisser désactivés (contrat, T20 : aucune mesure d'audience sans ADR et validation de Russel).
- **Settings → Git** : branche de production `main` ; une preview par PR (comportement par défaut).
- **Deployment Protection** : les previews restent protégées. Pour que Claude puisse mesurer une preview, Russel crée un lien de partage (**Share** sur le déploiement) ou un jeton de contournement, à usage temporaire.

## 3. Ce que Claude vérifie sur la première preview

- en-têtes : CSP complète avec `upgrade-insecure-requests`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, `Cross-Origin-Opener-Policy` ;
- `Cache-Control: public, max-age=31536000, immutable` sur `/fonts/` et `/media/approved/`, et seulement là (contrat, section 6) ;
- zéro violation CSP et zéro défaut axe sur les 14 routes, 404 réelle ;
- poids transférés à froid (Brotli réel du CDN), LCP médian de 5 chargements, Lighthouse mobile et desktop ;
- captures aux viewports de la DR-1 (1440 × 900 et 390 × 844), comparées aux vues de contrôle.

Ces résultats forment l'IR-0, dans `docs/quality/IR-0/`, soumise au visa de fidélité de Codex.
