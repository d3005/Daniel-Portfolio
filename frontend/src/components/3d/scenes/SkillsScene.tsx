import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';
import { usePerformanceConfig, usePageVisibility } from '../../../hooks/usePerformance';

// ============================================
// ROTATING 3D SKILL CUBES - Interactive Shapes
// ============================================
function RotatingSkillCubes() {
  const groupRef = useRef<THREE.Group>(null);
  
  const cubeData = useMemo(() => [
    { position: [-8, 3, -4], size: 0.8, color: '#00f5ff', speed: 1 },
    { position: [8, -2, -5], size: 0.7, color: '#bf00ff', speed: 1.2 },
    { position: [-6, -4, -3], size: 0.6, color: '#5b6cf2', speed: 0.8 },
    { position: [6, 4, -6], size: 0.75, color: '#00f5ff', speed: 1.1 },
    { position: [0, 5, -7], size: 0.65, color: '#bf00ff', speed: 0.9 },
    { position: [-4, 0, -4], size: 0.55, color: '#5b6cf2', speed: 1.3 },
    { position: [4, -5, -5], size: 0.7, color: '#00f5ff', speed: 1.0 },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((cube, i) => {
        const data = cubeData[i];
        if (!data) return;
        
        // Individual rotation
        cube.rotation.x = t * 0.5 * data.speed;
        cube.rotation.y = t * 0.7 * data.speed;
        
        // Floating motion
        cube.position.y = data.position[1] + Math.sin(t * 0.8 + i * 1.5) * 0.5;
        cube.position.x = data.position[0] + Math.cos(t * 0.5 + i) * 0.3;
        
        // Pulsing scale
        const pulse = 1 + Math.sin(t * 2 + i) * 0.1;
        cube.scale.setScalar(pulse);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {cubeData.map((data, i) => (
        <group key={i} position={data.position as [number, number, number]}>
          {/* Inner solid cube */}
          <mesh>
            <boxGeometry args={[data.size, data.size, data.size]} />
            <meshBasicMaterial color={data.color} transparent opacity={0.15} />
          </mesh>
          {/* Wireframe outline */}
          <mesh>
            <boxGeometry args={[data.size * 1.1, data.size * 1.1, data.size * 1.1]} />
            <meshBasicMaterial color={data.color} wireframe transparent opacity={0.6} />
          </mesh>
          {/* Outer glow cube */}
          <mesh>
            <boxGeometry args={[data.size * 1.3, data.size * 1.3, data.size * 1.3]} />
            <meshBasicMaterial color={data.color} wireframe transparent opacity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// NEURAL NETWORK - Interconnected Nodes (Enhanced)
// ============================================
function NeuralNetwork({ nodeCount = 50, isMobile = false }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulseRef = useRef<number[]>([]);
  const isPageVisible = usePageVisibility();
  
  // Reduce node count for mobile
  const actualNodeCount = isMobile ? Math.floor(nodeCount * 0.4) : nodeCount;
  
  const { nodePositions, linePositions, nodes } = useMemo(() => {
    const pos = new Float32Array(actualNodeCount * 3);
    const nodeList: THREE.Vector3[] = [];
    
    // Create nodes in a layered neural network pattern
    const layers = isMobile ? 3 : 5;
    const nodesPerLayer = Math.floor(actualNodeCount / layers);
    
    for (let layer = 0; layer < layers; layer++) {
      const layerX = (layer / (layers - 1) - 0.5) * 24;
      const nodesInThisLayer = layer === 0 || layer === layers - 1 
        ? Math.floor(nodesPerLayer * 0.6) 
        : nodesPerLayer;
      
      for (let i = 0; i < nodesInThisLayer; i++) {
        const idx = nodeList.length;
        if (idx >= actualNodeCount) break;
        
        const y = (i / (nodesInThisLayer - 1) - 0.5) * 12 + (Math.random() - 0.5) * 2;
        const z = -12 + (Math.random() - 0.5) * 4;
        
        pos[idx * 3] = layerX;
        pos[idx * 3 + 1] = y;
        pos[idx * 3 + 2] = z;
        
        nodeList.push(new THREE.Vector3(layerX, y, z));
      }
    }
    
    // Create connections between layers
    const lines: number[] = [];
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const dist = nodeList[i].distanceTo(nodeList[j]);
        // Connect nearby nodes
        if (dist < 7 && Math.random() > 0.4) {
          lines.push(nodeList[i].x, nodeList[i].y, nodeList[i].z);
          lines.push(nodeList[j].x, nodeList[j].y, nodeList[j].z);
        }
      }
    }
    
    pulseRef.current = new Array(actualNodeCount).fill(0).map(() => Math.random() * Math.PI * 2);
    
    return { 
      nodePositions: pos, 
      linePositions: new Float32Array(lines),
      nodes: nodeList 
    };
  }, [actualNodeCount, isMobile]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (pointsRef.current && isPageVisible) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      // Floating animation with individual phases
      for (let i = 0; i < actualNodeCount; i++) {
        if (nodes[i]) {
          pos[i * 3 + 1] = nodes[i].y + Math.sin(t * 0.5 + pulseRef.current[i]) * 0.3;
          pos[i * 3] = nodes[i].x + Math.cos(t * 0.3 + pulseRef.current[i]) * 0.15;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Pulsing size
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.size = 0.18 + Math.sin(t * 1.5) * 0.03;
    }
    
    if (linesRef.current && isPageVisible) {
      // Pulsing connections
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.15 + Math.sin(t * 2) * 0.08;
    }
  });

  return (
    <>
      {/* Neural nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          color="#00f5ff" 
          size={0.18} 
          transparent 
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      
      {/* Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00f5ff" transparent opacity={0.18} />
      </lineSegments>
    </>
  );
}

// ============================================
// SIGNAL PULSE - Data flowing through network (Enhanced)
// ============================================
function SignalPulses({ count = 12, isMobile = false }) {
  const ref = useRef<THREE.Points>(null);
  const progress = useRef<Float32Array>(new Float32Array(count));
  const paths = useRef<{ start: THREE.Vector3; end: THREE.Vector3; color: THREE.Color }[]>([]);
  const isPageVisible = usePageVisibility();
  
  // Reduce count for mobile
  const actualCount = isMobile ? Math.floor(count * 0.5) : count;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const col = new Float32Array(actualCount * 3);
    const prog = new Float32Array(actualCount);
    const pathList: { start: THREE.Vector3; end: THREE.Vector3; color: THREE.Color }[] = [];
    
    const colorOptions = [
      new THREE.Color('#00f5ff'),
      new THREE.Color('#bf00ff'),
      new THREE.Color('#5b6cf2'),
    ];
    
    for (let i = 0; i < actualCount; i++) {
      const startX = -12;
      const endX = 12;
      const y = (Math.random() - 0.5) * 10;
      const z = -12 + Math.random() * 3;
      const color = colorOptions[i % colorOptions.length];
      
      pathList.push({
        start: new THREE.Vector3(startX, y, z),
        end: new THREE.Vector3(endX, y + (Math.random() - 0.5) * 5, z),
        color
      });
      
      pos[i * 3] = startX;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
      prog[i] = Math.random();
    }
    
    progress.current = prog;
    paths.current = pathList;
    return { positions: pos, colors: col };
  }, [actualCount]);

  useFrame(() => {
    if (ref.current && progress.current && paths.current && isPageVisible) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < actualCount; i++) {
        progress.current[i] += 0.008;
        if (progress.current[i] > 1) {
          progress.current[i] = 0;
          const y = (Math.random() - 0.5) * 10;
          paths.current[i].start.set(-12, y, -12 + Math.random() * 3);
          paths.current[i].end.set(12, y + (Math.random() - 0.5) * 5, -12 + Math.random() * 3);
        }
        
        const p = progress.current[i];
        const path = paths.current[i];
        
        // Smooth curve interpolation
        pos[i * 3] = path.start.x + (path.end.x - path.start.x) * p;
        pos[i * 3 + 1] = path.start.y + (path.end.y - path.start.y) * p + Math.sin(p * Math.PI) * 1;
        pos[i * 3 + 2] = path.start.z + (path.end.z - path.start.z) * p;
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
        size={0.3} 
        transparent 
        opacity={0.95}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
}

// ============================================
// HEXAGONAL GRID - Technical Background (Enhanced)
// ============================================
function HexagonalGrid({ isMobile = false }) {
  const groupRef = useRef<THREE.Group>(null);
  const isPageVisible = usePageVisibility();
  
  const hexagons = useMemo(() => {
    const hexList: { position: [number, number, number]; size: number; phase: number }[] = [];
    const rows = isMobile ? 6 : 10;
    const cols = isMobile ? 8 : 14;
    const hexSize = 1.4;
    const hexHeight = hexSize * Math.sqrt(3);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize * 1.5 - (cols * hexSize * 1.5) / 2;
        const y = row * hexHeight - (rows * hexHeight) / 2 + (col % 2 === 0 ? 0 : hexHeight / 2);
        
        hexList.push({
          position: [x, y, -20],
          size: hexSize * 0.45 + Math.random() * 0.1,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    
    return hexList;
  }, [isMobile]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current && isPageVisible) {
      groupRef.current.children.forEach((hex, i) => {
        const mesh = hex as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        const data = hexagons[i];
        
        // Wave animation from center
        const distFromCenter = Math.sqrt(
          Math.pow(data.position[0], 2) + Math.pow(data.position[1], 2)
        );
        const wave = Math.sin(t * 0.8 - distFromCenter * 0.15 + data.phase) * 0.5 + 0.5;
        material.opacity = 0.03 + wave * 0.12;
        
        // Subtle z movement
        mesh.position.z = -20 + wave * 1.5;
      });
    }
  });

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 6;
    const size = 0.5;
    
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    
    return shape;
  }, []);

  return (
    <group ref={groupRef}>
      {hexagons.map((hex, i) => (
        <mesh key={i} position={hex.position} scale={hex.size}>
          <shapeGeometry args={[hexShape]} />
          <meshBasicMaterial 
            color={i % 3 === 0 ? '#00f5ff' : i % 3 === 1 ? '#bf00ff' : '#5b6cf2'} 
            wireframe
            transparent 
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// ORBITING SPHERES - Tech Planets
// ============================================
function OrbitingSpheres() {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbits = useMemo(() => [
    { radius: 4, speed: 0.3, size: 0.25, color: '#00f5ff', offset: 0 },
    { radius: 5.5, speed: -0.2, size: 0.2, color: '#bf00ff', offset: Math.PI / 2 },
    { radius: 7, speed: 0.15, size: 0.3, color: '#5b6cf2', offset: Math.PI },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((group, i) => {
        const orbit = orbits[i];
        const angle = t * orbit.speed + orbit.offset;
        
        group.position.x = Math.cos(angle) * orbit.radius;
        group.position.y = Math.sin(angle) * orbit.radius * 0.5;
        group.position.z = Math.sin(angle) * orbit.radius * 0.3 - 8;
        
        // Self rotation
        group.rotation.x = t * 0.5;
        group.rotation.y = t * 0.7;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbits.map((orbit, i) => (
        <group key={i}>
          <mesh>
            <sphereGeometry args={[orbit.size, 16, 16]} />
            <meshBasicMaterial color={orbit.color} transparent opacity={0.6} />
          </mesh>
          <mesh>
            <sphereGeometry args={[orbit.size * 1.3, 12, 12]} />
            <meshBasicMaterial color={orbit.color} wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// MOUSE INTERACTIVE ELEMENT
// ============================================
function MouseInteractive() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 0, -5));

  useFrame((state) => {
    const { pointer } = state;
    targetPos.current.set(
      pointer.x * viewport.width * 0.3,
      pointer.y * viewport.height * 0.3,
      -5
    );
    currentPos.current.lerp(targetPos.current, 0.05);
    
    if (meshRef.current) {
      meshRef.current.position.copy(currentPos.current);
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

// ============================================
// SKILLS SCENE CONTENT
// ============================================
function SkillsSceneContent({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      
      {/* Background hexagonal grid */}
      <HexagonalGrid isMobile={isMobile} />
      
      {/* Rotating 3D skill cubes - skip some on mobile */}
      <RotatingSkillCubes />
      
      {/* Neural network visualization */}
      <NeuralNetwork nodeCount={45} isMobile={isMobile} />
      
      {/* Data signals flowing through network */}
      <SignalPulses count={10} isMobile={isMobile} />
      
      {/* Orbiting spheres - skip on mobile */}
      {!isMobile && <OrbitingSpheres />}
      
      {/* Mouse interactive element - skip on mobile */}
      {!isMobile && <MouseInteractive />}
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
export default function SkillsScene() {
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
          <SkillsSceneContent isMobile={performanceConfig.isMobile} />
          <AutoRender />
        </Suspense>
      </Canvas>
    </div>
  );
}
