import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ProgressiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  containerClassName?: string;
}

export function ProgressiveImage({
  src,
  alt,
  placeholderSrc,
  className = '',
  containerClassName = '',
  ...props
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (img.complete) {
        setIsLoaded(true);
      } else {
        img.addEventListener('load', () => setIsLoaded(true));
        img.addEventListener('error', () => setError(true));
      }
    }
  }, [src]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-dark-800/50 ${containerClassName}`}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <span className="text-dark-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Placeholder / Blur effect */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse bg-dark-800/50 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
      
      {/* Low quality placeholder if provided */}
      {placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        loading="lazy"
        decoding="async"
        {...props}
      />
      
      {/* Loading spinner */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

interface Lazy3DSceneProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export function Lazy3DScene({ 
  children, 
  fallback,
  rootMargin = '100px'
}: Lazy3DSceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {isVisible ? children : fallback}
    </div>
  );
}

// Preload critical resources
export function usePreloadImages(imageUrls: string[]) {
  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    preloadImages();
  }, [imageUrls]);
}

// Priority loading for above-the-fold images
export function usePriorityImage(src: string) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsReady(true);
    img.onerror = () => setIsReady(true);
  }, [src]);

  return isReady;
}