import { lireDerive, type Fichier, type IdDerive } from '@/lib/media';

type Cadre = { derive: IdDerive; media?: string };

const srcSet = (fichiers: Fichier[]) => fichiers.map((f) => `${f.chemin} ${f.largeur}w`).join(', ');

// <picture> des dérivés hashés (contrat, T15) : AVIF puis WebP, dimensions explicites ; next/image est exclu en V1.
// Les cadres portant une media query passent avant le cadre par défaut, qui vient en dernier.
export function Visuel({
  cadres,
  alt,
  sizes,
  className,
  prioritaire = false,
}: {
  cadres: readonly [Cadre, ...Cadre[]];
  alt: string;
  sizes: string;
  className?: string | undefined;
  prioritaire?: boolean;
}) {
  const defaut = lireDerive(cadres[cadres.length - 1]!.derive);
  const repli = defaut.fichiers.webp[defaut.fichiers.webp.length - 1]!;

  return (
    <picture>
      {cadres.flatMap(({ derive, media }) => {
        const { fichiers } = lireDerive(derive);
        return (['avif', 'webp'] as const).map((format) => {
          const premier = fichiers[format][0]!;
          return (
            <source
              key={`${derive}-${format}`}
              type={`image/${format}`}
              media={media}
              srcSet={srcSet(fichiers[format])}
              sizes={sizes}
              width={premier.largeur}
              height={premier.hauteur}
            />
          );
        });
      })}
      <img
        className={className}
        src={repli.chemin}
        srcSet={srcSet(defaut.fichiers.webp)}
        sizes={sizes}
        width={repli.largeur}
        height={repli.hauteur}
        alt={alt}
        loading={prioritaire ? 'eager' : 'lazy'}
        fetchPriority={prioritaire ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}
