'use client';

import { FormEvent, useState } from 'react';
import { EclipseProfile } from '@/utils/eclipse-data';
import { toDateInputValue, toTimeInputValue, parseDateTimeInput } from '@/utils/time';
import { Panel, Section, Toggle, TextButton } from './primitives';
import { ChevronIcon } from './icons';
import EclipseBrowser from './eclipse-browser';

const BODIES: { value: string; label: string }[] = [
  { value: 'solar', label: 'Whole system' },
  { value: 'mercury', label: 'Mercury' },
  { value: 'venus', label: 'Venus' },
  { value: 'earth', label: 'Earth' },
  { value: 'mars', label: 'Mars' },
  { value: 'jupiter', label: 'Jupiter' },
  { value: 'saturn', label: 'Saturn' },
  { value: 'uranus', label: 'Uranus' },
  { value: 'neptune', label: 'Neptune' },
];

export interface LayerState {
  orbits: boolean;
  labels: boolean;
  axes: boolean;
  seasons: boolean;
}

interface ControlRailProps {
  focusTarget: string;
  onFocusChange: (value: string) => void;
  layers: LayerState;
  onLayerChange: (key: keyof LayerState, value: boolean) => void;
  /** Simulated time at the last commit, used to seed the date and time inputs. */
  anchorTime: number;
  onSetTime: (timestamp: number) => void;
  onSelectEclipse: (eclipse: EclipseProfile) => void;
  selectedEclipseId: number | null;
}

function JumpToForm({
  anchorTime,
  onSetTime,
}: {
  anchorTime: number;
  onSetTime: (timestamp: number) => void;
}) {
  /*
    Seeded straight from props. The parent remounts this with a key whenever the
    simulation time is committed elsewhere - the Now button, or picking an
    eclipse - which resets the fields without an effect chasing the prop.
  */
  const [dateValue, setDateValue] = useState(() => toDateInputValue(new Date(anchorTime)));
  const [timeValue, setTimeValue] = useState(() => toTimeInputValue(new Date(anchorTime)));
  const [invalid, setInvalid] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const timestamp = parseDateTimeInput(dateValue, timeValue);
    if (timestamp === null) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onSetTime(timestamp);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="eyebrow">Date</span>
          <input
            type="date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
            className="tnum w-full rounded border border-line bg-sunken px-1.5 py-1 text-[11px] text-ink focus:border-line-strong focus:outline-none"
          />
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="eyebrow">Time · UTC</span>
          <input
            type="text"
            inputMode="numeric"
            value={timeValue}
            placeholder="HH:MM:SS"
            onChange={(event) => setTimeValue(event.target.value)}
            className="tnum w-full rounded border border-line bg-sunken px-1.5 py-1 text-[11px] text-ink focus:border-line-strong focus:outline-none"
          />
        </label>
      </div>

      {invalid && (
        <p role="alert" className="text-[10px] text-solar">
          Enter a valid date and a time as HH:MM or HH:MM:SS.
        </p>
      )}

      <TextButton type="submit">Set time</TextButton>
    </form>
  );
}

export default function ControlRail({
  focusTarget,
  onFocusChange,
  layers,
  onLayerChange,
  anchorTime,
  onSetTime,
  onSelectEclipse,
  selectedEclipseId,
}: ControlRailProps) {
  const [eclipsesOpen, setEclipsesOpen] = useState(false);

  return (
    <Panel className="pointer-events-auto w-[268px]">
      <Section label="Camera focus">
        <select
          value={focusTarget}
          onChange={(event) => onFocusChange(event.target.value)}
          aria-label="Camera focus"
          className="w-full cursor-pointer rounded border border-line bg-sunken px-2 py-1.5 text-[12px] text-ink focus:border-line-strong focus:outline-none"
        >
          {BODIES.map((body) => (
            <option key={body.value} value={body.value}>
              {body.label}
            </option>
          ))}
        </select>
      </Section>

      <Section label="Layers">
        <Toggle
          label="Orbit paths"
          checked={layers.orbits}
          onChange={(value) => onLayerChange('orbits', value)}
        />
        <Toggle
          label="Body labels"
          checked={layers.labels}
          onChange={(value) => onLayerChange('labels', value)}
        />
        <Toggle
          label="Rotation axes"
          checked={layers.axes}
          onChange={(value) => onLayerChange('axes', value)}
        />
        <Toggle
          label="Seasonal surface"
          hint="Blue Marble monthly composites"
          checked={layers.seasons}
          onChange={(value) => onLayerChange('seasons', value)}
        />
      </Section>

      <Section label="Jump to">
        <JumpToForm key={anchorTime} anchorTime={anchorTime} onSetTime={onSetTime} />
      </Section>

      <Section
        label="Eclipses"
        action={
          <button
            type="button"
            onClick={() => setEclipsesOpen((open) => !open)}
            aria-expanded={eclipsesOpen}
            className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink-faint transition-colors hover:text-ink"
          >
            {eclipsesOpen ? 'Hide' : 'Browse'}
            <ChevronIcon open={eclipsesOpen} />
          </button>
        }
      >
        {eclipsesOpen ? (
          <EclipseBrowser onSelect={onSelectEclipse} selectedId={selectedEclipseId} />
        ) : (
          <p className="text-[11px] leading-relaxed text-ink-faint">
            Every solar and lunar eclipse from 2001 to 2100. Picking one moves the
            simulation to the moment of greatest eclipse.
          </p>
        )}
      </Section>
    </Panel>
  );
}
