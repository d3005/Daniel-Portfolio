import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Animated Gradient Mesh - Subtle animated background
export function GradientMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#0a0a15') },
        color2: { value: new THREE.Color('#1a0a25') },
        color3: { value: new THREE.Color('#0a1520') },
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
        uniform vec3 color3;
        varying vec2 vUv;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Animated noise
          float noise1 = snoise(uv * 2.0 + time * 0.05) * 0.5 + 0.5;
          float noise2 = snoise(uv * 3.0 - time * 0.03) * 0.5 + 0.5;
          float noise3 = snoise(uv * 1.5 + time * 0.02) * 0.5 + 0.5;
          
          // Blend colors based on noise
          vec3 color = mix(color1, color2, noise1);
          color = mix(color, color3, noise2 * 0.5);
          
          // Add subtle variation
          color += noise3 * 0.02;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
  }, []);

  useFrame((state) => {
    shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]} material={shaderMaterial}>
      <planeGeometry args={[150, 100]} />
    </mesh>
  );
}

// Ambient Glow Orbs - Floating in background
export function AmbientGlowOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => [
    { position: [-15, 8, -30], color: '#00f5ff', size: 4, speed: 0.1 },
    { position: [12, -5, -25], color: '#bf00ff', size: 5, speed: 0.15 },
    { position: [-8, -10, -35], color: '#5b6cf2', size: 3.5, speed: 0.08 },
    { position: [18, 10, -40], color: '#00f5ff', size: 3, speed: 0.12 },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (groupRef.current) {
      groupRef.current.children.forEach((orb, i) => {
        const data = orbs[i];
        orb.position.x = data.position[0] + Math.sin(t * data.speed + i) * 2;
        orb.position.y = data.position[1] + Math.cos(t * data.speed * 1.5 + i) * 1.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position as [number, number, number]}>
          <sphereGeometry args={[orb.size, 16, 16]} />
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

// Subtle Grid Lines
export function SubtleGrid() {
  return (
    <group position={[0, -10, -20]} rotation={[-Math.PI / 4, 0, 0]}>
      {/* Horizontal lines */}
      {Array(20).fill(null).map((_, i) => (
        <mesh key={`h-${i}`} position={[0, 0, (i - 10) * 3]}>
          <boxGeometry args={[60, 0.01, 0.01]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.05} />
        </mesh>
      ))}
      {/* Vertical lines */}
      {Array(20).fill(null).map((_, i) => (
        <mesh key={`v-${i}`} position={[(i - 10) * 3, 0, 0]}>
          <boxGeometry args={[0.01, 0.01, 60]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.05} />
        </mesh>
      ))}
    </group>
  );
}

export default { GradientMesh, AmbientGlowOrbs, SubtleGrid };
