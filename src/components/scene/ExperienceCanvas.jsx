/* ============================================================
   ExperienceCanvas — the single WebGL canvas for the whole
   page. Fixed behind content (pointer-events: none), except
   while the Showroom chapter is active, when App re-enables
   pointer input so users can drag-spin the device.

   One canvas = one GL context, no remounts on scroll, and a
   cinematic camera that flies between chapters written by the
   DOM layer into store/experience.js.
   ============================================================ */

import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import IPhone, { usePhoneAssets } from './IPhone';
import StudioEnvironment from './StudioEnvironment';
import CinematicRig from './CinematicRig';
import { state } from '../../store/experience';
import { finishes } from '../../constants';

/* Load wallpaper textures once; sRGB + mipmaps tuned for screens. */
function useWallpapers() {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    return finishes.map((f) => {
      const tex = loader.load(f.screen);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return tex;
    });
  }, []);
}

/* Applies showroom drag-spin to the phone group while the
   camera is inside chapter 3 (showroom window). Outside it,
   the spin target relaxes back to the hero pose. */
function SpinDriver({ phoneRef }) {
  useFrame((_, dt) => {
    const g = phoneRef.current;
    if (!g) return;

    const inShowroom = state.chapter > 2.5 && state.chapter < 3.5;

    if (inShowroom) {
      if (!state.dragging) {
        // inertia decay + slow autoplay torque when nearly stopped
        state.spinVelocity *= 0.95;
        if (!state.reducedMotion && Math.abs(state.spinVelocity) < 0.0016) {
          state.spinVelocity += 0.0011;
        }
        state.spin += state.spinVelocity;
      }
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        Math.PI + state.spin,
        8,
        Math.min(dt, 0.1)
      );
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.04, 3, dt);
    } else {
      // hand control back to the rig / parallax
      state.spin = g.rotation.y - Math.PI;
    }
  });
  return null;
}

function SceneContents({ finishIndex }) {
  const assets = usePhoneAssets();
  const wallpapers = useWallpapers();
  const phoneRef = useRef();

  // finish comes from React state (App) — deterministic, no stale reads
  const activeFinish = Math.min(finishIndex, wallpapers.length - 1);
  const finish = {
    tint: finishes[activeFinish].tint,
    screenTexture: wallpapers[activeFinish],
  };

  return (
    <>
      <Suspense fallback={null}>
        <StudioEnvironment quality={state.quality} />

        <Float
          speed={state.reducedMotion ? 0 : 1.4}
          rotationIntensity={0}
          floatIntensity={state.reducedMotion ? 0 : 0.3}
          floatingRange={[-0.03, 0.05]}
        >
          <group ref={phoneRef} scale={1.05} rotation={[0, Math.PI, 0]}>
            <SpinDriver phoneRef={phoneRef} />
            <IPhone assets={assets} finish={finish} />
          </group>
        </Float>

        <ContactShadows
          position={[0, -0.98, 0]}
          opacity={0.55}
          scale={5}
          blur={2.6}
          far={2}
          resolution={state.quality === 'high' ? 512 : 256}
          color="#000000"
        />
      </Suspense>

      <CinematicRig phoneRef={phoneRef} />

      {state.quality === 'high' && (
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={state.reducedMotion ? 0.3 : 0.55}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.18} darkness={0.85} />
        </EffectComposer>
      )}
    </>
  );
}

export default function ExperienceCanvas({ finishIndex = 0 }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={state.quality === 'high' ? [1, 2] : [1, 1.5]}
        camera={{ position: [0, 0.05, 2.6], fov: 36, near: 0.1, far: 20 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <SceneContents finishIndex={finishIndex} />
      </Canvas>
    </div>
  );
}
