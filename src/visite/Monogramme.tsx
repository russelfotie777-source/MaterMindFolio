import { PRIMITIVES, VUE_MONOGRAMME } from './monogramme';

// Monogramme de l'ouverture, tracé à l'encre de la surface ivoire. Chaque primitive porte data-trait :
// la boucle de la scène en révèle la longueur, sans jamais déformer le signe (DR-1, 08, section 3).
export function Monogramme({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={VUE_MONOGRAMME}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {PRIMITIVES.map((primitive, i) =>
        primitive.forme === 'path' ? (
          <path key={i} data-trait d={primitive.d} strokeWidth={primitive.epaisseur} />
        ) : (
          <circle
            key={i}
            data-trait
            cx={primitive.cx}
            cy={primitive.cy}
            r={primitive.r}
            strokeWidth={primitive.epaisseur}
          />
        ),
      )}
    </svg>
  );
}
