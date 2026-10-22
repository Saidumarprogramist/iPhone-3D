import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import IPhone, { usePhoneAssets } from './IPhone';
import StudioEnvironment from './StudioEnvironment';
import CinematicRig from './CinematicRig';
import { state } from '../../store/experience';
import { finishes } from '../../constants';
function ContextHealth({ onError }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e) => {
      e.preventDefault();
      onError();
    };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onError]);
  return null;
}
function Rotation({ phoneRef }) {
  useFrame((_, dt) => {
    if (state.hidden) return;
    const g = phoneRef.current;
    if (!g || state.targetChapter !== 3) return;
    const delta = Math.min(dt, 0.05);
    if (!state.dragging) {
      state.spinVelocity *= Math.exp(-5 * delta);
      state.spin += state.spinVelocity * delta * 60;
      if (!state.reducedMotion && !state.paused) state.spin += delta * 0.16;
    }
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, Math.PI + state.spin, 9, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.08, 4, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -0.08, 4, delta);
  });
  return null;
}
function Scene({ finishIndex, onError }) {
  const assets = usePhoneAssets();
  const phoneRef = useRef();
  return (
    <>
      <ContextHealth onError={onError} />
      <StudioEnvironment quality={state.quality} />
      <group ref={phoneRef} rotation={[0.12, Math.PI - 0.45, -0.17]}>
        <IPhone assets={assets} finish={finishes[finishIndex]} />
      </group>
      <CinematicRig phoneRef={phoneRef} />
      <Rotation phoneRef={phoneRef} />
    </>
  );
}
export default function ExperienceCanvas({ finishIndex = 0, onError }) {
  return (
    <Canvas
      dpr={state.quality === 'high' ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 4.6], fov: 32, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.35;
      }}
    >
      <Suspense fallback={null}>
        <Scene finishIndex={finishIndex} onError={onError} />
      </Suspense>
    </Canvas>
  );
}
