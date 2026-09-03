import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

import sunVertexShader from "./sun.vert";
import sunFragmentShader from "./sun.frag";

export default function Sun() {
  const shaderUniforms = useMemo(
    () => ({
      uCameraPosition: { value: new THREE.Vector3() },
      uGlowColor: { value: new THREE.Color("#ffe599") },
    }),
    []
  );

  useFrame((state) => {
    shaderUniforms.uCameraPosition.value.copy(state.camera.position);
  });

  return (
    <group>
      <mesh scale={12.0} >
        <sphereGeometry args={[0.11625, 32, 32]} />
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={shaderUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
        <Html
          position={new THREE.Vector3(0, 0, 0)}
          className="pointer-events-none select-none whitespace-nowrap flex flex-col items-center transform -translate-x-1/2 -translate-y-full"
        >
          <span className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-1 block">SUN</span>
          <div className="w-px h-13.75 mb-1 bg-white/60" />
        </Html>
      </mesh>
    </group >
  );
}
