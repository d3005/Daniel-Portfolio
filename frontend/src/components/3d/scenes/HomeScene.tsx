import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';
import { usePerformanceConfig, usePageVisibility } from '../../../hooks/usePerformance';

// ============================================
// MORPHING BLOB - Positioned on the RIGHT side
// ============================================
function MorphingBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const originalPositions = useRef<Float32Array | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.IcosahedronGeometry;
      const positions = geometry.attributes.position.array as Float32Array;
      
      if (!originalPositions.current) {
        originalPositions.current = new Float32Array(positions.length);
        originalPositions.current.set(positions);
      }
      
      for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions.current[i];
        const oy = originalPositions.current[i + 1];
        const oz = originalPositions.current[i + 2];
        
        const noise = Math.sin(ox * 2 + t * 0.8) * 
                     Math.cos(oy * 2 + t * 0.6) * 
                     Math.sin(oz * 2 + t * 0.7);
        
        const scale = 1 + noise * 0.12;
        
        positions[i] = ox * scale;
        positions[i + 1] = oy * scale;
        positions[i + 2] = oz * scale;
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    }
    
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.08;
      wireRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.08;
      const pulse = 1 + Math.sin(t * 0.5) * 0.08;
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + Math.sin(t * 0.8) * 0.02;
    }
  });

  return (
    // MOVED TO FAR RIGHT to not overlap with text
    <group position={[8, 0, -8]}>
      {/* Main blob - darker, more subtle */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[3, 4]} />
        <meshBasicMaterial 
          color="#050510"
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Wireframe overlay - more subtle */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[3.05, 4]} />
        <meshBasicMaterial 
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[3.8, 3]} />
        <meshBasicMaterial 
          color="#bf00ff"
          transparent
          opacity={0.05}
        />
      </mesh>
      
      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#00f5ff"
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

// ============================================
// PARTICLE STARFIELD - Background depth
// ============================================
function ParticleStarfield({ count = 400, isMobile = false }) {
  const ref = useRef<THREE.Points>(null);
  const isPageVisible = usePageVisibility();
  
  // Reduce count for mobile
  const actualCount = isMobile ? Math.floor(count * 0.3) : count;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const col = new Float32Array(actualCount * 3);
    
    const color1 = new THREE.Color('#00f5ff');
    const color2 = new THREE.Color('#bf00ff');
    const color3 = new THREE.Color('#ffffff');
    
    for (let i = 0; i < actualCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 20 + Math.random() * 40;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) - 25;
      
      const colorChoice = Math.random();
      const color = colorChoice < 0.4 ? color1 : colorChoice < 0.7 ? color2 : color3;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return { positions: pos, colors: col };
  }, [actualCount]);

  useFrame((state) => {
    if (ref.current && isPageVisible) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06}
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
// ORBITAL RINGS - Around blob on RIGHT
// ============================================
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.25;
      ring1Ref.current.rotation.x = Math.PI / 3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.2;
      ring2Ref.current.rotation.y = Math.PI / 4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.15;
      ring3Ref.current.rotation.x = -Math.PI / 5;
    }
  });

  return (
    <group position={[8, 0, -8]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[4.2, 0.02, 8, 64]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.8, 0.015, 8, 64]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[5.4, 0.01, 8, 64]} />
        <meshBasicMaterial color="#5b6cf2" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ============================================
// FLOATING PARTICLES - Around blob
// ============================================
function FloatingParticles({ count = 25, isMobile = false }) {
  const ref = useRef<THREE.Points>(null);
  const isPageVisible = usePageVisibility();
  
  // Reduce count for mobile
  const actualCount = isMobile ? Math.floor(count * 0.4) : count;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    
    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 3;
      
      pos[i * 3] = 8 + Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = -8 + Math.sin(angle) * radius;
    }
    
    return pos;
  }, [actualCount]);

  useFrame((state) => {
    if (ref.current && isPageVisible) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      const t = state.clock.elapsedTime;
      
      for (let i = 0; i < actualCount; i++) {
        const angle = t * 0.15 + (i / actualCount) * Math.PI * 2;
        const radius = 5 + Math.sin(t * 0.4 + i) * 0.5;
        
        pos[i * 3] = 8 + Math.cos(angle) * radius + Math.sin(t + i) * 0.2;
        pos[i * 3 + 1] = Math.sin(t * 0.25 + i * 0.5) * 4;
        pos[i * 3 + 2] = -8 + Math.sin(angle) * radius * 0.4;
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
        size={0.1} 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================
// MOUSE INTERACTIVE GLOW - Subtle cursor follower
// ============================================
function MouseGlow() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const { pointer } = state;
    targetPos.current.set(
      pointer.x * viewport.width * 0.25,
      pointer.y * viewport.height * 0.25,
      2
    );
    currentPos.current.lerp(targetPos.current, 0.04);
    
    if (meshRef.current) {
      meshRef.current.position.copy(currentPos.current);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial 
        color="#00f5ff"
        transparent
        opacity={0.1}
      />
    </mesh>
  );
}

// ============================================
// FLOATING GEOMETRIC SHAPES - Decorative
// ============================================
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x = t * 0.2 + i;
        child.rotation.y = t * 0.3 + i * 0.5;
        child.position.y = Math.sin(t * 0.3 + i * 2) * 0.3 + (i % 2 === 0 ? 4 : -4);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Top left */}
      <mesh position={[-10, 4, -12]}>
        <octahedronGeometry args={[0.4]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.3} />
      </mesh>
      {/* Bottom left */}
      <mesh position={[-8, -4, -10]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color="#bf00ff" wireframe transparent opacity={0.3} />
      </mesh>
      {/* Top far */}
      <mesh position={[0, 6, -15]}>
        <tetrahedronGeometry args={[0.3]} />
        <meshBasicMaterial color="#5b6cf2" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Bottom far */}
      <mesh position={[-5, -5, -14]}>
        <dodecahedronGeometry args={[0.25]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// ============================================
// HOME SCENE CONTENT
// ============================================
function HomeSceneContent({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      
      {/* Background starfield */}
      <ParticleStarfield count={350} isMobile={isMobile} />
      
      {/* Main morphing blob - positioned far right */}
      <MorphingBlob />
      
      {/* Orbital rings around blob */}
      <OrbitalRings />
      
      {/* Floating particles near blob */}
      <FloatingParticles count={20} isMobile={isMobile} />
      
      {/* Decorative floating shapes - skip on mobile */}
      {!isMobile && <FloatingShapes />}
      
      {/* Mouse interactive glow - skip on mobile */}
      {!isMobile && <MouseGlow />}
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
export default function HomeScene() {
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
          depth: true,
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <HomeSceneContent isMobile={performanceConfig.isMobile} />
          <AutoRender />
        </Suspense>
      </Canvas>
    </div>
  );
}
