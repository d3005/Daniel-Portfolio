import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';
import { usePerformanceConfig } from '../../../hooks/usePerformance';

// ============================================
// DNA HELIX - Growth & Knowledge Structure
// ============================================
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const strand1Ref = useRef<THREE.Points>(null);
  const strand2Ref = useRef<THREE.Points>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);
  
  const { strand1Positions, strand2Positions, connectionLines, basePositions } = useMemo(() => {
    const segments = 50;
    const helixHeight = 20;
    const radius = 1.8;
    
    const strand1 = new Float32Array(segments * 3);
    const strand2 = new Float32Array(segments * 3);
    const connections: number[] = [];
    const bases: { s1: THREE.Vector3; s2: THREE.Vector3 }[] = [];
    
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const y = (t - 0.5) * helixHeight;
      const angle = t * Math.PI * 8; // More rotations
      
      // Strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      strand1[i * 3] = x1;
      strand1[i * 3 + 1] = y;
      strand1[i * 3 + 2] = z1;
      
      // Strand 2 (opposite)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      strand2[i * 3] = x2;
      strand2[i * 3 + 1] = y;
      strand2[i * 3 + 2] = z2;
      
      bases.push({
        s1: new THREE.Vector3(x1, y, z1),
        s2: new THREE.Vector3(x2, y, z2)
      });
      
      // Connection rungs (every 4th segment)
      if (i % 4 === 0) {
        connections.push(x1, y, z1, x2, y, z2);
      }
    }
    
    return { 
      strand1Positions: strand1, 
      strand2Positions: strand2, 
      connectionLines: new Float32Array(connections),
      basePositions: bases
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.3;
    }
    
    // Animate strand positions
    if (strand1Ref.current && strand2Ref.current) {
      const pos1 = strand1Ref.current.geometry.attributes.position.array as Float32Array;
      const pos2 = strand2Ref.current.geometry.attributes.position.array as Float32Array;
      const segments = pos1.length / 3;
      
      for (let i = 0; i < segments; i++) {
        const base = basePositions[i];
        const wave = Math.sin(t * 0.8 + i * 0.15) * 0.15;
        
        pos1[i * 3] = base.s1.x + wave;
        pos1[i * 3 + 2] = base.s1.z + wave * 0.5;
        
        pos2[i * 3] = base.s2.x - wave;
        pos2[i * 3 + 2] = base.s2.z - wave * 0.5;
      }
      
      strand1Ref.current.geometry.attributes.position.needsUpdate = true;
      strand2Ref.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (connectionsRef.current) {
      const material = connectionsRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.25 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[-7, 0, -6]}>
      {/* Strand 1 - Cyan */}
      <points ref={strand1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand1Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          color="#00f5ff" 
          size={0.2} 
          transparent 
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      
      {/* Strand 2 - Purple */}
      <points ref={strand2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand2Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          color="#bf00ff" 
          size={0.2} 
          transparent 
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      
      {/* Connection rungs */}
      <lineSegments ref={connectionsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connectionLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#5b6cf2" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// ============================================
// FLOATING KNOWLEDGE ORBS
// ============================================
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => [
    { position: [6, 3, -4], size: 0.6, color: '#ffd700', speed: 0.4, phase: 0 },
    { position: [8, -2, -5], size: 0.5, color: '#00f5ff', speed: 0.35, phase: Math.PI / 2 },
    { position: [5, -4, -3], size: 0.45, color: '#bf00ff', speed: 0.45, phase: Math.PI },
    { position: [7, 5, -6], size: 0.55, color: '#ffd700', speed: 0.38, phase: Math.PI * 1.5 },
    { position: [9, 0, -4], size: 0.4, color: '#00f5ff', speed: 0.42, phase: Math.PI / 4 },
    { position: [4, 1, -5], size: 0.5, color: '#bf00ff', speed: 0.36, phase: Math.PI * 0.75 },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((group, i) => {
        const orb = orbs[i];
        
        // Floating motion
        group.position.y = orb.position[1] + Math.sin(t * orb.speed + orb.phase) * 1.2;
        group.position.x = orb.position[0] + Math.cos(t * orb.speed * 0.7 + orb.phase) * 0.5;
        
        // Inner orb rotation
        const innerMesh = group.children[0] as THREE.Mesh;
        const outerMesh = group.children[1] as THREE.Mesh;
        
        innerMesh.rotation.x = t * 0.5;
        innerMesh.rotation.y = t * 0.7;
        
        outerMesh.rotation.x = -t * 0.3;
        outerMesh.rotation.y = -t * 0.4;
        
        // Pulsing scale
        const pulse = 1 + Math.sin(t * 2 + orb.phase) * 0.15;
        innerMesh.scale.setScalar(pulse);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <group key={i} position={orb.position as [number, number, number]}>
          {/* Inner solid orb */}
          <mesh>
            <sphereGeometry args={[orb.size, 32, 32]} />
            <meshBasicMaterial 
              color={orb.color} 
              transparent 
              opacity={0.4}
            />
          </mesh>
          {/* Outer wireframe shell */}
          <mesh>
            <sphereGeometry args={[orb.size * 1.4, 16, 16]} />
            <meshBasicMaterial 
              color={orb.color} 
              wireframe 
              transparent 
              opacity={0.3}
            />
          </mesh>
          {/* Glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[orb.size * 1.6, 0.02, 8, 32]} />
            <meshBasicMaterial 
              color={orb.color} 
              transparent 
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// SPARKLE CONSTELLATION - Enhanced Stars
// ============================================
function SparkleConstellation({ count = 120 }) {
  const ref = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const color1 = new THREE.Color('#ffd700'); // Gold
    const color2 = new THREE.Color('#00f5ff'); // Cyan
    const color3 = new THREE.Color('#ffffff'); // White
    
    for (let i = 0; i < count; i++) {
      // Spread across the scene
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -8 - Math.random() * 18;
      
      // Color distribution - more gold for education theme
      const colorChoice = Math.random();
      const color = colorChoice < 0.45 ? color1 : colorChoice < 0.75 ? color2 : color3;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.PointsMaterial;
      const t = state.clock.elapsedTime;
      
      // Twinkling effect
      material.opacity = 0.5 + Math.sin(t * 1.5) * 0.2;
      material.size = 0.1 + Math.sin(t * 2) * 0.02;
      
      // Slow rotation
      ref.current.rotation.y = t * 0.015;
      ref.current.rotation.x = Math.sin(t * 0.08) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// CONSTELLATION LINES - Knowledge Connections
// ============================================
function ConstellationLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const linePositions = useMemo(() => {
    const lines: number[] = [];
    
    // Create constellation patterns representing academic symbols
    const patterns = [
      // Graduation cap shape
      [[-5, 5, -12], [-3, 6, -12], [0, 5.5, -12], [3, 6, -12], [5, 5, -12]],
      // Book shape
      [[-8, -2, -14], [-6, 0, -14], [-4, -2, -14], [-6, -4, -14], [-8, -2, -14]],
      // Star shape
      [[8, 2, -13], [9, 4, -13], [11, 4, -13], [9.5, 5.5, -13], [10, 7, -13], [8, 6, -13], [6, 7, -13], [6.5, 5.5, -13], [5, 4, -13], [7, 4, -13], [8, 2, -13]],
      // Arrow (progress)
      [[-2, -5, -15], [0, -3, -15], [2, -5, -15], [0, -3, -15], [0, -7, -15]],
    ];
    
    patterns.forEach(pattern => {
      for (let i = 0; i < pattern.length - 1; i++) {
        lines.push(...pattern[i], ...pattern[i + 1]);
      }
    });
    
    return new Float32Array(lines);
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#ffd700" transparent opacity={0.2} />
    </lineSegments>
  );
}

// ============================================
// ACHIEVEMENT PARTICLES - Rising Stars
// ============================================
function AchievementParticles({ count = 40 }) {
  const ref = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>(new Float32Array(count));
  const phases = useRef<Float32Array>(new Float32Array(count));
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const pha = new Float32Array(count);
    
    const color1 = new THREE.Color('#ffd700');
    const color2 = new THREE.Color('#00f5ff');
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = -12 + Math.random() * 24;
      pos[i * 3 + 2] = -5 - Math.random() * 12;
      
      vel[i] = 0.015 + Math.random() * 0.025;
      pha[i] = Math.random() * Math.PI * 2;
      
      const color = Math.random() > 0.4 ? color1 : color2;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    velocities.current = vel;
    phases.current = pha;
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (ref.current && velocities.current && phases.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      const t = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        // Rise up
        pos[i * 3 + 1] += velocities.current[i];
        
        // Gentle horizontal sway
        pos[i * 3] += Math.sin(t + phases.current[i]) * 0.01;
        
        // Reset when reaching top
        if (pos[i * 3 + 1] > 12) {
          pos[i * 3 + 1] = -12;
          pos[i * 3] = (Math.random() - 0.5) * 30;
        }
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
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
        opacity={0.6}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
}

// ============================================
// ACADEMIC FLOATING SHAPES
// ============================================
function AcademicShapes() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(() => [
    { position: [10, 4, -5], type: 'graduation', size: 0.6, color: '#ffd700' },
    { position: [-10, -3, -6], type: 'book', size: 0.5, color: '#00f5ff' },
    { position: [8, -5, -4], type: 'star', size: 0.45, color: '#ffd700' },
    { position: [-8, 5, -5], type: 'atom', size: 0.5, color: '#bf00ff' },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const data = shapes[i];
        child.rotation.x = t * 0.3 + i;
        child.rotation.y = t * 0.4 + i * 0.5;
        child.position.y = data.position[1] + Math.sin(t * 0.5 + i * 2) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <group key={i} position={shape.position as [number, number, number]}>
          {/* Main shape */}
          <mesh>
            {shape.type === 'graduation' && <coneGeometry args={[shape.size, shape.size * 0.4, 4]} />}
            {shape.type === 'book' && <boxGeometry args={[shape.size * 1.2, shape.size * 0.2, shape.size]} />}
            {shape.type === 'star' && <octahedronGeometry args={[shape.size]} />}
            {shape.type === 'atom' && <icosahedronGeometry args={[shape.size, 0]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.6} />
          </mesh>
          {/* Outer glow */}
          <mesh>
            {shape.type === 'graduation' && <coneGeometry args={[shape.size * 1.3, shape.size * 0.5, 4]} />}
            {shape.type === 'book' && <boxGeometry args={[shape.size * 1.5, shape.size * 0.3, shape.size * 1.3]} />}
            {shape.type === 'star' && <octahedronGeometry args={[shape.size * 1.3]} />}
            {shape.type === 'atom' && <icosahedronGeometry args={[shape.size * 1.3, 0]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// ORBITAL RINGS - Knowledge Cycles
// ============================================
function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((ring, i) => {
        ring.rotation.z = t * (0.15 + i * 0.05) * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 3 + i * 0.3, i * 0.2, 0]}>
          <torusGeometry args={[6 + i * 1.5, 0.02, 8, 64]} />
          <meshBasicMaterial 
            color={i === 0 ? '#ffd700' : i === 1 ? '#00f5ff' : '#bf00ff'} 
            transparent 
            opacity={0.2 - i * 0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// EDUCATION SCENE CONTENT
// ============================================
function EducationSceneContent({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      
      {/* Background constellation stars - reduced on mobile */}
      <SparkleConstellation count={isMobile ? 50 : 100} />
      {!isMobile && <ConstellationLines />}
      
      {/* DNA Helix - Growth structure - skip on mobile */}
      {!isMobile && <DNAHelix />}
      
      {/* Floating knowledge orbs */}
      <FloatingOrbs />
      
      {/* Rising achievement particles - reduced on mobile */}
      <AchievementParticles count={isMobile ? 18 : 35} />
      
      {/* Academic floating shapes */}
      <AcademicShapes />
      
      {/* Orbital rings - skip on mobile */}
      {!isMobile && <OrbitalRings />}
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
export default function EducationScene() {
  const performanceConfig = usePerformanceConfig();
  
  if (!performanceConfig.shouldRender3D) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
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
          <EducationSceneContent isMobile={performanceConfig.isMobile} />
          <AutoRender />
        </Suspense>
      </Canvas>
    </div>
  );
}
