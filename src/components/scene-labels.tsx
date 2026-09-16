'use client';

import { RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';


export interface LabelTarget {
  id: string;
  name: string;
  kind: 'planet' | 'moon';
}

export type LabelNodes = Record<string, HTMLDivElement | null>;

const projected = new THREE.Vector3();

const MOON_LABEL_DISTANCE = 2;

interface ProjectorProps {
  targets: LabelTarget[];
  registry: RefObject<Record<string, THREE.Object3D>>;
  nodes: RefObject<LabelNodes>;
  visible: boolean;
  focusTarget: string;
}

export function LabelProjector({
  targets,
  registry,
  nodes,
  visible,
  focusTarget,
}: ProjectorProps) {
  useFrame((state) => {
    const { camera, size } = state;

    camera.updateMatrixWorld();

    for (const target of targets) {
      const node = nodes.current[target.id];
      if (!node) continue;

      const object = registry.current[target.id];
      const hide = !object || !visible || target.id === focusTarget;

      if (hide) {
        if (node.style.opacity !== '0') node.style.opacity = '0';
        continue;
      }

      object.updateMatrixWorld();
      object.getWorldPosition(projected);

      const distance = projected.distanceTo(camera.position);
      projected.project(camera);

      const offscreen =
        projected.z > 1 || Math.abs(projected.x) > 1.5 || Math.abs(projected.y) > 1.5;
      const tooFar = target.kind === 'moon' && distance > MOON_LABEL_DISTANCE;

      if (offscreen || tooFar) {
        if (node.style.opacity !== '0') node.style.opacity = '0';
        continue;
      }

      const x = Math.round((projected.x * 0.5 + 0.5) * size.width);
      const y = Math.round((-projected.y * 0.5 + 0.5) * size.height);

      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (node.style.opacity !== '1') node.style.opacity = '1';
    }
  });

  return null;
}

interface LayerProps {
  targets: LabelTarget[];
  nodes: RefObject<LabelNodes>;
}

export function LabelLayer({ targets, nodes }: LayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      {targets.map((target) => (
        <div
          key={target.id}
          ref={(el) => {
            nodes.current[target.id] = el;
          }}
          className="scene-label"
          style={{ opacity: 0, transition: 'opacity 200ms ease' }}
        >
          <div className="flex -translate-x-1/2 -translate-y-full flex-col items-center">
            <span
              className={
                target.kind === 'planet'
                  ? 'mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/85'
                  : 'mb-1 text-[9px] uppercase tracking-[0.1em] text-ink-muted/70'
              }
            >
              {target.name}
            </span>
            <div
              className={
                target.kind === 'planet'
                  ? 'h-8 w-px bg-linear-to-b from-white/45 to-transparent'
                  : 'h-4 w-px bg-linear-to-b from-white/30 to-transparent'
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
