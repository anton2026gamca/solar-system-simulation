'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { CameraControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AdvancedAstronomyEngine, REALISTIC_PLANETS } from '@/utils/astronomy-engine';
import { Mea_Culpa } from 'next/font/google';

const AU_SCALE = 25;

interface SolarSceneProps {
  initialDate: Date;
  commitToken: number;
  timeScale: number;
  focusTarget: string;
}

export default function SolarSystemScene({ initialDate, commitToken, timeScale, focusTarget }: SolarSceneProps) {
  const systemContainerRef = useRef<THREE.Group>(null);
  const planetRefs = useRef<Record<string, THREE.Group>>({});
  const moonGroupRefs = useRef<Record<string, THREE.Group>>({});
  const controlsRef = useRef<any>(null);

  const timelineRef = useRef<number>(initialDate.getTime());

  const milkyWayBackground = useLoader(THREE.TextureLoader, "/textures/milkyway/milkyway.jpg")
  milkyWayBackground.mapping = THREE.EquirectangularReflectionMapping;
  milkyWayBackground.colorSpace = THREE.SRGBColorSpace


  useEffect(() => {
    timelineRef.current = initialDate.getTime();
    const activeFrameDate = new Date(timelineRef.current);

    Object.entries(REALISTIC_PLANETS).forEach(([pKey, profile]) => {
      const pGroup = planetRefs.current[pKey];
      if (pGroup) {
        const pPos = AdvancedAstronomyEngine.getPlanetPosition(profile, activeFrameDate);
        pGroup.position.set(pPos.x * AU_SCALE, pPos.z * AU_SCALE, pPos.y * AU_SCALE);
      }

      if (profile.moons) {
        Object.entries(profile.moons).forEach(([mKey, mProfile]) => {
          const mGroup = moonGroupRefs.current[pKey + '_' + mKey];
          if (mGroup) {
            const mPos = AdvancedAstronomyEngine.getMoonLocalPosition(mProfile, activeFrameDate);
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
      ) ? 0.5 : 0.1
      controlsRef.current.setLookAt(offset, offset * 0.4, offset, 0, 0, 0, true);
    }
  }, [focusTarget]);

  const systemPaths = useMemo(() => {
    const planetOrbits: any[] = []; const moonOrbits: Record<string, any[]> = {};
    Object.entries(REALISTIC_PLANETS).forEach(([pKey, profile]) => {
      const pPath = AdvancedAstronomyEngine.getOrbitPath(profile, initialDate, 180);
      planetOrbits.push({ key: pKey, color: profile.color, vectors: pPath.map(p => new THREE.Vector3(p.x * AU_SCALE, p.z * AU_SCALE, p.y * AU_SCALE)) });
      if (profile.moons) {
        moonOrbits[pKey] = Object.entries(profile.moons).map(([mKey, mProfile]) => {
          const mPath = AdvancedAstronomyEngine.getMoonLocalPath(mProfile, 64);
          return { key: mKey, color: mProfile.color, vectors: mPath.map(p => new THREE.Vector3(p.x * AU_SCALE, p.z * AU_SCALE, p.y * AU_SCALE)) };
        });
      }
    });
    return { planetOrbits, moonOrbits };
  }, [commitToken, initialDate]);

  useFrame((_, delta) => {
    if (timeScale !== 0) {
      timelineRef.current += delta * 1000 * timeScale;
    }
    const activeFrameDate = new Date(timelineRef.current);

    let focusShiftVector = new THREE.Vector3(0, 0, 0);

    Object.entries(REALISTIC_PLANETS).forEach(([pKey, profile]) => {
      const pGroup = planetRefs.current[pKey];
      if (pGroup) {
        const pos = AdvancedAstronomyEngine.getPlanetPosition(profile, activeFrameDate);
        const targetX = pos.x * AU_SCALE;
        const targetY = pos.z * AU_SCALE;
        const targetZ = pos.y * AU_SCALE;

        pGroup.position.set(targetX, targetY, targetZ);

        if (pKey === focusTarget) {
          focusShiftVector.set(targetX, targetY, targetZ);
        }
      }

      if (profile.moons) {
        Object.entries(profile.moons).forEach(([mKey, mProfile]) => {
          const uniqueMoonKey = pKey + '_' + mKey;
          const mGroup = moonGroupRefs.current[uniqueMoonKey];
          if (mGroup) {
            const mPos = AdvancedAstronomyEngine.getMoonLocalPosition(mProfile, activeFrameDate);
            mGroup.position.set(mPos.x * AU_SCALE, mPos.z * AU_SCALE, mPos.y * AU_SCALE);
          }
        });
      }
    });

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
        <CameraControls ref={controlsRef} minDistance={0.00001} maxDistance={6000} />

        <group ref={systemContainerRef}>
          <mesh>
            <sphereGeometry args={[0.11625, 32, 32]} />
            <meshBasicMaterial color="#fff2cc" />
            <Html position={new THREE.Vector3(0, 0, 0)} className="pointer-events-none select-none whitespace-nowrap flex flex-col items-center transform -translate-x-1/2 -translate-y-full">
              <span className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-1 block">SUN</span>
              <div className="w-px h-13.75 bg-white/60" />
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

          {systemPaths.planetOrbits.map((o) => (
            <Line key={o.key} points={o.vectors} color={o.color} lineWidth={2} transparent opacity={0.6} />
          ))}

          {Object.entries(REALISTIC_PLANETS).map(([pKey, profile]) => {
            const startPos = AdvancedAstronomyEngine.getPlanetPosition(profile, initialDate);

            const planetRadius = profile.radiusAu * AU_SCALE;

            return (
              <group
                key={pKey}
                ref={(el) => { if (el) planetRefs.current[pKey] = el; }}
                position={[startPos.x * AU_SCALE, startPos.z * AU_SCALE, startPos.y * AU_SCALE]}
              >
                <mesh>
                  <sphereGeometry args={[planetRadius, 64, 64]} />
                  <meshStandardMaterial
                    color={profile.color}
                    roughness={0.6}
                    metalness={0.0}
                  />
                </mesh>

                {pKey === 'earth' && (
                  <group>
                    <mesh scale={[1.015, 1.015, 1.015]}>
                      <sphereGeometry args={[planetRadius, 32, 32]} />
                      <meshStandardMaterial color="#4ca6ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
                    </mesh>

                    <mesh scale={[1.006, 1.006, 1.006]}>
                      <sphereGeometry args={[planetRadius, 32, 32]} />
                      <meshStandardMaterial color="#ffffff" transparent opacity={0.25} roughness={0.9} />
                    </mesh>
                  </group>
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
                    <div className="w-px h-10 bg-white/50" />
                  </Html>
                )}

                {systemPaths.moonOrbits[pKey]?.map((mOrbit) => {
                  const isIrregularOrbit = ['himalia', 'elara', 'lysithea', 'ananke', 'carme', 'pasiphae', 'sinope'].includes(mOrbit.key);

                  if (isIrregularOrbit && focusTarget !== 'jupiter') {
                    return null;
                  }

                  return (
                    <Line key={mOrbit.key} points={mOrbit.vectors} color={mOrbit.color} lineWidth={1} opacity={0.6} transparent />
                  );
                })}

                {profile.moons && Object.entries(profile.moons).map(([mKey, mProfile]) => {
                  const moonRadius = mProfile.radiusAu * AU_SCALE;
                  const uniqueMoonKey = pKey + '_' + mKey;
                  const startMoonPos = AdvancedAstronomyEngine.getMoonLocalPosition(mProfile, initialDate);

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
                          <div className="w-px h-5 bg-white/40" />
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

