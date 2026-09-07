import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SolarSystemScene from './solar-system-scene';

const SPEED_STEPS = [-100000000, -10000000, -200000, -50000, -20000, -5000, -1000, -100, -10, -5, -1, 0, 1, 5, 10, 100, 1000, 5000, 20000, 50000, 200000, 10000000, 100000000];

function LoadingPage() {
  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center">
      <pre>Loading 3D Scene... Please wait</pre>
    </div>
  )
}

export default function SolarSystemPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);

  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');

  const [engineAnchorDate, setEngineAnchorDate] = useState<Date>(new Date());
  const [speedIndex, setSpeedIndex] = useState<number>(SPEED_STEPS.indexOf(1));
  const [commitToken, setCommitToken] = useState<number>(0);
  const [focusTarget, setFocusTarget] = useState<string>('solar');

  const [currentDate, setCurrentDate] = useState(new Date());

  const [earthFocusShowLines, setEarthFocusShowLines] = useState(false);

  useEffect(() => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toISOString().slice(11, 19));
    setEngineAnchorDate(now);
    setCurrentDate(now);
    setCommitToken(1);
    setIsMounted(true);
  }, []);

  const handleManualSetTime = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizeTime = (timeStr: string): string | null => {
      const parts = timeStr.trim().split(':');
      if (parts.length < 2 || parts.length > 3) return null;

      const hh = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      const ss = (parts[2] || '0').padStart(2, '0');

      return `${hh}:${mm}:${ss}`;
    };

    const cleanTime = normalizeTime(inputTime);

    if (cleanTime) {
      const c = new Date(`${inputDate}T${cleanTime}`);

      if (!isNaN(c.getTime())) {
        setEngineAnchorDate(c);
        setCurrentDate(c);
        setCommitToken((prev) => prev + 1);
        return;
      }
    }

    console.error("Invalid time format provided");
  };

  if (!isMounted) return <div className="w-full h-screen bg-slate-950" />;

  const activeSpeedMultiplier = SPEED_STEPS[speedIndex];

  return (
    <div className="w-full h-screen relative bg-slate-950 text-slate-100 flex overflow-hidden pointer-events-none">
      <div className="absolute inset-0 z-10 flex justify-center items-end">
        <div className="pointer-events-auto cursor-default bg-slate-950/50 border border-slate-600 m-4 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex gap-4">
          {(() => {
            const dateStr = currentDate.toLocaleDateString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric'
            });

            const timeStr = currentDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });

            const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(new Date());
            const tzPart = parts.find(part => part.type === 'timeZoneName');
            const timezoneStr = tzPart?.value ?? 'GMT';

            return (
              <div className="flex items-center gap-4 font-sans tracking-widest text-slate-200 selection:bg-cyan-500/30">
                <span className="text-sm font-light uppercase opacity-80">{dateStr}</span>
                <span className="h-1 w-1 bg-cyan-500 rounded-full" />
                <span className="text-sm font-medium text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                  {timeStr} {timezoneStr}
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex justify-start items-start">
        <div className="pointer-events-auto cursor-default bg-slate-950/50 border border-slate-600 m-4 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-4 w-80">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold text-slate-400">Time Scale</label>
              <span className="font-mono text-xs text-emerald-400 font-semibold">{activeSpeedMultiplier.toLocaleString()}x</span>
            </div>
            <input type="range" min="0" max={SPEED_STEPS.length - 1} step="1" value={speedIndex} onChange={(e) => setSpeedIndex(Number(e.target.value))} className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Camera Intercept Target</span>
            <select value={focusTarget} onChange={(e) => setFocusTarget(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none cursor-pointer">
              <option value="solar">Solar System</option>
              <option value="mercury">Mercury</option>
              <option value="venus">Venus</option>
              <option value="earth">Earth</option>
              <option value="mars">Mars</option>
              <option value="jupiter">Jupiter</option>
              <option value="saturn">Saturn</option>
              <option value="uranus">Uranus</option>
              <option value="neptune">Neptune</option>
            </select>
          </div>

          <form onSubmit={handleManualSetTime} className="flex flex-col gap-3 p-2 border border-slate-800 rounded-lg">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Date</span>
                <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-xs px-2 py-1 rounded focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">Time</span>
                <input type="text" value={inputTime} onChange={(e) => setInputTime(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-xs px-2 py-1 rounded focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs p-1 rounded shadow cursor-pointer transition-colors">Set Date & Time</button>
          </form>

          {focusTarget === 'earth' && (
            <div className="flex flex-col gap-2 p-2.5 border border-cyan-500/30 bg-cyan-950/20 rounded-xl transition-all duration-300 animate-fadeIn">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-1">
                <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400">Earth-only settings</span>
              </div>

              <label className="flex items-center justify-between group cursor-pointer">
                <span className="text-xs text-slate-300 group-hover:text-slate-100 transition-colors">
                  Show orbit paths & other lines
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={earthFocusShowLines}
                    onChange={(e) => setEarthFocusShowLines(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:inset-s-1 after:bg-slate-400 peer-checked:after:bg-cyan-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-950 border border-slate-700 peer-checked:border-cyan-500/50"></div>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-full">
        {!isSceneReady && (
          <LoadingPage />
        )}

        <Canvas
          onCreated={({ scene }) => {
            const l = new THREE.PointLight(0xffffff, 4, 0);
            scene.add(l);
          }}
          camera={{ fov: 45, far: 15000, near: 0.00001 }}
        >
          <ambientLight intensity={0.4} />
          <Suspense fallback={null}>
            <SolarSystemScene
              initialDate={engineAnchorDate}
              commitToken={commitToken}
              timeScale={SPEED_STEPS[speedIndex]}
              focusTarget={focusTarget}
              earthFocusShowLines={earthFocusShowLines}
              updateDate={(date) => setCurrentDate(date)}
              onReady={() => setIsSceneReady(true)}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
