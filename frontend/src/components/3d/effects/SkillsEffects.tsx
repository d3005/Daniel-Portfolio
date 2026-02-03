import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Interactive Grid with displacement on hover
export function InteractiveGrid({ 
  position = [0, 0, -5] as [number, number, number],
  rows = 20,
  cols = 30 
}) {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });
  
  const gridPoints = useMemo(() => {
    const points: { x: number; y: number; baseZ: number }[] = [];
    const spacingX = viewport.width / cols;
    const spacingY = viewport.height / rows;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        points.push({
          x: (col - cols / 2) * spacingX,
          y: (row - rows / 2) * spacingY,
          baseZ: 0
        });
      }
    }
    return points;
  }, [rows, cols, viewport]);

  useFrame((state) => {
    // Update mouse position
    const { pointer } = state;
    mousePos.current = {
      x: pointer.x * viewport.width / 2,
      y: pointer.y * viewport.height / 2
    };
    
    if (ref.current) {
      ref.current.children.forEach((point, i) => {
        const data = gridPoints[i];
        const dx = mousePos.current.x - data.x;
        const dy = mousePos.current.y - data.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Displacement based on distance from mouse
        const maxDist = 3;
        const displacement = Math.max(0, 1 - dist / maxDist) * 1.5;
        
        point.position.z = displacement;
        
        // Color based on displacement
        const material = (point as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (displacement > 0.1) {
          material.color.setHex(0x00f5ff);
          material.opacity = 0.3 + displacement * 0.4;
        } else {
          material.color.setHex(0x5b6cf2);
          material.opacity = 0.15;
        }
      });
    }
  });

  return (
    <group ref={ref} position={position}>
      {gridPoints.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, 0]}>
          <circleGeometry args={[0.03, 8]} />
          <meshBasicMaterial 
            color="#5b6cf2" 
            transparent 
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

// Glitch Sphere - Tech stack visualization
export function GlitchSphere({ 
  position = [0, 0, -3] as [number, number, number],
  scale = 1.5 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const glitchRef = useRef<THREE.Group>(null);
  const [glitchState, setGlitchState] = useState({ offset: [0, 0, 0], color: '#00f5ff' });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
    }
    
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.15;
      wireRef.current.rotation.y = -t * 0.25;
    }
    
    // Random glitch effect
    if (Math.random() > 0.97) {
      setGlitchState({
        offset: [
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.1
        ],
        color: Math.random() > 0.5 ? '#00f5ff' : '#bf00ff'
      });
      
      // Reset after short delay
      setTimeout(() => {
        setGlitchState({ offset: [0, 0, 0], color: '#00f5ff' });
      }, 50);
    }
    
    if (glitchRef.current) {
      glitchRef.current.position.set(
        position[0] + glitchState.offset[0],
        position[1] + glitchState.offset[1],
        position[2] + glitchState.offset[2]
      );
    }
  });

  return (
    <group ref={glitchRef} position={position}>
      {/* Outer glow */}
      <mesh scale={scale * 1.3}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial 
          color="#bf00ff" 
          transparent 
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main sphere segments */}
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial 
          color={glitchState.color}
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh ref={wireRef} scale={scale * 1.05}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color="#00f5ff"
          wireframe
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner core */}
      <mesh scale={scale * 0.4}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Orbiting data points */}
      <OrbitingNodes scale={scale} />
      
      {/* Glitch slices */}
      <GlitchSlices scale={scale} color={glitchState.color} />
    </group>
  );
}

function OrbitingNodes({ scale }: { scale: number }) {
  const ref = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => 
    Array(6).fill(null).map((_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: scale * 1.4,
      speed: 0.5 + Math.random() * 0.5,
      size: 0.05 + Math.random() * 0.03
    })), [scale]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.children.forEach((node, i) => {
        const data = nodes[i];
        const angle = data.angle + t * data.speed;
        node.position.x = Math.cos(angle) * data.radius;
        node.position.z = Math.sin(angle) * data.radius;
        node.position.y = Math.sin(angle * 2) * 0.3;
      });
    }
  });

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <mesh key={i}>
          <sphereGeometry args={[node.size, 8, 8]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlitchSlices({ scale, color }: { scale: number; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current && Math.random() > 0.98) {
      ref.current.children.forEach((slice) => {
        slice.visible = Math.random() > 0.5;
      });
    }
  });

  return (
    <group ref={ref}>
      {[-0.3, 0, 0.3].map((y, i) => (
        <mesh key={i} position={[0, y * scale, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[scale * 0.8, scale * 0.85, 32]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default { InteractiveGrid, GlitchSphere };
