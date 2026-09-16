'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { SimulationClock } from '@/utils/simulation-clock';
import { DEFAULT_RATE_INDEX, ECLIPSE_RATE_INDEX, RATE_STEPS, TimeDirection, rateMultiplier } from '@/utils/time';
import { EclipseProfile } from '@/utils/eclipse-data';
import { LABEL_TARGETS } from '@/utils/label-targets';
import ControlRail, { LayerState } from './ui/control-rail';
import TimeBar from './ui/time-bar';
import LoadingScreen from './ui/loading-screen';
import { LabelLayer, LabelNodes, LabelProjector } from './scene-labels';

const SolarSystemScene = dynamic(() => import('./solar-system-scene'), { ssr: false });

export default function SolarSystemPage() {
  const clock = useMemo(() => new SimulationClock(), []);
  const registry = useRef<Record<string, THREE.Object3D>>({});
  const labelNodes = useRef<LabelNodes>({});

  const [rateIndex, setRateIndex] = useState(DEFAULT_RATE_INDEX);
  const [direction, setDirection] = useState<TimeDirection>(1);
  const [paused, setPaused] = useState(false);
  const [focusTarget, setFocusTarget] = useState('solar');
  const [sceneReady, setSceneReady] = useState(false);
  const [commitToken, setCommitToken] = useState(0);
  const [anchorTime, setAnchorTime] = useState(() => clock.getTime());
  const [selectedEclipseId, setSelectedEclipseId] = useState<number | null>(null);

  const [layers, setLayers] = useState<LayerState>({
    orbits: true,
    labels: true,
    axes: false,
    seasons: true,
  });

  const timeScale = rateMultiplier(rateIndex, direction, paused);

  const commitTime = useCallback(
    (timestamp: number) => {
      clock.setTime(timestamp);
      setAnchorTime(timestamp);
      setCommitToken((token) => token + 1);
    },
    [clock]
  );

  const handleRateChange = useCallback((index: number) => {
    setRateIndex(Math.min(RATE_STEPS.length - 1, Math.max(0, index)));
    setPaused(false);
  }, []);

  const handleJumpToNow = useCallback(() => {
    commitTime(Date.now());
    setSelectedEclipseId(null);
  }, [commitTime]);

  const handleSetTime = useCallback(
    (timestamp: number) => {
      commitTime(timestamp);
      setSelectedEclipseId(null);
    },
    [commitTime]
  );

  const handleSelectEclipse = useCallback(
    (eclipse: EclipseProfile) => {
      commitTime(eclipse.datetime.getTime());
      setSelectedEclipseId(eclipse.nasaCatalogNumber);
      setFocusTarget('earth');
      setRateIndex(ECLIPSE_RATE_INDEX);
      setDirection(1);
      setPaused(true);
    },
    [commitTime]
  );

  const handleLayerChange = useCallback((key: keyof LayerState, value: boolean) => {
    setLayers((current) => ({ ...current, [key]: value }));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          setPaused((value) => !value);
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleRateChange(rateIndex + 1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleRateChange(rateIndex - 1);
          break;
        case 'r':
          setDirection((value) => (value === 1 ? -1 : 1));
          break;
        case 'n':
          handleJumpToNow();
          break;
        case 'l':
          handleLayerChange('labels', !layers.labels);
          break;
        case 'o':
          handleLayerChange('orbits', !layers.orbits);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [rateIndex, layers.labels, layers.orbits, handleRateChange, handleJumpToNow, handleLayerChange]);

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 45, near: 0.0001, far: 20000, position: [0, 150, 250] }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <SolarSystemScene
            clock={clock}
            commitToken={commitToken}
            timeScale={timeScale}
            focusTarget={focusTarget}
            showOrbits={layers.orbits}
            showAxes={layers.axes}
            seasonalAlbedo={layers.seasons}
            registry={registry}
            onReady={() => setSceneReady(true)}
          />
          <LabelProjector
            targets={LABEL_TARGETS}
            registry={registry}
            nodes={labelNodes}
            visible={layers.labels}
            focusTarget={focusTarget}
          />
        </Suspense>
      </Canvas>

      <LabelLayer targets={LABEL_TARGETS} nodes={labelNodes} />

      <LoadingScreen done={sceneReady} />

      <div className="pointer-events-none absolute inset-0 z-20">
        <header className="pointer-events-none absolute left-4 top-4 flex flex-col gap-3">
          <ControlRail
            focusTarget={focusTarget}
            onFocusChange={setFocusTarget}
            layers={layers}
            onLayerChange={handleLayerChange}
            anchorTime={anchorTime}
            onSetTime={handleSetTime}
            onSelectEclipse={handleSelectEclipse}
            selectedEclipseId={selectedEclipseId}
          />
        </header>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <TimeBar
            clock={clock}
            rateIndex={rateIndex}
            direction={direction}
            paused={paused}
            onRateChange={handleRateChange}
            onDirectionChange={setDirection}
            onTogglePause={() => setPaused((value) => !value)}
            onJumpToNow={handleJumpToNow}
          />
        </div>

        <p className="pointer-events-none absolute bottom-5 right-4 select-none text-[10px] leading-relaxed text-ink-faint/70">
          <span className="tnum">space</span> play · <span className="tnum">← →</span> rate ·{' '}
          <span className="tnum">r</span> reverse · <span className="tnum">n</span> now
        </p>
      </div>
    </div>
  );
}
