import * as THREE from 'three';

/**
 * Seasonal Earth albedo.
 *
 * The twelve Blue Marble Next Generation composites are monthly snapshots of
 * the surface: snow line, sea ice, vegetation. Rather than pick one and freeze
 * the planet in a single season, the shader samples two adjacent months and
 * crossfades between them, so the surface drifts continuously as the simulation
 * runs through the year.
 */

const MONTH_FILES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
] as const;

const CACHE_LIMIT = 4;

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export interface SeasonBlend {
  /** Month index to sample as the base. */
  from: number;
  /** Month index to sample as the target. */
  to: number;
  /** 0 at the centre of `from`, 1 at the centre of `to`. */
  mix: number;
}

export function seasonBlendFor(date: Date): SeasonBlend {
  const month = date.getUTCMonth();
  const dayOfMonth = date.getUTCDate() - 1;
  const monthLength = MONTH_LENGTHS[month];

  const phase = month + dayOfMonth / monthLength - 0.5;
  const wrapped = ((phase % 12) + 12) % 12;

  const from = Math.floor(wrapped);
  return {
    from: from % 12,
    to: (from + 1) % 12,
    mix: wrapped - from,
  };
}

export class SeasonalAlbedo {
  private readonly cache = new Map<number, THREE.Texture>();
  private readonly pending = new Set<number>();
  private readonly loader = new THREE.TextureLoader();
  private disposed = false;

  constructor(private readonly maxAnisotropy = 4) { }

  request(month: number): THREE.Texture | null {
    const key = ((month % 12) + 12) % 12;

    const cached = this.cache.get(key);
    if (cached) {
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached;
    }

    this.load(key);
    return null;
  }

  private load(month: number): void {
    if (this.disposed || this.pending.has(month)) return;
    this.pending.add(month);

    this.loader.load(
      `/textures/earth/months/${MONTH_FILES[month]}.webp`,
      (texture) => {
        this.pending.delete(month);

        if (this.disposed) {
          texture.dispose();
          return;
        }

        texture.anisotropy = this.maxAnisotropy;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;

        this.cache.set(month, texture);
        this.evict();
      },
      undefined,
      () => {
        this.pending.delete(month);
      }
    );
  }

  private evict(): void {
    while (this.cache.size > CACHE_LIMIT) {
      const oldest = this.cache.keys().next();
      if (oldest.done) break;
      this.cache.get(oldest.value)?.dispose();
      this.cache.delete(oldest.value);
    }
  }

  dispose(): void {
    this.disposed = true;
    for (const texture of this.cache.values()) texture.dispose();
    this.cache.clear();
    this.pending.clear();
  }
}
