import { useRef, lazy, Suspense, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Cpu, Layers, Code, Cloud, Server, Star, Zap } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import type { Skill } from '../../types/portfolio';

// Lazy load 3D canvas for better initial load
const SkillsCanvas = lazy(() => 
  import('../3d/effects/SectionEnhancements').then(module => ({ 
    default: module.SkillsCanvas 
  }))
);

const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }> } = {
  Brain,
  Cpu,
  Layers,
  Code,
  Cloud,
  Server,
};

// Skill proficiency levels (hardcoded for now, can be moved to data)
const skillProficiency: { [key: string]: number } = {
  'GenAI Development': 95,
  'Machine Learning': 90,
  'Deep Learning': 88,
  'MLOps': 85,
  'Web Development': 82,
  'Cloud & DevOps': 80,
};

interface SkillCardProps {
  skill: Skill;
  index: number;
}

// Proficiency bar component with glow effect
function ProficiencyBar({ level, color, isInView }: { level: number; color: string; isInView: boolean }) {
  return (
    <div className="mt-4 mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-dark-400">Proficiency</span>
        <span className="text-xs font-mono text-accent-cyan">{level}%</span>
      </div>
      <div className="h-2 bg-dark-800 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, rgba(0, 245, 255, 0.8))`,
            boxShadow: `0 0 15px ${color}80`,
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ background: `rgba(255, 255, 255, 0.3)` }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Floating skill particles background
function FloatingParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary-500/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function SkillCard({ skill, index }: SkillCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = iconMap[skill.icon] || Brain;
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const proficiency = skillProficiency[skill.title] || 80;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        y: -15, 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative h-full"
    >
      {/* Enhanced animated gradient border */}
      <motion.div 
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: `linear-gradient(135deg, ${skill.color}, #00f5ff, ${skill.color})`,
          backgroundSize: '200% 200%',
        }}
        animate={isHovered ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Enhanced outer glow */}
      <motion.div
        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(circle at center, ${skill.color}60 0%, transparent 70%)`,
          filter: 'blur(25px)',
        }}
      />

      {/* Light glow following mouse */}
      <motion.div
        className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          width: 300,
          height: 300,
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          background: `radial-gradient(circle, ${skill.color}30 0%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
      />
      
      <div className="relative glass-card h-full card-shine z-10">
        {/* Icon section with enhanced effects */}
        <div className="relative mb-6">
          <motion.div
            className="w-16 h-16 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: `${skill.color}25` }}
            whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated background pulses */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={isHovered ? {
                boxShadow: [
                  `inset 0 0 20px ${skill.color}40`,
                  `inset 0 0 40px ${skill.color}60`,
                  `inset 0 0 20px ${skill.color}40`,
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Icon with rotation effect */}
            <motion.div
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Icon 
                size={32} 
                style={{ color: skill.color }}
                className="transition-transform group-hover:scale-125 relative z-10"
              />
            </motion.div>
          </motion.div>
          
          {/* Enhanced glow effect */}
          <motion.div 
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-0"
            style={{ 
              backgroundColor: skill.color,
              filter: 'blur(20px)',
            }}
          />

          {/* Floating star icons on hover */}
          {isHovered && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [1, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute -top-2 -right-2 text-accent-cyan"
              >
                <Star size={16} fill="currentColor" />
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [1, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -bottom-2 -left-2 text-primary-400"
              >
                <Zap size={16} fill="currentColor" />
              </motion.div>
            </>
          )}
        </div>

        {/* Enhanced title with color transition */}
        <motion.h3 
          className="heading-3 mb-3 transition-all duration-300"
          style={{
            color: isHovered ? skill.color : undefined,
            textShadow: isHovered ? `0 0 20px ${skill.color}50` : 'none',
          }}
        >
          {skill.title}
        </motion.h3>

        {/* Description with enhanced readability */}
        <p className="body-regular mb-4 group-hover:text-dark-100 transition-colors">
          {skill.description}
        </p>

        {/* Enhanced Proficiency bar */}
        <ProficiencyBar level={proficiency} color={skill.color} isInView={isInView} />

        {/* Technologies with staggered animations */}
        <div className="flex flex-wrap gap-2 mt-4">
          {skill.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 + i * 0.08 + 0.3 }}
              whileHover={{ 
                scale: 1.15,
                boxShadow: `0 0 20px ${skill.color}60`,
                y: -3,
              }}
              className="tag cursor-default transition-all"
              style={{
                borderColor: isHovered ? `${skill.color}80` : undefined,
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Enhanced decorative corner */}
        <div 
          className="absolute top-0 right-0 w-28 h-28 opacity-10 rounded-tr-2xl group-hover:opacity-30 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${skill.color} 0%, transparent 60%)`
          }}
        />
        
        {/* Animated corner accent lines */}
        <motion.div 
          className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-accent-cyan/80 to-transparent" />
          <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-accent-cyan/80 to-transparent" />
        </motion.div>

        {/* Bottom left corner accent */}
        <motion.div 
          className="absolute bottom-2 left-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={isHovered ? { rotate: -360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400/80 to-transparent" />
          <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-primary-400/80 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* 3D Background Canvas - Lazy loaded */}
      <Suspense fallback={null}>
        <SkillsCanvas />
      </Suspense>

      {/* Floating particles animation */}
      <FloatingParticles />
      
      {/* Semi-transparent content backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950/80 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <SectionHeader
          title="Core Directives"
          subtitle="Technologies and frameworks I specialize in to build intelligent systems"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>

        {/* Skill statistics section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-dark-700/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Years of Experience", value: "2+" },
              { label: "Projects Completed", value: "15+" },
              { label: "Technologies Mastered", value: "25+" },
              { label: "ML Models Deployed", value: "10+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-4 text-center"
              >
                <div className="text-2xl font-bold text-accent-cyan mb-1">{stat.value}</div>
                <div className="text-xs text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced background decoration */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
}
