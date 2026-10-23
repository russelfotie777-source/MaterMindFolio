import type { ReactNode } from 'react';

// Lien hors du site : nouvel onglet annoncé dans le nom accessible (DR-1, 03_ECRANS_ETATS, « Lien externe »).
export function LienExterne({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="visuellement-cache"> (nouvel onglet)</span>
    </a>
  );
}
