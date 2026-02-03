import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// 1. ENHANCED PARTICLE FIELD (Moving Stars)
// ============================================
export function EnhancedParticleField({ count = 2000 }) {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, velocities, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const sizeArr = new Float32Array(count);
    
    const colorOptions = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#00f5ff'),
      new THREE.Color('#bf00ff'),
      new THREE.Color('#5b6cf2'),
    ];
    
    for (let i = 0; i < count; i++) {
      // Spread particles across the scene
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = -10 - Math.random() * 50;
      
      // Slow drift velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      
      // Mostly white with some colored particles
      const color = Math.random() > 0.85 
        ? colorOptions[Math.floor(Math.random() * 4)] 
        : colorOptions[0];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
      
      // Varying sizes
      sizeArr[i] = 0.03 + Math.random() * 0.07;
    }
    
    return [pos, vel, cols, sizeArr];
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const t = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        // Move particles
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Add subtle wave motion
        positions[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.1) * 0.002;
        
        // Wrap around boundaries
        if (positions[i * 3] > 50) positions[i * 3] = -50;
        if (positions[i * 3] < -50) positions[i * 3] = 50;
        if (positions[i * 3 + 1] > 30) positions[i * 3 + 1] = -30;
        if (positions[i * 3 + 1] < -30) positions[i * 3 + 1] = 30;
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      // Slow rotation
      ref.current.rotation.y = t * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// 2. MOUSE-FOLLOWING ORB (Interactive Cursor)
