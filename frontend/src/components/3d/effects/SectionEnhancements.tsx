import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// SKILLS SECTION - Neural Network Visualization
// ============================================

// Floating Tech Orbs - Representing different skills
function TechOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => {
    const colors = ['#00f5ff', '#bf00ff', '#5b6cf2', '#ff6b35', '#00ff88'];
    return Array(12).fill(null).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2
      ] as [number, number, number],
      size: 0.1 + Math.random() * 0.15,
      color: colors[i % colors.length],
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((orb, i) => {
        const data = orbs[i];
        orb.position.y = data.position[1] + Math.sin(t * data.speed + data.phase) * 0.5;
        orb.position.x = data.position[0] + Math.cos(t * data.speed * 0.5 + data.phase) * 0.3;
        orb.rotation.x = t * 0.5;
        orb.rotation.y = t * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <group key={i} position={orb.position}>
          {/* Outer glow */}
          <mesh scale={2.5}>
            <sphereGeometry args={[orb.size, 8, 8]} />
            <meshBasicMaterial 
              color={orb.color}
              transparent 
              opacity={0.1}
              side={THREE.BackSide}
            />
          </mesh>
          {/* Core */}
          <mesh>
            <icosahedronGeometry args={[orb.size, 1]} />
            <meshBasicMaterial 
              color={orb.color}
              wireframe
              transparent 
              opacity={0.6}
            />
          </mesh>
          {/* Inner bright */}
          <mesh scale={0.4}>
            <sphereGeometry args={[orb.size, 8, 8]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent 
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Neural Network Connections
function NeuralConnections() {
  const ref = useRef<THREE.Group>(null);
  
  const connections = useMemo(() => {
    const conns: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    const nodeCount = 8;
    const nodes: THREE.Vector3[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3 - 3
      ));
    }
    
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 5) {
          conns.push({
            start: nodes[i],
            end: nodes[j],
            color: Math.random() > 0.5 ? '#00f5ff' : '#bf00ff'
          });
        }
      }
    }
    
    return conns;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.children.forEach((line, i) => {
        const material = (line as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.1 + Math.sin(t * 2 + i * 0.5) * 0.1;
      });
    }
  });

  return (
    <group ref={ref}>
      {connections.map((conn, i) => (
        <ConnectionLine key={i} start={conn.start} end={conn.end} color={conn.color} />
      ))}
    </group>
  );
}

function ConnectionLine({ start, end, color }: { start: THREE.Vector3; end: THREE.Vector3; color: string }) {
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([start, end]);
  }, [start, end]);
  
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
  }, [color]);

  return <primitive object={new THREE.Line(geometry, material)} />;
}

// Data Stream Particles
function DataStreamParticles({ count = 100 }) {
  const ref = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -5 - Math.random() * 5;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -0.02 - Math.random() * 0.03;
      velocities[i * 3 + 2] = 0;
    }
    
    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] += particleData.velocities[i * 3];
        positions[i * 3 + 1] += particleData.velocities[i * 3 + 1];
        
        // Reset when out of bounds
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 5;
          positions[i * 3] = (Math.random() - 0.5) * 15;
        }
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={0.03}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Skills Section 3D Scene
function SkillsScene() {
  return (
    <>
      <TechOrbs />
      <NeuralConnections />
      <DataStreamParticles count={150} />
    </>
  );
}

// ============================================
// PROJECTS SECTION - Holographic Display
// ============================================

