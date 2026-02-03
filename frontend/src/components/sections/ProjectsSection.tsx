import { useRef, lazy, Suspense, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Github, ExternalLink, TrendingUp, Play, Award, Code } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import type { Project } from '../../types/portfolio';

// Lazy load 3D canvas for better initial load
const ProjectsCanvas = lazy(() => 
  import('../3d/effects/SectionEnhancements').then(module => ({ 
    default: module.ProjectsCanvas 
  }))
);

// Tech stack icon mapping (simplified SVG or emoji based)
const techIcons: { [key: string]: string } = {
  'Python': '🐍',
  'PyTorch': '🔥',
  'TensorFlow': '📊',
  'LangChain': '🔗',
  'React': '⚛️',
  'TypeScript': '📘',
  'OpenAI': '🤖',
  'ChromaDB': '💎',
  'Streamlit': '🎈',
  'FastAPI': '⚡',
  'NLP': '💬',
  'RAG': '📚',
  'BERT': '🧠',
  'CNN': '🖼️',
  'RNN': '🔄',
  'Transformers': '🤗',
  'GPT': '💡',
  'Gemini': '✨',
  'AWS': '☁️',
  'Docker': '🐳',
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Gradient colors for different cards
  const gradients = [
    'from-primary-500 to-accent-cyan',
    'from-accent-cyan to-accent-pink',
    'from-accent-pink to-accent-orange',
    'from-accent-orange to-primary-500',
  ];
  const gradient = gradients[index % gradients.length];
  
  const glowColors = [
    'rgba(91, 108, 242, 0.5)',
    'rgba(0, 245, 255, 0.5)',
    'rgba(236, 72, 153, 0.5)',
    'rgba(251, 146, 60, 0.5)',
  ];
  const glowColor = glowColors[index % glowColors.length];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Card Container - Enhanced */}
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
        className="relative h-full"
      >
        {/* Enhanced glow effect behind card */}
        <motion.div
          className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x || '50%'} ${mousePosition.y || '50%'}, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />

        {/* Light tail following mouse on hover */}
        <motion.div
          className="absolute rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            width: 400,
            height: 400,
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />

        <div className="glass-card h-full overflow-hidden relative z-10">
          {/* Image Section - Enhanced */}
          <div className="relative h-56 -mx-6 -mt-6 mb-6 overflow-hidden group/image">
            {/* Animated gradient background - enhanced */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
              animate={isHovered ? {
                backgroundPosition: ['0% 0%', '100% 100%'],
              } : {}}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              style={{ opacity: 0.3 }}
            />
            
            {/* Animated grid pattern - enhanced */}
            <motion.div 
              className="absolute inset-0 grid-bg opacity-60"
              animate={isHovered ? { 
                backgroundPosition: ['0px 0px', '50px 50px'],
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Project number - large and bold */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: index * 0.15 + 0.3 }}
                className="text-7xl font-bold text-dark-100/15 font-mono"
              >
                {String(index + 1).padStart(2, '0')}
              </motion.div>
            </div>

            {/* Hover overlay with actions - enhanced */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-6`}
              style={{ opacity: isHovered ? 0.97 : 0 }}
            >
              <div className="flex gap-4">
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-4 bg-white/25 rounded-full text-white backdrop-blur-md"
                  whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.35)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github size={28} />
                </motion.a>
                {project.demo && (
                  <motion.a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-4 bg-white/25 rounded-full text-white backdrop-blur-md"
                    whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.35)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play size={28} />
                  </motion.a>
                )}
              </div>
              <span className="text-white font-bold text-xl">View Project Details</span>
            </motion.div>

            {/* Enhanced metrics badge */}
            {project.metrics && (
              <div className="absolute top-4 right-4">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: index * 0.15 + 0.4 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-950/95 backdrop-blur-sm border border-accent-green/40"
                  whileHover={{ scale: 1.1, borderColor: 'rgba(0, 245, 127, 0.8)' }}
                >
                  <TrendingUp size={16} className="text-accent-green" />
                  <span className="text-accent-green text-sm font-bold">{project.metrics}</span>
                </motion.div>
              </div>
            )}
            
            {/* Featured badge - enhanced */}
            {index < 2 && (
              <div className="absolute top-4 left-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1, y: [0, -2, 0] } : {}}
                  transition={{ delay: index * 0.15 + 0.4, duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/25 backdrop-blur-sm border border-accent-cyan/50"
                >
                  <Award size={14} className="text-accent-cyan" />
                  <span className="text-accent-cyan text-xs font-bold">Featured</span>
                </motion.div>
              </div>
            )}
          </div>

          {/* Content - Enhanced */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <motion.h3 
                className="heading-3 text-dark-100 transition-all duration-300 line-clamp-2 flex-1"
                style={{ color: isHovered ? '#00f5ff' : undefined }}
              >
                {project.title}
              </motion.h3>
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.15, rotate: 10 }}
                className="p-2.5 rounded-lg bg-primary-500/15 text-primary-400 flex-shrink-0 hover:bg-primary-500/25 transition-colors"
              >
                <Github size={20} />
              </motion.a>
            </div>
            
            <p className="body-regular mb-5 line-clamp-3 group-hover:text-dark-100 transition-colors">
              {project.description}
            </p>

            {/* Tech stack with enhanced styling */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.15 + 0.5 + i * 0.05 }}
                  whileHover={{ 
                    scale: 1.12,
                    boxShadow: `0 0 20px rgba(0, 245, 255, 0.4)`,
                    y: -2,
                  }}
                  className="tag flex items-center gap-1.5 transition-all"
                >
                  {techIcons[tag] && <span className="text-sm">{techIcons[tag]}</span>}
                  <span>{tag}</span>
                </motion.span>
              ))}
            </div>

            {/* Call to action button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.6 }}
            >
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm font-medium hover:bg-primary-500/20 transition-colors"
                whileHover={{ scale: 1.05, x: 3 }}
              >
                <Code size={14} />
                View Code
                <ExternalLink size={12} />
              </motion.a>
            </motion.div>
          </div>

          {/* Bottom gradient line - animated */}
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ transformOrigin: 'left' }}
          />
          
          {/* Corner accents - enhanced */}
          <motion.div 
            className="absolute top-3 right-3 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-accent-cyan/80 to-transparent" />
            <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-accent-cyan/80 to-transparent" />
          </motion.div>
          <motion.div 
            className="absolute bottom-3 left-3 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={isHovered ? { rotate: -360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-cyan/80 to-transparent" />
            <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-accent-cyan/80 to-transparent" />
          </motion.div>
        </div>
        
        {/* 3D depth layers - enhanced */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-2xl"
          style={{ 
            transform: 'translateZ(-15px)',
            background: `linear-gradient(135deg, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(15px)',
            opacity: isHovered ? 0.6 : 0.2,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* 3D Background Canvas - Lazy loaded */}
      <Suspense fallback={null}>
        <ProjectsCanvas />
      </Suspense>
      
      {/* Semi-transparent content backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950/80 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <SectionHeader
          title="Project Archives"
          subtitle="Featured projects showcasing my expertise in AI and Machine Learning"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Projects stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-dark-700/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "Total Projects", value: projects.length, icon: Code },
              { label: "Avg Accuracy", value: "89%", icon: TrendingUp },
              { label: "GitHub Stars", value: "50+", icon: Award },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.08, y: -5 }}
                  className="glass-card p-6 text-center group"
                >
                  <motion.div
                    className="flex justify-center mb-3"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon size={28} className="text-accent-cyan" />
                  </motion.div>
                  <div className="text-3xl font-bold text-white mb-1 group-hover:text-accent-cyan transition-colors">{stat.value}</div>
                  <div className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* View More on GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <motion.a
            href="https://github.com/d3005"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-cyan text-white font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all"
          >
            <Github size={22} />
            Explore All Projects on GitHub
            <ExternalLink size={18} />
          </motion.a>
        </motion.div>
      </div>

      {/* Enhanced background decoration */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
    </section>
  );
}
