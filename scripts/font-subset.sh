#!/bin/sh
# Dérivé web de DM Sans (OFL 1.1) depuis le fichier officiel Google Fonts de la DR-1 (H237-TYPE-DMSANS-PREVIEW).
# Mécanique seulement : axe wght restreint à 400–600, opsz 9–40 conservé, jeu latin du français,
# fonctions OpenType par défaut de fontTools (les jeux stylistiques ss01–ss08 ne sont pas employés),
# table name complète (licence comprise), WOFF2. Aucun glyphe n'est redessiné ni renommé
# (DR-1, 01_DIRECTION_ARTISTIQUE). Le nom du fichier porte son empreinte : il est servi en cache immuable.
# Requiert fontTools 4.57 et brotli. Après régénération, reporter le nouveau nom dans src/lib/police.ts
# et src/styles/global.css.
set -eu

# Horodatage figé (jour du visa typographique, 20 octobre 2026) : même master, même dérivé, même empreinte.
export SOURCE_DATE_EPOCH=1792454400

MASTER=design/releases/DR-1/assets/type-previews/DM-Sans-opsz-wght.ttf
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "8cd08d97e89c24d0aa92edd2f0f4c8ee6195eee9b7c9f154865a58b02f0c1c0d  $MASTER" | sha256sum -c --quiet

python3 -m fontTools.varLib.instancer "$MASTER" wght=400:600 -q -o "$TMP/instance.ttf"
python3 -m fontTools.subset "$TMP/instance.ttf" \
  --unicodes='U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+02C6,U+02DA,U+02DC,U+2009,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2039-203A,U+202F,U+20AC,U+2122,U+2212' \
  --name-IDs='*' --name-languages='*' --flavor=woff2 --output-file="$TMP/subset.woff2"

HASH=$(sha256sum "$TMP/subset.woff2" | cut -c1-8)
rm -f public/fonts/dm-sans-fr-*.woff2
cp "$TMP/subset.woff2" "public/fonts/dm-sans-fr-$HASH.woff2"
cp design/releases/DR-1/assets/type-previews/OFL-DM-Sans.txt public/fonts/OFL-DM-Sans.txt
sha256sum "public/fonts/dm-sans-fr-$HASH.woff2"
