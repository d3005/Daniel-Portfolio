import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Camera Controller
 * Smoothly transitions camera between sections
 */
export default function CameraController({ section }) {
  const cameraRef = useRef()
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())

  // Define camera positions for each section
  const cameraPositions = {
    home: {
      position: [0, 2, 8],
      lookAt: [0, 0, 0]
    },
    about: {
      position: [6, 2, 6],
      lookAt: [0, 0, 0]
    },
    projects: {
      position: [0, 3, 10],
      lookAt: [0, 0, 0]
    },
    skills: {
      position: [-6, 2, 6],
      lookAt: [0, 0, 0]
    },
    contact: {
      position: [0, 1, 6],
      lookAt: [0, 0, 0]
    }
  }

  // Update target when section changes
  useEffect(() => {
    const pos = cameraPositions[section] || cameraPositions.home
    targetPosition.current.set(...pos.position)
    targetLookAt.current.set(...pos.lookAt)
  }, [section])

  // Smooth camera transition
  useFrame(() => {
    // Lerp camera position
    camera.position.lerp(targetPosition.current, 0.05)

    // Smooth look-at transition
    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    currentLookAt.multiplyScalar(10)
    currentLookAt.add(camera.position)

    currentLookAt.lerp(targetLookAt.current, 0.05)
    camera.lookAt(currentLookAt)

    // Gentle camera sway
    camera.position.y += Math.sin(Date.now() * 0.0005) * 0.005
    camera.position.x += Math.cos(Date.now() * 0.0003) * 0.003
  })

  return null
}

/**
 * Orbital Camera Controller
 * Alternative camera that orbits around the scene
 */
export function OrbitalCameraController({ section, enabled = false }) {
  const { camera } = useThree()
  const orbitRef = useRef({
    angle: 0,
    radius: 8,
    height: 2
  })

  useFrame((state) => {
    if (!enabled) return

    // Orbit around center
    orbitRef.current.angle += 0.002

    const x = Math.cos(orbitRef.current.angle) * orbitRef.current.radius
    const z = Math.sin(orbitRef.current.angle) * orbitRef.current.radius
    const y = orbitRef.current.height + Math.sin(state.clock.elapsedTime * 0.5) * 0.5

    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * Mouse-Interactive Camera
 * Camera follows mouse movement
 */
export function MouseCameraController({ intensity = 0.5 }) {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    // Offset camera based on mouse position
    const targetX = mouseRef.current.x * intensity
    const targetY = mouseRef.current.y * intensity

    camera.position.x += (targetX - camera.position.x * 0.1) * 0.05
    camera.position.y += (targetY + 2 - camera.position.y) * 0.05
  })

  return null
}
