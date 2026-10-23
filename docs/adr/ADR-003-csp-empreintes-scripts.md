# ADR-003 — CSP stricte par empreintes des scripts en ligne

- Statut : **accepté**, 21 octobre 2026
- Auteur : Claude Code, propriétaire de l'architecture et de la sécurité (contrat, sections 8 et 9)
- Déclencheur : premier test de G2 exigé par le contrat (section 3.1, point 1) — « tout échec impose un ADR, pas un élargissement silencieux vers `'unsafe-inline'` »

## Constat mesuré

Build de production Next.js 16.4.2 avec `experimental.sri`, page d'accueil statique contenant un îlot client, politique du contrat (`script-src 'self' 'wasm-unsafe-eval'`) :

- 7 scripts externes, dont 5 portent un attribut `integrity` ;
- **3 scripts en ligne** : l'amorce Turbopack et deux blocs de données RSC (`self.__next_f.push`) ;
- dans Chromium sans tête : **3 violations `script-src-elem`**, et l'îlot « Copier l'adresse » **ne s'hydrate pas**.

L'option SRI de Next.js couvre les fichiers, pas les scripts en ligne. La politique du contrat est donc inapplicable telle quelle.

## Décision

1. **Build en deux passes** (`scripts/build.ts`, appelé par `pnpm build`, donc aussi par Vercel). La passe 1 construit le site et relève l'empreinte SHA-256 de chaque script en ligne de chaque page HTML prérendue. La passe 2 reconstruit le site : `next.config.ts` ajoute ces empreintes à `script-src`.
2. **Contrôle d'identité.** Les empreintes de la passe 2 doivent être exactement celles de la passe 1, sinon le build échoue. Les deux passes partagent le même identifiant de build (`H237_BUILD_ID`, le SHA du commit sur Vercel), puisqu'il figure dans les données RSC.
3. **Une seule politique** pour tout le site : l'union des empreintes de toutes les pages. Un script autorisé sur une page l'est donc sur les autres, mais ce sont uniquement nos propres scripts, générés au build.
4. **CSP seulement en production.** `next dev` exécute des scripts en ligne et `eval` ; les autres en-têtes de sécurité restent actifs en développement.
5. Le reste de la politique du contrat est inchangé : ni `'unsafe-inline'`, ni `'unsafe-eval'`, ni `'strict-dynamic'`.

## Résultat mesuré après la décision

- 5 empreintes uniques (accueil et page 404) ; passes 1 et 2 identiques ;
- page d'accueil : **0 violation**, îlot hydraté ;
- page 404 par défaut de Next.js : violations `style-src-attr` et `style-src-elem`, car elle injecte des styles en ligne. Elle sera remplacée par la page `not-found` sur mesure exigée par la DR-1, sans style en ligne.

## Alternatives écartées

- **`'unsafe-inline'`** : interdit par le contrat.
- **Nonce par requête via `proxy.ts`** : force le rendu dynamique de chaque page et abandonne la génération statique que le contrat conserve.
- **CSP en balise `<meta>` ajoutée après le build** : la politique en en-tête continuerait de bloquer, et la retouche des fichiers de sortie est fragile.
- **Modifier `routes-manifest.json` après une seule passe** : dépend d'un format interne de Next.js, sans garantie de stabilité.

## Conséquences

- Le build dure deux fois plus longtemps : quelques dizaines de secondes aujourd'hui.
- Les empreintes suivent automatiquement chaque changement de contenu ou de code ; rien n'est commité à la main.
- Si une version future de Next.js rend la sortie non déterministe, le contrôle d'identité échoue de façon visible au lieu de livrer une politique fausse.

## Vérifications restantes à G2

- tests Playwright sur Chromium, WebKit et Firefox, sur toutes les routes, avec zéro `securitypolicyviolation` ;
- en-tête vérifié sur un déploiement de prévisualisation Vercel, avec `upgrade-insecure-requests`.
