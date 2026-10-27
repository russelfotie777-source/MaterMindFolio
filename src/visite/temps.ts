// Position de la visite sur sa timeline, tirée d'une seule horloge (contrat, section 3.1, point 2) :
// AudioContext.currentTime quand le son joue, performance.now() sinon. En pause, la position est figée ;
// à la reprise, elle repart de l'horloge, donc sans dérive accumulée.
export type LecteurTemps = {
  position: () => number;
  jouer: () => void;
  pause: () => void;
  aller: (secondes: number) => void;
  enLecture: () => boolean;
};

export function creerLecteurTemps(horloge: () => number): LecteurTemps {
  let position = 0;
  let origine: number | null = null;
  return {
    position: () => (origine === null ? position : position + (horloge() - origine)),
    jouer() {
      if (origine === null) origine = horloge();
    },
    pause() {
      if (origine === null) return;
      position += horloge() - origine;
      origine = null;
    },
    aller(secondes) {
      position = secondes;
      if (origine !== null) origine = horloge();
    },
    enLecture: () => origine !== null,
  };
}
