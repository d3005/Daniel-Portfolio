import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox, Text, useTexture } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import * as THREE from 'three'

/**
 * 3D Project Carousel
 * Features:
 * - Auto-rotation
 * - Click to focus
 * - Hover effects
 * - Smooth transitions
 */
export default function ProjectCarousel({ projects, quality }) {
  const groupRef = useRef()
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)

  useFrame((state) => {
    if (groupRef.current && autoRotate && focusedIndex === null) {
      groupRef.current.rotation.y += 0.003
    }
  })

  const radius = 4
  const angleStep = (Math.PI * 2) / projects.length

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => {
        const angle = angleStep * index
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <ProjectCard
            key={index}
            project={project}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
            index={index}
            focusedIndex={focusedIndex}
            onFocus={() => {
              setFocusedIndex(index)
              setAutoRotate(false)
            }}
            onBlur={() => {
              setFocusedIndex(null)
              setAutoRotate(true)
            }}
            quality={quality}
          />
        )
      })}
    </group>
  )
}

// Individual Project Card
function ProjectCard({ 
  project, 
  position, 
  rotation, 
  index, 
  focusedIndex,
  onFocus, 
  onBlur,
  quality 
}) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()

  const isFocused = focusedIndex === index
  const isOtherFocused = focusedIndex !== null && !isFocused

  // Spring animations
  const { scale, positionY, opacity } = useSpring({
    scale: isFocused ? 1.5 : hovered ? 1.1 : 1,
    positionY: isFocused ? 1 : 0,
    opacity: isOtherFocused ? 0.3 : 1,
    config: config.wobbly
  })

  // Floating animation
  useFrame((state) => {
    if (meshRef.current && !isFocused) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.1
    }
  })

  return (
    <animated.group 
      position={[position[0], positionY, position[2]]}
      rotation={rotation}
      scale={scale}
    >
      <group ref={meshRef}>
        {/* Card Background */}
        <RoundedBox
          args={[2, 2.5, 0.1]}
          radius={0.1}
          smoothness={4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={isFocused ? onBlur : onFocus}
          castShadow
          receiveShadow
        >
          <animated.meshStandardMaterial
            color={project.color}
            metalness={0.6}
            roughness={0.3}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            opacity={opacity}
            transparent
          />
        </RoundedBox>

        {/* Project Info */}
        <Html
          transform
          occlude
          position={[0, 0, 0.06]}
          distanceFactor={1.5}
          style={{
            width: '280px',
            transition: 'all 0.3s',
            pointerEvents: isFocused ? 'auto' : 'none'
          }}
        >
          <div className={`project-card ${isFocused ? 'focused' : ''}`}>
            <h3 className="text-white font-bold text-lg mb-2">
              {project.title}
            </h3>
            <p className="text-white/80 text-sm mb-3">
              {project.description}
            </p>
            {isFocused && (
              <div className="tech-stack flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white/20 rounded text-xs text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Html>

        {/* Glow Effect */}
        {hovered && quality !== 'low' && (
          <mesh scale={1.05}>
            <boxGeometry args={[2, 2.5, 0.1]} />
            <meshBasicMaterial
              color={project.color}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Tech Icons (3D) */}
        {isFocused && (
          <TechIcons 
            tech={project.tech} 
            cardHeight={2.5}
          />
        )}
      </group>
    </animated.group>
  )
}

// Floating Tech Icons
function TechIcons({ tech, cardHeight }) {
  return (
    <group position={[0, cardHeight / 2 + 0.5, 0]}>
      {tech.map((techName, i) => (
        <Text
          key={i}
          position={[
            (i - tech.length / 2 + 0.5) * 0.8,
            Math.sin(i) * 0.2,
            0.2
          ]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {techName}
        </Text>
      ))}
    </group>
  )
}
