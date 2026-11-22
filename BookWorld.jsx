import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Html, OrbitControls } from "@react-three/drei";
import BookMesh from "./BookMesh";
import { books } from "../data/books";

function Scene({ progress, selected, onSelect, reducedMotion }) {
  return (
    <>
      <color attach="background" args={["#e9e4d9"]} />
      <fog attach="fog" args={["#e9e4d9", 9, 20]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 7, 6]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, 1, 2]} intensity={45} color="#d4b47d" distance={12} />
      <pointLight position={[4, -2, -3]} intensity={20} color="#8c9b82" distance={10} />
      <group position={[0, -0.05, 0]}>
        {books.map((book, index) => (
          <BookMesh
            key={book.id}
            book={book}
            index={index}
            progress={progress}
            selected={selected?.id === book.id}
            onSelect={onSelect}
            reducedMotion={reducedMotion}
          />
        ))}
      </group>
      <ContactShadows position={[0, -2.05, 0]} opacity={0.28} scale={14} blur={2.8} far={4} />
      <Environment preset="studio" />
    </>
  );
}

export default function BookWorld({ progress, selected, onSelect, reducedMotion }) {
  const dpr = useMemo(() => Math.min(window.devicePixelRatio || 1, 1.6), []);
  return (
    <div className="world-canvas" aria-label="Interactive 3D books. Select a book to inspect it.">
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 0.35, 9.4], fov: 34 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#e9e4d9", 1);
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <Scene progress={progress} selected={selected} onSelect={onSelect} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}