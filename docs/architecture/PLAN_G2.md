# Plan G2 — socle SSR, routes, résumé recruteur, navigation et fallback sans Canvas

DRI : Claude Code. Visa bloquant : ChatGPT / Codex sur la fidélité visible (contrat, sections 9 et 11). Branche : `feat/engine-g2-socle`.

## Preuves exigées pour fermer G2 (contrat, section 11)

Build, CSP, SEO, clavier, axe, et poids JS / CSS / polices / en-têtes mesurés.

## Étapes

| # | Étape | Critère de sortie |
|---:|---|---|
| 1 | Tuple et outillage : Node 24.22.1, pnpm 12.14.0, Next 16.4.2, React 19.3.1, TypeScript 6.0.3, ESLint plat, Prettier (`docs/adr/ADR-002-tuple-technique-g2.md`) | installation reproductible, lockfile commité, une seule version de React résolue |
| 2 | **Test CSP/SRI en premier** : politique stricte du contrat, `experimental.sri`, page statique avec un îlot client | zéro `securitypolicyviolation`, îlot hydraté ; sinon ADR avant toute suite |
| 3 | Tokens : script TypeScript interne `design/contracts/tokens.json` → `src/styles/tokens.css` généré | régénération identique au fichier commité |
| 4 | Faits : chargeurs Zod `server-only` pour le profil et les six projets depuis `content/facts/` | build en échec sur un fait non approuvé ou privé ; aucun Zod dans les chunks clients |
| 5 | Routes : `/`, `/visite`, `/projets`, `/projets/[slug]`, `/parcours`, `/resume-recruteur`, `/fabrication`, `/contact`, `/mentions`, `not-found`, `error`, `global-error` ; `/cv.pdf` reporté avec le CV | HTML complet sans JavaScript, métadonnées et URL canoniques |
| 6 | Navigation, lien d'évitement, focus visible, ordre DOM conforme à `04_MOUVEMENT_SON_ACCESSIBILITE.md` | parcours clavier complet |
| 7 | Fallback sans Canvas : poster d'aube, portrait détouré, mêmes faits et actions | identique avec WebGL coupé |
| 8 | Polices DM Sans auto-hébergées, sous-ensemble français, une graisse préchargée | ≤ 100 Ko |
| 9 | Tests : Playwright sur Chromium, WebKit et Firefox, `@axe-core/playwright`, CSP sur toutes les routes | CI verte |
| 10 | Mesures et IR-0 : poids transférés à froid, captures aux viewports de la DR-1 | dossier `docs/quality/` et visa Codex |
