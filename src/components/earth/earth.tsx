'use client';

import { RefObject, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import earthVertexShader from './earth.vert';
import earthFragmentShader from './earth.frag';

import atmosphereVertexShader from './atmosphere.vert';
import atmosphereFragmentShader from './atmosphere.frag';

import cloudVertexShader from './clouds.vert';
import cloudFragmentShader from './clouds.frag';

import { SeasonalAlbedo, seasonBlendFor } from '@/utils/seasonal-albedo';

const BUMP_WIDTH = 4096;
const BUMP_HEIGHT = 2048;

const SEASON_UPDATE_INTERVAL_MS = 250;

export interface EarthTextures {
  day: THREE.Texture;
  night: THREE.Texture;
  lights: THREE.Texture;
  clouds: THREE.Texture;
  specular: THREE.Texture;
  bump: THREE.Texture;
}

interface EarthProps {
  radius: number;
  time: RefObject<number>;
  sunPosition: THREE.Vector3;
  moonPosition: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  textures: EarthTextures;
  seasonalAlbedo: boolean;
}

export default function Earth({
  radius,
  time,
  sunPosition,
  moonPosition,
  cameraPosition,
  textures,
  seasonalAlbedo,
}: EarthProps) {
  const cloudMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const earthMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());

  const earthUniforms = useMemo(
    () => ({
      uDayTexture: { value: textures.day },
      uDayTextureNext: { value: textures.day },
      uSeasonBlend: { value: 0 },
      uNightTexture: { value: textures.night },
      uLightsTexture: { value: textures.lights },
      uSpecularTexture: { value: textures.specular },
      uBumpTexture: { value: textures.bump },
      uBumpTexelSize: { value: new THREE.Vector2(1 / BUMP_WIDTH, 1 / BUMP_HEIGHT) },
      uSunPosition: { value: sunPosition },
      uMoonPosition: { value: moonPosition },
      uCameraPosition: { value: cameraPosition },
      uNightLightsIntensity: { value: 1.0 },
      uMoonLightingFactor: { value: 0.2 },
      uMoonSpecularIntensity: { value: 1.0 },
    }),
    [textures, sunPosition, moonPosition, cameraPosition]
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uSunPosition: { value: sunPosition },
      uCameraPosition: { value: cameraPosition },
      uIntensity: { value: 0.8 },
    }),
    [sunPosition, cameraPosition]
  );

  const cloudUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCloudTexture: { value: textures.clouds },
      uSunPosition: { value: sunPosition },
    }),
    [textures, sunPosition]
  );

  const albedo = useMemo(() => new SeasonalAlbedo(maxAnisotropy), [maxAnisotropy]);
  useEffect(() => () => albedo.dispose(), [albedo]);

  const lastSeasonCheckRef = useRef(0);

  useFrame(() => {
    if (cloudMaterialRef.current) {
      const speedFactor = 0.001;
      const raw = time.current * 0.001 * speedFactor;
      cloudMaterialRef.current.uniforms.uTime.value = raw % (2 * Math.PI);
    }

    const material = earthMaterialRef.current;
    if (!material) return;

    if (!seasonalAlbedo) {
      material.uniforms.uDayTexture.value = textures.day;
      material.uniforms.uDayTextureNext.value = textures.day;
      material.uniforms.uSeasonBlend.value = 0;
      return;
    }

    const wall = performance.now();
    if (wall - lastSeasonCheckRef.current < SEASON_UPDATE_INTERVAL_MS) return;
    lastSeasonCheckRef.current = wall;

    const { from, to, mix } = seasonBlendFor(new Date(time.current));
    const fromTexture = albedo.request(from);
    const toTexture = albedo.request(to);

    if (fromTexture && toTexture) {
      material.uniforms.uDayTexture.value = fromTexture;
      material.uniforms.uDayTextureNext.value = toTexture;
      material.uniforms.uSeasonBlend.value = mix;
    } else {
      const resident = fromTexture ?? toTexture ?? textures.day;
      material.uniforms.uDayTexture.value = resident;
      material.uniforms.uDayTextureNext.value = resident;
      material.uniforms.uSeasonBlend.value = 0;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 128, 128]} />
        <shaderMaterial
          ref={earthMaterialRef}
          vertexShader={earthVertexShader}
          fragmentShader={earthFragmentShader}
          uniforms={earthUniforms}
        />
      </mesh>

      <mesh scale={1.008}>
        <sphereGeometry args={[radius, 128, 128]} />
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

      <mesh scale={1.02}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={atmosphereUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
