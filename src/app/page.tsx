"use client";

import dynamic from "next/dynamic";

const SolarSystemPage = dynamic(
  () => import('@/components/solar-system-page'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="h-full w-full cursor-grab active:cursor-grabbing">
        <SolarSystemPage />
      </div>
    </main>
  );
}
