"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import earthVertexShader from './earth.vert';
import earthFragmentShader from './earth.frag';

import atmosphereVertexShader from './atmosphere.vert';
import atmosphereFragmentShader from './atmosphere.frag';

import cloudVertexShader from './clouds.vert';
import cloudFragmentShader from './clouds.frag';



interface EarthProps {
  radius: number,
  sunPosition: THREE.Vector3,
  moonPosition: THREE.Vector3,
  cameraPosition: THREE.Vector3,
  earthDayTexture: THREE.Texture,
  earthNightTexture: THREE.Texture,
  earthLightsTexture: THREE.Texture,
  earthCloudsTexture: THREE.Texture,
  earthSpecularTexture: THREE.Texture,
  earthBumbTexture: THREE.Texture,
}

export default function Earth({ radius, sunPosition, moonPosition, cameraPosition, earthDayTexture, earthNightTexture, earthLightsTexture, earthCloudsTexture, earthSpecularTexture, earthBumbTexture }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthCloudsRef = useRef<THREE.Mesh>(null);

  const cloudMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const earthUniforms = useMemo(
    () => ({
      uDayTexture: { value: earthDayTexture },
      uNightTexture: { value: earthNightTexture },
      uLightsTexture: { value: earthLightsTexture },
      uSpecularTexture: { value: earthSpecularTexture },
      uBumbTexture: { value: earthBumbTexture },
      uSunPosition: { value: sunPosition },
      uMoonPosition: { value: moonPosition },
      uCameraPosition: { value: cameraPosition },
      uNightLightsIntensity: { value: 1.0 },
      uMoonLightingFactor: { value: 0.2 },
      uMoonSpecularIntensity: { value: 1.0 },
    }),
    [earthDayTexture, earthNightTexture, earthLightsTexture, earthSpecularTexture, earthBumbTexture, sunPosition, moonPosition, cameraPosition]
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uSunPosition: { value: sunPosition },
      uIntensity: { value: 0.8 },
    }),
    [sunPosition]
  );

  const cloudUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCloudTexture: { value: earthCloudsTexture },
      uSunPosition: { value: sunPosition, },
    }),
    [earthCloudsTexture, sunPosition]
  );

  useFrame((state) => {
    if (cloudMaterialRef.current) {
      cloudMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });


  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry
          args={[
            radius,
            128,
            128,
          ]}
        />

        <shaderMaterial
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={earthUniforms}
        />
      </mesh>

      <mesh
        ref={earthCloudsRef}
        scale={1.008}
      >
        <sphereGeometry
          args={[
            radius,
            128,
            128,
          ]}
        />

        <shaderMaterial
          ref={cloudMaterialRef}
          vertexShader={cloudVertexShader}
          fragmentShader={cloudFragmentShader}
          uniforms={cloudUniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      <mesh scale={1.025}>
        <sphereGeometry
          args={[
            radius,
            128,
            128,
          ]}
        />

        <shaderMaterial
          vertexShader={
            atmosphereVertexShader
          }
          fragmentShader={
            atmosphereFragmentShader
          }
          uniforms={atmosphereUniforms}
          transparent
          blending={
            THREE.AdditiveBlending
          }
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.055}>
        <sphereGeometry
          args={[
            radius,
            128,
            128,
          ]}
        />

        <shaderMaterial
          vertexShader={
            atmosphereVertexShader
          }
          fragmentShader={
            atmosphereFragmentShader
          }
          uniforms={atmosphereUniforms}
          transparent
          blending={
            THREE.AdditiveBlending
          }
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
