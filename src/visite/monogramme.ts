// Géométrie du monogramme TRACE 237, reprise telle quelle du master de Codex
// (design/releases/DR-1/assets/trace-237-monogram.svg ; amendement 2 de l'ADR-004 : aucun nouveau tracé).
// L'ordre est celui du master, en attendant l'annotation de Codex sur l'ordre et le sens de révélation.
// Un test unitaire compare ces valeurs au fichier master.
export const VUE_MONOGRAMME = '0 0 960 360';

export type Primitive =
  | { forme: 'path'; d: string; epaisseur: number }
  | { forme: 'circle'; cx: number; cy: number; r: number; epaisseur: number };

export const PRIMITIVES: readonly Primitive[] = [
  { forme: 'path', d: 'M96 252V92l144 132L384 92v160', epaisseur: 20 },
  { forme: 'path', d: 'M384 252V92l144 132L672 92v160', epaisseur: 20 },
  { forme: 'path', d: 'M72 284h600c92 0 148-52 148-132', epaisseur: 12 },
  { forme: 'circle', cx: 820, cy: 112, r: 28, epaisseur: 12 },
  { forme: 'path', d: 'M168 284v28M384 284v28M600 284v28', epaisseur: 12 },
];
