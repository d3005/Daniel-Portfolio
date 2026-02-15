import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useProgress } from '@react-three/drei'
import { Text } from '@react-three/drei'

/**
 * 3D Loading Screen
 * Displays while assets are loading
 */
export default function LoadingScreen() {
  const { progress, active } = useProgress()

  return (
    <group>
      {/* 3D Loading Animation */}
      <LoadingSpinner />

      {/* HTML Loading UI */}
      <Html center>
        <div className="loading-container">
          <div className="loading-text">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loading Experience
            </h2>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/70 mt-2">
              {progress.toFixed(0)}%
            </p>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Animated Loading Spinner
function LoadingSpinner() {
  const groupRef = useRef()
  const ringsRef = useRef([])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }

    // Rotate individual rings
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z = state.clock.elapsedTime * (1 + i * 0.3)
        ring.rotation.y = state.clock.elapsedTime * (0.5 + i * 0.2)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Nested rotating rings */}
      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (ringsRef.current[i] = el)}
        >
          <torusGeometry 
            args={[1 + i * 0.5, 0.05, 16, 100]} 
          />
          <meshStandardMaterial
            color={['#4F46E5', '#10B981', '#F59E0B'][i]}
            emissive={['#4F46E5', '#10B981', '#F59E0B'][i]}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Central sphere */}
      <PulsingCore />
    </group>
  )
}

// Pulsing core sphere
function PulsingCore() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  )
}

// Alternative: Particle Loading Effect
export function ParticleLoadingScreen() {
  const { progress } = useProgress()
  const particlesRef = useRef()

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2
      
      // Expand particles based on progress
      const scale = 1 + (progress / 100) * 2
      particlesRef.current.scale.set(scale, scale, scale)
    }
  })

  const particleCount = 100
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const theta = (i / particleCount) * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 2

    return {
      position: [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ]
    }
  })

  return (
    <group>
      <group ref={particlesRef}>
        {particles.map((particle, i) => (
          <mesh key={i} position={particle.position}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#4F46E5"
              emissive="#4F46E5"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      <Html center>
        <div className="text-white text-2xl font-bold">
          {progress.toFixed(0)}%
        </div>
      </Html>
    </group>
  )
}
