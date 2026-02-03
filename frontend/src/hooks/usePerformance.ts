import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export interface PerformanceConfig {
  isMobile: boolean;
  isLowEnd: boolean;
  isReducedMotion: boolean;
  shouldRender3D: boolean;
  dpr: [number, number];
  particleMultiplier: number;
  enableComplexEffects: boolean;
  enablePostProcessing: boolean;
}

/**
 * Hook to detect device capabilities and adjust rendering settings
 */
export function usePerformanceConfig(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>({
    isMobile: false,
    isLowEnd: false,
    isReducedMotion: false,
    shouldRender3D: true,
    dpr: [1, 2],
    particleMultiplier: 1,
    enableComplexEffects: true,
    enablePostProcessing: true,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = motionQuery.matches;

    // Check for mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     window.innerWidth < 768;

    // Check for low-end device (low core count or memory)
    const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                     (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined && 
                     (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;

    // Check for battery saver mode (if available)
    const checkBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as Navigator & { getBattery: () => Promise<{ charging: boolean; level: number }> }).getBattery();
          return !battery.charging && battery.level < 0.2;
        }
      } catch {
        // Battery API not available
      }
      return false;
    };

    checkBattery().then((isLowBattery) => {
      let dpr: [number, number] = [1, 2];
      let particleMultiplier = 1;
      let enableComplexEffects = true;
      let enablePostProcessing = true;
      let shouldRender3D = !isReducedMotion;

      // Adjust settings based on device capabilities
      if (isReducedMotion) {
        shouldRender3D = false;
      } else if (isMobile) {
        dpr = [1, 1];
        particleMultiplier = 0.3;
        enableComplexEffects = false;
        enablePostProcessing = false;
      } else if (isLowEnd || isLowBattery) {
        dpr = [1, 1.5];
        particleMultiplier = 0.5;
        enableComplexEffects = false;
        enablePostProcessing = false;
      }

      setConfig({
        isMobile,
        isLowEnd,
        isReducedMotion,
        shouldRender3D,
        dpr,
        particleMultiplier,
        enableComplexEffects,
        enablePostProcessing,
      });
    });

    // Listen for motion preference changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({
        ...prev,
        isReducedMotion: e.matches,
        shouldRender3D: !e.matches,
      }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  return config;
}

/**
 * Hook to adjust particle counts based on device performance
 */
export function useOptimizedCount(baseCount: number, config?: PerformanceConfig): number {
  const defaultConfig = usePerformanceConfig();
  const activeConfig = config || defaultConfig;

  return useMemo(() => {
    return Math.floor(baseCount * activeConfig.particleMultiplier);
  }, [baseCount, activeConfig.particleMultiplier]);
}

/**
 * Hook to lazy load 3D components using Intersection Observer
 */
export function useIntersectionLoader(
  threshold = 0.1,
  rootMargin = '100px'
): {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  hasBeenVisible: boolean;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, hasBeenVisible]);

  return { ref: ref as React.RefObject<HTMLDivElement>, isVisible, hasBeenVisible };
}

/**
 * Hook to pause/resume 3D rendering based on visibility
 */
export function useRenderControl(isVisible: boolean) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Immediately start rendering when visible
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShouldRender(true);
    } else {
      // Delay stopping render to allow smooth exit
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  return shouldRender;
}

/**
 * Hook to detect page visibility and pause 3D when tab is hidden
 */
export function usePageVisibility(): boolean {
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isPageVisible;
}

/**
 * Combined hook for optimal 3D rendering control
 */
export function useOptimal3D(
  options: {
    baseParticleCount?: number;
    threshold?: number;
    rootMargin?: string;
  } = {}
) {
  const { baseParticleCount = 100, threshold = 0.1, rootMargin = '100px' } = options;
  
  const performanceConfig = usePerformanceConfig();
  const { ref, isVisible, hasBeenVisible } = useIntersectionLoader(threshold, rootMargin);
  const isPageVisible = usePageVisibility();
  const shouldRender = useRenderControl(isVisible && isPageVisible);
  
  const particleCount = useOptimizedCount(baseParticleCount, performanceConfig);

  return {
    ref,
    isVisible,
    hasBeenVisible,
    shouldRender: shouldRender && performanceConfig.shouldRender3D,
    performanceConfig,
    particleCount,
    isPageVisible,
  };
}

/**
 * Hook to measure and report FPS for debugging
 */
export function useFPSMonitor(enabled = false) {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  const measureFPS = useCallback(() => {
    if (!enabled) return;

    frameCount.current++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime.current;

    if (elapsed >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / elapsed));
      frameCount.current = 0;
      lastTime.current = currentTime;
    }

    requestAnimationFrame(measureFPS);
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      requestAnimationFrame(measureFPS);
    }
  }, [enabled, measureFPS]);

  return fps;
}

export default usePerformanceConfig;
