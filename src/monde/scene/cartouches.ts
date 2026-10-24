import { gsap } from 'gsap';

// Cartouches des stations de l'accueil quand le monde est actif : le nom d'un projet se lève lettre à
// lettre quand la caméra se pose devant son île, le reste du texte suit, et un trait de lumière part du
// cadre de l'écran 3D jusqu'au repère du texte. Au départ, le cartouche s'efface. Sans monde, ce module
// n'est jamais chargé et le texte reste affiché tel quel.
export type Point = { x: number; y: number };
export type Cartouches = {
  // Section posée devant la caméra (indice dans les sections de la page), ou -1 pendant un trajet.
  activer: (section: number) => void;
  // Section dont le texte a le focus du clavier, que la caméra soit arrivée ou non (-1 sinon).
  focalisee: () => number;
  // Relie le texte actif au point du cadre de l'écran 3D projeté dans la fenêtre. Le trait se dessine
  // dès que ce point existe, c'est-à-dire quand le cadre de lumière a fini son tour ; null le cache.
  relier: (ancre: Point | null, cote: 'droite' | 'gauche' | 'bas') => void;
  detruire: () => void;
};

type Cartouche = { panneau: HTMLElement; lettres: HTMLElement[]; suite: HTMLElement[]; repere: HTMLElement };

export function animerCartouches(sections: readonly HTMLElement[], trait: SVGSVGElement): Cartouches {
  const cartouches = sections.map((section): Cartouche | null => {
    const panneau = section.querySelector<HTMLElement>('[data-cartouche]');
    const repere = section.querySelector<HTMLElement>('[data-repere]');
    if (!panneau || !repere) return null;
    return {
      panneau,
      lettres: [...panneau.querySelectorAll<HTMLElement>('[data-lettre]')],
      suite: [...panneau.querySelectorAll<HTMLElement>('[data-apparait]')],
      repere,
    };
  });
  const presents = cartouches.filter((c) => c !== null);
  gsap.set(
    presents.map((c) => c.panneau),
    { opacity: 0 },
  );

  const ligne = trait.querySelector('polyline')!;
  const [point, onde, fin] = trait.querySelectorAll('circle');
  const dessin = { progres: 0 };
  let relie = false;
  let actif = -1;
  let focus = -1;

  const entrer = (k: number) => {
    const cartouche = cartouches[k];
    if (!cartouche) return;
    const { panneau, lettres, suite } = cartouche;
    gsap.killTweensOf([panneau, ...lettres, ...suite]);
    gsap.set(panneau, { opacity: 1 });
    gsap
      .timeline()
      .fromTo(
        lettres,
        { yPercent: 118 },
        { yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.024 },
        0,
      )
      .fromTo(
        suite,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 },
        0.18,
      );
    gsap.killTweensOf(dessin);
    dessin.progres = 0;
    relie = false;
  };

  const sortir = (k: number) => {
    const cartouche = cartouches[k];
    if (!cartouche) return;
    gsap.killTweensOf(cartouche.panneau);
    gsap.to(cartouche.panneau, { opacity: 0, duration: 0.35, ease: 'power1.in' });
    gsap.killTweensOf(dessin);
    gsap.to(dessin, { progres: 0, duration: 0.25, ease: 'power1.in' });
  };

  const changer = (suivant: number) => {
    if (suivant === actif) return;
    if (actif !== -1) sortir(actif);
    actif = suivant;
    if (actif !== -1) entrer(actif);
  };

  // Le clavier passe avant la caméra : un lien qui reçoit le focus rend son cartouche visible à l'instant.
  const surFocus = (evenement: FocusEvent) => {
    const k = sections.findIndex((section) => section.contains(evenement.target as Node));
    if (k === -1 || !cartouches[k]) return;
    focus = k;
    changer(k);
  };
  const surSortieFocus = (evenement: FocusEvent) => {
    if (focus !== -1 && !sections[focus]!.contains(evenement.relatedTarget as Node | null)) focus = -1;
  };
  sections.forEach((section) => {
    section.addEventListener('focusin', surFocus);
    section.addEventListener('focusout', surSortieFocus);
  });

  const cacherTrait = () => {
    trait.style.opacity = '0';
  };
  cacherTrait();

  return {
    activer(section) {
      changer(focus !== -1 ? focus : cartouches[section] ? section : -1);
    },
    focalisee: () => focus,
    relier(ancre, cote) {
      const cartouche = cartouches[actif];
      if (!cartouche || !ancre) return cacherTrait();
      if (!relie) {
        relie = true;
        gsap.to(dessin, { progres: 1, duration: 0.9, ease: 'power2.inOut', delay: 0.15 });
      }
      if (dessin.progres <= 0) return cacherTrait();
      const boite = cartouche.repere.getBoundingClientRect();
      // Repère sorti de la fenêtre (page défilée) : le trait se retire avec lui.
      if (boite.bottom < 0 || boite.top > innerHeight) return cacherTrait();
      const bloc = cartouche.panneau.getBoundingClientRect();
      // Arrivée : juste avant le repère (texte à droite), juste après la jauge (texte à gauche), ou
      // au-dessus du repère (téléphone, où le trait descend du coin bas de l'écran). Sur grand écran, le
      // coude se tient hors du bloc de texte : le trait ne traverse jamais une ligne et arrive à
      // l'horizontale, à la hauteur du repère.
      const jauge = (cartouche.repere.lastElementChild ?? cartouche.repere).getBoundingClientRect();
      const arrivee: Point =
        cote === 'droite'
          ? { x: boite.left - 14, y: boite.top + boite.height / 2 }
          : cote === 'gauche'
            ? { x: jauge.right + 14, y: boite.top + boite.height / 2 }
            : { x: boite.left + 3, y: boite.top - 14 };
      const coude: Point =
        cote === 'bas'
          ? { x: arrivee.x, y: ancre.y }
          : { x: cote === 'droite' ? arrivee.x - 40 : bloc.right + 32, y: arrivee.y };
      const longueur =
        Math.hypot(coude.x - ancre.x, coude.y - ancre.y) +
        Math.hypot(arrivee.x - coude.x, arrivee.y - coude.y);
      ligne.setAttribute('points', `${ancre.x},${ancre.y} ${coude.x},${coude.y} ${arrivee.x},${arrivee.y}`);
      ligne.style.strokeDasharray = `${longueur}`;
      ligne.style.strokeDashoffset = `${longueur * (1 - dessin.progres)}`;
      for (const cercle of [point, onde]) {
        cercle?.setAttribute('cx', `${ancre.x}`);
        cercle?.setAttribute('cy', `${ancre.y}`);
      }
      fin?.setAttribute('cx', `${arrivee.x}`);
      fin?.setAttribute('cy', `${arrivee.y}`);
      fin?.style.setProperty('opacity', dessin.progres > 0.98 ? '1' : '0');
      trait.style.opacity = `${Math.min(dessin.progres * 3, 1)}`;
    },
    detruire() {
      sections.forEach((section) => {
        section.removeEventListener('focusin', surFocus);
        section.removeEventListener('focusout', surSortieFocus);
      });
      const tous = presents.flatMap((c) => [c.panneau, ...c.lettres, ...c.suite]);
      gsap.killTweensOf([...tous, dessin]);
      // Sans monde, le texte redevient simplement visible.
      gsap.set(tous, { clearProps: 'opacity,transform' });
      cacherTrait();
    },
  };
}
