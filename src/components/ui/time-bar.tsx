'use client';

import { useSyncExternalStore } from 'react';
import { SimulationClock } from '@/utils/simulation-clock';
import {
  RATE_STEPS,
  TimeDirection,
  formatUtcDate,
  formatUtcTime,
  rateLabel,
} from '@/utils/time';
import { Panel, IconButton, TextButton } from './primitives';
import { FasterIcon, PauseIcon, PlayIcon, ReverseIcon, SlowerIcon } from './icons';

interface TimeBarProps {
  clock: SimulationClock;
  rateIndex: number;
  direction: TimeDirection;
  paused: boolean;
  onRateChange: (index: number) => void;
  onDirectionChange: (direction: TimeDirection) => void;
  onTogglePause: () => void;
  onJumpToNow: () => void;
}

export default function TimeBar({
  clock,
  rateIndex,
  direction,
  paused,
  onRateChange,
  onDirectionChange,
  onTogglePause,
  onJumpToNow,
}: TimeBarProps) {
  /*
    The clock ticks every frame but only notifies subscribers about twelve times
    a second, so this readout repaints at a readable rate while the render loop
    runs free. Nothing else in the tree re-renders with it.
  */
  const time = useSyncExternalStore(
    clock.subscribe,
    clock.getSnapshot,
    clock.getServerSnapshot
  );

  const date = new Date(time);

  return (
    <Panel className="pointer-events-auto flex items-stretch divide-x divide-line">
      <div className="flex items-center gap-1 px-2.5">
        <IconButton label="Slower" onClick={() => onRateChange(rateIndex - 1)} disabled={rateIndex <= 0}>
          <SlowerIcon />
        </IconButton>
        <IconButton label={paused ? 'Play' : 'Pause'} onClick={onTogglePause} active={!paused}>
          {paused ? <PlayIcon /> : <PauseIcon />}
        </IconButton>
        <IconButton
          label="Faster"
          onClick={() => onRateChange(rateIndex + 1)}
          disabled={rateIndex >= RATE_STEPS.length - 1}
        >
          <FasterIcon />
        </IconButton>
        <IconButton
          label={direction === 1 ? 'Run time backwards' : 'Run time forwards'}
          onClick={() => onDirectionChange(direction === 1 ? -1 : 1)}
          active={direction === -1}
        >
          <ReverseIcon />
        </IconButton>
      </div>

      <div className="flex min-w-0 flex-col justify-center px-4 py-2">
        <div className="flex items-baseline gap-3">
          <span className="tnum text-[13px] tracking-wide text-ink-muted">
            {formatUtcDate(date)}
          </span>
          <span className="tnum text-[15px] font-medium tracking-wide text-ink">
            {formatUtcTime(date)}
          </span>
          <span className="text-[10px] font-medium tracking-wider text-ink-faint">UTC</span>
        </div>
      </div>

      <div className="flex w-52 flex-col justify-center gap-1 px-3 py-2">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Rate</span>
          <span className={`tnum text-[11px] ${paused ? 'text-ink-faint' : 'text-accent'}`}>
            {rateLabel(rateIndex, direction, paused)}
          </span>
        </div>
        <input
          type="range"
          className="range"
          min={0}
          max={RATE_STEPS.length - 1}
          step={1}
          value={rateIndex}
          aria-label="Time rate"
          onChange={(event) => onRateChange(Number(event.target.value))}
        />
      </div>

      <div className="flex items-center px-2.5">
        <TextButton onClick={onJumpToNow}>Now</TextButton>
      </div>
    </Panel>
  );
}
