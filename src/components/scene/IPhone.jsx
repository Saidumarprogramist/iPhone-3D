/* ============================================================
   IPhone — procedural, fully-controllable iPhone built from
   primitives. Zero external assets, instant load, and every
   material is live-tunable (titanium tint, screen wallpaper,
   lens glass). Shares one geometry/material set across the
   hero canvas and the showroom canvas.
   ============================================================ */

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const W = 0.72; // width
const H = 1.5; // height
const D = 0.045; // depth
const R = 0.09; // corner radius

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

const bevelOpts = {
  depth: D,
  bevelEnabled: true,
  bevelThickness: 0.012,
  bevelSize: 0.012,
  bevelSegments: 5,
  curveSegments: 12,
};

export function usePhoneAssets() {
  return useMemo(() => {
    const bodyGeo = new THREE.ExtrudeGeometry(roundedRectShape(W, H, R), bevelOpts);
    bodyGeo.center();

    const screenGeo = new THREE.PlaneGeometry(W - 0.05, H - 0.055, 1, 1);

    const islandGeo = new THREE.ExtrudeGeometry(
      roundedRectShape(0.2, 0.052, 0.026),
      { depth: 0.004, bevelEnabled: false, curveSegments: 10 }
    );
    islandGeo.center();

    const camPlateGeo = new THREE.ExtrudeGeometry(
      roundedRectShape(0.34, 0.34, 0.1),
      { depth: 0.014, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 10 }
    );
    camPlateGeo.center();

    const ringGeo = new THREE.TorusGeometry(0.052, 0.011, 12, 40);
    const lensGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.012, 32);
    const flashGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.01, 20);

    return { bodyGeo, screenGeo, islandGeo, camPlateGeo, ringGeo, lensGeo, flashGeo };
  }, []);
}

function Lens({ assets, position, materials }) {
  return (
    <group position={position}>
      <mesh geometry={assets.ringGeo} material={materials.frame} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={assets.lensGeo} material={materials.lens} rotation={[Math.PI / 2, 0, 0]} />
      {/* inner aperture disc */}
      <mesh position={[0, 0, 0.008]} material={materials.aperture}>
        <circleGeometry args={[0.03, 28]} />
      </mesh>
    </group>
  );
}

/**
 * props:
 *  - finish: { tint, screenTexture }  (screenTexture: THREE.Texture | null)
 *  - emissiveBoost?: number (screen brightness multiplier)
 */
export default function IPhone({ assets, finish, emissiveBoost = 1.15 }) {
  const screenMatRef = useRef();

  const materials = useMemo(() => {
    const frame = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.tint),
      metalness: 0.92,
      roughness: 0.32,
      envMapIntensity: 1.35,
    });
    const back = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.tint).multiplyScalar(0.85),
      metalness: 0.55,
      roughness: 0.5,
      envMapIntensity: 1.1,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#0a0a0c',
      metalness: 0,
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
      envMapIntensity: 1.6,
    });
    const lensGlass = new THREE.MeshPhysicalMaterial({
      color: '#05070d',
      metalness: 0.1,
      roughness: 0.05,
      clearcoat: 1,
      envMapIntensity: 2,
    });
    const aperture = new THREE.MeshStandardMaterial({
      color: '#020204',
      metalness: 0.2,
      roughness: 0.25,
    });
    const island = new THREE.MeshStandardMaterial({
      color: '#060608',
      metalness: 0.3,
      roughness: 0.35,
    });
    const plate = new THREE.MeshStandardMaterial({
      color: new THREE.Color(finish.tint).multiplyScalar(0.9),
      metalness: 0.9,
      roughness: 0.28,
      envMapIntensity: 1.4,
    });
    const flash = new THREE.MeshStandardMaterial({
      color: '#f7f2df',
      emissive: '#3a3628',
      roughness: 0.4,
      metalness: 0.1,
    });
    const buttons = frame;

    return { frame, back, glass, lens: lensGlass, aperture, island, plate, flash, buttons };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live-update tint + wallpaper without rebuilding materials
  useFrame(() => {
    materials.frame.color.set(finish.tint);
    materials.plate.color.set(finish.tint).multiplyScalar(0.9);
    materials.back.color.set(finish.tint).multiplyScalar(0.85);

    const m = screenMatRef.current;
    if (m && m.map !== (finish.screenTexture || null)) {
      m.map = finish.screenTexture || null;
      m.emissiveMap = finish.screenTexture || null;
      m.needsUpdate = true;
    }
    if (m) m.emissiveIntensity = emissiveBoost;
  });

  return (
    <group dispose={null}>
      {/* Titanium chassis */}
      <mesh castShadow geometry={assets.bodyGeo} material={materials.frame} />

      {/* Glass front slightly proud of the body */}
      <mesh position={[0, 0, D / 2 + 0.004]} geometry={assets.screenGeo} ref={undefined}>
        <primitive object={materials.glass} attach="material" />
      </mesh>

      {/* Screen content (emissive wallpaper) just under the glass */}
      <mesh position={[0, 0, D / 2 + 0.0032]}>
        <planeGeometry args={[W - 0.045, H - 0.05]} />
        <meshStandardMaterial
          ref={screenMatRef}
          color="#000000"
          emissive="#ffffff"
          emissiveIntensity={emissiveBoost}
          roughness={0.35}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      {/* Dynamic island */}
      <mesh
        position={[0, H / 2 - 0.12, D / 2 + 0.0065]}
        geometry={assets.islandGeo}
        material={materials.island}
      />

      {/* Rear camera plate + lenses */}
      <group position={[-W / 2 + 0.24, H / 2 - 0.24, -(D / 2 + 0.01)]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={assets.camPlateGeo} material={materials.plate} />
        <Lens assets={assets} position={[-0.075, 0.075, 0.02]} materials={materials} />
        <Lens assets={assets} position={[-0.075, -0.075, 0.02]} materials={materials} />
        <Lens assets={assets} position={[0.085, 0, 0.02]} materials={materials} />
        <mesh position={[0.085, 0.11, 0.016]} geometry={assets.flashGeo} material={materials.flash} rotation={[Math.PI / 2, 0, 0]} />
      </group>

      {/* Side buttons */}
      <mesh position={[W / 2 + 0.008, 0.32, 0]} material={materials.buttons}>
        <boxGeometry args={[0.012, 0.14, 0.02]} />
      </mesh>
      <mesh position={[-(W / 2 + 0.008), 0.42, 0]} material={materials.buttons}>
        <boxGeometry args={[0.012, 0.09, 0.02]} />
      </mesh>
      <mesh position={[-(W / 2 + 0.008), 0.28, 0]} material={materials.buttons}>
        <boxGeometry args={[0.012, 0.09, 0.02]} />
      </mesh>
    </group>
  );
}

export const PHONE_SIZE = { W, H, D };
