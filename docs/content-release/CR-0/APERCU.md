# Aperçu CR-0 — les six projets et ton profil

Généré le 20 octobre 2026 depuis `docs/content-release/CR-0/*.json`, eux-mêmes transcrits de la fiche G1. **Validé par Russel le 20 octobre 2026** : les sept fichiers sont en `approved`. Les points signalés en bas de page restent des limites déclarées, pas des certitudes. Les lignes marquées 🔒 ne seront jamais publiées.

## Fast Shipping logistique

| | |
|---|---|
| Liens | [fast-shipping-logistics.com](https://fast-shipping-logistics.com) |
| Statut | Site en ligne |
| Période | juin 2025 |
| Organisation | Fast Shipping logistique (client), France |
| Ton rôle | Développeur des fonctions métier, à partir d'un thème acheté |
| Ce que tu as fait | • Suivi de colis<br>• Demande de devis<br>• Back-office<br>• Traductions du site |
| Plateformes | web, administration web |
| Stack | PHP, Bootstrap, jQuery |
| Preuves | • [Site en ligne, en 9 langues, avec suivi de colis et devis](https://fast-shipping-logistics.com) |
| Droits | Russel (MASTERMIND) — accord de Russel ; portée : nom, logo, captures, vidéo, chiffres<br>⚠ Aucune autorisation nommée de l'agence |
| Confidentiel 🔒 | Données des clients et des envois |

## Batobaye Market

| | |
|---|---|
| Liens | [batobayemarket.shop](https://batobayemarket.shop/fr) · [Google Play](https://play.google.com/store/apps/details?id=com.vivacom.batobaya) · [App Store](https://apps.apple.com/cm/app/batobaye-market/id6770470645) |
| Statut | En ligne ; phase principale achevée, maintenance et mises à jour en cours |
| Période | novembre 2025 → en cours<br>Phase principale de développement : novembre 2025 → août 2026 |
| Organisation | BatobayeMarket (employeur), Douala, Cameroun |
| Ton rôle | Développeur Full Stack ; maintenance actuelle à dominante backend |
| Ce que tu as fait | • Backend Laravel<br>• Interface d'administration en React.js<br>• Version mobile en React Native<br>• Storefront web public<br>• Publication sur Google Play et l'App Store<br>• Maintenance et mises à jour, aujourd'hui surtout côté backend |
| Équipe | 4 personne(s) · Dont 2 développeurs basés en Inde ; rôles individuels à préciser. |
| Plateformes | web, administration web, Android, iOS |
| Stack | Laravel, MySQL, React.js, React Native, Firebase (notifications push), VPS DigitalOcean |
| Preuves | • [Site marchand en ligne avec catalogue public](https://batobayemarket.shop/fr)<br>• [Application sur Google Play, 1 k+ téléchargements affichés](https://play.google.com/store/apps/details?id=com.vivacom.batobaya)<br>• [Application sur l'App Store](https://apps.apple.com/cm/app/batobaye-market/id6770470645) |
| Droits | PDG de BatobayeMarket — accord verbal ; portée : nom, logo, captures<br>⚠ Masquer le numéro de téléphone visible sur la capture de connexion<br>⚠ Retirer l'interface du navigateur par recadrage |
| Confidentiel 🔒 | Données des clients et des commandes |

## MBoa Market

| | |
|---|---|
| Liens | [mboamarkets.com](https://mboamarkets.com/) |
| Statut | Site marchand en ligne, maintenu |
| Période | janvier 2026 → en cours<br>Développement principal : janvier 2026 → février 2026<br>Seconde phase : modèle produit, PWA, paiement Orange : août 2026 → septembre 2026 |
| Organisation | MBoa Market (filiale de l'employeur), Cameroun |
| Ton rôle | Développeur principal |
| Ce que tu as fait | • Migration du modèle produit<br>• Optimisation de la vitesse de chargement<br>• PWA complète<br>• Galerie et interfaces client<br>• Livraison et calcul des frais<br>• Intégration du paiement Orange<br>• Onglet paiement et corrections du back-office |
| Équipe 🔒 | Iris : Système de panier · 32 des 34 commits viennent des identités Git de Russel. |
| Plateformes | web, administration web, PWA |
| Stack | PHP 8.2 natif (PDO, sans framework), MySQL / MariaDB, Tailwind CSS 4, Swiper.js, Service worker maison, Commande via WhatsApp, Paiement Orange |
| Preuves | • [Site en ligne : catalogue, panier, commande WhatsApp, 6 langues](https://mboamarkets.com/)<br>• 32 des 34 commits du dépôt par Russel |
| Décisions techniques | • **PHP natif sans framework ni build JavaScript** : Le trafic vient surtout de publicités Facebook : la vitesse de chargement passe avant tout.<br>• **Tailwind compilé en local** : Pas de dépendance à un CDN au chargement.<br>• **Redirection fluide vers WhatsApp** : C'est le principal canal de commande. |
| Droits | PDG de BatobayeMarket (maison mère) — accord verbal ; portée : nom, logo, captures |
| Confidentiel 🔒 | Données des clients et des commandes · Identifiants de la base et du paiement |

## ZIRIS

| | |
|---|---|
| Liens | [ZIRIS Établissements](https://ziris.vercel.app/) · [ZIRIS Entreprises](https://ziris-app.alwaysdata.net/vitrine/index) |
| Statut | SaaS en développement actif, déjà proposé à la vente |
| Période | juin 2026 → en cours (début approximatif) |
| Organisation | ZIRIS (produit en co-propriété), Douala, Cameroun |
| Ton rôle | Co-propriétaire et développeur des versions Établissements et Entreprises |
| Ce que tu as fait | • Versions Établissements et Entreprises, développées en parallèle avec Amadou Mendouga<br>• Intégration Anthropic côté administration Établissements : inscriptions et imports massifs d'étudiants depuis des formats variés, préparation des emplois du temps, traitement d'informations |
| Équipe | 2 personne(s) · Amadou Mendouga : Co-propriétaire ; intégration Groq de la version Entreprises |
| Plateformes | web, administration web |
| Stack | Next.js (Établissements, sur Vercel), Hébergement alwaysdata (Entreprises), Anthropic (Établissements), Groq (Entreprises) |
| Preuves | • [Version Établissements : pointage, emploi du temps et suivi de présence](https://ziris.vercel.app/)<br>• [Version Entreprises : pointage par téléphone, suivi des présences, paie, offres publiques](https://ziris-app.alwaysdata.net/vitrine/index) |
| Droits | Russel et Amadou Mendouga, co-propriétaires — accord des co-propriétaires ; portée : nom, logo, captures, vidéo<br>⚠ Présenter ZIRIS comme un produit co-développé<br>⚠ Ne pas attribuer à Russel seul ce que la vitrine crédite à Amadou Mendouga |
| Confidentiel 🔒 | Données d'étudiants, d'employés ou de clients · Secrets, contrats et code privé non autorisé |

## Shopitech

| | |
|---|---|
| Liens | [Version web beta](https://beta.shopitech.cm/fr) |
| Statut | Version web en beta, maintenue ; application mobile pas encore publiée |
| Période | août 2026 → en cours<br>Développement : août 2026 → octobre 2026 |
| Organisation | Itech Service (client), Douala (Akwa), Cameroun |
| Ton rôle | Développeur du backend, de l'administration, du front public et de la base de données |
| Ce que tu as fait | • Backend<br>• Ensemble de l'administration<br>• Front public en Next.js<br>• Base de données<br>• Maintenance en cours |
| Plateformes | web, administration web |
| Stack | Next.js (front, backend et administration), Base de données SQL, Serveur privé Hostinger |
| Preuves | • [Beta en ligne avec catalogue public en FCFA](https://beta.shopitech.cm/fr) |
| Droits | Shopitech — forme non précisée ; portée : nom, logo, captures |
| Confidentiel 🔒 | Données des clients et des commandes |

## ArtVibeCamer

| | |
|---|---|
| Liens | [artvibecamer.com](https://artvibecamer.com/) |
| Statut | En ligne et ouvert au public depuis le 11 octobre 2026 |
| Période | octobre 2026 → en cours |
| Organisation | SAM BIAI (client), Douala, Cameroun |
| Ton rôle | Seul développeur, full stack |
| Ce que tu as fait | • API Laravel<br>• Site public et back-office Next.js<br>• Inscription individuelle et en groupe avec paiement Mobile Money, relance et reçu PDF<br>• Fiches publiques des candidats<br>• Achat de voix avec garde-fous anti-fraude<br>• Back-office : tableau de bord, validation des dossiers, suivi des paiements, exports CSV<br>• Billetterie à QR code et contrôle à l'entrée côté API<br>• Déploiement, en-têtes de sécurité et HSTS |
| Équipe | 1 personne(s) · Russel seul. |
| Plateformes | web, administration web |
| Stack | Laravel 13, PHP 8.4, Sanctum, MySQL / MariaDB, Next.js 16, TypeScript, Tailwind CSS 4, Elgiopay (MTN Mobile Money, Orange Money), Cloudflare Workers, Hostinger |
| Preuves | • [Plateforme d'inscription en ligne](https://artvibecamer.com/)<br>• Premier encaissement réel réussi le 11 octobre 2026 sur MTN et Orange, notifications à signature vérifiée<br>• Tous les commits du dépôt viennent des identités Git de Russel |
| Décisions techniques | • **API et front séparés** : Le contrat d'API est la seule frontière : chaque côté avance sans bloquer l'autre.<br>• **Le paiement est la seule source des contreparties** : Aucune voix ni aucun billet sans paiement abouti ; le prix est toujours calculé par le serveur.<br>• **Pas de blocage automatique par adresse IP** : Au Cameroun, une connexion partagée peut regrouper des centaines de votants légitimes ; l'organisation tranche les cas suspects. |
| Droits | SAM BIAI — forme non précisée ; portée : nom, logo, captures<br>⚠ Logo du sponsor Zamara montré seulement tel qu'il apparaît sur le site, jamais isolé |
| Confidentiel 🔒 | Données des candidats et des paiements · Clés Elgiopay et autres secrets · Identifiants et chemins du serveur |

## Ton profil

| | |
|---|---|
| Nom public | MASTERMIND |
| Intitulé | Software Engineer |
| Poste actuel | Développeur Full Stack chez BatobayeMarket, Douala, depuis le 18 novembre 2025 — maintenance et mises à jour à dominante backend |
| Base | Douala, Cameroun |
| Email | russelfotie777@gmail.com |
| GitHub | https://github.com/russelfotie777-source |
| Disponibilité | En poste, ouvert aux opportunités |
| Langue du site | français |

## Points à vérifier en priorité

- **Fast Shipping logistique** (name) : Graphie du site public ; nom officiel à valider.
- **Fast Shipping logistique** (organization) : Agence française ; ville à préciser.
- **Fast Shipping logistique** (stack) : Observation publique ; à confirmer.
- **Fast Shipping logistique** (confidential) : Valeur de protection proposée par Claude.
- **Batobaye Market** (confidential) : Valeur de protection proposée par Claude.
- **MBoa Market** (role) : Déduit de l'historique Git (32 des 34 commits) ; à confirmer par Russel.
- **MBoa Market** (decisions) : Tiré du README ; à valider par Russel.
- **ZIRIS** (name) : Les deux sites écrivent « Ziris » ; casse à valider.
- **ZIRIS** (platforms) : La vitrine annonce une application mobile ; nature à confirmer.
- **Shopitech** (stack) : Moteur SQL exact à préciser.
- **Shopitech** (confidential) : Valeur de protection proposée par Claude.
- **ArtVibeCamer** (decisions) : Tiré de ARCHITECTURE.md ; à valider par Russel.
- **Shopitech** : le client « Itech Service » est-il la même entreprise que « ITEC Service SARL », où tu as fait ton stage en 2021–2022 ?
- **Parcours** : les dates et rôles repris de ton ancien portfolio (Didacsoft, ITEC, freelance) ne sont pas encore corrigés ; ils restent absents du site tant que ce n'est pas fait.
