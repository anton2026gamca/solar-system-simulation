"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  EARTH_RADIUS,
  MOON_RADIUS,
  MOON_SEMI_MAJOR_AXIS,
  SUN_RADIUS,
  AU,
} from "@/constants/astronomy";

import earthVertexShader from './earth.vert';
import earthFragmentShader from './earth.frag';

import atmosphereVertexShader from './atmosphere.vert';
import atmosphereFragmentShader from './atmosphere.frag';

import cloudVertexShader from './clouds.vert';
import cloudFragmentShader from './clouds.frag';


/**
 * ============================================================================
 * Scene
 * ============================================================================
 */

export default function EarthScene() {
  const earthRef = useRef<THREE.Mesh>(null);
  const earthCloudsRef = useRef<THREE.Mesh>(null);

  const moonRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);

  const sunPosition = useMemo(
    () => new THREE.Vector3(AU, 0, 0),
    []
  );

  /**
   * --------------------------------------------------------------------------
   * Textures
   * --------------------------------------------------------------------------
   */

  const [
    earthDayMap,
    earthNightMap,
    earthLightsMap,
    earthCloudsMap,
    moonMap,
    milkyWayMap,
  ] = useLoader(
    THREE.TextureLoader,
    [
      "/textures/earth/earth_day.jpg",
      "/textures/earth/earth_night.jpg",
      "/textures/earth/earth_lights.jpg",
      "/textures/earth/earth_clouds.jpg",
      "/textures/moon/moon.jpg",
      "/textures/milkyway/milkyway.jpg",
    ]
  );

  milkyWayMap.mapping = THREE.EquirectangularReflectionMapping;

  /**
   * --------------------------------------------------------------------------
   * Earth shader uniforms
   * --------------------------------------------------------------------------
   */

  const earthUniforms = useMemo(
    () => ({
      uDayTexture: {
        value: earthDayMap,
      },

      uNightTexture: {
        value: earthNightMap,
      },

      uLightsTexture: {
        value: earthLightsMap,
      },

      uSunPosition: {
        value: sunPosition,
      },

      uNightIntensity: {
        value: 0.9,
      },
    }),
    [
      earthDayMap,
      earthNightMap,
      sunPosition,
    ]
  );

  /**
   * --------------------------------------------------------------------------
   * Atmosphere uniforms
   * --------------------------------------------------------------------------
   */

  const atmosphereUniforms = useMemo(
    () => ({
      uSunPosition: {
        value: sunPosition,
      },

      uIntensity: {
        value: 0.8,
      },
    }),
    [sunPosition]
  );

  /**
   * --------------------------------------------------------------------------
   * Cloud uniforms
   * --------------------------------------------------------------------------
   */

  const cloudUniforms = useMemo(
    () => ({
      uCloudTexture: {
        value: earthCloudsMap,
      },

      uSunPosition: {
        value: sunPosition,
      },
    }),
    [earthCloudsMap, sunPosition]
  );

  /**
   * --------------------------------------------------------------------------
   * Animation
   * --------------------------------------------------------------------------
   */

  useFrame(({ clock }) => {
    const elapsedTime =
      clock.getElapsedTime();

    /**
     * Earth rotation.
     *
     * This is currently visual rotation only.
     */
    if (earthRef.current) {
      earthRef.current.rotation.y =
        elapsedTime * 0.03;
    }

    if (earthCloudsRef.current) {
      earthCloudsRef.current.rotation.y =
        elapsedTime * 0.035;
    }

    /**
     * Temporary visual lunar orbit.
     */
    if (moonOrbitRef.current) {
      moonOrbitRef.current.rotation.y =
        elapsedTime * 0.01;
    }

    /**
     * Moon rotation.
     */
    if (moonRef.current) {
      moonRef.current.rotation.y =
        elapsedTime * 0.005;
    }
  });

  return (
    <>
      {/* ================================================================== */}
      {/* Space background                                                   */}
      {/* ================================================================== */}

      <mesh>
        <sphereGeometry
          args={[100, 64, 64]}
        />

        <meshBasicMaterial
          map={milkyWayMap}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ================================================================== */}
      {/* Lighting                                                           */}
      {/* ================================================================== */}

      <ambientLight intensity={0.025} />

      <directionalLight
        position={sunPosition}
        intensity={2.5}
        color="#ffffff"
      />

      {/* ================================================================== */}
      {/* Controls                                                            */}
      {/* ================================================================== */}

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={1.0}
        maxDistance={50}
        target={[0, 0, 0]}
      />

      {/* ================================================================== */}
      {/* EARTH                                                               */}
      {/* ================================================================== */}

      <group>
        {/* -------------------------------------------------------------- */}
        {/* Earth surface                                                  */}
        {/* -------------------------------------------------------------- */}

        <mesh ref={earthRef}>
          <sphereGeometry
            args={[
              EARTH_RADIUS,
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

        {/* -------------------------------------------------------------- */}
        {/* Clouds                                                         */}
        {/* -------------------------------------------------------------- */}

        <mesh
          ref={earthCloudsRef}
          scale={1.008}
        >
          <sphereGeometry
            args={[
              EARTH_RADIUS,
              128,
              128,
            ]}
          />

          <shaderMaterial
            vertexShader={cloudVertexShader}
            fragmentShader={cloudFragmentShader}
            uniforms={cloudUniforms}
            transparent
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* -------------------------------------------------------------- */}
        {/* Inner atmosphere                                               */}
        {/* -------------------------------------------------------------- */}

        <mesh scale={1.025}>
          <sphereGeometry
            args={[
              EARTH_RADIUS,
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

        {/* -------------------------------------------------------------- */}
        {/* Outer atmosphere                                               */}
        {/* -------------------------------------------------------------- */}

        <mesh scale={1.055}>
          <sphereGeometry
            args={[
              EARTH_RADIUS,
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

      {/* ================================================================== */}
      {/* MOON                                                               */}
      {/* ================================================================== */}

      <group ref={moonOrbitRef}>
        <mesh
          ref={moonRef}
          position={[
            MOON_SEMI_MAJOR_AXIS,
            0,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              MOON_RADIUS,
              64,
              64,
            ]}
          />

          <meshStandardMaterial
            map={moonMap}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* SUN                                                                */}
      {/* ================================================================== */}

      {/*
       * IMPORTANT:
       *
       * This is the physically sized Sun:
       *
       *   radius ~ 54.66 Earth diameters
       *   distance ~ 11,742 Earth diameters
       *
       * At this scale it is intentionally enormous and extremely far away.
       */}

      <mesh position={sunPosition}>
        <sphereGeometry
          args={[
            SUN_RADIUS,
            64,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#fff8dc"
        />
      </mesh>
    </>
  );
}
