'use client';

import { ReactNode } from 'react';

/*
  Shared shells for the interface.

  Everything here sticks to one border weight, one panel radius and one accent.
  The constraint is deliberate: the scene already carries nine orbit colours, a
  lit Earth and a star field, so any extra decoration in the chrome reads as
  noise rather than hierarchy.
*/

export function Panel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-line bg-panel/85 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  label,
  children,
  action,
}: {
  label: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="border-b border-line px-3 py-3 last:border-b-0">
      <header className="mb-2.5 flex items-center justify-between">
        <h2 className="eyebrow">{label}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-1">
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[12px] leading-tight text-ink-muted transition-colors group-hover:text-ink">
          {label}
        </span>
        {hint && <span className="text-[10px] leading-tight text-ink-faint">{hint}</span>}
      </span>
      <span className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className="block h-[14px] w-[26px] rounded-full border border-line-strong bg-sunken transition-colors peer-checked:border-accent-dim peer-checked:bg-accent-dim/35 peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-accent"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute left-[2px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-ink-faint transition-all peer-checked:left-[13px] peer-checked:bg-accent"
          aria-hidden
        />
      </span>
    </label>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  active = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded border transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        active
          ? 'border-accent-dim bg-accent-dim/25 text-accent'
          : 'border-line bg-sunken text-ink-muted hover:border-line-strong hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

export function TextButton({
  children,
  onClick,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded border border-line bg-sunken px-2.5 py-1.5 text-[11px] font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
    >
      {children}
    </button>
  );
}
