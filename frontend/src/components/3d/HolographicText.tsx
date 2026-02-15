import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Holographic Text Component
 * Features:
 * - Glowing outline
 * - Chromatic aberration effect
 * - Floating animation
 * - Transparency
 */
export default function HolographicText({ 
  text, 
  position = [0, 0, 0], 
  size = 0.5,
  color = '#4F46E5'
}) {
  const textRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (textRef.current) {
      // Gentle floating
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Subtle rotation
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }

    if (glowRef.current) {
      // Pulsating glow
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7
      glowRef.current.material.opacity = pulse * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Main Text */}
      <Text
        ref={textRef}
        fontSize={size}
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="/fonts/inter-bold.woff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={size * 0.05}
        outlineColor="#ffffff"
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.95}
        />
      </Text>

      {/* Glow Layer 1 */}
      <Text
        ref={glowRef}
        position={[0, 0, -0.01]}
        fontSize={size * 1.1}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Text>

      {/* Glow Layer 2 - Larger */}
      <Text
        position={[0, 0, -0.02]}
        fontSize={size * 1.2}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Text>

      {/* Scan lines effect */}
      <ScanLines position={[0, 0, 0.01]} size={size} text={text} />
    </group>
  )
}

// Holographic scan lines effect
function ScanLines({ position, size, text }) {
  const scanRef = useRef()

  useFrame((state) => {
    if (scanRef.current) {
      scanRef.current.position.y = (Math.sin(state.clock.elapsedTime * 3) * 0.5) * size
    }
  })

  return (
    <group position={position}>
      <mesh ref={scanRef}>
        <planeGeometry args={[size * text.length * 0.6, 0.05]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/**
 * 3D Extruded Text with Glass Effect
 */
export function GlassText({ 
  text, 
  position = [0, 0, 0], 
  size = 0.5,
  color = '#4F46E5'
}) {
  const textRef = useRef()

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Text3D
      ref={textRef}
      position={position}
      font="/fonts/helvetiker_bold.typeface.json"
      size={size}
      height={0.2}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
    >
      {text}
      <MeshTransmissionMaterial
        backside
        samples={16}
        resolution={512}
        transmission={0.95}
        roughness={0.2}
        thickness={0.5}
        ior={1.5}
        chromaticAberration={0.5}
        anisotropy={1}
        distortion={0.1}
        distortionScale={0.2}
        temporalDistortion={0.1}
        color={color}
      />
    </Text3D>
  )
}

// Helper component for 3D text
import { Text3D } from '@react-three/drei'
