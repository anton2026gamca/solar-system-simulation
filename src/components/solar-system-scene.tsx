'use client';

import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { CameraControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  AdvancedAstronomyEngine,
  MoonProfile,
  PlanetProfile,
  REALISTIC_PLANETS,
  Vector3D,
} from '@/utils/astronomy-engine';
import { SimulationClock } from '@/utils/simulation-clock';
import Earth, { EarthTextures } from './earth/earth';
import Sun from './sun/sun';

export const AU_SCALE = 25;

const MOON_PATH_UPDATE_INTERVAL_MS = 6 * 60 * 60 * 1000;

const IRREGULAR_MOONS = new Set([
  'himalia', 'elara', 'lysithea', 'ananke', 'carme', 'pasiphae', 'sinope',
]);

const PLANET_ENTRIES = Object.entries(REALISTIC_PLANETS) as [string, PlanetProfile][];
const MOON_ENTRIES: Record<string, [string, MoonProfile][]> = Object.fromEntries(
  PLANET_ENTRIES.map(([key, profile]) => [key, Object.entries(profile.moons ?? {})])
);

function resolvePlanetPosition(key: string, profile: PlanetProfile, date: Date): Vector3D {
  return key === 'earth'
    ? AdvancedAstronomyEngine.getEarthPositionPrecise(date)
    : AdvancedAstronomyEngine.getPlanetPosition(profile, date);
}

function resolvePlanetPath(
  key: string,
  profile: PlanetProfile,
  date: Date,
  segments: number
): Vector3D[] {
  return key === 'earth'
    ? AdvancedAstronomyEngine.getEarthPathPrecise(segments, date)
    : AdvancedAstronomyEngine.getOrbitPath(profile, date, segments);
}

function resolveMoonPosition(
  planetKey: string,
  moonKey: string,
  profile: MoonProfile,
  date: Date
): Vector3D {
  return planetKey === 'earth' && moonKey === 'moon'
    ? AdvancedAstronomyEngine.getEarthMoonPositionPrecise(date)
    : AdvancedAstronomyEngine.getMoonLocalPosition(profile, date);
}

function resolveMoonPath(
  planetKey: string,
  moonKey: string,
  profile: MoonProfile,
  date: Date,
  segments: number
): Vector3D[] {
  return planetKey === 'earth' && moonKey === 'moon'
    ? AdvancedAstronomyEngine.getEarthMoonPathPrecise(segments, date)
    : AdvancedAstronomyEngine.getMoonLocalPath(profile, segments);
}

function toSceneVector(p: Vector3D): THREE.Vector3 {
  return new THREE.Vector3(p.x * AU_SCALE, p.z * AU_SCALE, -p.y * AU_SCALE);
}

interface SolarSystemSceneProps {
  clock: SimulationClock;
  commitToken: number;
  timeScale: number;
  focusTarget: string;
  showOrbits: boolean;
  showAxes: boolean;
  seasonalAlbedo: boolean;
  registry: RefObject<Record<string, THREE.Object3D>>;
  onReady: () => void;
}

