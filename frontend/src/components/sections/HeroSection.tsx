import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter, ChevronDown } from 'lucide-react';
import HeroScene from '../3d/HeroScene';
import type { Profile } from '../../types/portfolio';

interface HeroSectionProps {
  profile: Profile;
}

function TypewriterText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(text.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, texts]);

  return (
    <span className="gradient-text">
      {currentText}
      <span className="animate-pulse text-accent-cyan">|</span>
    </span>
  );
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}+</span>;
}

// ============================================
// 3D ROTATING PHOTO FRAME WITH HOLOGRAPHIC EFFECTS
// ============================================
function Photo3DFrame({ image, name }: { image: string; name: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  
  // Shine effect position
  const shineX = useTransform(mouseX, [-0.5, 0.5], [-50, 150]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], [-50, 150]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      {/* Outer animated glow */}
      <motion.div
        className="absolute -inset-6 rounded-3xl"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, rgba(0, 245, 255, 0.4) 0%, rgba(191, 0, 255, 0.2) 50%, transparent 70%)',
            'radial-gradient(circle at 70% 70%, rgba(191, 0, 255, 0.4) 0%, rgba(0, 245, 255, 0.2) 50%, transparent 70%)',
            'radial-gradient(circle at 30% 70%, rgba(91, 108, 242, 0.4) 0%, rgba(0, 245, 255, 0.2) 50%, transparent 70%)',
            'radial-gradient(circle at 30% 30%, rgba(0, 245, 255, 0.4) 0%, rgba(191, 0, 255, 0.2) 50%, transparent 70%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ filter: 'blur(30px)' }}
      />
      
      {/* Main 3D Card */}
      <motion.div
        ref={frameRef}
        className="relative cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient border with animation */}
        <motion.div
          className="absolute -inset-[3px] rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #00f5ff, #5b6cf2, #bf00ff, #00f5ff)',
            backgroundSize: '300% 300%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner frame */}
        <div className="relative w-48 h-60 sm:w-64 sm:h-80 md:w-72 md:h-88 lg:w-80 lg:h-96 rounded-3xl overflow-hidden bg-dark-950">
          {/* Photo */}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
          
          {/* Scanline effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.03) 2px, rgba(0, 245, 255, 0.03) 4px)',
            }}
          />
          
          {/* Moving scanline */}
          <motion.div
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent pointer-events-none"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />
          
          {/* Holographic overlay */}
          <motion.div
            className="absolute inset-0 mix-blend-color-dodge pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(0, 245, 255, 0.1) 45%, rgba(191, 0, 255, 0.1) 55%, transparent 60%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 200%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
          
          {/* Corner brackets (sci-fi style) */}
          <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-accent-cyan/60" />
          <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-accent-cyan/60" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-accent-cyan/60" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-accent-cyan/60" />
          
          {/* Inner glow border */}
          <div className="absolute inset-0 rounded-3xl border border-accent-cyan/20 shadow-inner" />
        </div>
        
        {/* 3D Depth layers (behind) */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-3xl bg-accent-cyan/10"
          style={{ transform: 'translateZ(-20px)', filter: 'blur(8px)' }}
        />
        <motion.div
          className="absolute inset-0 -z-20 rounded-3xl bg-accent-purple/10"
          style={{ transform: 'translateZ(-40px)', filter: 'blur(16px)' }}
        />
      </motion.div>
      
      {/* Floating icons with enhanced styling */}
      <FloatingIcon emoji="🐍" position="top-left" delay={0} />
      <FloatingIcon emoji="🧠" position="top-right" delay={0.5} />
      <FloatingIcon emoji="🤖" position="bottom-left" delay={1} />
      <FloatingIcon emoji="🚀" position="bottom-right" delay={1.5} />
      
      {/* Particle ring around frame */}
      <ParticleRing />
    </div>
  );
}

