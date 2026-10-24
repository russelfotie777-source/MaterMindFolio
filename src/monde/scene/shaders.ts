// Shaders du monde HORIZON 237. Les couleurs sont écrites directement en sRGB (aucune inclusion de
// conversion) : ce que l'on lit ici est ce qui s'affiche. Palette vivante de la direction C3 : violets
// profonds, glycine, rose de la trace solaire, or du soleil levant, vert vivant des lucioles.

// Bruit de valeur 2D et somme d'octaves, partagés par le ciel, la mer de nuages et le Fuji.
const BRUIT = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float bruit(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float somme = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      somme += amplitude * bruit(p);
      p = p * 2.03 + vec2(17.0, 9.0);
      amplitude *= 0.5;
    }
    return somme;
  }
`;

// Ciel : dôme vu de l'intérieur. Zénith violet nuit, horizon rose, halo d'or autour du soleil levant.
export const CIEL = {
  vertex: /* glsl */ `
    varying vec3 vDirection;
    void main() {
      vDirection = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uSoleil;
    varying vec3 vDirection;
    void main() {
      vec3 d = normalize(vDirection);
      float h = d.y;
      vec3 horizon = vec3(0.98, 0.50, 0.62);
      vec3 bas = vec3(0.62, 0.22, 0.66);
      vec3 milieu = vec3(0.30, 0.10, 0.52);
      vec3 zenith = vec3(0.045, 0.025, 0.11);
      vec3 couleur = mix(horizon, bas, smoothstep(0.0, 0.06, h));
      couleur = mix(couleur, milieu, smoothstep(0.04, 0.22, h));
      couleur = mix(couleur, zenith, smoothstep(0.18, 0.75, h));
      vec3 soleil = normalize(uSoleil);
      float proche = max(dot(d, soleil), 0.0);
      couleur += vec3(1.0, 0.62, 0.28) * pow(proche, 18.0) * 0.85;
      couleur += vec3(1.0, 0.38, 0.52) * pow(proche, 3.0) * 0.22 * (1.0 - smoothstep(0.0, 0.5, h));
      couleur = mix(couleur, vec3(0.16, 0.06, 0.28), smoothstep(0.0, -0.12, h));
      gl_FragColor = vec4(couleur, 1.0);
    }
  `,
};

// Étoiles : points scintillants sur la voûte, plus nombreux vers le zénith.
export const ETOILES = {
  vertex: /* glsl */ `
    uniform float uTemps;
    uniform float uPixel;
    attribute float aGraine;
    varying float vEclat;
    void main() {
      vec4 vue = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * vue;
      float scintille = 0.6 + 0.4 * sin(uTemps * (1.2 + aGraine * 2.5) + aGraine * 40.0);
      vEclat = scintille * (0.45 + aGraine * 0.55);
      gl_PointSize = (1.0 + aGraine * 2.2) * uPixel;
    }
  `,
  fragment: /* glsl */ `
    varying float vEclat;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float disque = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vec3(1.0, 0.95, 1.0) * vEclat, disque * vEclat);
    }
  `,
};

// Mer de nuages : un grand plan dont le relief et la lumière viennent du même bruit animé ; les crêtes
// tournées vers le soleil s'éclairent d'or et de rose, les creux restent violets.
export const NUAGES = {
  vertex: /* glsl */ `
    uniform float uTemps;
    varying vec3 vMonde;
    varying float vRelief;
    ${BRUIT}
    void main() {
      vec4 monde = modelMatrix * vec4(position, 1.0);
      vec2 p = monde.xz * 0.006 + vec2(uTemps * 0.006, uTemps * 0.002);
      float relief = fbm(p) * 0.7 + fbm(p * 2.7 - uTemps * 0.004) * 0.3;
      monde.y += (relief - 0.5) * 34.0;
      vMonde = monde.xyz;
      vRelief = relief;
      gl_Position = projectionMatrix * viewMatrix * monde;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uSoleil;
    uniform vec3 uCamera;
    varying vec3 vMonde;
    varying float vRelief;
    void main() {
      vec3 creux = vec3(0.20, 0.09, 0.40);
      vec3 flanc = vec3(0.55, 0.30, 0.78);
      vec3 crete = vec3(1.0, 0.80, 0.90);
      float r = smoothstep(0.3, 0.78, vRelief);
      vec3 couleur = mix(creux, flanc, smoothstep(0.0, 0.55, r));
      couleur = mix(couleur, crete, smoothstep(0.55, 1.0, r));
      vec3 vue = vMonde - uCamera;
      vec2 versSoleil = normalize(uSoleil.xz);
      float face = pow(max(dot(normalize(vue.xz), versSoleil), 0.0), 6.0);
      couleur += vec3(1.0, 0.55, 0.30) * face * r * 0.45;
      float distance = length(vue.xz);
      couleur = mix(couleur, vec3(0.98, 0.52, 0.66), smoothstep(350.0, 2200.0, distance));
      gl_FragColor = vec4(couleur, 1.0);
    }
  `,
};

// Fuji : éclairage simple venu du soleil, neige au sommet qui descend en coulées dans les ravines,
// voile d'horizon rose sur le pied.
export const FUJI = {
  vertex: /* glsl */ `
    varying vec3 vNormale;
    varying vec3 vMonde;
    varying vec3 vLocal;
    varying float vHauteur;
    uniform float uSommet;
    void main() {
      vec4 monde = modelMatrix * vec4(position, 1.0);
      vMonde = monde.xyz;
      vLocal = position;
      vNormale = normalize(mat3(modelMatrix) * normal);
      vHauteur = position.y / uSommet;
      gl_Position = projectionMatrix * viewMatrix * monde;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uSoleil;
    uniform vec3 uCamera;
    varying vec3 vNormale;
    varying vec3 vMonde;
    varying vec3 vLocal;
    varying float vHauteur;
    ${BRUIT}
    void main() {
      vec3 n = normalize(vNormale);
      float lumiere = max(dot(n, normalize(uSoleil)), 0.0);
      float face = max(dot(n, normalize(uCamera - vMonde)), 0.0);
      vec3 roche = mix(vec3(0.07, 0.06, 0.20), vec3(0.24, 0.14, 0.44), lumiere * 0.8 + face * 0.25);
      float a = atan(vLocal.x, vLocal.z);
      float lobes = fbm(vec2(a * 5.0, 3.1));
      float coulees = pow(fbm(vec2(a * 30.0, vHauteur * 1.2)), 2.2);
      float bord = 0.78 - lobes * 0.12 - coulees * 0.5;
      float neige = smoothstep(bord, bord + 0.02, vHauteur);
      vec3 blanc = mix(vec3(0.80, 0.74, 0.96), vec3(1.0, 0.95, 0.98), lumiere * 0.7 + face * 0.4);
      vec3 couleur = mix(roche, blanc, neige);
      couleur += vec3(1.0, 0.45, 0.58) * pow(1.0 - face, 3.0) * 0.22;
      float distance = length(vMonde - uCamera);
      float pied = 1.0 - smoothstep(0.0, 0.25, vHauteur);
      couleur = mix(couleur, vec3(0.86, 0.46, 0.70), clamp(smoothstep(500.0, 2200.0, distance) * 0.5 + pied * 0.35, 0.0, 1.0));
      gl_FragColor = vec4(couleur, 1.0);
    }
  `,
};

// Pétales : sprites qui tombent en tournoyant, recyclés à l'infini dans un volume autour du chemin.
export const PETALES = {
  vertex: /* glsl */ `
    uniform float uTemps;
    uniform float uPixel;
    uniform vec3 uVolume;
    attribute vec4 aGraine;
    varying float vRotation;
    varying vec3 vCouleur;
    void main() {
      vec3 p = position;
      float chute = uTemps * (2.0 + aGraine.x * 2.5);
      p.y = mod(p.y - chute, uVolume.y);
      p.x += sin(uTemps * (0.5 + aGraine.y) + aGraine.z * 6.28) * 3.0 + uTemps * 1.2;
      p.x = mod(p.x + uVolume.x * 0.5, uVolume.x) - uVolume.x * 0.5;
      p.z += cos(uTemps * (0.4 + aGraine.z) + aGraine.y * 6.28) * 2.0;
      vec4 vue = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * vue;
      gl_PointSize = (180.0 + aGraine.w * 220.0) * uPixel / -vue.z;
      vRotation = uTemps * (1.0 + aGraine.x * 2.0) + aGraine.w * 6.28;
      vCouleur = mix(vec3(1.0, 0.62, 0.82), vec3(0.78, 0.48, 0.96), aGraine.y);
    }
  `,
  fragment: /* glsl */ `
    varying float vRotation;
    varying vec3 vCouleur;
    void main() {
      vec2 p = gl_PointCoord - 0.5;
      float c = cos(vRotation);
      float s = sin(vRotation);
      p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
      float forme = length(vec2(p.x * 2.2, p.y + p.x * p.x * 1.6));
      float alpha = smoothstep(0.5, 0.36, forme);
      if (alpha < 0.02) discard;
      gl_FragColor = vec4(vCouleur * (0.8 + 0.4 * p.y), alpha * 0.92);
    }
  `,
};

// Lucioles : points vivants vert et or qui flottent autour des îles et respirent.
export const LUCIOLES = {
  vertex: /* glsl */ `
    uniform float uTemps;
    uniform float uPixel;
    attribute vec3 aGraine;
    varying float vEclat;
    varying vec3 vCouleur;
    void main() {
      vec3 p = position;
      p.x += sin(uTemps * 0.6 + aGraine.x * 6.28) * 1.6;
      p.y += sin(uTemps * 0.8 + aGraine.y * 6.28) * 1.2;
      p.z += cos(uTemps * 0.5 + aGraine.z * 6.28) * 1.6;
      vec4 vue = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * vue;
      vEclat = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTemps * 2.2 + aGraine.x * 30.0), 3.0);
      gl_PointSize = 420.0 * uPixel / -vue.z;
      vCouleur = mix(vec3(0.11, 0.85, 0.46), vec3(1.0, 0.82, 0.38), step(0.72, aGraine.y));
    }
  `,
  fragment: /* glsl */ `
    varying float vEclat;
    varying vec3 vCouleur;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float coeur = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vCouleur, pow(coeur, 2.2) * vEclat);
    }
  `,
};

// Halo du soleil : disque d'or et couronne douce, dessinés sur un plan toujours tourné vers la caméra.
export const SOLEIL = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    varying vec2 vUv;
    void main() {
      float d = length(vUv - 0.5) * 2.0;
      float disque = smoothstep(0.24, 0.22, d);
      float couronne = pow(max(1.0 - d, 0.0), 2.6) * 0.75;
      vec3 couleur = mix(vec3(1.0, 0.55, 0.35), vec3(1.0, 0.93, 0.78), disque);
      gl_FragColor = vec4(couleur, max(disque, couronne));
    }
  `,
};

// Comète : une tête blanche et une queue rose qui traversent le ciel toutes les seize secondes, dessinées
// sur un long plan ; elle passe en trois secondes, puis le ciel redevient calme.
export const COMETE = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform float uTemps;
    varying vec2 vUv;
    void main() {
      float cycle = mod(uTemps + 6.0, 16.0) / 3.2;
      float d = cycle - vUv.x;
      float largeur = 1.0 - abs(vUv.y - 0.5) * 2.0;
      float queue = d > 0.0 ? pow(max(1.0 - d / 0.32, 0.0), 2.0) * pow(largeur, 2.0 + d * 24.0) : 0.0;
      float tete = smoothstep(0.012, 0.0, abs(d)) * pow(largeur, 5.0);
      vec3 couleur = mix(vec3(1.0, 0.42, 0.68), vec3(1.0, 0.96, 1.0), clamp(tete * 2.0 + queue * 0.35, 0.0, 1.0));
      float visible = step(cycle, 1.35);
      gl_FragColor = vec4(couleur, (queue * 0.85 + tete) * visible);
    }
  `,
};