export default function SolarSystemScene({
  clock,
  commitToken,
  timeScale,
  focusTarget,
  showOrbits,
  showAxes,
  seasonalAlbedo,
  registry,
  onReady,
}: SolarSystemSceneProps) {
  const systemContainerRef = useRef<THREE.Group>(null);
  const planetRefs = useRef<Record<string, THREE.Group>>({});
  const planetMeshRefs = useRef<Record<string, THREE.Object3D>>({});
  const moonGroupRefs = useRef<Record<string, THREE.Group>>({});
  const controlsRef = useRef<CameraControls>(null);

  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());

  const [
    milkyWay,
    earthDay,
    earthNight,
    earthLights,
    earthClouds,
    earthSpecular,
    earthBump,
    moonMap,
  ] = useLoader(THREE.TextureLoader, [
    '/textures/milkyway/milkyway.webp',
    '/textures/earth/day.webp',
    '/textures/earth/night.webp',
    '/textures/earth/lights.webp',
    '/textures/earth/clouds.webp',
    '/textures/earth/specular.webp',
    '/textures/earth/bump.webp',
    '/textures/moon/moon.webp',
  ]);

  useEffect(() => {
    milkyWay.mapping = THREE.EquirectangularReflectionMapping;

    for (const texture of [milkyWay]) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
    for (const texture of [earthLights, earthClouds, earthSpecular, earthBump]) {
      texture.colorSpace = THREE.NoColorSpace;
      texture.needsUpdate = true;
    }
    for (const texture of [earthDay, earthNight, moonMap, earthClouds]) {
      texture.anisotropy = maxAnisotropy;
    }
  }, [milkyWay, earthDay, earthNight, earthLights, earthClouds, earthSpecular, earthBump, moonMap, maxAnisotropy]);

  const earthTextures: EarthTextures = useMemo(
    () => ({
      day: earthDay,
      night: earthNight,
      lights: earthLights,
      clouds: earthClouds,
      specular: earthSpecular,
      bump: earthBump,
    }),
    [earthDay, earthNight, earthLights, earthClouds, earthSpecular, earthBump]
  );

  const sunWorld = useRef(new THREE.Vector3());
  const moonWorld = useRef(new THREE.Vector3());
  const cameraWorld = useRef(new THREE.Vector3());
  const focusShift = useRef(new THREE.Vector3());

  const [earthMoonLivePath, setEarthMoonLivePath] = useState<THREE.Vector3[] | null>(null);
  const lastMoonPathUpdateRef = useRef(clock.getTime());

  useEffect(() => {
    const date = new Date(clock.getTime());
    lastMoonPathUpdateRef.current = Number.NEGATIVE_INFINITY;

    for (const [planetKey, profile] of PLANET_ENTRIES) {
      const group = planetRefs.current[planetKey];
      if (group) {
        const position = resolvePlanetPosition(planetKey, profile, date);
        group.position.set(position.x * AU_SCALE, position.z * AU_SCALE, -position.y * AU_SCALE);
      }

      for (const [moonKey, moonProfile] of MOON_ENTRIES[planetKey]) {
        const moonGroup = moonGroupRefs.current[`${planetKey}_${moonKey}`];
        if (!moonGroup) continue;
        const position = resolveMoonPosition(planetKey, moonKey, moonProfile, date);
        moonGroup.position.set(position.x * AU_SCALE, position.z * AU_SCALE, -position.y * AU_SCALE);
      }
    }
  }, [clock, commitToken]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (focusTarget === 'solar') {
      controls.setLookAt(0, 150, 250, 0, 0, 0, true);
      return;
    }

    const profile = REALISTIC_PLANETS[focusTarget];
    if (!profile) return;

    const position = resolvePlanetPosition(focusTarget, profile, new Date(clock.getTime()));
    const towardsSun = new THREE.Vector3(-position.x, -position.z, position.y).normalize();

    const direction = towardsSun
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(55))
      .setY(0.3)
      .normalize();

    const distance = profile.radiusAu * AU_SCALE * 9;

    controls.setLookAt(
      direction.x * distance,
      direction.y * distance,
      direction.z * distance,
      0,
      0,
      0,
      true
    );
  }, [focusTarget, clock, commitToken]);

  const systemPaths = useMemo(() => {
    const date = new Date(clock.getTime());
    const planetOrbits: { key: string; color: string; vectors: THREE.Vector3[] }[] = [];
    const moonOrbits: Record<
      string,
      { key: string; color: string; vectors: THREE.Vector3[]; radius: number }[]
    > = {};

    for (const [planetKey, profile] of PLANET_ENTRIES) {
      planetOrbits.push({
        key: planetKey,
        color: profile.color,
        vectors: resolvePlanetPath(planetKey, profile, date, 180).map(toSceneVector),
      });

      moonOrbits[planetKey] = MOON_ENTRIES[planetKey].map(([moonKey, moonProfile]) => ({
        key: moonKey,
        color: moonProfile.color,
        vectors: resolveMoonPath(planetKey, moonKey, moonProfile, date, 64).map(toSceneVector),
        radius: moonProfile.a * AU_SCALE,
      }));
    }

    return { planetOrbits, moonOrbits };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, commitToken]);

  const timeRef = useRef(clock.getTime());

  const moonOrbitRefs = useRef<Record<string, { object: THREE.Object3D; radius: number }>>({});

  const initialPlacement = useMemo(() => {
    const date = new Date(clock.getTime());
    const planets: Record<string, Vector3D> = {};
    const moons: Record<string, Vector3D> = {};

    for (const [planetKey, profile] of PLANET_ENTRIES) {
      planets[planetKey] = resolvePlanetPosition(planetKey, profile, date);
      for (const [moonKey, moonProfile] of MOON_ENTRIES[planetKey]) {
        moons[`${planetKey}_${moonKey}`] = resolveMoonPosition(
          planetKey,
          moonKey,
          moonProfile,
          date
        );
      }
    }

    return { planets, moons };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, commitToken]);

  const lastNearRef = useRef(0);

  useFrame((state, delta) => {
    if (timeScale !== 0) {
      clock.advance(delta * 1000 * timeScale);
    }

    timeRef.current = clock.getTime();
    const date = new Date(timeRef.current);
    const container = systemContainerRef.current;

    focusShift.current.set(0, 0, 0);

    for (const [planetKey, profile] of PLANET_ENTRIES) {
      const group = planetRefs.current[planetKey];
      if (group) {
        const position = resolvePlanetPosition(planetKey, profile, date);
        const x = position.x * AU_SCALE;
        const y = position.z * AU_SCALE;
        const z = -position.y * AU_SCALE;
        group.position.set(x, y, z);

        if (planetKey === focusTarget) focusShift.current.set(x, y, z);
      }

      const mesh = planetMeshRefs.current[planetKey];
      if (mesh) {
        mesh.rotation.copy(AdvancedAstronomyEngine.getPlanetEulerRotation(profile, date));
      }

      for (const [moonKey, moonProfile] of MOON_ENTRIES[planetKey]) {
        const moonGroup = moonGroupRefs.current[`${planetKey}_${moonKey}`];
        if (!moonGroup) continue;
        const position = resolveMoonPosition(planetKey, moonKey, moonProfile, date);
        moonGroup.position.set(
          position.x * AU_SCALE,
          position.z * AU_SCALE,
          -position.y * AU_SCALE
        );
      }
    }

    if (container) {
      if (focusTarget === 'solar') {
        container.position.set(0, 0, 0);
      } else {
        container.position.copy(focusShift.current).multiplyScalar(-1);
      }
      controlsRef.current?.setTarget(0, 0, 0, false);

      sunWorld.current.copy(container.position);

      const earthGroup = planetRefs.current.earth;
      const moonGroup = moonGroupRefs.current.earth_moon;
      if (earthGroup && moonGroup) {
        moonWorld.current
          .copy(container.position)
          .add(earthGroup.position)
          .add(moonGroup.position);
      }
    }

    cameraWorld.current.copy(state.camera.position);

    const cameraDistance = state.camera.position.length();
    for (const entry of Object.values(moonOrbitRefs.current)) {
      entry.object.visible = cameraDistance > entry.radius * 0.55;
    }

    if (Math.abs(clock.getTime() - lastMoonPathUpdateRef.current) > MOON_PATH_UPDATE_INTERVAL_MS) {
      lastMoonPathUpdateRef.current = clock.getTime();
      setEarthMoonLivePath(
        AdvancedAstronomyEngine.getEarthMoonPathPrecise(64, date).map(toSceneVector)
      );
    }

    const distance = state.camera.position.length();
    const near = THREE.MathUtils.clamp(distance * 0.01, 1e-5, 5);
    if (Math.abs(near - lastNearRef.current) > lastNearRef.current * 0.25) {
      lastNearRef.current = near;
      camera.near = near;
      camera.updateProjectionMatrix();
    }
  });

  const readyFrames = useRef(0);
  const readyFired = useRef(false);

  useFrame(() => {
    if (readyFired.current) return;
    readyFrames.current += 1;
    if (readyFrames.current >= 2) {
      readyFired.current = true;
      onReady();
    }
  });

  return (
    <>
      <primitive attach="background" object={milkyWay} />
      <ambientLight intensity={0.05} />

      <CameraControls ref={controlsRef} minDistance={0.003} maxDistance={6000} />

      <group ref={systemContainerRef}>
        <Sun auScale={AU_SCALE} />

        {showOrbits &&
          focusTarget === 'solar' &&
          systemPaths.planetOrbits.map((orbit) => (
            <Line
              key={orbit.key}
              points={orbit.vectors}
              color={orbit.color}
              lineWidth={1.0}
              transparent
              opacity={1.0}
            />
          ))}

        {PLANET_ENTRIES.map(([planetKey, profile]) => {
          const start = initialPlacement.planets[planetKey];
          const radius = profile.radiusAu * AU_SCALE;
          const isEarth = planetKey === 'earth';

          return (
            <group
              key={planetKey}
              ref={(el) => {
                if (el) {
                  planetRefs.current[planetKey] = el;
                  registry.current[planetKey] = el;
                }
              }}
              position={[start.x * AU_SCALE, start.z * AU_SCALE, -start.y * AU_SCALE]}
            >
              {showAxes && (
                <Line
                  points={[
                    [0, -radius * 1.8, 0],
                    [0, radius * 1.8, 0],
                  ]}
                  color="#4a5568"
                  lineWidth={1}
                  transparent
                  opacity={1.0}
                />
              )}

              <group
                ref={(el) => {
                  if (el) planetMeshRefs.current[planetKey] = el;
                }}
              >
                {isEarth ? (
                  <Earth
                    radius={radius}
                    time={timeRef}
                    sunPosition={sunWorld.current}
                    moonPosition={moonWorld.current}
                    cameraPosition={cameraWorld.current}
                    textures={earthTextures}
                    seasonalAlbedo={seasonalAlbedo}
                  />
                ) : (
                  <mesh>
                    <sphereGeometry args={[radius, 48, 48]} />
                    <meshStandardMaterial color={profile.color} roughness={0.85} metalness={0} />
                  </mesh>
                )}

                {planetKey === 'saturn' && (
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[radius * 1.24, radius * 2.27, 96]} />
                    <meshStandardMaterial
                      color="#e2bf7d"
                      roughness={0.8}
                      metalness={0}
                      side={THREE.DoubleSide}
                      transparent
                      opacity={0.75}
                    />
                  </mesh>
                )}

                {showAxes && (
                  <Line
                    points={[
                      [0, -radius * 1.8, 0],
                      [0, radius * 1.8, 0],
                    ]}
                    color="#ffffff"
                    lineWidth={1}
                    transparent
                    opacity={1.0}
                  />
                )}
              </group>

              {showOrbits &&
                focusTarget === planetKey &&
                systemPaths.moonOrbits[planetKey]?.map((orbit) => {
                  if (IRREGULAR_MOONS.has(orbit.key) && focusTarget !== 'jupiter') return null;

                  const isEarthMoon = isEarth && orbit.key === 'moon';
                  const points = isEarthMoon && earthMoonLivePath ? earthMoonLivePath : orbit.vectors;

                  return (
                    <Line
                      key={orbit.key}
                      ref={(el) => {
                        if (el) {
                          moonOrbitRefs.current[`${planetKey}_${orbit.key}`] = {
                            object: el,
                            radius: orbit.radius,
                          };
                        }
                      }}
                      points={points}
                      color={orbit.color}
                      lineWidth={1}
                      transparent
                      opacity={1.0}
                    />
                  );
                })}

              {MOON_ENTRIES[planetKey].map(([moonKey, moonProfile]) => {
                if (IRREGULAR_MOONS.has(moonKey) && focusTarget !== 'jupiter') return null;

                const moonRadius = moonProfile.radiusAu * AU_SCALE;
                const uniqueKey = `${planetKey}_${moonKey}`;
                const start = initialPlacement.moons[uniqueKey];
                const isLuna = isEarth && moonKey === 'moon';

                return (
                  <group
                    key={uniqueKey}
                    ref={(el) => {
                      if (el) {
                        moonGroupRefs.current[uniqueKey] = el;
                        registry.current[uniqueKey] = el;
                      }
                    }}
                    position={[start.x * AU_SCALE, start.z * AU_SCALE, -start.y * AU_SCALE]}
                  >
                    <mesh>
                      <sphereGeometry args={[moonRadius, isLuna ? 48 : 16, isLuna ? 48 : 16]} />
                      <meshStandardMaterial
                        map={isLuna ? moonMap : undefined}
                        color={isLuna ? '#ffffff' : moonProfile.color}
                        roughness={1}
                        metalness={0}
                      />
                    </mesh>
                  </group>
                );
              })}
            </group>
          );
        })}
      </group>
    </>
  );
}
