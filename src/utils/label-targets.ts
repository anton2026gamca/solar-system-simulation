import { REALISTIC_PLANETS } from './astronomy-engine';
import type { LabelTarget } from '@/components/scene-labels';

export const LABEL_TARGETS: LabelTarget[] = Object.entries(REALISTIC_PLANETS).flatMap(
  ([planetKey, profile]) => [
    { id: planetKey, name: profile.name, kind: 'planet' as const },
    ...Object.entries(profile.moons ?? {}).map(([moonKey, moon]) => ({
      id: `${planetKey}_${moonKey}`,
      name: moon.name,
      kind: 'moon' as const,
    })),
  ]
);
