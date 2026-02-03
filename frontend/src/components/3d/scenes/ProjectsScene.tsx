import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';
import { usePerformanceConfig } from '../../../hooks/usePerformance';

// ============================================
// PORTAL VORTEX - Enhanced Gateway Effect
// ============================================
function PortalVortex() {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  
  const portalParticles = useMemo(() => {
    const count = 150;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);
    const zOffsets = new Float32Array(count);
    
    const color1 = new THREE.Color('#00f5ff');
    const color2 = new THREE.Color('#bf00ff');
    const color3 = new THREE.Color('#ffffff');
    
    for (let i = 0; i < count; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 1.5 + Math.random() * 5;
      speeds[i] = 0.3 + Math.random() * 0.7;
      zOffsets[i] = (Math.random() - 0.5) * 4;
      
      pos[i * 3] = Math.cos(angles[i]) * radii[i];
      pos[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
      pos[i * 3 + 2] = zOffsets[i];
      
      // Color gradient based on radius
      const colorT = radii[i] / 6;
      const color = colorT < 0.33 ? color3 : colorT < 0.66 ? color1 : color2;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return { positions: pos, colors: col, angles, radii, speeds, zOffsets };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.4;
      groupRef.current.rotation.z = t * 0.05;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = t * (0.4 + i * 0.12) * (i % 2 === 0 ? 1 : -1);
        
        // Breathing scale
        const breath = 1 + Math.sin(t * 1.5 + i * 0.8) * 0.08;
        ring.scale.setScalar(breath);
        
        // Dynamic opacity
        const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = (0.35 - i * 0.05) + Math.sin(t * 2 + i) * 0.1;
      });
    }
    
    if (innerGlowRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      innerGlowRef.current.scale.setScalar(pulse);
      const material = innerGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.4 + Math.sin(t * 2) * 0.2;
    }
    
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const count = pos.length / 3;
      
      for (let i = 0; i < count; i++) {
        portalParticles.angles[i] += 0.025 * portalParticles.speeds[i];
        
        // Spiral inward with varying speeds
        portalParticles.radii[i] -= 0.015 * portalParticles.speeds[i];
        if (portalParticles.radii[i] < 0.3) {
          portalParticles.radii[i] = 5 + Math.random() * 2;
          portalParticles.zOffsets[i] = (Math.random() - 0.5) * 4;
        }
        
        pos[i * 3] = Math.cos(portalParticles.angles[i]) * portalParticles.radii[i];
        pos[i * 3 + 1] = Math.sin(portalParticles.angles[i]) * portalParticles.radii[i];
        pos[i * 3 + 2] = portalParticles.zOffsets[i] + Math.sin(t + i * 0.1) * 0.3;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -6]}>
      {/* Concentric rings with glow */}
      <group ref={ringsRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} rotation={[0, 0, i * 0.15]}>
            <torusGeometry args={[1.2 + i * 0.7, 0.025 - i * 0.002, 16, 64]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'} 
              transparent 
              opacity={0.35 - i * 0.05}
            />
          </mesh>
        ))}
      </group>
      
      {/* Outer glow ring */}
      <mesh>
        <ringGeometry args={[4.5, 5.5, 64]} />
        <meshBasicMaterial 
          color="#00f5ff" 
          transparent 
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Center glow layers */}
      <mesh>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial 
          color="#00f5ff" 
          transparent 
          opacity={0.2}
        />
      </mesh>
      
      {/* Inner bright core */}
      <mesh ref={innerGlowRef}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Core center */}
      <mesh>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={1}
        />
      </mesh>
      
      {/* Spiraling particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[portalParticles.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[portalParticles.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.1} 
          transparent 
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          vertexColors
        />
      </points>
    </group>
  );
}

// ============================================
// ENTRANCE EFFECT - Particles rushing into portal
// ============================================
function EntranceEffect() {
  const ref = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array | null>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    
    const color1 = new THREE.Color('#00f5ff');
    const color2 = new THREE.Color('#bf00ff');
    
    for (let i = 0; i < count; i++) {
      // Start from edges
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 10;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -6 + (Math.random() - 0.5) * 8;
      
      vel[i] = 0.05 + Math.random() * 0.1;
      
      const color = Math.random() > 0.5 ? color1 : color2;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    velocities.current = vel;
    return { positions: pos, colors: col };
  }, []);

  useFrame(() => {
    if (ref.current && velocities.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      const count = pos.length / 3;
      
      for (let i = 0; i < count; i++) {
        const x = pos[i * 3];
        const y = pos[i * 3 + 1];
        const dist = Math.sqrt(x * x + y * y);
        
        if (dist > 0.5) {
          // Move toward center
          const factor = velocities.current[i];
          pos[i * 3] -= (x / dist) * factor * 2;
          pos[i * 3 + 1] -= (y / dist) * factor * 2;
        } else {
          // Reset to edge
          const angle = Math.random() * Math.PI * 2;
          const radius = 15 + Math.random() * 10;
          pos[i * 3] = Math.cos(angle) * radius;
          pos[i * 3 + 1] = Math.sin(angle) * radius;
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
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}

// ============================================
// GLASSMORPHISM SHAPES - Enhanced Floating Cards
// ============================================
function GlassmorphismShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => [
    { position: [-8, 3, -4], size: [2.5, 3, 0.1], rotation: [0.1, 0.2, 0.1], color: '#00f5ff' },
    { position: [8, -2, -5], size: [2.2, 2.8, 0.1], rotation: [-0.1, -0.15, -0.05], color: '#bf00ff' },
    { position: [-7, -4, -3], size: [1.8, 2.2, 0.1], rotation: [0.05, 0.1, 0.15], color: '#5b6cf2' },
    { position: [7, 5, -6], size: [2.8, 2, 0.1], rotation: [-0.08, 0.12, -0.1], color: '#00f5ff' },
    { position: [0, -6, -7], size: [3, 1.5, 0.1], rotation: [0.2, 0, 0.05], color: '#bf00ff' },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((shape, i) => {
        const data = shapes[i];
        
        // Floating motion
        shape.position.y = data.position[1] + Math.sin(t * 0.5 + i * 1.5) * 0.6;
        shape.position.x = data.position[0] + Math.cos(t * 0.35 + i) * 0.4;
        
        // Subtle rotation
        shape.rotation.x = data.rotation[0] + Math.sin(t * 0.25 + i) * 0.15;
        shape.rotation.y = data.rotation[1] + t * 0.06;
        shape.rotation.z = data.rotation[2] + Math.cos(t * 0.2 + i) * 0.05;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <group key={i} position={shape.position as [number, number, number]}>
          {/* Glass panel with gradient feel */}
          <mesh>
            <boxGeometry args={shape.size as [number, number, number]} />
            <meshBasicMaterial 
              color={shape.color}
              transparent 
              opacity={0.1}
            />
          </mesh>
          
          {/* Border glow */}
          <mesh>
            <boxGeometry args={[shape.size[0] + 0.08, shape.size[1] + 0.08, shape.size[2]]} />
            <meshBasicMaterial 
              color={shape.color}
              wireframe
              transparent 
              opacity={0.4}
            />
          </mesh>
          
          {/* Outer glow */}
          <mesh>
            <boxGeometry args={[shape.size[0] + 0.2, shape.size[1] + 0.2, shape.size[2]]} />
            <meshBasicMaterial 
              color={shape.color}
              wireframe
              transparent 
              opacity={0.15}
            />
          </mesh>
          
          {/* Inner highlight */}
          <mesh position={[0, shape.size[1] * 0.3, 0.06]}>
            <planeGeometry args={[shape.size[0] * 0.85, shape.size[1] * 0.35]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent 
              opacity={0.08}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// GRID FLOOR - Enhanced Perspective Grid
// ============================================
function GridFloor() {
  const gridRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const gridLines = useMemo(() => {
    const lines: number[] = [];
    const size = 60;
    const divisions = 30;
    const step = size / divisions;
    
    // Horizontal lines
    for (let i = 0; i <= divisions; i++) {
      const y = -size / 2 + i * step;
      lines.push(-size / 2, y, 0, size / 2, y, 0);
    }
    
    // Vertical lines
    for (let i = 0; i <= divisions; i++) {
      const x = -size / 2 + i * step;
      lines.push(x, -size / 2, 0, x, size / 2, 0);
    }
    
    return new Float32Array(lines);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (gridRef.current) {
      gridRef.current.position.z = -18 + Math.sin(t * 0.15) * 1;
    }
    
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.15 + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={gridRef} position={[0, -10, -18]} rotation={[Math.PI / 2.5, 0, 0]}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[gridLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00f5ff" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

// ============================================
// CODE PARTICLES - Enhanced Background
// ============================================
function CodeParticles({ count = 100 }) {
  const ref = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const color1 = new THREE.Color('#00f5ff');
    const color2 = new THREE.Color('#bf00ff');
    const color3 = new THREE.Color('#ffffff');
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = -15 - Math.random() * 20;
      
      const colorChoice = Math.random();
      const color = colorChoice < 0.4 ? color1 : colorChoice < 0.7 ? color2 : color3;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
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
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}

// ============================================
// FLOATING TECH SHAPES
// ============================================
function TechShapes() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(() => [
    { position: [-10, 5, -4], type: 'octa', size: 0.5, color: '#00f5ff' },
    { position: [10, -5, -5], type: 'ico', size: 0.45, color: '#bf00ff' },
    { position: [-9, -4, -3], type: 'tetra', size: 0.4, color: '#5b6cf2' },
    { position: [9, 4, -6], type: 'dodeca', size: 0.35, color: '#00f5ff' },
    { position: [0, 6, -7], type: 'octa', size: 0.55, color: '#bf00ff' },
    { position: [-5, -6, -4], type: 'ico', size: 0.4, color: '#5b6cf2' },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const data = shapes[i];
        child.rotation.x = t * 0.4 + i;
        child.rotation.y = t * 0.5 + i * 0.5;
        child.position.y = data.position[1] + Math.sin(t * 0.6 + i * 2) * 0.4;
        child.position.x = data.position[0] + Math.cos(t * 0.4 + i) * 0.25;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <group key={i} position={shape.position as [number, number, number]}>
          <mesh>
            {shape.type === 'octa' && <octahedronGeometry args={[shape.size]} />}
            {shape.type === 'ico' && <icosahedronGeometry args={[shape.size, 0]} />}
            {shape.type === 'tetra' && <tetrahedronGeometry args={[shape.size]} />}
            {shape.type === 'dodeca' && <dodecahedronGeometry args={[shape.size]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.6} />
          </mesh>
          <mesh>
            {shape.type === 'octa' && <octahedronGeometry args={[shape.size * 1.2]} />}
            {shape.type === 'ico' && <icosahedronGeometry args={[shape.size * 1.2, 0]} />}
            {shape.type === 'tetra' && <tetrahedronGeometry args={[shape.size * 1.2]} />}
            {shape.type === 'dodeca' && <dodecahedronGeometry args={[shape.size * 1.2]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// PROJECTS SCENE CONTENT
// ============================================
function ProjectsSceneContent({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      
      {/* Background particles - reduced on mobile */}
      <CodeParticles count={isMobile ? 40 : 80} />
      
      {/* Grid floor for depth - skip on mobile */}
      {!isMobile && <GridFloor />}
      
      {/* Central portal effect - Enhanced */}
      <PortalVortex />
      
      {/* Entrance particles rushing into portal - skip on mobile */}
      {!isMobile && <EntranceEffect />}
      
      {/* Floating glassmorphism panels */}
      <GlassmorphismShapes />
      
      {/* Tech shapes - skip on mobile */}
      {!isMobile && <TechShapes />}
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
export default function ProjectsScene() {
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
          <ProjectsSceneContent isMobile={performanceConfig.isMobile} />
          <AutoRender />
        </Suspense>
      </Canvas>
    </div>
  );
}
