import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

// Mesmerizing Morphing Blob - Main centerpiece
export function MorphingBlob({ 
  position = [0, 0, 0] as [number, number, number],
  scale = 2.5 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.15;
    }
    
    if (materialRef.current) {
      // Animate distortion
      materialRef.current.distort = 0.4 + Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        {/* Outer glow layers */}
        <Sphere args={[scale * 1.3, 32, 32]}>
          <meshBasicMaterial 
            color="#bf00ff" 
            transparent 
            opacity={0.05}
            side={THREE.BackSide}
          />
        </Sphere>
        <Sphere args={[scale * 1.15, 32, 32]}>
          <meshBasicMaterial 
            color="#00f5ff" 
            transparent 
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>
        
        {/* Main morphing blob */}
        <Sphere ref={meshRef} args={[scale, 64, 64]}>
          <MeshDistortMaterial
            ref={materialRef}
            color="#1a1a2e"
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Inner glow core */}
        <Sphere args={[scale * 0.3, 32, 32]}>
          <meshBasicMaterial 
            color="#00f5ff" 
            transparent 
            opacity={0.6}
          />
        </Sphere>
        
        {/* Wireframe overlay */}
        <Sphere args={[scale * 1.02, 32, 32]}>
          <meshBasicMaterial 
            color="#00f5ff" 
            wireframe 
            transparent 
            opacity={0.1}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Holographic Text Effect for name/title
export function HolographicText({ 
  position = [0, 0, 0] as [number, number, number] 
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create glitch lines around text area
  const glitchLines = useMemo(() => {
    return Array(8).fill(null).map(() => ({
      width: 0.5 + Math.random() * 2,
      y: (Math.random() - 0.5) * 3,
      speed: 1 + Math.random() * 2,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((line, i) => {
        const data = glitchLines[i];
        if (data) {
          // Glitch horizontal position
          if (Math.random() > 0.95) {
            line.position.x = (Math.random() - 0.5) * 0.3;
          } else {
            line.position.x = 0;
          }
          
          // Flicker opacity
          const material = (line as THREE.Mesh).material as THREE.MeshBasicMaterial;
          material.opacity = 0.1 + Math.sin(t * data.speed + data.offset) * 0.05;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {glitchLines.map((line, i) => (
        <mesh key={i} position={[0, line.y, 0]}>
          <planeGeometry args={[line.width, 0.02]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'}
            transparent 
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Scan line effect */}
      <ScanLine />
    </group>
  );
}

function ScanLine() {
  const lineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lineRef.current) {
      const t = state.clock.elapsedTime;
      lineRef.current.position.y = ((t * 2) % 6) - 3;
      (lineRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2;
    }
  });

  return (
    <mesh ref={lineRef}>
      <planeGeometry args={[6, 0.05]} />
      <meshBasicMaterial 
        color="#00f5ff" 
        transparent 
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Particle Field / Starfield for background depth
export function StarField({ count = 3000 }) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    const colorOptions = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#00f5ff'),
      new THREE.Color('#bf00ff'),
    ];
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) - 20;
      
      // Random color from palette (mostly white)
      const color = Math.random() > 0.9 
        ? colorOptions[Math.floor(Math.random() * 3)] 
        : colorOptions[0];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    
    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      ref.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.9}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default { MorphingBlob, HolographicText, StarField };