// Rotating Holographic Cube
function HolographicCube() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.5;
      innerRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[4, 0, -3]}>
      {/* Outer wireframe cube */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial 
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Inner rotating cube */}
      <mesh ref={innerRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial 
          color="#bf00ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Corner lights */}
      {[[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], 
        [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.05, 8, 8]} />
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

// Floating Code Brackets
function CodeBrackets() {
  const groupRef = useRef<THREE.Group>(null);
  
  const brackets = useMemo(() => [
    { position: [-4, 2, -4], rotation: [0, 0.3, 0], scale: 0.8 },
    { position: [5, -2, -5], rotation: [0, -0.2, 0], scale: 0.6 },
    { position: [-3, -3, -3], rotation: [0, 0.5, 0], scale: 0.5 },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((bracket, i) => {
        const data = brackets[i];
        bracket.position.y = data.position[1] + Math.sin(t * 0.5 + i * 2) * 0.3;
        bracket.rotation.y = data.rotation[1] + t * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {brackets.map((bracket, i) => (
        <group 
          key={i} 
          position={bracket.position as [number, number, number]}
          scale={bracket.scale}
        >
          {/* Left bracket < */}
          <mesh position={[-0.5, 0, 0]}>
            <torusGeometry args={[0.5, 0.02, 8, 16, Math.PI / 2]} />
            <meshBasicMaterial 
              color="#00f5ff"
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Right bracket > */}
          <mesh position={[0.5, 0, 0]} rotation={[0, Math.PI, 0]}>
            <torusGeometry args={[0.5, 0.02, 8, 16, Math.PI / 2]} />
            <meshBasicMaterial 
              color="#bf00ff"
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Binary Rain Effect
function BinaryRain({ count = 50 }) {
  const ref = useRef<THREE.Points>(null);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 8 - 4;
      positions[i * 3 + 2] = -3 - Math.random() * 5;
      speeds[i] = 0.02 + Math.random() * 0.04;
    }
    
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= data.speeds[i];
        
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 5;
          positions[i * 3] = (Math.random() - 0.5) * 12;
        }
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff88"
        size={0.04}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Scanning Lines
function ScanningLines() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.children.forEach((line, i) => {
        const progress = ((t * 0.3 + i * 0.3) % 1);
        line.position.y = 4 - progress * 8;
        (line as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: '#00f5ff',
          transparent: true,
          opacity: 0.1 * (1 - Math.abs(progress - 0.5) * 2),
          side: THREE.DoubleSide
        });
      });
    }
  });

  return (
    <group ref={ref}>
      {Array(3).fill(null).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -4]}>
          <planeGeometry args={[15, 0.02]} />
          <meshBasicMaterial 
            color="#00f5ff"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Projects Section 3D Scene
function ProjectsScene() {
  return (
    <>
      <HolographicCube />
      <CodeBrackets />
      <BinaryRain count={80} />
      <ScanningLines />
    </>
  );
}

// ============================================
// CONTACT SECTION - Communication Waves
// ============================================

// Pulsing Communication Rings
function CommunicationRings() {
  const ref = useRef<THREE.Group>(null);
  const ringCount = 5;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.children.forEach((ring, i) => {
        const progress = ((t * 0.5 + i * 0.2) % 1);
        const scale = 1 + progress * 3;
        const opacity = 0.3 * (1 - progress);
        
        ring.scale.setScalar(scale);
        (ring as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#00f5ff' : '#bf00ff',
          transparent: true,
          opacity,
          side: THREE.DoubleSide
        });
      });
    }
  });

  return (
    <group ref={ref} position={[-3, 0, -3]}>
      {Array(ringCount).fill(null).map((_, i) => (
        <mesh key={i} rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[0.8, 0.85, 64]} />
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

// Floating Message Icons (Envelope shapes)
function FloatingEnvelopes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const envelopes = useMemo(() => 
    Array(5).fill(null).map(() => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        -2 - Math.random() * 3
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      size: 0.15 + Math.random() * 0.1
    })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((envelope, i) => {
        const data = envelopes[i];
        envelope.position.y = data.position[1] + Math.sin(t * data.speed + data.phase) * 0.4;
        envelope.position.x = data.position[0] + Math.cos(t * data.speed * 0.5 + data.phase) * 0.2;
        envelope.rotation.y = Math.sin(t * 0.5 + data.phase) * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {envelopes.map((env, i) => (
        <group key={i} position={env.position}>
          {/* Envelope body */}
          <mesh>
            <boxGeometry args={[env.size * 2, env.size * 1.4, env.size * 0.1]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'}
              wireframe
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Envelope flap */}
          <mesh position={[0, env.size * 0.7, env.size * 0.05]} rotation={[Math.PI / 4, 0, 0]}>
            <planeGeometry args={[env.size * 2, env.size * 1]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'}
              wireframe
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Signal Wave Lines
function SignalWaves() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((wave, i) => {
        const material = (wave as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.2 + Math.sin(t * 2 + i) * 0.1;
      });
    }
  });

  const waves = useMemo(() => {
    return Array(4).fill(null).map((_, waveIndex) => {
      const points: THREE.Vector3[] = [];
      const segments = 50;
      
      for (let i = 0; i < segments; i++) {
        const x = (i / segments) * 10 - 5;
        const y = Math.sin(i * 0.3 + waveIndex) * 0.5 + (waveIndex - 1.5) * 1.5;
        points.push(new THREE.Vector3(x, y, -4));
      }
      
      return {
        points,
        color: waveIndex % 2 === 0 ? '#00f5ff' : '#bf00ff'
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {waves.map((wave, i) => (
        <WaveLine key={i} points={wave.points} color={wave.color} />
      ))}
    </group>
  );
}

function WaveLine({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const ref = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);
  
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
  }, [color]);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const t = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] = points[i].y + Math.sin(t * 3 + i * 0.2) * 0.2;
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return <primitive ref={ref} object={new THREE.Line(geometry, material)} />;
}

// Connecting Dots Animation
function ConnectingDots({ count = 30 }) {
  const ref = useRef<THREE.Points>(null);
  
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = -3 - Math.random() * 3;
    }
    
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(t * 2 + i * 0.5) * 0.002;
        positions[i * 3] += Math.cos(t + i * 0.3) * 0.001;
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.04}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Contact Section 3D Scene
function ContactScene() {
  return (
    <>
      <CommunicationRings />
      <FloatingEnvelopes />
      <SignalWaves />
      <ConnectingDots count={40} />
    </>
  );
}

// ============================================
// EXPORTED CANVAS COMPONENTS
// ============================================

export function SkillsCanvas() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false
        }}
      >
        <Suspense fallback={null}>
          <SkillsScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function ProjectsCanvas() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false
        }}
      >
        <Suspense fallback={null}>
          <ProjectsScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function ContactCanvas() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false
        }}
      >
        <Suspense fallback={null}>
          <ContactScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default { SkillsCanvas, ProjectsCanvas, ContactCanvas };
