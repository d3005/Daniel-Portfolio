import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Floating Geometric Shapes - 3-4 shapes around content
export function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => [
    { 
      type: 'icosahedron', 
      position: [-4, 2, -3] as [number, number, number], 
      color: '#00f5ff', 
      scale: 0.6,
      speed: 0.3 
    },
    { 
      type: 'octahedron', 
      position: [4, -1, -4] as [number, number, number], 
      color: '#bf00ff', 
      scale: 0.5,
      speed: 0.4 
    },
    { 
      type: 'dodecahedron', 
      position: [-3, -2, -2] as [number, number, number], 
      color: '#5b6cf2', 
      scale: 0.4,
      speed: 0.35 
    },
    { 
      type: 'tetrahedron', 
      position: [3.5, 2.5, -5] as [number, number, number], 
      color: '#00f5ff', 
      scale: 0.45,
      speed: 0.25 
    },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.children.forEach((shape, i) => {
        const data = shapes[i];
        shape.rotation.x = t * data.speed;
        shape.rotation.y = t * data.speed * 1.3;
        shape.position.y = data.position[1] + Math.sin(t * 0.5 + i) * 0.3;
      });
    }
  });

  const getGeometry = (type: string) => {
    switch (type) {
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1, 0]} />;
      case 'tetrahedron': return <tetrahedronGeometry args={[1, 0]} />;
      default: return <icosahedronGeometry args={[1, 0]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={shape.position} scale={shape.scale}>
            {/* Glow */}
            <mesh scale={1.3}>
              {getGeometry(shape.type)}
              <meshBasicMaterial 
                color={shape.color} 
                transparent 
                opacity={0.1}
                side={THREE.BackSide}
              />
            </mesh>
            {/* Wireframe shape */}
            <mesh>
              {getGeometry(shape.type)}
              <meshBasicMaterial 
                color={shape.color} 
                wireframe 
                transparent 
                opacity={0.8}
              />
            </mesh>
            {/* Solid inner */}
            <mesh scale={0.3}>
              {getGeometry(shape.type)}
              <meshBasicMaterial 
                color={shape.color} 
                transparent 
                opacity={0.5}
              />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

// DNA Helix / Spiral - Side decoration
export function DNAHelix({ 
  position = [5, 0, -5] as [number, number, number],
  scale = 1 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const strand1Ref = useRef<THREE.Group>(null);
  const strand2Ref = useRef<THREE.Group>(null);
  
  const helixData = useMemo(() => {
    const segments = 30;
    const height = 8;
    const radius = 0.8;
    
    const points1: [number, number, number][] = [];
    const points2: [number, number, number][] = [];
    const connectors: { y: number; angle: number }[] = [];
    
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 4;
      const y = (t - 0.5) * height;
      
      points1.push([
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ]);
      
      points2.push([
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      ]);
      
      if (i % 3 === 0) {
        connectors.push({ y, angle });
      }
    }
    
    return { points1, points2, connectors, radius };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Strand 1 - spheres */}
      <group ref={strand1Ref}>
        {helixData.points1.map((pos, i) => (
          <mesh key={`s1-${i}`} position={pos}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#00f5ff" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
      
      {/* Strand 2 - spheres */}
      <group ref={strand2Ref}>
        {helixData.points2.map((pos, i) => (
          <mesh key={`s2-${i}`} position={pos}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#bf00ff" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
      
      {/* Connectors */}
      {helixData.connectors.map((conn, i) => (
        <mesh 
          key={`conn-${i}`} 
          position={[0, conn.y, 0]}
          rotation={[0, conn.angle, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.02, 0.02, helixData.radius * 2, 8]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'} 
            transparent 
            opacity={0.4}
          />
        </mesh>
      ))}
      
      {/* Floating particles */}
      <HelixParticles radius={helixData.radius * 1.5} height={8} />
    </group>
  );
}

function HelixParticles({ radius, height }: { radius: number; height: number }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 50;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const angle = t * Math.PI * 4 + (Math.random() - 0.5);
      const r = radius * (0.8 + Math.random() * 0.4);
      
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (t - 0.5) * height + (Math.random() - 0.5);
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    
    return pos;
  }, [radius, height]);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const t = state.clock.elapsedTime;
      
      for (let i = 0; i < 50; i++) {
        positions[i * 3 + 1] += Math.sin(t * 2 + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={0.05}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default { FloatingShapes, DNAHelix };
