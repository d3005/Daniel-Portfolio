import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function MagneticCursor({ strength = 0.3 }: { strength?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const { viewport, pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    targetPosition.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

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

export function TrailEffect({ count = 10 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const delay = i * 0.1;
      const targetXAdjusted = targetX * (1 - delay * 0.1);
      const targetYAdjusted = targetY * (1 - delay * 0.1);

      pos[i * 3] += (targetXAdjusted - pos[i * 3]) * 0.15;
      pos[i * 3 + 1] += (targetYAdjusted - pos[i * 3 + 1]) * 0.15;
      pos[i * 3 + 2] += (0 - pos[i * 3 + 2]) * 0.15;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
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

export function ParticleSwarm({ count = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      originalPositions[i * 3] = positions[i * 3];
      originalPositions[i * 3 + 1] = positions[i * 3 + 1];
      originalPositions[i * 3 + 2] = positions[i * 3 + 2];
    }

    return { positions, velocities, originalPositions };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const { velocities, originalPositions } = particles;
    const time = state.clock.elapsedTime;
    const targetX = (pointer.x * viewport.width) / 4;
    const targetY = (pointer.y * viewport.height) / 4;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      const dx = targetX - pos[i3];
      const dy = targetY - pos[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      const attractStrength = Math.max(0, 1 - dist / 8) * 0.02;
      
      velocities[i3] += dx * attractStrength;
      velocities[i3 + 1] += dy * attractStrength;
      velocities[i3 + 2] += (oz - pos[i3 + 2]) * 0.01;

      velocities[i3] *= 0.95;
      velocities[i3 + 1] *= 0.95;
      velocities[i3 + 2] *= 0.95;

      pos[i3] = ox + Math.sin(time + i * 0.01) * 0.5 + velocities[i3];
      pos[i3 + 1] = oy + Math.cos(time + i * 0.01) * 0.5 + velocities[i3 + 1];
      pos[i3 + 2] = oz + velocities[i3 + 2];
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    return geo;
  }, [particles.positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
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
