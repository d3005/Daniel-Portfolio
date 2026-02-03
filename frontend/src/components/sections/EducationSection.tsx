import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { GraduationCap, School, BookOpen, Award, Brain, Cloud, Cpu, ExternalLink, Download, Sparkles, Star, CheckCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import type { Education, Certification } from '../../types/portfolio';

const educationIconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }> } = {
  GraduationCap,
  School,
  BookOpen,
};

const certIconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }> } = {
  Cpu,
  Cloud,
  Brain,
  Award,
};

// Sparkle component for decorative effects
function Sparkle({ delay = 0, size = 4, color = '#00f5ff', className = '' }: { delay?: number; size?: number; color?: string; className?: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
      }}
    >
      <Star size={size} fill={color} color={color} />
    </motion.div>
  );
}

// Floating geometric shapes
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Hexagons */}
      <motion.div
        className="absolute top-20 left-[10%] w-16 h-16 border-2 border-primary-500/20"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-40 right-[15%] w-12 h-12 border-2 border-accent-cyan/20"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        animate={{
          y: [0, 15, 0],
          rotate: [0, -180, -360],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Triangles */}
      <motion.div
        className="absolute bottom-32 left-[20%] w-0 h-0"
        style={{
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderBottom: '20px solid rgba(191, 0, 255, 0.2)',
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Circles */}
      <motion.div
        className="absolute top-1/2 right-[8%] w-8 h-8 rounded-full border-2 border-accent-green/30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Diamond */}
      <motion.div
        className="absolute bottom-20 right-[25%] w-10 h-10 border-2 border-primary-400/20"
        style={{ transform: 'rotate(45deg)' }}
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
}

interface EducationCardProps {
  education: Education;
  index: number;
}

