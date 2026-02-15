import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Animated Wave Shader Material
 */
const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#4F46E5'),
    uColor2: new THREE.Color('#10B981'),
    uIntensity: 1.0,
    uSpeed: 1.0
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Wave effect
      float wave = sin(pos.x * 2.0 + uTime) * 0.5;
      wave += sin(pos.y * 3.0 + uTime * 1.5) * 0.3;
      wave += cos(pos.x * pos.y * 0.5 + uTime) * 0.2;
      
      pos.z += wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Gradient based on position and time
      float gradient = sin(vUv.x * 3.14159 + uTime * 0.5) * 0.5 + 0.5;
      gradient += sin(vUv.y * 3.14159 + uTime * 0.3) * 0.3;
      
      vec3 color = mix(uColor1, uColor2, gradient);
      
      // Add some glow
      float glow = 1.0 - length(vUv - 0.5) * 2.0;
      color += glow * uIntensity * 0.2;
      
      gl_FragColor = vec4(color, 0.8);
    }
  `
)

extend({ WaveShaderMaterial })

/**
 * Animated Background Component
 */
export default function AnimatedBackground({ section }) {
  const planeRef = useRef()
  const materialRef = useRef()

  // Section-specific colors
  const sectionColors = {
    home: { color1: '#4F46E5', color2: '#10B981' },
    about: { color1: '#10B981', color2: '#F59E0B' },
    projects: { color1: '#F59E0B', color2: '#EC4899' },
    skills: { color1: '#EC4899', color2: '#8B5CF6' },
    contact: { color1: '#8B5CF6', color2: '#4F46E5' }
  }

  const { color1, color2 } = sectionColors[section] || sectionColors.home

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
      
      // Smoothly transition colors
      materialRef.current.uColor1.lerp(new THREE.Color(color1), 0.05)
      materialRef.current.uColor2.lerp(new THREE.Color(color2), 0.05)
    }

    if (planeRef.current) {
      planeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      planeRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group>
      {/* Main Background Plane */}
      <mesh ref={planeRef} position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 50, 64, 64]} />
        <waveShaderMaterial
          ref={materialRef}
          transparent
          side={THREE.DoubleSide}
          uSpeed={1.0}
          uIntensity={1.0}
        />
      </mesh>

      {/* Additional Background Layers */}
      <BackgroundLayers section={section} />
    </group>
  )
}

// Additional decorative background layers
function BackgroundLayers({ section }) {
  const layersRef = useRef()

  useFrame((state) => {
    if (layersRef.current) {
      layersRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={layersRef} position={[0, 0, -8]}>
      {/* Rotating rings */}
      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
          position={[0, 0, -i]}
        >
          <torusGeometry args={[5 + i * 2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Pulsating spheres */}
      <PulsatingSpheres />
    </group>
  )
}

// Pulsating decorative spheres
function PulsatingSpheres() {
  const spheresRef = useRef()

  useFrame((state) => {
    if (spheresRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      spheresRef.current.scale.set(scale, scale, scale)
    }
  })

  const positions = useMemo(() => {
    return [
      [-8, 4, 0],
      [8, 4, 0],
      [-8, -4, 0],
      [8, -4, 0],
      [0, 6, 0],
      [0, -6, 0]
    ]
  }, [])

  return (
    <group ref={spheresRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            emissive="#4F46E5"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}
