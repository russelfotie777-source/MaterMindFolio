# Exceptions d'audit des dépendances

Le contrat (section 3.1, point 8) bloque en CI toute vulnérabilité connue de niveau high ou critical, dépendances de build comprises. Une exception n'est admise qu'avec sa portée, son risque, sa mitigation, son owner et sa date d'expiration. Elle est déclarée dans `pnpm-workspace.yaml` (`auditConfig.ignoreGhsas`) et décrite ici. Le rapport de production (`pnpm audit --prod`) reste séparé et ne connaît aucune exception.

| GHSA | Paquet | Portée | Risque | Mitigation | Owner | Expiration |
|---|---|---|---|---|---|---|
| [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | `braces` 3.0.3, high, aucune version corrigée au 21 octobre 2026 | développement seulement : `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces` | épuisement de pile sur des motifs d'accolades très imbriqués ; ESLint ne développe que les motifs de notre propre configuration, jamais une entrée de visiteur ; rien n'est livré au client ni au serveur de production | `pnpm audit --prod` vide ; l'exception tombe dès qu'une version corrigée ou une mise à jour d'`eslint-config-next` la supprime | Claude Code | 21 janvier 2027 |
