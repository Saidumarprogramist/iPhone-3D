import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { state } from '../../store/experience';
// [horizontal position as viewport fraction, vertical, scale, pitch, yaw, roll]
const desktop = [
  [0.7, 0, 1.3, 0.12, Math.PI - 0.48, -0.17],
  [0.29, 0.02, 1.45, -0.15, Math.PI + 0.85, 0.15],
  [0.72, -0.09, 1.9, -0.12, Math.PI - 0.3, -0.28],
  [0.72, 0, 1.22, 0.08, Math.PI, -0.08],
  [0.5, -0.15, 0.7, 0, Math.PI, 0],
];
const mobile = [
  [0.5, 0.3, 0.77, 0.1, Math.PI - 0.45, -0.17],
  [0.5, 0.24, 0.87, -0.08, Math.PI + 0.8, 0.12],
  [0.5, 0.24, 1.0, -0.1, Math.PI - 0.3, -0.23],
  [0.5, 0.04, 0.86, 0.08, Math.PI, -0.08],
  [0.5, 0, 0.5, 0, Math.PI, 0],
];
export default function CinematicRig({ phoneRef }) {
  const { viewport, size } = useThree();
  const scale = useRef(1);
  const sections = useMemo(
    () => ['hero', 'chip', 'camera', 'showroom', 'cta'].map((id) => document.getElementById(id)),
    [],
  );
  useFrame((_, dt) => {
    const g = phoneRef.current;
    if (!g || state.hidden) return;
    const delta = Math.min(dt, 0.05);
    const shot = (size.width <= 700 ? mobile : desktop)[state.targetChapter] || desktop[0];
    const factor = state.reducedMotion ? 100 : 3.5;
    const px = state.reducedMotion ? 0 : state.pointer.x;
    const py = state.reducedMotion ? 0 : state.pointer.y;
    g.position.x = THREE.MathUtils.damp(
      g.position.x,
      (shot[0] - 0.5) * viewport.width,
      factor,
      delta,
    );
    const mobileCenter =
      (sections[state.targetChapter]?.getBoundingClientRect().top || 0) +
      [320, 270, 270, 570, 300][state.targetChapter];
    const targetY =
      size.width <= 700
        ? (0.5 - mobileCenter / size.height) * viewport.height
        : shot[1] * viewport.height;
    g.position.y =
      size.width <= 700 ? targetY : THREE.MathUtils.damp(g.position.y, targetY, factor, delta);
    scale.current = THREE.MathUtils.damp(scale.current, shot[2], factor, delta);
    g.scale.setScalar(scale.current);
    if (state.targetChapter !== 3) {
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, shot[3] - py * 0.05, factor, delta);
      // Return to the closest equivalent orientation, avoiding multiple revolutions after dragging.
      const yaw = shot[4] + px * 0.09;
      const difference = Math.atan2(Math.sin(yaw - g.rotation.y), Math.cos(yaw - g.rotation.y));
      g.rotation.y += difference * (1 - Math.exp(-factor * delta));
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, shot[5], factor, delta);
      state.spin = g.rotation.y - Math.PI;
      state.spinVelocity = 0;
    }
    state.chapter = state.targetChapter;
  });
  return null;
}
