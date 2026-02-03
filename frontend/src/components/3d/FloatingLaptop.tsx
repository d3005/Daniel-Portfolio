import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Stylized wireframe laptop made with basic geometries
// Generates code lines once on mount for consistent rendering
export default function FloatingLaptop() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate code lines data once on mount (not on every render)
  const codeLines = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      offsetX: -0.6 + (i * 0.05), // Deterministic offset
      width: 0.8 + (i % 3) * 0.3, // Deterministic width
      color: i % 3 === 0 ? '#00f5ff' : i % 3 === 1 ? '#bf00ff' : '#5b6cf2',
      opacity: 0.4 + (i % 4) * 0.1, // Deterministic opacity
      yPos: 0.45 - i * 0.15
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15 - 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05 - 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[-3.5, -0.5, -1]} scale={0.8}>
      {/* Laptop Base */}
      <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.6]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Keyboard area glow */}
      <mesh position={[0, 0.05, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2.2, 0.02, 1.4]} />
        <meshBasicMaterial color="#0a0a15" />
      </mesh>
      
      {/* Keyboard keys (subtle grid) */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <mesh
            key={`key-${row}-${col}`}
            position={[-0.9 + col * 0.2, 0.07, -0.45 + row * 0.25]}
            rotation={[-0.1, 0, 0]}
          >
            <boxGeometry args={[0.15, 0.02, 0.18]} />
            <meshBasicMaterial color="#2a2a3e" transparent opacity={0.8} />
          </mesh>
        ))
      )}
      
      {/* Touchpad */}
      <mesh position={[0, 0.06, 0.5]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.8, 0.01, 0.5]} />
        <meshBasicMaterial color="#1f1f35" />
      </mesh>

      {/* Screen Frame */}
      <group position={[0, 0.85, -0.75]} rotation={[0.3, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 1.5, 0.05]} />
          <meshBasicMaterial color="#1a1a2e" />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[2.2, 1.35]} />
          <meshBasicMaterial color="#050510" />
        </mesh>
        
        {/* Screen glow/content */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[2.1, 1.25]} />
          <meshBasicMaterial 
            color="#00f5ff" 
            transparent 
            opacity={0.1}
          />
        </mesh>
        
        {/* Code lines on screen */}
        {codeLines.map((line, i) => (
          <mesh key={`code-${i}`} position={[line.offsetX, line.yPos, 0.05]}>
            <planeGeometry args={[line.width, 0.04]} />
            <meshBasicMaterial 
              color={line.color} 
              transparent 
              opacity={line.opacity}
            />
          </mesh>
        ))}
        
        {/* Screen border glow */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[2.3, 1.4]} />
          <meshBasicMaterial 
            color="#00f5ff" 
            transparent 
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Hinge */}
      <mesh position={[0, 0.08, -0.75]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.3, 8]} />
        <meshBasicMaterial color="#2a2a3e" />
      </mesh>
      
      {/* Ambient glow under laptop */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial 
          color="#00f5ff" 
          transparent 
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