// ============================================
export function MouseFollowingOrb() {
  const { viewport } = useThree();
  const orbRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const trailPositions = useRef<THREE.Vector3[]>(
    Array(12).fill(null).map(() => new THREE.Vector3(0, 0, 0))
  );

  useFrame((state) => {
    const { pointer } = state;
    const t = state.clock.elapsedTime;
    
    // Update target from mouse
    targetPos.current.set(
      pointer.x * viewport.width * 0.5,
      pointer.y * viewport.height * 0.5,
      0
    );
    
    // Smooth follow with easing
    currentPos.current.lerp(targetPos.current, 0.08);
    
    // Update orb position
    if (orbRef.current) {
      orbRef.current.position.copy(currentPos.current);
      orbRef.current.position.z = 2;
      
      // Pulse animation
      const pulse = 1 + Math.sin(t * 4) * 0.15;
      orbRef.current.scale.setScalar(pulse);
      
      // Rotate the orb slightly
      orbRef.current.rotation.z = t * 0.5;
    }
    
    // Animated glow size
    if (glowRef.current) {
      const glowPulse = 2.5 + Math.sin(t * 3) * 0.5;
      glowRef.current.scale.setScalar(glowPulse);
    }
    
    // Update trail with smooth interpolation
    for (let i = trailPositions.current.length - 1; i > 0; i--) {
      trailPositions.current[i].lerp(trailPositions.current[i - 1], 0.3);
    }
    trailPositions.current[0].copy(currentPos.current);
    
    if (trailRef.current) {
      trailRef.current.children.forEach((trail, i) => {
        trail.position.copy(trailPositions.current[i]);
        trail.position.z = 2;
        const scale = 1 - (i / trailPositions.current.length) * 0.85;
        trail.scale.setScalar(scale);
      });
    }
  });

  return (
    <>
      {/* Trail particles */}
      <group ref={trailRef}>
        {Array(12).fill(null).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#00f5ff" : "#bf00ff"}
              transparent 
              opacity={0.5 * (1 - i / 12)}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      
      {/* Main orb */}
      <group ref={orbRef}>
        {/* Large outer glow (bloom will enhance this) */}
        <mesh ref={glowRef} scale={2.5}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial 
            color="#00f5ff"
            transparent 
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Mid glow - purple */}
        <mesh scale={1.8}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial 
            color="#bf00ff"
            transparent 
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Core orb */}
        <mesh>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshBasicMaterial 
            color="#00f5ff"
            transparent 
            opacity={0.7}
          />
        </mesh>
        
        {/* Inner bright core */}
        <mesh scale={0.5}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshBasicMaterial 
            color="#ffffff"
          />
        </mesh>
        
        {/* Orbiting ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.015, 8, 32]} />
          <meshBasicMaterial 
            color="#00f5ff"
            transparent 
            opacity={0.5}
          />
        </mesh>
      </group>
    </>
  );
}

// ============================================
// 3. PARTICLE VORTEX (Around Globe)
// ============================================
export function ParticleVortex({ 
  position = [3.5, 0, -2] as [number, number, number],
  radius = 3,
  count = 200
}) {
  const ref = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const angles = new Float32Array(count);
    const heights = new Float32Array(count);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      heights[i] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.2 + Math.random() * 0.3;
      radii[i] = radius * (0.8 + Math.random() * 0.4);
      
      // Initial positions
      positions[i * 3] = Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = heights[i];
      positions[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
    }
    
    return { angles, heights, speeds, radii, positions };
  }, [count, radius]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const angle = particleData.angles[i] + t * particleData.speeds[i];
        const r = particleData.radii[i];
        const h = particleData.heights[i] + Math.sin(t * 0.5 + i) * 0.3;
        
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = h;
        positions[i * 3 + 2] = Math.sin(angle) * r;
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00f5ff"
        size={0.05}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// 4. PULSE WAVE (From Globe Center) - Enhanced
// ============================================
export function PulseWave({ 
  position = [3.5, 0, -2] as [number, number, number]
}) {
  const ringsRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const waveCount = 5;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Animate pulse rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const offset = i / waveCount;
        const progress = ((t * 0.3 + offset) % 1);
        const scale = 0.5 + progress * 6;
        const opacity = 0.4 * (1 - progress);
        
        ring.scale.setScalar(scale);
        (ring as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#00f5ff' : '#bf00ff',
          transparent: true,
          opacity,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
      });
    }
    
    // Animate center sphere pulse
    if (sphereRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.2;
      sphereRef.current.scale.setScalar(pulse);
      
      const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Center glow sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial 
          color="#00f5ff"
          transparent 
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Pulse rings */}
      <group ref={ringsRef}>
        {Array(waveCount).fill(null).map((_, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1, 64]} />
            <meshBasicMaterial 
              color="#00f5ff"
              transparent 
              opacity={0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      
      {/* Vertical pulse rings */}
      <group rotation={[0, 0, Math.PI / 2]}>
        {Array(3).fill(null).map((_, i) => (
          <mesh key={`v-${i}`} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8 + i * 0.3, 1.85 + i * 0.3, 64]} />
            <meshBasicMaterial 
              color="#bf00ff"
              transparent 
              opacity={0.15 - i * 0.04}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================
// 5. FLOATING GEOMETRIC SHAPES
// ============================================
export function FloatingGeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const shapes = useMemo(() => [
    { type: 'octahedron', position: [-6, 3, -5], color: '#00f5ff', size: 0.4, speed: 0.5 },
    { type: 'tetrahedron', position: [6, -2, -8], color: '#bf00ff', size: 0.5, speed: 0.3 },
    { type: 'icosahedron', position: [-4, -4, -6], color: '#5b6cf2', size: 0.35, speed: 0.4 },
    { type: 'dodecahedron', position: [5, 4, -7], color: '#00f5ff', size: 0.3, speed: 0.6 },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((shape, i) => {
        const data = shapes[i];
        // Floating motion
        shape.position.y = data.position[1] + Math.sin(t * data.speed + i * 2) * 0.5;
        shape.position.x = data.position[0] + Math.cos(t * data.speed * 0.5 + i) * 0.3;
        
        // Rotation
        shape.rotation.x = t * data.speed * 0.5;
        shape.rotation.y = t * data.speed * 0.7;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position as [number, number, number]}>
          {shape.type === 'octahedron' && <octahedronGeometry args={[shape.size]} />}
          {shape.type === 'tetrahedron' && <tetrahedronGeometry args={[shape.size]} />}
          {shape.type === 'icosahedron' && <icosahedronGeometry args={[shape.size, 0]} />}
          {shape.type === 'dodecahedron' && <dodecahedronGeometry args={[shape.size]} />}
          <meshBasicMaterial 
            color={shape.color}
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// 6. ENERGY RIBBONS (Flowing Lines)
// ============================================
export function EnergyRibbons({ 
  position = [-3, 0, -3] as [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  const ribbons = useMemo(() => {
    return Array(5).fill(null).map((_, i) => ({
      points: generateRibbonCurve(i),
      color: i % 2 === 0 ? '#00f5ff' : '#bf00ff',
      speed: 0.3 + i * 0.1,
      offset: (i / 5) * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((ribbon, i) => {
        const data = ribbons[i];
        ribbon.rotation.z = Math.sin(t * data.speed + data.offset) * 0.3;
        ribbon.rotation.y = t * data.speed * 0.2;
        
        // Pulse opacity
        const material = (ribbon.children[0] as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + Math.sin(t * 2 + data.offset) * 0.15;
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {ribbons.map((ribbon, i) => (
        <group key={i}>
          <RibbonLine points={ribbon.points} color={ribbon.color} />
        </group>
      ))}
    </group>
  );
}

function generateRibbonCurve(index: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const segments = 40;
  
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 + index * 0.5;
    const radius = 2 + Math.sin(t * Math.PI * 3) * 0.8;
    const y = (t - 0.5) * 4 + Math.sin(angle * 2) * 0.5;
    
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius * 0.5
    ));
  }
  
  return points;
}

function RibbonLine({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);
  
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
  }, [color]);

  return <primitive object={new THREE.Line(geometry, material)} />;
}

// ============================================
// 7. WIREFRAME GLOBE (Enhanced with Bloom support)
// ============================================
export function WireframeGlobe({ 
  position = [3.5, 0, -2] as [number, number, number],
  size = 2
}) {
  const globeRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.15;
      globeRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.25;
      innerRef.current.rotation.x = t * 0.1;
    }
    
    // Pulsing core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.3;
      coreRef.current.scale.setScalar(pulse);
      
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 + Math.sin(t * 3) * 0.2;
    }
    
    // Rotating latitude rings
    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={globeRef} position={position}>
      {/* Outer glow sphere (for bloom) */}
      <mesh scale={1.15}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial 
          color="#00f5ff"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer wireframe sphere */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial 
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Inner rotating sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[size * 0.7, 20, 20]} />
        <meshBasicMaterial 
          color="#bf00ff"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
      
      {/* Latitude lines */}
      <group ref={ringsRef}>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => (
          <mesh key={i} position={[0, y * size, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[Math.cos(Math.asin(y)) * size, 0.015, 8, 64]} />
            <meshBasicMaterial 
              color="#00f5ff" 
              transparent 
              opacity={0.25}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      
      {/* Longitude lines */}
      {[0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4].map((angle, i) => (
        <mesh key={`long-${i}`} rotation={[0, angle, 0]}>
          <torusGeometry args={[size, 0.01, 8, 64]} />
          <meshBasicMaterial 
            color="#bf00ff" 
            transparent 
            opacity={0.15}
          />
        </mesh>
      ))}
      
      {/* Core glow - multiple layers for bloom */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size * 0.2, 24, 24]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <mesh scale={1.5}>
        <sphereGeometry args={[size * 0.2, 16, 16]} />
        <meshBasicMaterial 
          color="#00f5ff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh scale={2.5}>
        <sphereGeometry args={[size * 0.2, 12, 12]} />
        <meshBasicMaterial 
          color="#bf00ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default {
  EnhancedParticleField,
  MouseFollowingOrb,
  ParticleVortex,
  PulseWave,
  FloatingGeometricShapes,
  EnergyRibbons,
  WireframeGlobe
};
