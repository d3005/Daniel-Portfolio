import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// LIGHTWEIGHT STAR FIELD
// ============================================
function LightStarField({ count = 500 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = -10 - Math.random() * 40;
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
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// SIMPLE AMBIENT ORBS (just 3)
// ============================================
function AmbientOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((orb, i) => {
        orb.position.y = Math.sin(t * 0.3 + i * 2) * 2;
        orb.position.x = Math.cos(t * 0.2 + i * 2) * 0.5 + (i - 1) * 8;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[
        { color: '#00f5ff', pos: [-8, 0, -15] },
        { color: '#bf00ff', pos: [0, 0, -20] },
        { color: '#5b6cf2', pos: [8, 0, -15] },
      ].map((orb, i) => (
        <mesh key={i} position={orb.pos as [number, number, number]}>
          <sphereGeometry args={[1.5, 8, 8]} />
          <meshBasicMaterial 
            color={orb.color} 
            transparent 
            opacity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// MINIMAL BACKGROUND SCENE
// ============================================
function MinimalBackgroundScene() {
  return (
    <>
      <LightStarField count={400} />
      <AmbientOrbs />
    </>
  );
}

export default function AnimatedBackground() {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Check for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShouldRender(false);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 -z-10">
      {/* CSS gradient fallback - always visible */}
      <div className="absolute inset-0 bg-[#050509]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a15] via-[#050509] to-[#0a0510]" />
        
        {/* Static glow spots */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00f5ff]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#bf00ff]/5 rounded-full blur-[150px]" />
      </div>
      
      {/* Cyber grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      {/* 3D Canvas - only if should render */}
      {shouldRender && (
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          dpr={1}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: 'default',
            stencil: false
          }}
        >
          <Suspense fallback={null}>
            <MinimalBackgroundScene />
          </Suspense>
        </Canvas>
      )}
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />
    </div>
  );
}
