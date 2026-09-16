/*
  Inline icons.

  A handful of 16px glyphs does not justify an icon package in the bundle, and
  drawing them here keeps the stroke weight consistent with the hairline borders
  used everywhere else.
*/

const base = {
  width: 14,
  height: 14,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const PlayIcon = () => (
  <svg {...base} aria-hidden>
    <path d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none" />
  </svg>
);

export const PauseIcon = () => (
  <svg {...base} aria-hidden>
    <rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" />
    <rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none" />
  </svg>
);

export const SlowerIcon = () => (
  <svg {...base} aria-hidden>
    <path d="M11 5L4 12l7 7M20 5l-7 7 7 7" />
  </svg>
);

export const FasterIcon = () => (
  <svg {...base} aria-hidden>
    <path d="M13 5l7 7-7 7M4 5l7 7-7 7" />
  </svg>
);

export const ReverseIcon = () => (
  <svg {...base} aria-hidden>
    <path d="M9 14L4 9l5-5" />
    <path d="M20 20v-7a4 4 0 00-4-4H4" />
  </svg>
);

export const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    {...base}
    aria-hidden
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);
