'use client';

import { useProgress } from '@react-three/drei';

/**
 * Covers the canvas until the first frames are on screen.
 *
 * Progress is read from drei's loading manager rather than faked, so the bar
 * reflects actual texture bytes arriving. It sits absolutely over the canvas
 * instead of in the layout flow - as a flow sibling it would push the canvas
 * out of the viewport while visible.
 */
export default function LoadingScreen({ done }: { done: boolean }) {
  const { progress, item } = useProgress();

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-void transition-opacity duration-500 ${done ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      aria-hidden={done}
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[13px] font-medium uppercase tracking-[0.34em] text-ink">Solar System Simulation</h1>
        <p className="text-[11px] text-ink-faint">Assembling the solar system</p>
      </div>

      <div className="h-px w-56 overflow-hidden bg-line">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${Math.max(4, progress)}%` }}
        />
      </div>

      <p className="tnum h-4 max-w-72 truncate text-[10px] text-ink-faint">
        {item ? item.replace(/^.*\//, '') : ''}
      </p>
    </div>
  );
}
