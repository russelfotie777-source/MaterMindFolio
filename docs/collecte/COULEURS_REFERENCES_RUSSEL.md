# Couleurs — règle absolue et références de Russel

Consigné par Claude Code le 20 octobre 2026, à partir du message direct de Russel et des six références qu'il a envoyées. Destinataire : ChatGPT/Codex, DRI de la palette (`design/contracts/tokens.json`).

## 1. Règle absolue

Mots de Russel, résumés sans les adoucir :

- les couleurs doivent être **vivantes, naturelles et pleines de vie**, comme le **violet sur blanc de ZIRIS Entreprises** ;
- **aucune couleur morte**, aucune brillance « IA » (halo, glow, verre, reflets gratuits) ;
- le **sombre est bienvenu tant qu'il est vivant** ; c'est l'**excès de clair** qui est mauvais (précision du 20/10) ;
- le **noir texturé** est accepté ;
- la **couleur du texte** doit elle aussi être vivante et vraie, jamais générique ;
- Russel a **détesté les moodframes C2** : la direction visuelle C2 n'est pas validée ;
- chaque finition peut prendre du temps : la qualité passe avant la vitesse ;
- si Codex a besoin de maquettes de couleur, il les demande à Russel.

## 2. Pourquoi C2 paraît « mort »

Les teintes C2 sont peu saturées et tirent vers le gris ou le brun : `surface.mineral` `#f3efe7`, `surface.elevated` `#e8e1d5`, `sky.cobalt` `#6a7994`, `sky.depth` `#253047`, `earth.laterite` `#97714f`, `state.focus-on-light` `#6b4e34`. Le seul accent proche de ce que Russel aime est `project.ziris` `#4b2b9e`.

## 3. Relevés mesurés dans les références

Couleurs vives extraites mécaniquement (pixels de saturation > 0,45 et de luminosité entre 0,12 et 0,8, regroupés en six teintes), avec leur part parmi les pixels vifs. Ce sont des **mesures**, pas une palette : Codex les étalonne avec les photos du Japon validées et vérifie les contrastes.

| Référence | Teintes vives relevées |
|---|---|
| ZIRIS Entreprises (capture publique du 20/10) | `#402a87` 26 % · `#271859` 23 % · `#1a103e` 20 % · `#150d32` 30 % ; le blanc `#ffffff` occupe 17 % de l'image |
| Tableau de bord violet-rose | `#d728bf` 29 % · `#7e13e0` 25 % · `#4a06f0` 25 % · `#b71ec6` 11 % · `#f5836a` 7 % |
| Application bancaire sombre | fond `#272727`–`#303030` ; accents `#267cf3` 36 % · `#ed4459` 28 % · `#5eabeb` 18 % · `#f93a1f` 14 % |
| Lecteur de musique | `#0865a4` 38 % · `#741a6b` 18 % · `#14135a` 16 % · `#00c4da` 15 % |
| Application violet et noir | `#55338d` dominant ; noir `#01040b` ; mauve `#ab6baf` |
| Kit vert et bleu | `#009bea` 33 % · `#0276e1` 25 % · `#1bda76` 24 % · `#75e69c` 14 % |

Constante commune : un **violet profond et saturé** (`#402a87` à `#7e13e0`), posé sur du **blanc pur** ou sur un **noir texturé**, avec un ou deux accents francs (bleu, magenta, vert).

## 4. Statut des références

Ces six images sont des **références de goût**. Plusieurs sont des kits d'interface Freepik, filigrane compris : aucune n'est intégrée au site, recopiée ou utilisée comme actif. Seule leur leçon de couleur est retenue.
