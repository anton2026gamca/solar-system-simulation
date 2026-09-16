import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),

  {
    /*
      The rendering layer is imperative by design.

      React Compiler's `immutability` and `refs` rules assume a pure data-flow
      component model: no mutation of values reached through props, no touching
      refs outside an event handler. react-three-fiber inverts that. Its frame
      callback runs sixty times a second outside React's render cycle and works
      by mutating Object3D transforms, shader uniforms and DOM nodes in place -
      that is the entire point, and the alternative is a re-render per frame.

      These rules stay switched on everywhere else. They are relaxed only for
      the three files that own the render loop, and only for the two rules that
      conflict with it.
    */
    name: 'solar-system-simulation/imperative-render-loop',
    files: [
      'src/components/solar-system-scene.tsx',
      'src/components/scene-labels.tsx',
      'src/components/earth/earth.tsx',
    ],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },
]);

export default eslintConfig;
