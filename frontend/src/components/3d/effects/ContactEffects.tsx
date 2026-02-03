import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Energy Ribbons - Flowing around contact form
export function EnergyRibbons({ 
  position = [0, 0, -5] as [number, number, number],
  count = 5 
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  const ribbons = useMemo(() => {
    return Array(count).fill(null).map((_, i) => ({
      points: generateRibbonPoints(i),
      color: i % 2 === 0 ? '#00f5ff' : '#bf00ff',
      speed: 0.3 + Math.random() * 0.3,
      offset: (i / count) * Math.PI * 2
    }));
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((ribbon, i) => {
        const data = ribbons[i];
        ribbon.rotation.y = t * data.speed + data.offset;
        ribbon.rotation.z = Math.sin(t * 0.5 + data.offset) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {ribbons.map((ribbon, i) => (
        <RibbonMesh key={i} points={ribbon.points} color={ribbon.color} />
      ))}
    </group>
  );
}

function generateRibbonPoints(index: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const segments = 50;
  const radius = 3 + index * 0.5;
  const height = 4;
  
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 3 + index * 0.5;
    const y = (t - 0.5) * height;
    const r = radius * (1 + Math.sin(t * Math.PI * 4) * 0.2);
    
    points.push(new THREE.Vector3(
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r
    ));
  }
  
  return points;
}

function RibbonMesh({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);
  
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
  }, [color]);

  return <primitive object={new THREE.Line(geometry, material)} />;
}

// Pulse Wave - for submit button effect
export function PulseWave({ 
  position = [0, 0, 0] as [number, number, number],
  active = false 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const waveCount = 3;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((wave, i) => {
        const offset = i / waveCount;
        const scale = ((t * 0.8 + offset) % 1) * 3;
        const opacity = active ? 0.4 * (1 - scale / 3) : 0.1 * (1 - scale / 3);
        
        wave.scale.setScalar(scale);
        (wave as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#00f5ff' : '#bf00ff',
          transparent: true,
          opacity,
          side: THREE.DoubleSide
        });
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array(waveCount).fill(null).map((_, i) => (
        <mesh key={i}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial 
            color="#00f5ff"
            transparent 
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating particles around contact area
export function ContactParticles({ 
  position = [0, 0, -3] as [number, number, number] 
}) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, velocities] = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < 100; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Boundary check and reverse
        if (Math.abs(positions[i * 3]) > 5) velocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 4) velocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 2) velocities[i * 3 + 2] *= -1;
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={0.05}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default { EnergyRibbons, PulseWave, ContactParticles };
