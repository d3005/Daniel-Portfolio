import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Html } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

/**
 * Interactive 3D Cards
 * Features:
 * - Flip animation on click
 * - Hover effects
 * - Smooth transitions
 * - Front and back content
 */
export default function InteractiveCards({ cards, position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {cards.map((card, index) => (
        <InteractiveCard
          key={index}
          card={card}
          position={[
            (index - cards.length / 2 + 0.5) * 3,
            0,
            0
          ]}
          index={index}
        />
      ))}
    </group>
  )
}

// Individual Interactive Card
function InteractiveCard({ card, position, index }) {
  const cardRef = useRef()
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Spring animations
  const { rotationY, scale, positionY } = useSpring({
    rotationY: flipped ? Math.PI : 0,
    scale: hovered ? 1.1 : 1,
    positionY: hovered ? 0.3 : 0,
    config: { tension: 200, friction: 25 }
  })

  // Floating animation
  useFrame((state) => {
    if (cardRef.current && !hovered) {
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime + index * 0.5) * 0.2
    }
  })

  return (
    <animated.group
      ref={cardRef}
      position={[position[0], positionY, position[2]]}
      rotation-y={rotationY}
      scale={scale}
    >
      {/* Front Side */}
      <CardSide
        title={card.title}
        color={card.color}
        isBack={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setFlipped(!flipped)}
        hovered={hovered}
      />

      {/* Back Side */}
      <CardSide
        title={card.content}
        color={card.color}
        isBack={true}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setFlipped(!flipped)}
        hovered={hovered}
      />

      {/* Glow effect */}
      {hovered && (
        <mesh scale={1.05}>
          <boxGeometry args={[2, 2.5, 0.1]} />
          <meshBasicMaterial
            color={card.color}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </animated.group>
  )
}

// Card Side Component
function CardSide({ 
  title, 
  color, 
  isBack, 
  onPointerOver, 
  onPointerOut, 
  onClick,
  hovered 
}) {
  return (
    <group
      rotation-y={isBack ? Math.PI : 0}
      position-z={isBack ? -0.05 : 0.05}
    >
      <RoundedBox
        args={[2, 2.5, 0.1]}
        radius={0.1}
        smoothness={4}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
          side={THREE.FrontSide}
        />
      </RoundedBox>

      {/* Text Content */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={isBack ? 0.15 : 0.25}
        maxWidth={1.8}
        textAlign="center"
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {title}
      </Text>

      {/* Decorative Elements */}
      {!isBack && <CardDecoration color={color} />}
    </group>
  )
}

// Decorative elements on card
function CardDecoration({ color }) {
  const decorRef = useRef()

  useFrame((state) => {
    if (decorRef.current) {
      decorRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={decorRef} position={[0, -0.8, 0.06]}>
      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 0.3,
            Math.sin((i / 3) * Math.PI * 2) * 0.3,
            0
          ]}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}
