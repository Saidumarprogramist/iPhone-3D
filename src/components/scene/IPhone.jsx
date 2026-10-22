import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
const W = 0.72,
  H = 1.5,
  D = 0.065;
function shape(w, h, r) {
  const s = new THREE.Shape(),
    x = -w / 2,
    y = -h / 2;
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
function panel(w, h, r) {
  const geo = new THREE.ShapeGeometry(shape(w, h, r), 24);
  const pos = geo.attributes.position,
    uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  return geo;
}
export function usePhoneAssets() {
  const assets = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(shape(W, H, 0.105), {
      depth: D,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 4,
      curveSegments: 24,
    });
    body.center();
    const mark = new THREE.Shape();
    mark.moveTo(-0.045, -0.05);
    mark.lineTo(0, 0.05);
    mark.lineTo(0.045, -0.05);
    mark.lineTo(0.025, -0.05);
    mark.lineTo(0, 0.01);
    mark.lineTo(-0.025, -0.05);
    mark.closePath();
    return {
      mark: new THREE.ShapeGeometry(mark),
      body,
      back: panel(W - 0.018, H - 0.018, 0.1),
      screen: panel(W - 0.04, H - 0.04, 0.09),
      plate: panel(0.345, 0.36, 0.08),
      island: panel(0.2, 0.047, 0.023),
      ring: new THREE.TorusGeometry(0.057, 0.008, 12, 48),
      lens: new THREE.CircleGeometry(0.048, 48),
    };
  }, []);
  useEffect(() => () => Object.values(assets).forEach((g) => g.dispose()), [assets]);
  return assets;
}
function screenTexture(tint) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const bg = ctx.createLinearGradient(0, 0, 512, 1024);
  bg.addColorStop(0, '#080c13');
  bg.addColorStop(1, '#171c24');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 1024);
  // A generated vector-like wallpaper: no network request or multi-megabyte textures.
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.translate(260, 530);
    ctx.rotate(-0.55);
    const gradient = ctx.createLinearGradient(-180, 0, 190, 0);
    gradient.addColorStop(0, '#05080e');
    gradient.addColorStop(0.48, tint);
    gradient.addColorStop(0.54, '#f8f2df');
    gradient.addColorStop(0.6, tint);
    gradient.addColorStop(1, '#101722');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.ellipse(0, 0, 90 + i * 47, 180 + i * 62, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = '#ffffffca';
  ctx.textAlign = 'center';
  ctx.font = '300 72px Arial';
  ctx.fillText('09:41', 256, 200);
  ctx.font = '16px Arial';
  ctx.fillText('Thursday, October 22', 256, 240);
  ctx.fillStyle = '#ffffffa0';
  ctx.fillRect(185, 988, 142, 5);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
}
function Lens({ assets, x, y }) {
  return (
    <group position={[x, y, 0.027]}>
      <mesh geometry={assets.ring}>
        <meshStandardMaterial color="#8c8f91" metalness={1} roughness={0.17} />
      </mesh>
      <mesh geometry={assets.lens} position-z={0.004}>
        <meshPhysicalMaterial color="#08121f" metalness={0.65} roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position-z={0.006}>
        <circleGeometry args={[0.029, 32]} />
        <meshBasicMaterial color="#02040a" />
      </mesh>
      <mesh position={[0.012, 0.018, 0.007]}>
        <circleGeometry args={[0.01, 20]} />
        <meshBasicMaterial color="#426d8b" transparent opacity={0.65} />
      </mesh>
      <mesh position={[-0.016, -0.009, 0.008]}>
        <circleGeometry args={[0.006, 16]} />
        <meshBasicMaterial color="#826389" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
export default function IPhone({ assets, finish }) {
  const texture = useMemo(() => screenTexture(finish.tint), [finish.tint]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group>
      <mesh geometry={assets.body}>
        <meshStandardMaterial
          color={finish.tint}
          metalness={0.88}
          roughness={0.27}
          envMapIntensity={1.8}
        />
      </mesh>
      <mesh geometry={assets.back} position={[0, 0, -D / 2 - 0.009]} rotation-y={Math.PI}>
        <meshStandardMaterial
          color={finish.tint}
          metalness={0.5}
          roughness={0.38}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh geometry={assets.screen} position={[0, 0, D / 2 + 0.01]}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh geometry={assets.island} position={[0, 0.65, D / 2 + 0.012]}>
        <meshBasicMaterial color="#030305" />
      </mesh>
      <mesh position={[0.064, 0.65, D / 2 + 0.014]}>
        <circleGeometry args={[0.012, 24]} />
        <meshBasicMaterial color="#142130" />
      </mesh>
      <group position={[0.155, 0.5, -D / 2 - 0.018]} rotation-y={Math.PI}>
        <mesh geometry={assets.plate}>
          <meshStandardMaterial color={finish.tint} metalness={0.55} roughness={0.25} />
        </mesh>
        <Lens assets={assets} x={-0.083} y={0.084} />
        <Lens assets={assets} x={-0.083} y={-0.084} />
        <Lens assets={assets} x={0.083} y={0} />
        <mesh position={[0.082, 0.115, 0.016]}>
          <circleGeometry args={[0.022, 24]} />
          <meshStandardMaterial color="#f5efdc" emissive="#443f30" />
        </mesh>
        <mesh position={[0.082, -0.11, 0.016]}>
          <circleGeometry args={[0.016, 24]} />
          <meshStandardMaterial color="#111217" roughness={0.25} />
        </mesh>
      </group>
      <group position={[0, -0.04, -D / 2 - 0.012]} rotation-y={Math.PI}>
        <mesh geometry={assets.mark}>
          <meshStandardMaterial color={finish.tint} metalness={1} roughness={0.15} />
        </mesh>
      </group>
      {[
        [W / 2 + 0.006, 0.3, 0.14],
        [-W / 2 - 0.006, 0.39, 0.08],
        [-W / 2 - 0.006, 0.24, 0.08],
      ].map(([x, y, h], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[0.014, h, 0.035]} />
          <meshStandardMaterial color={finish.tint} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, -H / 2 - 0.009, 0]}>
        <boxGeometry args={[0.11, 0.005, 0.024]} />
        <meshBasicMaterial color="#101114" />
      </mesh>
    </group>
  );
}
