import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';
import { usePerformanceConfig } from '../../../hooks/usePerformance';

// ============================================
// DNA HELIX - Growth & Evolution Theme
// ============================================
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const spheresRef = useRef<THREE.InstancedMesh>(null);
  
  const { sphereData, connectionPairs } = useMemo(() => {
    const data: { position: THREE.Vector3; color: string; strand: number }[] = [];
    const connections: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    
    const segments = 30;
    const helixHeight = 18;
    const radius = 1.5;
    
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const y = (t - 0.5) * helixHeight;
      const angle = t * Math.PI * 6; // Multiple rotations
      
      // Strand 1
      const x1 = Math.cos(angle) * radius - 8;
      const z1 = Math.sin(angle) * radius - 8;
      data.push({ 
        position: new THREE.Vector3(x1, y, z1), 
        color: '#00f5ff',
        strand: 0 
      });
      
      // Strand 2 (opposite)
      const x2 = Math.cos(angle + Math.PI) * radius - 8;
      const z2 = Math.sin(angle + Math.PI) * radius - 8;
      data.push({ 
        position: new THREE.Vector3(x2, y, z2), 
        color: '#bf00ff',
        strand: 1 
      });
      
      // Connection rungs (every 3rd segment)
      if (i % 3 === 0) {
        connections.push({
          start: new THREE.Vector3(x1, y, z1),
          end: new THREE.Vector3(x2, y, z2)
        });
      }
    }
    
    return { sphereData: data, connectionPairs: connections };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Slow rotation around Y axis
      groupRef.current.rotation.y = t * 0.15;
      
      // Update sphere positions with wave
      if (spheresRef.current) {
        const dummy = new THREE.Object3D();
        
        sphereData.forEach((sphere, i) => {
          const waveOffset = Math.sin(t * 0.5 + i * 0.1) * 0.1;
          
          dummy.position.set(
            sphere.position.x,
            sphere.position.y + waveOffset,
            sphere.position.z
          );
          dummy.updateMatrix();
          spheresRef.current!.setMatrixAt(i, dummy.matrix);
        });
        
        spheresRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Instanced spheres for helix nodes */}
      <instancedMesh ref={spheresRef} args={[undefined, undefined, sphereData.length]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.8} />
      </instancedMesh>
      
      {/* Connection rungs */}
      {connectionPairs.map((conn, i) => {
        const points = [conn.start, conn.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive 
            key={i} 
            object={new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({ 
                color: '#5b6cf2', 
                transparent: true, 
                opacity: 0.4 
              })
            )} 
          />
        );
      })}
    </group>
  );
}

// ============================================
// PARTICLE WAVE - Flow of Time Theme
// ============================================
function ParticleWave({ count = 400 }) {
  const ref = useRef<THREE.Points>(null);
  
  const { positions, baseY } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const yBase = new Float32Array(count);
    
    const rows = 20;
    const cols = Math.floor(count / rows);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        if (i >= count) break;
        
        const x = (col / cols - 0.5) * 50;
        const z = (row / rows - 0.5) * 20 - 15;
        const y = -6;
        
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        yBase[i] = -6;
      }
    }
    
    return { positions: pos, baseY: yBase };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      const t = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        const x = pos[i * 3];
        const z = pos[i * 3 + 2];
        
        // Multiple wave layers for organic feel
        const wave1 = Math.sin(x * 0.1 + t * 0.8) * 1.5;
        const wave2 = Math.cos(z * 0.15 + t * 0.5) * 0.8;
        const wave3 = Math.sin((x + z) * 0.08 + t * 0.3) * 0.5;
        
        pos[i * 3 + 1] = baseY[i] + wave1 + wave2 + wave3;
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      // Slow drift
      ref.current.position.x = Math.sin(t * 0.1) * 0.5;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        color="#00f5ff"
        size={0.06}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// TIMELINE PARTICLES - Vertical Flow
// ============================================
function TimelineParticles({ count = 40 }) {
  const ref = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>(new Float32Array(count));
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Position along left side (timeline position)
      pos[i * 3] = -10 + Math.random() * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -5 + Math.random() * 2;
      vel[i] = 0.015 + Math.random() * 0.025;
    }
    
    velocities.current = vel;
    return pos;
  }, [count]);

  useFrame(() => {
    if (ref.current && velocities.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= velocities.current[i];
        
        // Reset when reaching bottom
        if (pos[i * 3 + 1] < -10) {
          pos[i * 3 + 1] = 10;
          pos[i * 3] = -10 + Math.random() * 2;
        }
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
        color="#bf00ff"
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================
// PROGRESS RINGS - Career Milestones
// ============================================
function ProgressRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.2;
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.3) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.15;
      ring2Ref.current.rotation.y = Math.PI / 4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.1;
      ring3Ref.current.rotation.x = -Math.PI / 5;
    }
  });

  return (
    <group position={[6, 0, -8]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.02, 8, 48]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3, 0.015, 8, 48]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.5, 0.01, 8, 48]} />
        <meshBasicMaterial color="#5b6cf2" transparent opacity={0.15} />
      </mesh>
      
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ============================================
// AMBIENT PARTICLES - Background Depth
// ============================================
function AmbientParticles({ count = 100 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = -15 - Math.random() * 15;
    }
    
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        color="#ffffff"
        size={0.04}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// EXPERIENCE SCENE CONTENT
// ============================================
function ExperienceSceneContent({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      
      {/* Background particles - reduced on mobile */}
      <AmbientParticles count={isMobile ? 40 : 80} />
      
      {/* Main wave effect - reduced on mobile */}
      <ParticleWave count={isMobile ? 150 : 300} />
      
      {/* DNA helix representing growth - skip on mobile */}
      {!isMobile && <DNAHelix />}
      
      {/* Timeline particles - reduced on mobile */}
      <TimelineParticles count={isMobile ? 15 : 30} />
      
      {/* Progress rings */}
      <ProgressRings />
    </>
  );
}

// ============================================
// AUTO RENDER HOOK
// ============================================
function AutoRender() {
  useFrame(() => {});
  return null;
}

// ============================================
// MAIN EXPORT
// ============================================
export default function ExperienceScene() {
  const performanceConfig = usePerformanceConfig();
  
  if (!performanceConfig.shouldRender3D) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={performanceConfig.dpr}
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: performanceConfig.isMobile ? 'low-power' : 'default',
          stencil: false,
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ExperienceSceneContent isMobile={performanceConfig.isMobile} />
          <AutoRender />
        </Suspense>
      </Canvas>
    </div>
  );
}
