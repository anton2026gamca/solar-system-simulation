"use client";

import dynamic from "next/dynamic";
// import * as THREE from "three";

// const CanvasContainer = dynamic(
//   () => import("@react-three/fiber").then((mod) => mod.Canvas),
//   { ssr: false }
// );

// const EarthScene = dynamic(
//   () => import("../components/earth-scene"),
//   { ssr: false }
// );

const SolarSystemPage = dynamic(
  () => import('@/components/solar-system-page'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="h-full w-full cursor-grab active:cursor-grabbing">
        {/* <CanvasContainer */}
        {/*   camera={{ */}
        {/*     position: [0, 0, 6], */}
        {/*     fov: 45, */}
        {/*     near: 0.01, */}
        {/*     far: 20_000, */}
        {/*   }} */}
        {/*   gl={{ */}
        {/*     antialias: true, */}
        {/*     powerPreference: "high-performance", */}
        {/*     toneMapping: THREE.NoToneMapping, */}
        {/*     outputColorSpace: THREE.SRGBColorSpace, */}
        {/*   }} */}
        {/* > */}
        {/*   <EarthScene /> */}
        {/* </CanvasContainer> */}
        <SolarSystemPage />
      </div>
    </main>
  );
}
