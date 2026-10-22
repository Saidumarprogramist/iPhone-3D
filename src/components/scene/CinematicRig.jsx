/* ============================================================
   CinematicRig — the scroll-driven camera. One persistent
   canvas sits behind the DOM; this rig flies the camera along
   keyframed "chapters" with damped lerps, adds pointer parallax
   and micro-handheld float so the shot always feels alive.
   ============================================================ */

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { state } from '../../store/experience';

/* Chapter keyframes: [camera pos, look-at target]
   0 HERO     — front portrait, screen glowing at us
   1 CHIP     — low orbit to the flank, engineering feel
   2 CAMERA   — macro over the shoulder, lens cluster fills frame
   3 SHOWROOM — pulled-back 3/4 view (drag-spin takes over)
   4 CTA      — slow rise, phone floats centered below headline  */
const SHOTS = [
  { pos: new THREE.Vector3(0, 0.05, 2.6), tgt: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(-1.7, -0.5, 1.9), tgt: new THREE.Vector3(0, -0.1, 0) },
  { pos: new THREE.Vector3(-0.5, 1.15, 1.35), tgt: new THREE.Vector3(-0.18, 0.5, -0.05) },
  { pos: new THREE.Vector3(0.2, 0.15, 2.9), tgt: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(0, 0.85, 3.1), tgt: new THREE.Vector3(0, 0.15, 0) },
];

const damp = THREE.MathUtils.damp;

export default function CinematicRig({ phoneRef }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const cur = useRef({ ...SHOTS[0], pos: SHOTS[0].pos.clone() });

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.1);

    // smooth chapter index for in-between blends
    state.chapter = damp(state.chapter, state.targetChapter, 2.2, delta);

    const i = Math.floor(THREE.MathUtils.clamp(state.chapter, 0, SHOTS.length - 1));
    const j = Math.min(i + 1, SHOTS.length - 1);
    const f = THREE.MathUtils.clamp(state.chapter - i, 0, 1);
    const eased = f * f * (3 - 2 * f); // smoothstep blend

    const targetPos = cur.current.pos.copy(SHOTS[i].pos).lerp(SHOTS[j].pos, eased);
    const targetTgt = lookAt.current.copy(SHOTS[i].tgt).lerp(SHOTS[j].tgt, eased);

    // pointer parallax (subtle, disabled under reduced motion)
    const px = state.reducedMotion ? 0 : state.pointer.x;
    const py = state.reducedMotion ? 0 : state.pointer.y;

    // handheld micro-float
    const t = state.reducedMotion ? 0 : performance.now() / 1000;
    const floatX = Math.sin(t * 0.5) * 0.02 + px * 0.14;
    const floatY = Math.cos(t * 0.37) * 0.015 - py * 0.1;

    const k = state.dragging ? 6 : 3.2; // faster follow while user drags showroom
    camera.position.x = damp(camera.position.x, targetPos.x + floatX, k, delta);
    camera.position.y = damp(camera.position.y, targetPos.y + floatY, k, delta);
    camera.position.z = damp(camera.position.z, targetPos.z, k, delta);

    lookAt.current.set(targetTgt.x + px * 0.05, targetTgt.y - py * 0.04, targetTgt.z);
    camera.lookAt(lookAt.current);

    // idle life on the phone itself outside the showroom chapter
    // (SpinDriver owns rotation inside the showroom window)
    if (phoneRef.current) {
      const inShowroom = state.chapter > 2.5 && state.chapter < 3.5;
      if (!inShowroom) {
        const g = phoneRef.current;
        g.rotation.y = damp(g.rotation.y, Math.PI + px * 0.25, 2, delta);
        g.rotation.x = damp(g.rotation.x, py * -0.12, 2, delta);
      }
    }
  });

  return null;
}
