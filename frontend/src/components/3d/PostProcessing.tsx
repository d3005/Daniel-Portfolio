import { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Enhanced Bloom with custom settings
export function EnhancedBloom({ intensity = 0.5, luminanceThreshold = 0.9 }) {
  return (
    <EffectComposer>
      <Bloom
        intensity={intensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}

// Full post-processing stack
export function PostProcessingEffects({ 
  enableBloom = true,
  enableVignette = true,
  enableNoise = false,
  quality = 'high'
}: {
  enableBloom?: boolean;
  enableVignette?: boolean;
  enableNoise?: boolean;
  quality?: 'low' | 'medium' | 'high';
}) {
  const settings = useMemo(() => {
    switch (quality) {
      case 'low':
        return { bloom: 0.2, vignette: 0.3, noise: 0 };
      case 'medium':
        return { bloom: 0.4, vignette: 0.5, noise: 0.02 };
      case 'high':
      default:
        return { bloom: 0.6, vignette: 0.6, noise: 0.03 };
    }
  }, [quality]);

  if (quality === 'low') {
    return null; // Skip post-processing on low quality
  }

  return (
    <EffectComposer>
      {enableBloom && (
        <Bloom
          intensity={settings.bloom}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      )}
      
      {enableVignette && (
        <Vignette
          offset={0.3}
          darkness={settings.vignette}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {enableNoise && (
        <Noise
          opacity={settings.noise}
          blendFunction={BlendFunction.OVERLAY}
        />
      )}
    </EffectComposer>
  );
}

// Custom wave distortion shader
export function WaveDistortion() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00f5ff') },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          
          void main() {
            vec2 uv = vUv;
            
            // Wave distortion
            float wave = sin(uv.y * 10.0 + uTime) * 0.01;
            wave += sin(uv.x * 15.0 + uTime * 0.5) * 0.01;
            
            // Color gradient
            vec3 color = mix(uColor, vec3(0.75, 0.0, 1.0), uv.y + wave);
            
            // Fade at edges
            float alpha = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x);
            alpha *= smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
            
            gl_FragColor = vec4(color, alpha * 0.1);
          }
        `}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default { PostProcessingEffects, EnhancedBloom, WaveDistortion };
