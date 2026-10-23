import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // ADR-004 : <Canvas> embarque tout Three.js ; la scène est montée par createRoot et un catalogue explicite.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@react-three/fiber',
              importNames: ['Canvas'],
              message: 'Interdit par l’ADR-004 : utiliser createRoot et extend({ … }).',
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    '.tests/**',
    'node_modules/**',
    'next-env.d.ts',
    'design/**',
    'decor-candidats/**',
    'captures-projets/**',
  ]),
]);
