import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere, Trail } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

/**
 * Skill Orbs Constellation
 * Features:
 * - Spherical arrangement
 * - Magnetic mouse effect
 * - Hover interactions
 * - Trail effects
 */
export default function SkillOrbs({ skills, quality }) {
  const groupRef = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })

  // Track mouse position
  useMemo(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Rotate entire constellation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => (
        <SkillOrb
          key={skill}
          skill={skill}
          index={index}
          total={skills.length}
          mouseRef={mouseRef}
          quality={quality}
        />
      ))}
    </group>
  )
}

// Individual Skill Orb
function SkillOrb({ skill, index, total, mouseRef, quality }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Position on sphere using Fibonacci sphere algorithm
  const position = useMemo(() => {
    const phi = Math.acos(1 - 2 * (index + 0.5) / total)
    const theta = Math.PI * (1 + Math.sqrt(5)) * index
    const radius = 3

    return [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    ]
  }, [index, total])

  // Color based on position
  const color = useMemo(() => {
    const hue = (index / total) * 360
    return `hsl(${hue}, 70%, 60%)`
  }, [index, total])

  // Spring animation
  const { scale } = useSpring({
    scale: hovered ? 1.5 : 1,
    config: { tension: 300, friction: 20 }
  })

  // Magnetic effect and floating animation
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const basePos = new THREE.Vector3(...position)

    // Floating effect
    basePos.y += Math.sin(time * 2 + index) * 0.1

    // Magnetic effect - attract to mouse
    const mousePos = new THREE.Vector3(
      mouseRef.current.x * 5,
      mouseRef.current.y * 5,
      0
    )
    const direction = mousePos.sub(meshRef.current.position)
    const distance = direction.length()

    if (distance < 3) {
      const force = (3 - distance) / 3
      basePos.add(direction.normalize().multiplyScalar(force * 0.5))
    }

    // Smooth lerp to target position
    meshRef.current.position.lerp(basePos, 0.1)

    // Rotation
    meshRef.current.rotation.x = time * 0.5
    meshRef.current.rotation.y = time * 0.3
  })

  const OrbContent = () => (
    <animated.group scale={scale}>
      {/* Main Orb */}
      <Sphere
        args={[0.3, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Outer Ring */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.02, 16, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Skill Name */}
      <Text
        position={[0, hovered ? -0.6 : -0.5, 0]}
        fontSize={hovered ? 0.15 : 0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {skill}
      </Text>

      {/* Particles around orb */}
      {hovered && quality !== 'low' && <OrbParticles color={color} />}
    </animated.group>
  )

  return (
    <group ref={meshRef} position={position}>
      {quality === 'high' ? (
        <Trail
          width={0.5}
          length={6}
          color={color}
          attenuation={(t) => t * t}
        >
          <OrbContent />
        </Trail>
      ) : (
        <OrbContent />
      )}
    </group>
  )
}

// Particles orbiting the skill orb
function OrbParticles({ color }) {
  const particlesRef = useRef()

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.5
    }
  })

  const particles = useMemo(() => {
    const count = 12
    const radius = 0.5

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        ]
      }
    })
  }, [])

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}
