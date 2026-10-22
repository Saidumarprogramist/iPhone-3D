/* ============================================================
   StudioEnvironment — procedural HDR-like lighting built from
   Lightformers. No external .hdr files: instant load, full art
   direction. Two rect key lights + rim strips + soft fill give
   the titanium its long anisotropic-looking highlights.
   ============================================================ */

import { Environment, Lightformer } from '@react-three/drei';

export default function StudioEnvironment({ quality = 'high' }) {
  const resolution = quality === 'high' ? 256 : 128;

  return (
    <group name="studio-lights">
      <Environment resolution={resolution} frames={1}>
        {/* Key: large warm-white softbox, upper left */}
        <Lightformer
          form="rect"
          intensity={4.2}
          color="#fff4dd"
          position={[-3, 4, 6]}
          scale={[7, 5, 1]}
          rotation-y={Math.PI / 5}
        />
        {/* Fill: cool dim panel right */}
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#bcd4ff"
          position={[5, 1, 4]}
          scale={[5, 6, 1]}
          rotation-y={-Math.PI / 3}
        />
        {/* Rim strip behind the product — the "Awwwards edge light" */}
        <Lightformer
          form="rect"
          intensity={6}
          color="#d8b25a"
          position={[0, 2.5, -6]}
          scale={[9, 0.6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ffffff"
          position={[0, -3.5, -5]}
          scale={[9, 0.4, 1]}
        />
        {/* Top line for the glass front */}
        <Lightformer
          form="ring"
          intensity={3}
          color="#ffffff"
          position={[0, 6, 2]}
          scale={3}
        />
        {/* Dark base so reflections have contrast */}
        <Lightformer form="rect" intensity={0.25} color="#101014" position={[0, -6, 0]} scale={[14, 14, 1]} rotation-x={Math.PI / 2} />
      </Environment>

      {/* Direct spots for specular pop on lenses */}
      <spotLight
        position={[-2, 6, 4]}
        angle={0.35}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.9}
        color="#f8f4ea"
      />
      <spotLight
        position={[3, -4, 3]}
        angle={0.4}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.35}
        color="#9db8ff"
      />
      <ambientLight intensity={0.12} color="#cfd6e6" />
    </group>
  );
}
