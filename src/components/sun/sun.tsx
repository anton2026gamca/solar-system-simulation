'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import sunVertexShader from './sun.vert';
import sunFragmentShader from './sun.frag';

const SUN_RADIUS_AU = 0.00465;

interface SunProps {
  auScale: number;
  exaggeration?: number;
}

export default function Sun({ auScale, exaggeration = 12 }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uCameraPosition: { value: new THREE.Vector3() },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uCameraPosition.value.copy(state.camera.position);
  });

  const radius = SUN_RADIUS_AU * auScale * exaggeration;

  return (
    <group ref={groupRef}>
      <pointLight intensity={2.2} decay={0} distance={0} color="#fff6e5" />

      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
