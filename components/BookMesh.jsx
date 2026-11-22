import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

function makeCoverTexture(book) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 512, 768);
  gradient.addColorStop(0, book.color);
  gradient.addColorStop(1, new THREE.Color(book.color).multiplyScalar(0.68).getStyle());
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 768);

  ctx.strokeStyle = `${book.accent}88`;
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 460, 716);
  ctx.strokeRect(39, 39, 434, 690);

  ctx.fillStyle = book.accent;
  ctx.font = "500 17px 'DM Mono', monospace";
  ctx.letterSpacing = "4px";
  ctx.fillText("SHREE  /  SELECTED EDITIONS", 58, 95);

  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(390, 190, 95, 0, Math.PI * 2);
  ctx.strokeStyle = book.accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(390, 190, 72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = book.accent;
  const words = book.title.toUpperCase().split(" ");
  const fontSize = book.title.length > 17 ? 48 : 62;
  ctx.font = `600 ${fontSize}px Georgia`;
  let y = 350;
  words.forEach((word) => {
    ctx.fillText(word, 58, y);
    y += fontSize * 1.05;
  });

  ctx.fillStyle = `${book.accent}cc`;
  ctx.font = "italic 22px Georgia";
  ctx.fillText(book.genre, 60, 610);

  ctx.fillStyle = book.accent;
  ctx.font = "500 15px 'DM Mono', monospace";
  ctx.fillText(book.author.toUpperCase(), 60, 685);
  ctx.fillText("SHREE PUBLICATION", 60, 715);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function BookMesh({ book, index, progress, selected, onSelect, reducedMotion }) {
  const group = useRef();
  const cover = useRef();
  const texture = useMemo(() => makeCoverTexture(book), [book]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const count = 5;
    const arc = (index - (count - 1) / 2);
    const heroX = arc * 1.35;
    const heroY = Math.sin(index * 1.2) * 0.28;
    const heroZ = -Math.abs(arc) * 0.24;

    const showcaseX = arc * 2.0;
    const showcaseY = 0.05 + Math.cos(index * 0.8) * 0.12;
    const showcaseZ = -0.2 - Math.abs(arc) * 0.1;

    const collectionX = arc * 2.15;
    const collectionY = -0.15 + Math.sin(index) * 0.1;
    const collectionZ = -0.5;

    const blend = (a, b, v) => a + (b - a) * v;
    let x, y, z, ry, rx, scale;

    if (p < 0.34) {
      const q = p / 0.34;
      x = blend(heroX * 1.5, heroX, q);
      y = blend(heroY + 1.8, heroY, q);
      z = blend(heroZ - 1.8, heroZ, q);
      ry = blend(-0.7, 0.15 + arc * 0.12, q);
      rx = blend(0.45, 0.05, q);
      scale = 0.82;
    } else if (p < 0.68) {
      const q = (p - 0.34) / 0.34;
      x = blend(heroX, showcaseX, q);
      y = blend(heroY, showcaseY, q);
      z = blend(heroZ, showcaseZ, q);
      ry = blend(0.15 + arc * 0.12, -0.12 + arc * 0.06, q);
      rx = blend(0.05, 0.02, q);
      scale = 0.82 + Math.sin(q * Math.PI) * 0.06;
    } else {
      const q = (p - 0.68) / 0.32;
      x = blend(showcaseX, collectionX, q);
      y = blend(showcaseY, collectionY, q);
      z = blend(showcaseZ, collectionZ, q);
      ry = blend(-0.12 + arc * 0.06, 0.25 + arc * 0.05, q);
      rx = 0.02;
      scale = 0.84;
    }

    const float = reducedMotion ? 0 : Math.sin(t * 0.75 + index * 1.7) * 0.055;
    const targetX = selected ? x * 0.52 : x;
    const targetY = selected ? y - 0.05 : y + float;
    const targetZ = selected ? z + 1.35 : z;
    const targetScale = selected ? 1.12 : scale;

    const damp = 1 - Math.exp(-delta * 5.5);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, damp);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, damp);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, damp);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rx, damp);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, ry + (selected ? 0.18 : 0), damp);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, selected ? -0.04 : Math.sin(t * 0.4 + index) * 0.018, damp);
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, damp));
    if (cover.current) {
      cover.current.rotation.y = THREE.MathUtils.lerp(cover.current.rotation.y, selected ? -0.16 : 0, damp);
    }
  });

  return (
    <group ref={group} onClick={(e) => { e.stopPropagation(); onSelect(book); }} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "auto"; }}>
      {/* paper block */}
      <RoundedBox args={[1.72, 2.48, 0.22]} radius={0.035} smoothness={2} position={[0.055, 0, -0.015]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8dfcd" roughness={0.92} />
      </RoundedBox>
      {/* tiny page-edge lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[0.055, -1.08 + i * 0.27, 0.101]}>
          <boxGeometry args={[1.62, 0.006, 0.003]} />
          <meshBasicMaterial color="#b8ad99" transparent opacity={0.48} />
        </mesh>
      ))}
      {/* back board */}
      <RoundedBox args={[1.82, 2.58, 0.09]} radius={0.055} smoothness={3} position={[0, 0, -0.13]} castShadow>
        <meshStandardMaterial color={book.spine} roughness={0.68} />
      </RoundedBox>
      {/* front cover */}
      <group ref={cover} position={[-0.015, 0, 0.09]}>
        <RoundedBox args={[1.82, 2.58, 0.085]} radius={0.055} smoothness={4} castShadow>
          <meshStandardMaterial map={texture} roughness={0.48} metalness={0.03} />
        </RoundedBox>
      </group>
      {/* spine */}
      <RoundedBox args={[0.12, 2.56, 0.23]} radius={0.035} smoothness={3} position={[-0.91, 0, -0.005]} castShadow>
        <meshStandardMaterial color={book.spine} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, 0, 0.142]}>
        <planeGeometry args={[1.58, 2.28]} />
        <meshBasicMaterial map={texture} transparent opacity={0.0001} depthWrite={false} />
      </mesh>
    </group>
  );
}
