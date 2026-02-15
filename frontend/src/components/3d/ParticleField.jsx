import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * GPU-Accelerated Particle Field
 * Features:
 * - Dynamic particle movement
 * - Mouse interaction
 * - Color gradients
 * - Performance optimized
 */
export default function ParticleField({ count = 2000 }) {
  const pointsRef = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })

  // Generate particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      // Color gradient
      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Scale variation
      scales[i] = Math.random() * 0.5 + 0.5
    }

    return { positions, colors, scales }
  }, [count])

  // Mouse movement tracking
  useMemo(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime

    // Animate each particle
    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Wave motion
      const x = positions[i3]
      const y = positions[i3 + 1]
      const z = positions[i3 + 2]

      positions[i3 + 1] = y + Math.sin(time + x * 0.5) * 0.01
      positions[i3] = x + Math.cos(time + y * 0.5) * 0.01

      // Mouse attraction
      const dx = mouseRef.current.x * 10 - x
      const dy = mouseRef.current.y * 10 - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 5) {
        positions[i3] += dx * 0.001
        positions[i3 + 1] += dy * 0.001
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Rotation
    pointsRef.current.rotation.y = time * 0.05
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
  })

  return (
    <Points ref={pointsRef} positions={particles.positions}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        count={count}
        array={particles.colors}
        itemSize={3}
      />
    </Points>
  )
}
