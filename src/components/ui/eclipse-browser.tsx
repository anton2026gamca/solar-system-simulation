'use client';

import { useMemo, useRef, useState } from 'react';
import { EclipseProfile, EclipseType, parseData } from '@/utils/eclipse-data';
import { formatDuration, formatUtcDateShort } from '@/utils/time';

let cachedCatalogue: EclipseProfile[] | null = null;
function catalogue(): EclipseProfile[] {
  cachedCatalogue ??= parseData();
  return cachedCatalogue;
}

type Family = 'solar' | 'lunar';
type Filter = 'all' | Family;

interface TypeMeta {
  label: string;
  family: Family;
  code: string;
  emphatic: boolean;
}

const TYPE_META: Record<EclipseType, TypeMeta> = {
  [EclipseType.SolarPartial]: { label: 'Partial solar', family: 'solar', code: 'P', emphatic: false },
  [EclipseType.SolarAnnular]: { label: 'Annular solar', family: 'solar', code: 'A', emphatic: false },
  [EclipseType.SolarTotal]: { label: 'Total solar', family: 'solar', code: 'T', emphatic: true },
  [EclipseType.SolarHybrid]: { label: 'Hybrid solar', family: 'solar', code: 'H', emphatic: true },
  [EclipseType.LunarPenumbral]: { label: 'Penumbral lunar', family: 'lunar', code: 'Pe', emphatic: false },
  [EclipseType.LunarPartial]: { label: 'Partial lunar', family: 'lunar', code: 'P', emphatic: false },
  [EclipseType.LunarTotal]: { label: 'Total lunar', family: 'lunar', code: 'T', emphatic: true },
};

const FALLBACK: TypeMeta = { label: 'Eclipse', family: 'solar', code: '?', emphatic: false };
const metaFor = (type: EclipseType): TypeMeta => TYPE_META[type] ?? FALLBACK;

const ROW_HEIGHT = 30;
const VIEWPORT_HEIGHT = ROW_HEIGHT * 8;
const OVERSCAN = 3;

const ROW_TIME = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

interface EclipseBrowserProps {
  onSelect: (eclipse: EclipseProfile) => void;
  selectedId: number | null;
}

export default function EclipseBrowser({ onSelect, selectedId }: EclipseBrowserProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [scrollTop, setScrollTop] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const events = catalogue();

  const filtered = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean && filter === 'all') return events;

    const normalise = (value: string) => value.replace(/\b0+(\d)/g, '$1').toLowerCase();
    const needle = normalise(clean);

    return events.filter((eclipse) => {
      const meta = metaFor(eclipse.type);
      if (filter !== 'all' && meta.family !== filter) return false;
      if (!needle) return true;

      const haystack = normalise(
        `${formatUtcDateShort(eclipse.datetime)} ${ROW_TIME.format(eclipse.datetime)} ${meta.label}`
      );
      return haystack.includes(needle);
    });
  }, [events, query, filter]);

  const resetScroll = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setScrollTop(0);
  };

  const total = filtered.length;
  const first = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const last = Math.min(total - 1, Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + OVERSCAN);

  const visible = useMemo(() => {
    const rows: { eclipse: EclipseProfile; index: number }[] = [];
    for (let i = first; i <= last; i += 1) {
      const eclipse = filtered[i];
      if (eclipse) rows.push({ eclipse, index: i });
    }
    return rows;
  }, [filtered, first, last]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            resetScroll();
          }}
          placeholder="Search date, time or type"
          aria-label="Search eclipses"
          className="min-w-0 flex-1 rounded border border-line bg-sunken px-2 py-1.5 text-[11px] text-ink placeholder:text-ink-faint focus:border-line-strong focus:outline-none"
        />
      </div>

      <div className="flex gap-1" role="group" aria-label="Filter by family">
        {(['all', 'solar', 'lunar'] as Filter[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setFilter(option);
              resetScroll();
            }}
            aria-pressed={filter === option}
            className={`flex-1 rounded border px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${filter === option
              ? 'border-accent-dim bg-accent-dim/25 text-accent'
              : 'border-line bg-sunken text-ink-faint hover:text-ink-muted'
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        className="scroll-thin relative overflow-y-auto rounded border border-line bg-sunken/60"
        style={{ height: total > 0 ? Math.min(total * ROW_HEIGHT, VIEWPORT_HEIGHT) : 56 }}
      >
        {total === 0 ? (
          <p className="px-3 py-4 text-center text-[11px] text-ink-faint">
            Nothing matches that search.
          </p>
        ) : (
          <div style={{ height: total * ROW_HEIGHT, position: 'relative' }}>
            {visible.map(({ eclipse, index }) => {
              const meta = metaFor(eclipse.type);
              const selected = eclipse.nasaCatalogNumber === selectedId;
              const tone = meta.family === 'solar' ? 'text-solar' : 'text-lunar';

              return (
                <button
                  key={eclipse.nasaCatalogNumber}
                  type="button"
                  onClick={() => onSelect(eclipse)}
                  title={`${meta.label} — ${eclipse.durationSeconds
                    ? `${formatDuration(eclipse.durationSeconds)} at greatest eclipse`
                    : 'no duration catalogued'
                    }`}
                  style={{ position: 'absolute', top: index * ROW_HEIGHT, height: ROW_HEIGHT }}
                  className={`group inset-x-0 flex w-full items-center gap-2 px-2 text-left transition-colors ${selected ? 'bg-accent-dim/20' : 'hover:bg-raised/70'
                    }`}
                >
                  <span
                    className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-sm border text-[9px] font-semibold ${tone} ${meta.emphatic
                      ? 'border-current bg-current/15'
                      : 'border-current/35 bg-transparent'
                      }`}
                  >
                    {meta.code}
                  </span>

                  <span
                    className={`tnum shrink-0 text-[11px] ${selected ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                      }`}
                  >
                    {formatUtcDateShort(eclipse.datetime)}
                  </span>

                  <span className="tnum shrink-0 text-[10px] text-ink-faint">
                    {ROW_TIME.format(eclipse.datetime)}
                  </span>

                  <span className="tnum ml-auto shrink-0 text-[10px] text-ink-faint">
                    {formatDuration(eclipse.durationSeconds)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="tnum text-[10px] text-ink-faint">
        {total.toLocaleString()} of {events.length.toLocaleString()} events · NASA GSFC catalogue
      </p>
    </div>
  );
}
