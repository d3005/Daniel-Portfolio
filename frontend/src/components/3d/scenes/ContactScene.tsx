import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';
import { usePerformanceConfig } from '../../../hooks/usePerformance';

// ============================================
// ENERGY RIBBONS - Connection Theme
// ============================================
function EnergyRibbons() {
  const groupRef = useRef<THREE.Group>(null);
  
  const ribbonData = useMemo(() => {
    const ribbons: { points: THREE.Vector3[]; color: string }[] = [];
    const ribbonCount = 5;
    
    for (let r = 0; r < ribbonCount; r++) {
      const points: THREE.Vector3[] = [];
      const segments = 50;
      const phase = (r / ribbonCount) * Math.PI * 2;
      
      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 3 + phase;
        const radius = 4 + Math.sin(t * Math.PI * 2 + r) * 2;
        const y = (t - 0.5) * 16;
        
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius - 12
        ));
      }
      
      const colors = ['#00f5ff', '#bf00ff', '#5b6cf2', '#00f5ff', '#bf00ff'];
      ribbons.push({ points, color: colors[r] });
    }
    
    return ribbons;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y = t * 0.08;
      
      // Animate ribbon opacity
      groupRef.current.children.forEach((child, i) => {
        const line = child as THREE.Line;
        const material = line.material as THREE.LineBasicMaterial;
        material.opacity = 0.2 + Math.sin(t * 1.5 + i * 0.5) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {ribbonData.map((ribbon, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(ribbon.points);
        return (
          <primitive 
            key={i} 
            object={new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({
                color: ribbon.color,
                transparent: true,
                opacity: 0.25
              })
            )} 
          />
        );
      })}
    </group>
  );
}

// ============================================
// PULSE WAVE - Signal/Communication Theme
// ============================================
function PulseWave() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    const animateRing = (
      ref: React.RefObject<THREE.Mesh | null>, 
      offset: number,
      maxScale: number
    ) => {
      if (ref.current) {
        const progress = ((t * 0.5 + offset) % 1);
        const scale = 0.5 + progress * maxScale;
        ref.current.scale.setScalar(scale);
        (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - progress);
      }
    };
    
    animateRing(ring1Ref, 0, 6);
    animateRing(ring2Ref, 0.25, 6);
    animateRing(ring3Ref, 0.5, 6);
    animateRing(ring4Ref, 0.75, 6);
  });

  return (
    <group position={[0, 0, -6]}>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring4Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Center core */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ============================================
// CONNECTION NETWORK - Reaching Out Theme
// ============================================
function ConnectionNetwork({ nodeCount = 15 }) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const { nodes, linePositions } = useMemo(() => {
    const nodeList: THREE.Vector3[] = [];
    
    // Center node
    nodeList.push(new THREE.Vector3(0, 0, -6));
    
    // Surrounding nodes
    for (let i = 1; i < nodeCount; i++) {
      const angle = ((i - 1) / (nodeCount - 1)) * Math.PI * 2;
      const radius = 4 + Math.random() * 4;
      const y = (Math.random() - 0.5) * 8;
      
      nodeList.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius - 10
      ));
    }
    
    // Create connections from center to all nodes
    const lines: number[] = [];
    for (let i = 1; i < nodeList.length; i++) {
      lines.push(nodeList[0].x, nodeList[0].y, nodeList[0].z);
      lines.push(nodeList[i].x, nodeList[i].y, nodeList[i].z);
    }
    
    // Some node-to-node connections
    for (let i = 1; i < nodeList.length - 1; i++) {
      if (Math.random() > 0.5) {
        const next = i + 1;
        lines.push(nodeList[i].x, nodeList[i].y, nodeList[i].z);
        lines.push(nodeList[next].x, nodeList[next].y, nodeList[next].z);
      }
    }
    
    return { nodes: nodeList, linePositions: new Float32Array(lines) };
  }, [nodeCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }
    
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.1 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00f5ff" transparent opacity={0.12} />
      </lineSegments>
      
      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node}>
          <sphereGeometry args={[i === 0 ? 0.15 : 0.08, 8, 8]} />
          <meshBasicMaterial 
            color={i === 0 ? '#ffffff' : '#00f5ff'} 
            transparent 
            opacity={i === 0 ? 0.8 : 0.5} 
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// FLOATING MAIL PARTICLES - Communication
// ============================================
function MailParticles({ count = 30 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 6 + Math.random() * 6;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 12;
    }
    
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * 0.03;
      
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(t + i * 0.2) * 0.003;
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
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================
// AMBIENT STARS - Background
// ============================================
function AmbientStars({ count = 100 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = -20 - Math.random() * 20;
    }
    
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.005;
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
// FLOATING SOCIAL ICONS (Geometric)
// ============================================
function SocialShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x = t * 0.3 + i;
        child.rotation.y = t * 0.4 + i * 0.5;
        child.position.y = Math.sin(t * 0.5 + i * 2) * 0.4 + (i % 2 === 0 ? 5 : -4);
      });
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-8, 5, -5]}>
        <octahedronGeometry args={[0.35]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[8, -4, -6]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#bf00ff" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[-7, -3, -4]}>
        <tetrahedronGeometry args={[0.3]} />
        <meshBasicMaterial color="#5b6cf2" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[7, 4, -7]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ============================================
// CONTACT SCENE CONTENT
// ============================================
function ContactSceneContent({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      
      {/* Background stars - reduced on mobile */}
      <AmbientStars count={isMobile ? 40 : 80} />
      
      {/* Energy ribbons - main effect - skip on mobile */}
      {!isMobile && <EnergyRibbons />}
      
      {/* Central pulse wave */}
      <PulseWave />
      
      {/* Connection network - reduced on mobile */}
      <ConnectionNetwork nodeCount={isMobile ? 8 : 12} />
      
      {/* Floating particles - reduced on mobile */}
      <MailParticles count={isMobile ? 12 : 25} />
      
      {/* Social shapes - skip on mobile */}
      {!isMobile && <SocialShapes />}
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
export default function ContactScene() {
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
          <ContactSceneContent isMobile={performanceConfig.isMobile} />
          <AutoRender />
        </Suspense>
      </Canvas>
    </div>
  );
}
