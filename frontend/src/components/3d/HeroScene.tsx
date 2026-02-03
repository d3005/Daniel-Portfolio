import { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// ============================================
// OPTIMIZED PARTICLE FIELD (Reduced count)
// ============================================
function OptimizedParticles({ count = 800 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = -5 - Math.random() * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// SIMPLE MOUSE ORB (Lightweight)
// ============================================
function SimpleMouseOrb() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    const { pointer } = state;
    targetPos.current.set(
      pointer.x * viewport.width * 0.4,
      pointer.y * viewport.height * 0.4,
      2
    );
    currentPos.current.lerp(targetPos.current, 0.08);
    
    if (meshRef.current) {
      meshRef.current.position.copy(currentPos.current);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial 
        color="#00f5ff"
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// ============================================
// OPTIMIZED WIREFRAME GLOBE
// ============================================
function SimpleGlobe({ position = [4, 0.5, -3] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 24, 24]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.15} />
      </mesh>
      
      {/* Inner sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial color="#bf00ff" wireframe transparent opacity={0.1} />
      </mesh>
      
      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      
      {/* Single equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 8, 48]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ============================================
// SIMPLE PULSE RINGS
// ============================================
function SimplePulse({ position = [4, 0.5, -3] as [number, number, number] }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      const scale1 = 0.5 + ((t * 0.3) % 1) * 4;
      ring1Ref.current.scale.setScalar(scale1);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - ((t * 0.3) % 1));
    }
    
    if (ring2Ref.current) {
      const scale2 = 0.5 + (((t * 0.3) + 0.5) % 1) * 4;
      ring2Ref.current.scale.setScalar(scale2);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - (((t * 0.3) + 0.5) % 1));
    }
  });

  return (
    <group position={position}>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ============================================
// FLOATING SHAPES (Reduced)
// ============================================
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x = t * 0.3 + i;
        child.rotation.y = t * 0.4 + i;
        child.position.y += Math.sin(t * 0.5 + i * 2) * 0.003;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-6, 3, -6]}>
        <octahedronGeometry args={[0.4]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh position={[6, -2, -8]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color="#bf00ff" wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ============================================
// MAIN OPTIMIZED SCENE
// ============================================
function OptimizedHeroScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#00f5ff" />
      
      {/* Reduced particle count */}
      <OptimizedParticles count={600} />
      
      {/* Simple mouse follower */}
      <SimpleMouseOrb />
      
      {/* Simplified globe */}
      <SimpleGlobe />
      
      {/* Just 2 pulse rings instead of 5 */}
      <SimplePulse />
      
      {/* Only 2 floating shapes */}
      <FloatingShapes />
    </>
  );
}

export default function HeroScene() {
  const [shouldRender, setShouldRender] = useState(true);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);
  
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShouldRender(false);
      return;
    }
    
    // Check for low-end devices
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isLowEnd || isMobile) {
      setDpr([1, 1]);
    }
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={dpr}
        gl={{ 
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: 'default',
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: true
        }}
        frameloop="demand" // Only render when needed
        performance={{ min: 0.5 }} // Allow frame drops
      >
        <Suspense fallback={null}>
          <OptimizedHeroScene />
          {/* Auto-render loop */}
          <AutoRender />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Forces continuous render for animations
function AutoRender() {
  useFrame(() => {
    // This empty hook forces the canvas to render each frame
  });
  return null;
}
