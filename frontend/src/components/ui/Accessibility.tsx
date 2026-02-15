import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface Accessible3DWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  interactive?: boolean;
}

export function Accessible3DWrapper({
  children,
  title,
  description,
  className = '',
  onFocus,
  onBlur,
  interactive = false
}: Accessible3DWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;

    switch (e.key) {
      case 'Tab':
        // Allow natural tab navigation
        break;
      case 'Enter':
      case ' ':
        // Trigger any interactive action
        e.preventDefault();
        containerRef.current?.click();
        break;
      case 'Escape':
        // Reset or exit interaction
        if (isFocused) {
          containerRef.current?.blur();
        }
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      role="img"
      aria-label={description}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      whileFocus={interactive ? { scale: 1.02 } : undefined}
      whileHover={interactive ? { scale: 1.01 } : undefined}
    >
      {/* Screen reader only title */}
      <h2 className="sr-only">{title}</h2>
      
      {/* Visual description for screen readers */}
      <p className="sr-only">{description}</p>
      
      {/* Main 3D content */}
      {children}
      
      {/* Focus indicator */}
      {isFocused && interactive && (
        <div 
          className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none"
          aria-hidden="true"
        />
      )}
      
      {/* Keyboard instructions for screen readers */}
      {interactive && (
        <span className="sr-only">
          Press Enter or Space to interact. Press Escape to exit.
        </span>
      )}
    </motion.div>
  );
}

interface SkipToMainContentProps {
  mainContentId?: string;
}

export function SkipToMainContent({ mainContentId = 'main-content' }: SkipToMainContentProps) {
  return (
    <a
      href={`#${mainContentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
    >
      Skip to main content
    </a>
  );
}

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Hook for announcing changes to screen readers
export function useAnnouncer() {
  const [announcement, setAnnouncement] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setPoliteness(priority);
    setAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return { announcement, politeness, announce, LiveRegionComponent: () => (
    <LiveRegion message={announcement} politeness={politeness} />
  )};
}

// High contrast mode support
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
}

// Reduced motion support
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}