# ADR-002 — Tuple technique verrouillé pour G2

- Statut : **accepté**, 21 octobre 2026
- Auteur : Claude Code, propriétaire de l'architecture (contrat, sections 3 et 3.1)
- Source des versions : registre npm et index officiel de Node.js, consultés le 21 octobre 2026

## Décision

| Élément | Version exacte | Contrainte vérifiée |
|---|---|---|
| Node.js | **24.22.1** (LTS Krypton, correctif de sécurité du 20 octobre 2026) | T01 ; `.node-version` = `24.22.1`, `engines.node` = `24.x` |
| pnpm | **12.14.0** | T01 ; `packageManager` avec intégrité, lockfile commité |
| Next.js | **16.4.2** | T02 ; pairs React `^19.0.0` acceptés |
| React / React DOM | **19.3.1** / **19.3.1** | T02 ; une seule version résolue |
| React Three Fiber | **9.8.2** | T06 ; pairs `react` et `react-dom` `>=19 <19.4` : React 19.3.1 conforme |
| Three.js | **0.186.1** | T06 ; R3F 9 exige `>=0.156` |
| GSAP | **3.15.0** | T08 ; Core uniquement |
| Zustand | **5.0.15** | T09 ; `zustand/vanilla` |
| Zod | **4.6.7** | T10 ; modules `server-only` |
| TypeScript | **6.0.3** | T21 ; voir ci-dessous |
| ESLint / eslint-config-next | **10.13.0** / **16.4.2** | T21 ; configuration plate, sans `next lint` |
| Prettier | **3.9.10** | T21 |
| Playwright | **1.64.1** | T17 ; pair facultatif de Next `^1.51.1` |

R3F, Three.js, GSAP et Zustand sont verrouillés dès maintenant mais installés seulement au lot qui les utilise (G3), afin que le socle G2 ne charge aucun code 3D.

## TypeScript 6 plutôt que 7

TypeScript 7.0.2 est la première version du compilateur natif. Next.js 16.4 s'appuie encore sur l'API JavaScript de TypeScript pendant `next build`, et aucune preuve ne garantit encore leur compatibilité. La version 6.0.3, dernière de la lignée JavaScript, est retenue. Le passage à TypeScript 7 se fera par un ADR après un build complet et une vérification des types identiques.

## Règle de montée de version

Conforme au contrat (section 3.1, point 3) : Next, React, React DOM et R3F ne montent que dans une même PR, avec build, hydratation du Canvas et parcours complet sur trois navigateurs. La CI bloque toute deuxième version résolue de React.
