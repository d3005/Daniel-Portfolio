import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
}

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const trailRef = useRef<TrailDot[]>([]);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  
  // Smooth cursor position
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Spring animation for smooth following
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device has cursor (not touch)
    const hasCursor = window.matchMedia('(pointer: fine)').matches;
    if (!hasCursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Update trail
      const newDot = { x: e.clientX, y: e.clientY, opacity: 1 };
      trailRef.current = [newDot, ...trailRef.current.slice(0, 7)].map((dot, i) => ({
        ...dot,
        opacity: 1 - (i * 0.12)
      }));
      setTrail([...trailRef.current]);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Detect hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, .glass-card');
      setIsHovering(!!isHoverable);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);

    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Add cursor:none to all interactive elements
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      document.body.style.cursor = 'auto';
      style.remove();
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Trail dots */}
      {trail.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: dot.x,
            top: dot.y,
            x: '-50%',
            y: '-50%',
            width: 8 - i * 0.8,
            height: 8 - i * 0.8,
            opacity: dot.opacity * 0.5,
            background: i % 2 === 0 
              ? 'linear-gradient(135deg, #00f5ff, #5b6cf2)' 
              : 'linear-gradient(135deg, #bf00ff, #00f5ff)',
            boxShadow: `0 0 ${10 - i}px ${i % 2 === 0 ? '#00f5ff' : '#bf00ff'}`,
          }}
        />
      ))}
      
      {/* Main cursor ring */}
      <motion.div
        className="absolute rounded-full border-2 border-accent-cyan/80"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          width: isHovering ? 50 : isClicking ? 20 : 32,
          height: isHovering ? 50 : isClicking ? 20 : 32,
          borderColor: isHovering ? 'rgba(191, 0, 255, 0.8)' : 'rgba(0, 245, 255, 0.8)',
          backgroundColor: isClicking ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Inner dot */}
      <motion.div
        className="absolute rounded-full bg-accent-cyan"
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          width: isClicking ? 8 : 6,
          height: isClicking ? 8 : 6,
          backgroundColor: isHovering ? '#bf00ff' : '#00f5ff',
          boxShadow: isHovering 
            ? '0 0 15px #bf00ff, 0 0 30px #bf00ff' 
            : '0 0 10px #00f5ff, 0 0 20px #00f5ff',
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Hover ring expansion effect */}
      {isHovering && (
        <motion.div
          className="absolute rounded-full border border-accent-purple/40"
          style={{
            left: cursorXSpring,
            top: cursorYSpring,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ width: 50, height: 50, opacity: 0.6 }}
          animate={{ 
            width: 70, 
            height: 70, 
            opacity: 0,
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
      
      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          className="absolute rounded-full border-2 border-accent-cyan"
          style={{
            left: cursorX,
            top: cursorY,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ width: 20, height: 20, opacity: 1 }}
          animate={{ 
            width: 60, 
            height: 60, 
            opacity: 0,
          }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
}
