'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { CameraControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AdvancedAstronomyEngine, REALISTIC_PLANETS } from '@/utils/astronomy-engine';
import Earth from './earth/earth';

const AU_SCALE = 25;
const MOON_PATH_UPDATE_INTERVAL_MS = 6 * 60 * 60 * 1000;

function resolvePlanetPosition(pKey: string, profile: any, date: Date) {
  return pKey === 'earth'
    ? AdvancedAstronomyEngine.getEarthPositionPrecise(date)
    : AdvancedAstronomyEngine.getPlanetPosition(profile, date);
}

function resolvePlanetPath(pKey: string, profile: any, date: Date, segments: number) {
  return pKey === 'earth'
    ? AdvancedAstronomyEngine.getEarthPathPrecise(segments, date)
    : AdvancedAstronomyEngine.getOrbitPath(profile, date, segments);
}

function resolveMoonPosition(pKey: string, mKey: string, mProfile: any, date: Date) {
  return (pKey === 'earth' && mKey === 'moon')
    ? AdvancedAstronomyEngine.getEarthMoonPositionPrecise(date)
    : AdvancedAstronomyEngine.getMoonLocalPosition(mProfile, date);
}

function resolveMoonPath(pKey: string, mKey: string, mProfile: any, date: Date, segments: number) {
  return (pKey === 'earth' && mKey === 'moon')
    ? AdvancedAstronomyEngine.getEarthMoonPathPrecise(segments, date)
    : AdvancedAstronomyEngine.getMoonLocalPath(mProfile, segments);
}

interface SolarSystemSceneProps {
  initialDate: Date;
  commitToken: number;
  timeScale: number;
  focusTarget: string;
}

