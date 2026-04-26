"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Cylinder, Box, Cone, Dodecahedron, Icosahedron, Octahedron, Tetrahedron } from "@react-three/drei";
import * as THREE from "three";

// Generate a random-ish rock cluster from overlapping primitives
function RockCluster({ position, scale = 1, color = "#6b5d4f" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const rocks = useMemo(() => {
    const items = [];
    const count = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const type = Math.floor(Math.random() * 4);
      const offset = [
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.8,
      ];
      const s = 0.3 + Math.random() * 0.5;
      const rot = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
      items.push({ type, offset, scale: s, rotation: rot, key: i });
    }
    return items;
  }, []);

  return (
    <group position={position} scale={scale}>
      {rocks.map((rock) => {
        const mat = <meshStandardMaterial color={color} roughness={0.95} metalness={0.0} flatShading />;
        switch (rock.type) {
          case 0:
            return (
              <Dodecahedron key={rock.key} args={[rock.scale]} position={rock.offset as [number, number, number]} rotation={rock.rotation as [number, number, number]}>
                {mat}
              </Dodecahedron>
            );
          case 1:
            return (
              <Icosahedron key={rock.key} args={[rock.scale]} position={rock.offset as [number, number, number]} rotation={rock.rotation as [number, number, number]}>
                {mat}
              </Icosahedron>
            );
          case 2:
            return (
              <Octahedron key={rock.key} args={[rock.scale]} position={rock.offset as [number, number, number]} rotation={rock.rotation as [number, number, number]}>
                {mat}
              </Octahedron>
            );
          default:
            return (
              <Tetrahedron key={rock.key} args={[rock.scale]} position={rock.offset as [number, number, number]} rotation={rock.rotation as [number, number, number]}>
                {mat}
              </Tetrahedron>
            );
        }
      })}
    </group>
  );
}

function RockyModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle breathing/idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
    }
  });

  // 5 legs arranged in pentagon
  const legs = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 5;
      const x = Math.cos(angle);
      const z = Math.sin(angle);
      return { x, z, angle, key: i };
    });
  }, []);

  // Stone color palette
  const stoneColors = {
    main: "#7a6b5a",
    dark: "#5c4f42",
    light: "#9e8f7e",
    shadow: "#4a3f35",
    highlight: "#b5a898",
  };

  return (
    <group ref={groupRef}>
      {/* === MAIN BODY - Boulder-like core === */}
      <group position={[0, 0.2, 0]}>
        {/* Central boulder mass - hexagonal core */}
        <Cylinder args={[0.9, 1.0, 1.2, 6]} position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
          <meshStandardMaterial color={stoneColors.main} roughness={0.95} metalness={0.0} flatShading />
        </Cylinder>
        <Box args={[1.6, 0.8, 1.4]} position={[0, 0.1, 0]} rotation={[0, 0.3, 0]}>
          <meshStandardMaterial color={stoneColors.dark} roughness={0.95} metalness={0.0} flatShading />
        </Box>
        <Cylinder args={[0.7, 0.8, 1.0, 6]} position={[-0.1, -0.1, 0.1]} rotation={[0.2, 0.8, 0.4]}>
          <meshStandardMaterial color={stoneColors.light} roughness={0.95} metalness={0.0} flatShading />
        </Cylinder>
        <Box args={[1.0, 0.6, 1.0]} position={[0.1, 0.3, 0.2]} rotation={[0.3, 0.1, 0.5]}>
          <meshStandardMaterial color={stoneColors.highlight} roughness={0.9} metalness={0.0} flatShading />
        </Box>
        <Tetrahedron args={[0.5]} position={[-0.1, 0.25, -0.15]} rotation={[0.7, 0.4, 0.1]}>
          <meshStandardMaterial color={stoneColors.shadow} roughness={0.95} metalness={0.0} flatShading />
        </Tetrahedron>

        {/* Front protrusion - where face is */}
        <group position={[0, 0.1, 0.7]}>
          <Dodecahedron args={[0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color={stoneColors.main} roughness={0.95} metalness={0.0} flatShading />
          </Dodecahedron>
          <Icosahedron args={[0.35]} position={[0.1, 0.05, 0.1]} rotation={[0.2, 0.3, 0]}>
            <meshStandardMaterial color={stoneColors.dark} roughness={0.95} metalness={0.0} flatShading />
          </Icosahedron>
          <Octahedron args={[0.3]} position={[-0.1, -0.05, 0.05]} rotation={[0.4, 0.1, 0.3]}>
            <meshStandardMaterial color={stoneColors.light} roughness={0.95} metalness={0.0} flatShading />
          </Octahedron>
        </group>

        {/* Top - flat hexagonal head */}
        <group position={[0, 0.6, -0.1]}>
          <Cylinder args={[0.6, 0.7, 0.4, 6]} position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
            <meshStandardMaterial color={stoneColors.light} roughness={0.95} metalness={0.0} flatShading />
          </Cylinder>
          <Box args={[0.9, 0.25, 0.8]} position={[0.05, 0.15, 0.05]} rotation={[0.1, 0.3, 0]}>
            <meshStandardMaterial color={stoneColors.highlight} roughness={0.9} metalness={0.0} flatShading />
          </Box>
          <Box args={[0.5, 0.15, 0.6]} position={[-0.05, 0.3, -0.05]} rotation={[0.05, 0.2, 0.1]}>
            <meshStandardMaterial color={stoneColors.main} roughness={0.95} metalness={0.0} flatShading />
          </Box>
        </group>

        {/* Side bulges */}
        <group position={[0.55, 0, 0]}>
          <Icosahedron args={[0.45]} position={[0, 0, 0]}>
            <meshStandardMaterial color={stoneColors.dark} roughness={0.95} metalness={0.0} flatShading />
          </Icosahedron>
          <Dodecahedron args={[0.3]} position={[0.05, 0.1, -0.05]} rotation={[0.2, 0.4, 0.1]}>
            <meshStandardMaterial color={stoneColors.shadow} roughness={0.95} metalness={0.0} flatShading />
          </Dodecahedron>
        </group>
        <group position={[-0.55, 0, 0]}>
          <Icosahedron args={[0.45]} position={[0, 0, 0]}>
            <meshStandardMaterial color={stoneColors.dark} roughness={0.95} metalness={0.0} flatShading />
          </Icosahedron>
          <Dodecahedron args={[0.3]} position={[-0.05, 0.1, 0.05]} rotation={[0.3, 0.2, 0.4]}>
            <meshStandardMaterial color={stoneColors.shadow} roughness={0.95} metalness={0.0} flatShading />
          </Dodecahedron>
        </group>

        {/* Back bulk */}
        <group position={[0, -0.1, -0.4]}>
          <Dodecahedron args={[0.6]} position={[0, 0, 0]}>
            <meshStandardMaterial color={stoneColors.dark} roughness={0.95} metalness={0.0} flatShading />
          </Dodecahedron>
          <Octahedron args={[0.4]} position={[0.05, 0.1, -0.1]} rotation={[0.2, 0.6, 0.3]}>
            <meshStandardMaterial color={stoneColors.shadow} roughness={0.95} metalness={0.0} flatShading />
          </Octahedron>
        </group>

        {/* === MOUTH - crack/gap in the rock === */}
        <group position={[0, -0.15, 0.85]}>
          <Box args={[0.35, 0.06, 0.15]} position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#2a2018" roughness={1.0} />
          </Box>
          {/* Mandibles as stone pincers */}
          <Box args={[0.08, 0.2, 0.12]} position={[0.18, -0.08, 0.05]} rotation={[0, 0, -0.4]}>
            <meshStandardMaterial color={stoneColors.dark} roughness={0.95} flatShading />
          </Box>
          <Box args={[0.08, 0.2, 0.12]} position={[-0.18, -0.08, 0.05]} rotation={[0, 0, 0.4]}>
            <meshStandardMaterial color={stoneColors.dark} roughness={0.95} flatShading />
          </Box>
        </group>

        {/* === SPIRACLES / VENTS - holes in the rock === */}
        {Array.from({ length: 3 }, (_, i) => (
          <Sphere
            key={`vent-r-${i}`}
            args={[0.05, 6, 6]}
            position={[0.85, 0.05 - i * 0.12, 0.3 - i * 0.15]}
          >
            <meshStandardMaterial color="#1a1510" roughness={1.0} />
          </Sphere>
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <Sphere
            key={`vent-l-${i}`}
            args={[0.05, 6, 6]}
            position={[-0.85, 0.05 - i * 0.12, 0.3 - i * 0.15]}
          >
            <meshStandardMaterial color="#1a1510" roughness={1.0} />
          </Sphere>
        ))}
      </group>

      {/* === 5 LEGS - Two rectangular parts with one joint === */}
      {legs.map((leg) => (
        <group key={`leg-${leg.key}`}>
          {/* Upper leg - rectangular thigh */}
          <group position={[leg.x * 0.85, -0.35, leg.z * 0.85]} rotation={[0, -leg.angle, 0]}>
            <Box args={[0.42, 0.7, 0.28]} position={[0, -0.35, 0]} rotation={[0.1, 0.2, 0.4]}>
              <meshStandardMaterial color={stoneColors.main} roughness={0.95} flatShading />
            </Box>
          </group>

          {/* Joint - knee 
          <group position={[leg.x * 1.15, -0.95, leg.z * 1.0]} rotation={[0, -leg.angle, 0]}>
            <Sphere args={[0.16, 8, 8]} position={[0, 0, 0]}>
              <meshStandardMaterial color={stoneColors.light} roughness={0.9} flatShading />
            </Sphere>
          </group>*/}

          {/* Lower leg - rectangular shin */}
          <group position={[leg.x * 1.15, -0.95, leg.z * 1.0]} rotation={[-0.4, -leg.angle, 0.2]}>
            <Box args={[0.38, 1, 0.28]} position={[0, -0.4, 0]} rotation={[0.15, 0.3, 0.3]}>
              <meshStandardMaterial color={stoneColors.dark} roughness={0.95} flatShading />
            </Box>
          </group>

          {/* Foot - flat stone pad */}
          <group position={[leg.x * 1.60, -1.65, leg.z * 1.45]} rotation={[0.2, -leg.angle, 0.1]}>
            <Box args={[0.25, 0.12, 0.25]} position={[-0.25, 0, 0]}>
              <meshStandardMaterial color={stoneColors.shadow} roughness={0.95} flatShading />
            </Box>
          </group>
        </group>
      ))}
    </group>
  );
}

export default function Rocky() {
  return (
    <Canvas
      camera={{ position: [5, 4, 6], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        target={[0, 0, 0]}
      />

      <color attach="background" args={["#000000"]} />

      {/* Lighting - warm, like sunlight on rocks */}
      <ambientLight intensity={0.5} color="#c4b5a0" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff5e6" castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} color="#a8c4e0" />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#ffd4a3" />

      <RockyModel />

      {/* Ground - rocky terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#3d342b" roughness={1.0} />
      </mesh>

      {/* Scattered ground rocks */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 2.5 + Math.random() * 3;
        const pos: [number, number, number] = [Math.cos(angle) * dist, -1.75, Math.sin(angle) * dist];
        const s = 0.1 + Math.random() * 0.25;
        return (
          <Dodecahedron key={`ground-rock-${i}`} args={[s]} position={pos} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}>
            <meshStandardMaterial color="#5c4f42" roughness={0.95} flatShading />
          </Dodecahedron>
        );
      })}
    </Canvas>
  );
}