function EducationCard({ education, index }: EducationCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = educationIconMap[education.icon] || GraduationCap;
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x);
    mouseY.set(y);
    rotateX.set(-y * 10);
    rotateY.set(x * 10);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const colors = ['#6366f1', '#22d3ee', '#f472b6'];
  const color = colors[index % colors.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative"
    >
      {/* Glow effect behind card */}
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${color}30 0%, transparent 70%)` }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Animated border */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${color}, #22d3ee, ${color})`,
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative glass-card h-full overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
        {/* Sparkles around the card */}
        <AnimatePresence>
          {isHovered && (
            <>
              <Sparkle delay={0} size={6} color={color} className="top-2 right-4" />
              <Sparkle delay={0.3} size={5} color="#22d3ee" className="top-8 right-8" />
              <Sparkle delay={0.6} size={4} color="#f472b6" className="bottom-4 left-4" />
              <Sparkle delay={0.9} size={6} color={color} className="bottom-8 right-6" />
            </>
          )}
        </AnimatePresence>

        {/* Top accent line with animation */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${color}, #22d3ee, ${color})` }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)',
            backgroundSize: '200% 100%',
          }}
          animate={isHovered ? { backgroundPosition: ['200% 0', '-200% 0'] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Icon with enhanced glow */}
        <motion.div
          className="relative w-16 h-16 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}20` }}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Inner glow ring */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ 
              boxShadow: `inset 0 0 20px ${color}40`,
              border: `1px solid ${color}30`,
            }}
            animate={isHovered ? { 
              boxShadow: [`inset 0 0 20px ${color}40`, `inset 0 0 30px ${color}60`, `inset 0 0 20px ${color}40`],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Icon size={32} style={{ color }} />
        </motion.div>

        {/* Degree with gradient on hover */}
        <motion.h3 
          className="heading-3 text-dark-100 mb-2 transition-all duration-300"
          style={isHovered ? { 
            background: `linear-gradient(90deg, ${color}, #22d3ee)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          } : {}}
        >
          {education.degree}
        </motion.h3>

        {/* Institution */}
        <p className="text-accent-cyan font-medium mb-3 flex items-center gap-2">
          <School size={16} className="opacity-60" />
          {education.institution}
        </p>

        {/* Duration & Grade */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-dark-400">
          <span className="flex items-center gap-1">
            <BookOpen size={14} className="opacity-60" />
            {education.duration}
          </span>
          <motion.span 
            className="px-3 py-1 rounded-full font-medium flex items-center gap-1"
            style={{ 
              backgroundColor: `${color}15`, 
              color,
              border: `1px solid ${color}30`,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle size={14} />
            {education.grade}
          </motion.span>
        </div>

        {/* Corner accents */}
        <div className="absolute top-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-0 right-0 w-full h-0.5" style={{ background: color }} />
          <div className="absolute top-0 right-0 w-0.5 h-full" style={{ background: color }} />
        </div>
        <div className="absolute bottom-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 w-full h-0.5" style={{ background: color }} />
          <div className="absolute bottom-0 left-0 w-0.5 h-full" style={{ background: color }} />
        </div>
      </div>
    </motion.div>
  );
}

interface CertificationCardProps {
  certification: Certification;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function CertificationCard({ certification, index, isExpanded, onToggle }: CertificationCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = certIconMap[certification.icon] || Award;
  const [isHovered, setIsHovered] = useState(false);

  const colors = ['#818cf8', '#22d3ee', '#f472b6', '#34d399'];
  const color = colors[index % colors.length];

  const hasLink = certification.link && certification.link.length > 0;
  const isDownload = certification.link?.endsWith('.pdf');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Sparkles */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              className="absolute -top-2 -right-2 z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <Sparkles size={20} style={{ color }} />
            </motion.div>
            <Sparkle delay={0.2} size={5} color={color} className="-top-1 left-1/4" />
            <Sparkle delay={0.5} size={4} color="#22d3ee" className="-bottom-1 right-1/3" />
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="relative glass-card overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.02, x: 5 }}
        onClick={onToggle}
        layout
      >
        {/* Animated top border */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${color}, #22d3ee)` }}
          initial={{ width: '0%' }}
          animate={{ width: isHovered || isExpanded ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
        />

        {/* Main content */}
        <div className="flex items-center gap-4">
          {/* Icon with enhanced styling */}
          <motion.div
            className="relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ border: `2px solid ${color}` }}
              animate={isHovered ? {
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <Icon size={26} style={{ color }} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.h4 
              className="font-semibold text-dark-100 truncate transition-all duration-300"
              style={isHovered ? { color } : {}}
            >
              {certification.title}
            </motion.h4>
            <p className="text-sm text-dark-400 truncate flex items-center gap-1">
              <Award size={12} className="opacity-60" />
              {certification.issuer}
            </p>
          </div>

          {/* Year badge & action */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.span 
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${color}15`, 
                color,
                border: `1px solid ${color}40`,
              }}
              whileHover={{ scale: 1.1 }}
            >
              {certification.year}
            </motion.span>
            {hasLink && (
              <motion.a
                href={certification.link}
                target={isDownload ? undefined : "_blank"}
                rel={isDownload ? undefined : "noopener noreferrer"}
                download={isDownload ? true : undefined}
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl text-dark-400 transition-all duration-300"
                style={{ 
                  backgroundColor: `${color}10`,
                  border: `1px solid ${color}30`,
                }}
              >
                {isDownload ? (
                  <Download size={18} style={{ color }} />
                ) : (
                  <ExternalLink size={18} style={{ color }} />
                )}
              </motion.a>
            )}
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-dark-700">
                <div className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle size={16} style={{ color }} />
                  <span>Verified credential from {certification.issuer}</span>
                </div>
                {hasLink && (
                  <motion.a
                    href={certification.link}
                    target={isDownload ? undefined : "_blank"}
                    rel={isDownload ? undefined : "noopener noreferrer"}
                    download={isDownload ? true : undefined}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    style={{ 
                      backgroundColor: `${color}20`,
                      color,
                      border: `1px solid ${color}40`,
                    }}
                    whileHover={{ scale: 1.05, x: 5 }}
                  >
                    {isDownload ? (
                      <>
                        <Download size={16} />
                        Download Certificate
                      </>
                    ) : (
                      <>
                        <ExternalLink size={16} />
                        View Credential
                      </>
                    )}
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner decorations */}
        <div className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-0 right-0 w-full h-px" style={{ background: color }} />
          <div className="absolute top-0 right-0 w-px h-full" style={{ background: color }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

interface EducationSectionProps {
  education: Education[];
  certifications: Certification[];
}

export default function EducationSection({ education, certifications }: EducationSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedCert, setExpandedCert] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for gradient mesh effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="education" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Animated gradient mesh background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* Semi-transparent content backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950/80 pointer-events-none" />

      {/* Floating geometric shapes */}
      <FloatingShapes />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        {/* Education */}
        <SectionHeader
          title="Education"
          subtitle="My academic journey and foundations"
        />

        {/* Decorative line connecting to cards */}
        <motion.div
          className="hidden md:block absolute left-1/2 h-12 w-px"
          style={{ 
            background: 'linear-gradient(180deg, transparent, #6366f1, transparent)',
            top: '160px',
          }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        />

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {education.map((edu, index) => (
            <EducationCard key={edu.id} education={edu} index={index} />
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="text-accent-cyan" size={24} />
              <h3 className="heading-2 gradient-text">Certifications</h3>
              <Sparkles className="text-accent-pink" size={24} />
            </motion.div>
            <p className="body-large max-w-2xl mx-auto">
              Professional certifications validating my expertise
            </p>
          </div>

          {/* Certification count badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-cyan/20 border border-primary-500/30 flex items-center gap-2">
              <Award size={18} className="text-accent-cyan" />
              <span className="text-dark-200 font-medium">
                {certifications.length} Professional Certifications
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <CertificationCard 
                key={cert.id} 
                certification={cert} 
                index={index}
                isExpanded={expandedCert === cert.id}
                onToggle={() => setExpandedCert(expandedCert === cert.id ? null : cert.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced background decorations */}
      <motion.div 
        className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244, 114, 182, 0.08) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent-cyan/40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
}
