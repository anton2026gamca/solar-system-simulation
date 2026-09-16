const PUBLISH_INTERVAL_MS = 80;

type Listener = () => void;

export class SimulationClock {
  private time: number;
  private published: number;
  private lastPublishWallMs = 0;
  private readonly listeners = new Set<Listener>();

  constructor(initial: number = Date.now()) {
    this.time = initial;
    this.published = initial;
  }

  getTime(): number {
    return this.time;
  }

  getSnapshot = (): number => this.published;

  getServerSnapshot = (): number => 0;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  advance(deltaMs: number): void {
    if (deltaMs === 0) return;
    this.time += deltaMs;
    this.maybePublish();
  }

  setTime(time: number): void {
    this.time = time;
    this.published = time;
    this.lastPublishWallMs = now();
    this.emit();
  }

  private maybePublish(): void {
    const wall = now();
    if (wall - this.lastPublishWallMs < PUBLISH_INTERVAL_MS) return;
    this.lastPublishWallMs = wall;
    this.published = this.time;
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}