export default function SolarSystemScene({ initialDate, commitToken, timeScale, focusTarget }: SolarSystemSceneProps) {
  const systemContainerRef = useRef<THREE.Group>(null);
  const planetRefs = useRef<Record<string, THREE.Group>>({});
  const planetMeshRefs = useRef<Record<string, THREE.Mesh | THREE.Group>>({});
  const moonGroupRefs = useRef<Record<string, THREE.Group>>({});
  const controlsRef = useRef<any>(null);

  const timelineRef = useRef<number>(initialDate.getTime());

  const milkyWayBackground = useLoader(THREE.TextureLoader, "/textures/milkyway/milkyway.jpg")
  milkyWayBackground.mapping = THREE.EquirectangularReflectionMapping;
  milkyWayBackground.colorSpace = THREE.SRGBColorSpace

  const [
    earthDayTexture,
    earthNightTexture,
    earthLightsTexture,
    earthCloudsTexture,
    earthSpecularTexture,
    earthBumpTexture,
  ] = useLoader(
    THREE.TextureLoader,
    [
      "/textures/earth/earth_day.jpg",
      "/textures/earth/earth_night.jpg",
      "/textures/earth/earth_lights.jpg",
      "/textures/earth/earth_clouds.jpg",
      "/textures/earth/earth_specular.jpg",
      "/textures/earth/earth_bump.jpg",
    ]
  );

  const sharedSunPos = useRef(new THREE.Vector3());
  const sharedMoonPos = useRef(new THREE.Vector3());
  const sharedCamPos = useRef(new THREE.Vector3());

  const [earthMoonLivePath, setEarthMoonLivePath] = useState<THREE.Vector3[] | null>(null);
  const lastMoonPathUpdateRef = useRef<number>(initialDate.getTime());


  useEffect(() => {
    timelineRef.current = initialDate.getTime();
    lastMoonPathUpdateRef.current = initialDate.getTime();
    setEarthMoonLivePath(null);
    const activeFrameDate = new Date(timelineRef.current);

    Object.entries(REALISTIC_PLANETS).forEach(([pKey, profile]) => {
      const pGroup = planetRefs.current[pKey];
      if (pGroup) {
        const pPos = resolvePlanetPosition(pKey, profile, activeFrameDate);
        pGroup.position.set(pPos.x * AU_SCALE, pPos.z * AU_SCALE, pPos.y * AU_SCALE);
      }

      if (profile.moons) {
        Object.entries(profile.moons).forEach(([mKey, mProfile]) => {
          const mGroup = moonGroupRefs.current[pKey + '_' + mKey];
          if (mGroup) {
            const mPos = resolveMoonPosition(pKey, mKey, mProfile, activeFrameDate);
            mGroup.position.set(mPos.x * AU_SCALE, mPos.z * AU_SCALE, mPos.y * AU_SCALE);
          }
        });
      }
    });
  }, [commitToken, initialDate]);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (focusTarget === 'solar') {
      controlsRef.current.setLookAt(0, 150, 250, 0, 0, 0, true);
    } else {
      let offset = (
        focusTarget === 'jupiter' ||
        focusTarget === 'saturn' ||
        focusTarget === 'uranus' ||
        focusTarget === 'neptune'
      ) ? 0.5 : 0.01
      controlsRef.current.setLookAt(offset, offset * 0.4, offset, 0, 0, 0, true);
    }
  }, [focusTarget]);

  const systemPaths = useMemo(() => {
    const planetOrbits: any[] = []; const moonOrbits: Record<string, any[]> = {};
    Object.entries(REALISTIC_PLANETS).forEach(([pKey, profile]) => {
      const pPath = resolvePlanetPath(pKey, profile, initialDate, 180);
      planetOrbits.push({ key: pKey, color: profile.color, vectors: pPath.map(p => new THREE.Vector3(p.x * AU_SCALE, p.z * AU_SCALE, p.y * AU_SCALE)) });
      if (profile.moons) {
        moonOrbits[pKey] = Object.entries(profile.moons).map(([mKey, mProfile]) => {
          const mPath = resolveMoonPath(pKey, mKey, mProfile, initialDate, 64);
          return { key: mKey, color: mProfile.color, vectors: mPath.map(p => new THREE.Vector3(p.x * AU_SCALE, p.z * AU_SCALE, p.y * AU_SCALE)) };
        });
      }
    });
    return { planetOrbits, moonOrbits };
  }, [commitToken, initialDate]);

  useFrame((state, delta) => {
    if (timeScale !== 0) {
      timelineRef.current += delta * 1000 * timeScale;
    }
    const activeFrameDate = new Date(timelineRef.current);

    let focusShiftVector = new THREE.Vector3(0, 0, 0);
    let currentMoonWorldPos = new THREE.Vector3();

    Object.entries(REALISTIC_PLANETS).forEach(([pKey, profile]) => {
      const pGroup = planetRefs.current[pKey];
      if (pGroup) {
        const pos = resolvePlanetPosition(pKey, profile, activeFrameDate);
        const targetX = pos.x * AU_SCALE;
        const targetY = pos.z * AU_SCALE;
        const targetZ = pos.y * AU_SCALE;

        pGroup.position.set(targetX, targetY, targetZ);

        if (pKey === focusTarget) {
          focusShiftVector.set(targetX, targetY, targetZ);
        }
      }

      const pMesh = planetMeshRefs.current[pKey];
      if (pMesh) {
        const computedEuler = AdvancedAstronomyEngine.getPlanetEulerRotation(profile, activeFrameDate);
        pMesh.rotation.copy(computedEuler);
      }

      if (profile.moons) {
        Object.entries(profile.moons).forEach(([mKey, mProfile]) => {
          const uniqueMoonKey = pKey + '_' + mKey;
          const mGroup = moonGroupRefs.current[uniqueMoonKey];
          if (mGroup) {
            const mPos = resolveMoonPosition(pKey, mKey, mProfile, activeFrameDate);
            const mX = mPos.x * AU_SCALE;
            const mY = mPos.z * AU_SCALE;
            const mZ = mPos.y * AU_SCALE;

            mGroup.position.set(mX, mY, mZ);

            if (pKey === 'earth' && mKey === 'moon') {
              currentMoonWorldPos.set(mX, mY, mZ);
            }
          }
        });
      }
    });

    const earthGroup = planetRefs.current['earth'];
    if (earthGroup) {
      sharedSunPos.current.copy(earthGroup.position).multiplyScalar(-1);

      sharedMoonPos.current.copy(currentMoonWorldPos);

      if (systemContainerRef.current) {
        sharedCamPos.current
          .copy(state.camera.position)
          .sub(systemContainerRef.current.position)
          .sub(earthGroup.position);
      }
    }

    if (Math.abs(timelineRef.current - lastMoonPathUpdateRef.current) > MOON_PATH_UPDATE_INTERVAL_MS) {
      lastMoonPathUpdateRef.current = timelineRef.current;
      const freshMoonPath = AdvancedAstronomyEngine.getEarthMoonPathPrecise(64, activeFrameDate);
      setEarthMoonLivePath(freshMoonPath.map(p => new THREE.Vector3(p.x * AU_SCALE, p.z * AU_SCALE, p.y * AU_SCALE)));
    }

    if (systemContainerRef.current) {
      if (focusTarget === 'solar') {
        systemContainerRef.current.position.set(0, 0, 0);
        if (controlsRef.current) controlsRef.current.setTarget(0, 0, 0, false);
      } else {
        systemContainerRef.current.position.set(-focusShiftVector.x, -focusShiftVector.y, -focusShiftVector.z);
        if (controlsRef.current) controlsRef.current.setTarget(0, 0, 0, false);
      }
    }
  });

  return (
    <>
      <primitive attach="background" object={milkyWayBackground} />
      <group>
        <CameraControls ref={controlsRef} minDistance={0.0015} maxDistance={6000} />

        <group ref={systemContainerRef}>
          <mesh>
            <sphereGeometry args={[0.11625, 32, 32]} />
            <meshBasicMaterial color="#fff2cc" />
            <Html position={new THREE.Vector3(0, 0, 0)} className="pointer-events-none select-none whitespace-nowrap flex flex-col items-center transform -translate-x-1/2 -translate-y-full">
              <span className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-1 block">SUN</span>
              <div className="w-px h-13.75 mb-1 bg-white/60" />
            </Html>
          </mesh>
          <mesh scale={[2, 2, 2]}>
            <sphereGeometry args={[0.11625, 32, 32]} />
            <meshBasicMaterial color="#fff2cc" side={THREE.BackSide} opacity={0.3} transparent depthWrite={false} />
          </mesh>
          <mesh scale={[8, 8, 8]}>
            <sphereGeometry args={[0.11625, 32, 32]} />
            <meshBasicMaterial color="#fff2cc" side={THREE.BackSide} opacity={0.1} transparent depthWrite={false} />
          </mesh>

          {focusTarget !== 'earth' && systemPaths.planetOrbits.map((o) => (
            <Line key={o.key} points={o.vectors} color={o.color} lineWidth={2} transparent opacity={0.6} />
          ))}

          {Object.entries(REALISTIC_PLANETS).map(([pKey, profile]) => {
            const startPos = resolvePlanetPosition(pKey, profile, initialDate);

            const planetRadius = profile.radiusAu * AU_SCALE;

            return (
              <group
                key={pKey}
                ref={(el) => { if (el) planetRefs.current[pKey] = el; }}
                position={[startPos.x * AU_SCALE, startPos.z * AU_SCALE, startPos.y * AU_SCALE]}
              >
                {pKey === 'earth' ? (
                  <group ref={(el) => { if (el) planetMeshRefs.current[pKey] = el; }}>
                    <Earth
                      radius={planetRadius}
                      time={timelineRef}
                      sunPosition={sharedSunPos.current}
                      moonPosition={sharedMoonPos.current}
                      cameraPosition={sharedCamPos.current}
                      earthDayTexture={earthDayTexture}
                      earthNightTexture={earthNightTexture}
                      earthLightsTexture={earthLightsTexture}
                      earthCloudsTexture={earthCloudsTexture}
                      earthSpecularTexture={earthSpecularTexture}
                      earthBumbTexture={earthBumpTexture}
                    />
                  </group>
                ) : (
                  <mesh ref={(el) => { if (el) planetMeshRefs.current[pKey] = el; }}>
                    <sphereGeometry args={[planetRadius, 64, 64]} />
                    <meshStandardMaterial
                      color={profile.color}
                      roughness={0.6}
                      metalness={0.0}
                    />
                  </mesh>
                )}

                {pKey === 'saturn' && (
                  <mesh
                    rotation={[Math.PI / 2.5, 0, Math.PI / 6]}
                  >
                    <ringGeometry args={[0.00045 * AU_SCALE, 0.00095 * AU_SCALE, 64]} />
                    <meshStandardMaterial
                      color="#e2bf7d"
                      roughness={0.6}
                      metalness={0.0}
                      side={THREE.DoubleSide}
                      transparent
                      opacity={0.8}
                    />
                  </mesh>
                )}

                {focusTarget !== pKey && (
                  <Html
                    position={new THREE.Vector3(0, 0, 0)}
                    className="pointer-events-none select-none whitespace-nowrap flex flex-col items-center transform -translate-x-1/2 -translate-y-full"
                  >
                    <span className="text-white text-xs font-mono font-medium uppercase tracking-wider mb-1 block">
                      {profile.name}
                    </span>
                    <div className="w-px h-10 mb-1 bg-white/50" />
                  </Html>
                )}

                {systemPaths.moonOrbits[pKey]?.map((mOrbit) => {
                  const isIrregularOrbit = ['himalia', 'elara', 'lysithea', 'ananke', 'carme', 'pasiphae', 'sinope'].includes(mOrbit.key);

                  if (isIrregularOrbit && focusTarget !== 'jupiter') {
                    return null;
                  }

                  const isEarthMoon = pKey === 'earth' && mOrbit.key === 'moon';
                  const points = (isEarthMoon && earthMoonLivePath) ? earthMoonLivePath : mOrbit.vectors;

                  return (
                    <Line key={mOrbit.key} points={points} color={mOrbit.color} lineWidth={1} opacity={0.6} transparent />
                  );
                })}

                {profile.moons && Object.entries(profile.moons).map(([mKey, mProfile]) => {
                  const moonRadius = mProfile.radiusAu * AU_SCALE;
                  const uniqueMoonKey = pKey + '_' + mKey;
                  const startMoonPos = resolveMoonPosition(pKey, mKey, mProfile, initialDate);

                  const isIrregularMoon = ['himalia', 'elara', 'lysithea', 'ananke', 'carme', 'pasiphae', 'sinope'].includes(mKey);
                  if (isIrregularMoon && focusTarget !== 'jupiter') {
                    return null;
                  }

                  const shouldShowMoonLabel = focusTarget === pKey;

                  return (
                    <group
                      key={uniqueMoonKey}
                      ref={(el) => { if (el) moonGroupRefs.current[uniqueMoonKey] = el; }}
                      position={[startMoonPos.x * AU_SCALE, startMoonPos.z * AU_SCALE, startMoonPos.y * AU_SCALE]}
                    >
                      <mesh>
                        <sphereGeometry args={[moonRadius, 16, 16]} />
                        <meshStandardMaterial color={mProfile.color} roughness={0.8} />
                      </mesh>

                      {shouldShowMoonLabel && (
                        <Html className="pointer-events-none select-none whitespace-nowrap flex flex-col items-center transform -translate-x-1/2 -translate-y-full">
                          <span className="text-white text-[9px] font-mono opacity-75 lowercase mb-1 block">
                            {mProfile.name}
                          </span>
                          <div className="w-px h-5 mb-1 bg-white/40" />
                        </Html>
                      )}
                    </group>
                  );
                })}
              </group>
            );
          })}
        </group>
      </group>
    </>
  );
}
