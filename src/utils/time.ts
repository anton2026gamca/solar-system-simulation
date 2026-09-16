export interface TimeRate {
  multiplier: number;
  label: string;
}

const SECOND = 1;
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365.25 * DAY;

export const RATE_STEPS: TimeRate[] = [
  { multiplier: SECOND, label: 'real time' },
  { multiplier: 10 * SECOND, label: '10 s / s' },
  { multiplier: MINUTE, label: '1 min / s' },
  { multiplier: 10 * MINUTE, label: '10 min / s' },
  { multiplier: HOUR, label: '1 hour / s' },
  { multiplier: 6 * HOUR, label: '6 hours / s' },
  { multiplier: DAY, label: '1 day / s' },
  { multiplier: WEEK, label: '1 week / s' },
  { multiplier: MONTH, label: '1 month / s' },
  { multiplier: YEAR, label: '1 year / s' },
  { multiplier: 10 * YEAR, label: '10 years / s' },
  { multiplier: 100 * YEAR, label: '100 years / s' },
];

export const DEFAULT_RATE_INDEX = 0;

export const ECLIPSE_RATE_INDEX = 3;

export type TimeDirection = 1 | -1;

export function rateLabel(index: number, direction: TimeDirection, paused: boolean): string {
  if (paused) return 'paused';
  const step = RATE_STEPS[index] ?? RATE_STEPS[DEFAULT_RATE_INDEX];
  return direction === -1 ? `${step.label} reversed` : step.label;
}

export function rateMultiplier(index: number, direction: TimeDirection, paused: boolean): number {
  if (paused) return 0;
  const step = RATE_STEPS[index] ?? RATE_STEPS[DEFAULT_RATE_INDEX];
  return step.multiplier * direction;
}

const MONTH_ABBR = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const UTC_TIME = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export function formatUtcDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day} ${MONTH_ABBR[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatUtcDateShort(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = MONTH_ABBR[date.getUTCMonth()];
  return `${day} ${month[0]}${month.slice(1).toLowerCase()} ${date.getUTCFullYear()}`;
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return '—';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  return `${minutes}m ${String(secs).padStart(2, '0')}s`;
}

export function formatUtcTime(date: Date): string {
  return UTC_TIME.format(date);
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toTimeInputValue(date: Date): string {
  return date.toISOString().slice(11, 19);
}

export function parseDateTimeInput(dateValue: string, timeValue: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null;

  const parts = timeValue.trim().split(':');
  if (parts.length < 2 || parts.length > 3) return null;

  const [h, m, s = '0'] = parts;
  if (!/^\d{1,2}$/.test(h) || !/^\d{1,2}$/.test(m) || !/^\d{1,2}$/.test(s)) return null;

  const hours = Number(h);
  const minutes = Number(m);
  const seconds = Number(s);
  if (hours > 23 || minutes > 59 || seconds > 59) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp = Date.parse(
    `${dateValue}T${pad(hours)}:${pad(minutes)}:${pad(seconds)}Z`
  );

  return Number.isNaN(timestamp) ? null : timestamp;
}
