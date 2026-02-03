import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Portal / Vortex Effect - Project showcase entrance
export function PortalVortex({ 
  position = [0, 0, -8] as [number, number, number],
  scale = 1 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#00f5ff') },
        color2: { value: new THREE.Color('#bf00ff') }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float angle = atan(center.y, center.x);
          
          float spiral = sin(angle * 8.0 + dist * 15.0 - time * 4.0) * 0.5 + 0.5;
          float radial = 1.0 - smoothstep(0.0, 0.5, dist);
          
          vec3 color = mix(color1, color2, spiral);
          float alpha = radial * (0.4 + spiral * 0.3);
          
          gl_FragColor = vec4(color, alpha * 0.6);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, []);

  const particlePositions = useMemo(() => {
    const count = 150;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    shaderMaterial.uniforms.time.value = t;
    
    if (coreRef.current) {
      coreRef.current.rotation.z = t * 0.5;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z = t * (0.3 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
      });
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < 150; i++) {
        const idx = i * 3;
        const currentAngle = Math.atan2(positions[idx + 1], positions[idx]);
        const currentRadius = Math.sqrt(positions[idx] ** 2 + positions[idx + 1] ** 2);
        
        const newAngle = currentAngle + 0.02;
        const newRadius = currentRadius - 0.01;
        
        if (newRadius < 0.2) {
          const resetAngle = Math.random() * Math.PI * 2;
          positions[idx] = Math.cos(resetAngle) * 3;
          positions[idx + 1] = Math.sin(resetAngle) * 3;
        } else {
          positions[idx] = Math.cos(newAngle) * newRadius;
          positions[idx + 1] = Math.sin(newAngle) * newRadius;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Portal core with shader */}
      <mesh ref={coreRef} material={shaderMaterial}>
        <circleGeometry args={[2, 64]} />
      </mesh>
      
      {/* Concentric rings */}
      <group ref={ringsRef}>
        {[2.2, 2.5, 2.8, 3.1].map((radius, i) => (
          <mesh key={i}>
            <torusGeometry args={[radius, 0.02, 16, 64]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'}
              transparent 
              opacity={0.5 - i * 0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Spiraling particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#00f5ff"
          size={0.06}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// Mouse-Following Orb with trail
export function MouseOrb() {
  const { viewport } = useThree();
  const orbRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const trailPositions = useRef<THREE.Vector3[]>(
    Array(12).fill(null).map(() => new THREE.Vector3(0, 0, 0))
  );

  useFrame((state) => {
    const { pointer } = state;
    
    // Update target from mouse
    targetPos.current.set(
      pointer.x * viewport.width * 0.4,
      pointer.y * viewport.height * 0.4,
      0
    );
    
    // Smooth follow
    currentPos.current.lerp(targetPos.current, 0.08);
    
    // Update orb position
    if (orbRef.current) {
      orbRef.current.position.copy(currentPos.current);
      
      // Subtle rotation based on movement
      const velocity = targetPos.current.clone().sub(currentPos.current);
      orbRef.current.rotation.x = velocity.y * 0.5;
      orbRef.current.rotation.y = -velocity.x * 0.5;
    }
    
    // Update trail
    for (let i = trailPositions.current.length - 1; i > 0; i--) {
      trailPositions.current[i].lerp(trailPositions.current[i - 1], 0.3);
    }
    trailPositions.current[0].copy(currentPos.current);
    
    if (trailRef.current) {
      trailRef.current.children.forEach((trail, i) => {
        trail.position.copy(trailPositions.current[i]);
        const scale = 1 - (i / trailPositions.current.length) * 0.8;
        trail.scale.setScalar(scale);
      });
    }
  });

  return (
    <>
      {/* Trail */}
      <group ref={trailRef}>
        {Array(12).fill(null).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial 
              color="#00f5ff"
              transparent 
              opacity={0.3 * (1 - i / 12)}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      
      {/* Main orb */}
      <group ref={orbRef}>
        {/* Outer glow */}
        <mesh scale={1.5}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial 
            color="#bf00ff"
            transparent 
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Core */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial 
            color="#00f5ff"
            transparent 
            opacity={0.6}
          />
        </mesh>
        
        {/* Inner bright core */}
        <mesh scale={0.5}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent 
            opacity={0.9}
          />
        </mesh>
      </group>
    </>
  );
}

export default { PortalVortex, MouseOrb };
