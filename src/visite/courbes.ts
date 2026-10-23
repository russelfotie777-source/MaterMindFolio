// Courbes de mouvement des jetons DR-1 (04_MOUVEMENT_SON_ACCESSIBILITE, section 2), utilisables comme
// `ease` GSAP sans le plugin CustomEase : une courbe de Bézier cubique résolue par Newton puis dichotomie.
export function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1;
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1;
  const c = (p1: number) => 3 * p1;
  const courbe = (t: number, p1: number, p2: number) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const pente = (t: number, p1: number, p2: number) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);

  function tPourX(x: number): number {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = pente(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      const ecart = courbe(t, x1, x2) - x;
      if (Math.abs(ecart) < 1e-7) return t;
      t -= ecart / d;
    }
    let bas = 0;
    let haut = 1;
    t = x;
    while (haut - bas > 1e-7) {
      if (courbe(t, x1, x2) < x) bas = t;
      else haut = t;
      t = (bas + haut) / 2;
    }
    return t;
  }

  return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : courbe(tPourX(x), y1, y2));
}

// motion.approach et motion.chapter : cubic-bezier(0.65, 0, 0.35, 1).
export const DEPLACEMENT = bezier(0.65, 0, 0.35, 1);
// motion.reveal : cubic-bezier(0.45, 0, 0.2, 1), élévation finale.
export const REVELATION = bezier(0.45, 0, 0.2, 1);
