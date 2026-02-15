import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface MagneticCursorProps {
  strength?: number;
  radius?: number;
}

export function MagneticCursor({ strength = 0.3, radius = 3 }: MagneticCursorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const { viewport, pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    // Convert pointer to world coordinates
    targetPosition.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    // Spring physics - smooth interpolation
    currentPosition.current.lerp(targetPosition.current, strength);
    meshRef.current.position.copy(currentPosition.current);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial 
        color="#00f5ff" 
        transparent 
        opacity={0.4}
      />
    </mesh>
  );
}

export function TrailEffect({ count = 10 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();
  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  const velocities = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = 0;
      positions.current[i * 3 + 1] = 0;
      positions.current[i * 3 + 2] = 0;
      velocities.current[i * 3] = 0;
      velocities.current[i * 3 + 1] = 0;
      velocities.current[i * 3 + 2] = 0;
    }
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;

    // Move particles toward cursor with delay (trail effect)
    for (let i = 0; i < count; i++) {
      const delay = i * 0.1;
      const target = {
        x: targetX * (1 - delay * 0.1),
        y: targetY * (1 - delay * 0.1),
        z: 0
      };

      pos[i * 3] += (target.x - pos[i * 3]) * 0.15;
      pos[i * 3 + 1] += (target.y - pos[i * 3 + 1]) * 0.15;
      pos[i * 3 + 2] += (target.z - pos[i * 3 + 2]) * 0.15;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00f5ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function ParticleSwarm({ count = 2000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();

  const particles = useRef({
    positions: new Float32Array(count * 3),
    velocities: new Float32Array(count * 3),
    originalPositions: new Float32Array(count * 3),
  });

  useEffect(() => {
    const { positions, originalPositions } = particles.current;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      originalPositions[i * 3] = positions[i * 3];
      originalPositions[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions[i * 3 + 2] = positions[i * 3 + 2];
    }
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const { positions, velocities, originalPositions } = particles.current;
    const time = state.clock.elapsedTime;
    const targetX = (pointer.x * viewport.width) / 4;
    const targetY = (pointer.y * viewport.height) / 4;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Original position with wave motion
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // Mouse attraction
      const dx = targetX - positions[i3];
      const dy = targetY - positions[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Varies distance based on index for swarm effect
      const attractStrength = Math.max(0, 1 - dist / 8) * 0.02;
      
      velocities[i3] += dx * attractStrength;
      velocities[i3 + 1] += dy * attractStrength;
      velocities[i3 + 2] += (oz - positions[i3 + 2]) * 0.01;

      // Damping
      velocities[i3] *= 0.95;
      velocities[i3 + 1] *= 0.95;
      velocities[i3 + 2] *= 0.95;

      // Update positions with wave
      positions[i3] = ox + Math.sin(time + i * 0.01) * 0.5 + velocities[i3];
      positions[i3 + 1] = oy + Math.cos(time + i * 0.01) * 0.5 + velocities[i3 + 1];
      positions[i3 + 2] = oz + velocities[i3 + 2];
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.current.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#bf00ff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default { MagneticCursor, TrailEffect, ParticleSwarm };