// Enhanced floating icon component
function FloatingIcon({ emoji, position, delay }: { emoji: string; position: string; delay: number }) {
  const positionClasses: Record<string, string> = {
    'top-left': '-top-4 -left-4',
    'top-right': '-top-4 -right-4',
    'bottom-left': '-bottom-4 -left-4',
    'bottom-right': '-bottom-4 -right-4',
  };

  return (
    <motion.div
      className={`hidden sm:flex absolute ${positionClasses[position]} w-12 h-12 md:w-14 md:h-14 rounded-xl bg-dark-900/90 backdrop-blur-md border border-accent-cyan/40 items-center justify-center text-xl md:text-2xl shadow-lg cursor-pointer z-10`}
      style={{
        boxShadow: '0 0 20px rgba(0, 245, 255, 0.2), inset 0 0 20px rgba(0, 245, 255, 0.05)',
      }}
      animate={{
        y: [0, -12, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        y: { duration: 3, repeat: Infinity, delay },
        rotate: { duration: 6, repeat: Infinity, delay },
      }}
      whileHover={{
        scale: 1.15,
        boxShadow: '0 0 30px rgba(0, 245, 255, 0.5), inset 0 0 20px rgba(0, 245, 255, 0.1)',
        borderColor: 'rgba(0, 245, 255, 0.8)',
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Particle ring around photo
function ParticleRing() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * Math.PI * 2,
    delay: i * 0.1,
    size: 2 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-accent-cyan"
          style={{
            left: '50%',
            top: '50%',
            boxShadow: '0 0 6px rgba(0, 245, 255, 0.8)',
          }}
          animate={{
            x: [
              Math.cos(particle.angle) * 140,
              Math.cos(particle.angle + Math.PI * 2) * 140,
            ],
            y: [
              Math.sin(particle.angle) * 180,
              Math.sin(particle.angle + Math.PI * 2) * 180,
            ],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// ANIMATED SCROLL INDICATOR
// ============================================
function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <span className="text-sm text-dark-400">Explore More</span>
      <motion.div
        className="relative w-6 h-10 rounded-full border-2 border-accent-cyan/50 flex justify-center"
        animate={{
          boxShadow: [
            '0 0 10px rgba(0, 245, 255, 0.2)',
            '0 0 20px rgba(0, 245, 255, 0.4)',
            '0 0 10px rgba(0, 245, 255, 0.2)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1.5 h-3 bg-accent-cyan rounded-full mt-2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-accent-cyan/60" />
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const roles = [
    "GenAI & ML Engineer",
    "Data Science Enthusiast", 
    "Deep Learning Developer",
    "AI Problem Solver",
    "RAG Pipeline Architect"
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      {/* 3D Background */}
      <HeroScene />
      
      <div className="container-custom relative z-10 py-8 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Profile Image with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <Photo3DFrame image={profile.image} name={profile.name} />
          </motion.div>

          {/* Content */}
          <div className="relative text-center lg:text-left order-1 lg:order-2 p-6 md:p-8">
            {/* Glassmorphism backdrop for text readability */}
            <div
              className="absolute inset-0 rounded-3xl bg-dark-950/70 backdrop-blur-md border border-primary-500/10 -z-10"
              style={{
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03), 0 0 40px rgba(0, 0, 0, 0.3)'
              }}
            />
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent-green/10 border border-accent-green/30 mb-4 md:mb-6"
            >
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span className="text-accent-green text-xs md:text-sm font-medium">Available for Opportunities</span>
            </motion.div>

            {/* Name with neon effect */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="heading-1 mb-3 md:mb-4"
            >
              <span className="text-dark-100">{profile.name.split(' ').slice(0, -1).join(' ')}</span>{' '}
              <span className="gradient-text">{profile.name.split(' ').slice(-1)}</span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl font-medium mb-3 md:mb-4 min-h-[32px]"
            >
              <TypewriterText texts={roles} />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-dark-400 text-sm md:text-base mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {profile.subtitle}
            </motion.p>

            {/* Stats with pulse animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center lg:justify-start gap-6 md:gap-8 mb-6 md:mb-8 py-4 md:py-6 border-y border-accent-cyan/20"
            >
              {[
                { value: profile.stats.internships, label: 'Internships' },
                { value: profile.stats.projects, label: 'Projects' },
                { value: profile.stats.certifications, label: 'Certifications' },
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="text-center relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Glow on hover */}
                  <motion.div
                    className="absolute -inset-2 bg-accent-cyan/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ filter: 'blur(8px)' }}
                  />
                  <motion.div
                    className="font-mono text-2xl md:text-3xl font-bold text-accent-cyan relative"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(0, 245, 255, 0.5)',
                        '0 0 20px rgba(0, 245, 255, 0.8)',
                        '0 0 10px rgba(0, 245, 255, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <AnimatedCounter value={stat.value} />
                  </motion.div>
                  <div className="text-xs md:text-sm text-dark-400 uppercase tracking-wider relative">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs - Updated to use Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 mb-6 md:mb-8"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 245, 255, 0.5), 0 0 60px rgba(0, 245, 255, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/contact"
                  className="btn-primary flex items-center gap-2 text-sm md:text-base px-4 md:px-6 py-2.5 md:py-3 relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <Mail size={16} className="md:w-[18px] md:h-[18px] relative z-10" />
                  <span className="relative z-10">Get In Touch</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(91, 108, 242, 0.4), 0 0 50px rgba(91, 108, 242, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/projects"
                  className="btn-secondary flex items-center gap-2 text-sm md:text-base px-4 md:px-6 py-2.5 md:py-3 relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-cyan/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">View My Work</span>
                  <ArrowRight size={16} className="md:w-[18px] md:h-[18px] relative z-10" />
                </Link>
              </motion.div>
              <motion.a
                href={profile.resume}
                download="Daniel_Joseph_Kommu_Resume.pdf"
                className="btn-glass flex items-center gap-2 text-sm md:text-base px-4 md:px-6 py-2.5 md:py-3 relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(191, 0, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 to-accent-purple/5"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <Download size={16} className="md:w-[18px] md:h-[18px] relative z-10" />
                <span className="relative z-10">Resume</span>
              </motion.a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex justify-center lg:justify-start gap-3 md:gap-4"
            >
              {[
                { icon: Github, href: profile.social.github },
                { icon: Linkedin, href: profile.social.linkedin },
                { icon: Twitter, href: profile.social.twitter },
                { icon: Mail, href: `mailto:${profile.email}` },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 md:p-3 glass-card rounded-xl text-dark-400 hover:text-accent-cyan transition-colors"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={18} className="md:w-5 md:h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll indicator */}
      <motion.div
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Link to="/skills" className="group">
          <ScrollIndicator />
        </Link>
      </motion.div>
    </section>
  );
}
