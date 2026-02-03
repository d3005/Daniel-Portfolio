import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, Briefcase, GraduationCap, ChevronRight, Award, Rocket, Lightbulb } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import type { Experience } from '../../types/portfolio';

interface TimelineItemProps {
  experience: Experience;
  index: number;
  isLast: boolean;
}

function TimelineItem({ experience, index, isLast }: TimelineItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative pl-8 md:pl-20 pb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline line - enhanced glowing */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
          className="absolute left-[11px] md:left-[31px] top-8 w-1 h-full origin-top"
          style={{
            background: 'linear-gradient(to bottom, rgba(91, 108, 242, 1), rgba(91, 108, 242, 0.5), rgba(91, 108, 242, 0.1))',
            boxShadow: 'inset 0 0 10px rgba(0, 245, 255, 0.3)',
          }}
        >
          {/* Animated pulse traveling down the line */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-10 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0, 245, 255, 1), transparent)',
              boxShadow: '0 0 15px rgba(0, 245, 255, 0.8)',
            }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: index * 0.5 }}
          />
        </motion.div>
      )}

      {/* Timeline dot - enhanced with multiple rings */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="absolute left-0 md:left-1 top-1 w-8 h-8 md:w-12 md:h-12"
      >
        {/* Outer pulsing ring - enhanced */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent-cyan/70"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-1 rounded-full border border-primary-500/50"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
        />
        
        {/* Main dot with gradient */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan flex items-center justify-center relative overflow-hidden"
          style={{
            boxShadow: isHovered 
              ? '0 0 25px rgba(0, 245, 255, 1), 0 0 50px rgba(91, 108, 242, 0.6), inset 0 0 10px rgba(255,255,255,0.3)'
              : '0 0 20px rgba(0, 245, 255, 0.7)',
          }}
        >
          {/* Rotating ring inside */}
          <motion.div
            className="absolute inset-1 rounded-full border border-white/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Icon */}
          {experience.type === 'work' ? (
            <Briefcase size={16} className="text-dark-950 relative z-10" />
          ) : (
            <GraduationCap size={16} className="text-dark-950 relative z-10" />
          )}
        </div>
      </motion.div>

      {/* Content card - significantly enhanced */}
      <motion.div
        whileHover={{ x: 15, scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="glass-card group relative overflow-hidden"
        style={{
          boxShadow: isHovered 
            ? '0 0 40px rgba(0, 245, 255, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
            : '0 0 20px rgba(0, 245, 255, 0.1)',
          borderColor: isHovered ? 'rgba(0, 245, 255, 0.5)' : undefined,
        }}
      >
          {/* Animated top border - enhanced */}
          <motion.div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-purple"
            initial={{ width: 0 }}
            animate={isInView ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 1, delay: index * 0.2 + 0.4 }}
          />

        {/* Background glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 245, 255, 1), transparent)',
          }}
        />

        {/* Duration and location badges */}
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 text-primary-300 text-sm font-medium border border-primary-500/30"
            whileHover={{ scale: 1.08, borderColor: 'rgba(91, 108, 242, 0.8)' }}
          >
            <Calendar size={16} className="flex-shrink-0" />
            {experience.duration}
          </motion.span>
          <span className="inline-flex items-center gap-2 text-dark-400 text-sm font-medium">
            <MapPin size={16} className="text-accent-cyan flex-shrink-0" />
            {experience.location}
          </span>
        </div>

        {/* Title & Company with icon */}
        <div className="flex items-start gap-3 mb-2">
          {experience.type === 'work' ? (
            <Rocket size={20} className="text-accent-cyan mt-1 flex-shrink-0" />
          ) : (
            <Award size={20} className="text-accent-green mt-1 flex-shrink-0" />
          )}
          <div>
            <motion.h3 
              className="heading-3 mb-1 transition-colors duration-300"
              style={{ color: isHovered ? '#00f5ff' : undefined }}
            >
              {experience.title}
            </motion.h3>
            <p className="text-primary-400 font-semibold text-base flex items-center gap-2 mb-4">
              {experience.company}
              <motion.span
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={16} className="opacity-60" />
              </motion.span>
            </p>
          </div>
        </div>

        {/* Description with enhanced bullets and icons */}
        <ul className="space-y-3 mb-4">
          {experience.description.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.2 + 0.4 + i * 0.1 }}
              className="flex items-start gap-3 text-dark-300 group/item"
            >
              <motion.span 
                className="mt-2.5 w-2 h-2 rounded-full bg-primary-400 flex-shrink-0"
                whileHover={{ scale: 2, backgroundColor: '#00f5ff' }}
                style={{
                  boxShadow: '0 0 10px rgba(91, 108, 242, 0.6)',
                }}
              />
              <motion.span 
                className="group-hover/item:text-dark-100 transition-colors duration-200 leading-relaxed"
                whileHover={{ x: 2 }}
              >
                {item}
              </motion.span>
            </motion.li>
          ))}
        </ul>

        {/* Type badge - enhanced */}
        <div className="pt-4 border-t border-dark-700/50 flex items-center justify-between">
          <motion.span 
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              experience.type === 'work' 
                ? 'bg-accent-green/15 text-accent-green border border-accent-green/40' 
                : 'bg-accent-orange/15 text-accent-orange border border-accent-orange/40'
            }`}
            whileHover={{ scale: 1.08 }}
          >
            {experience.type === 'work' ? (
              <>
                <Briefcase size={12} />
                Full-time
              </>
            ) : (
              <>
                <GraduationCap size={12} />
                Internship
              </>
            )}
          </motion.span>
          
          {/* Right side decoration - pulsing */}
          <motion.div
            className="text-dark-500 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 1 }}
          >
            <Lightbulb size={18} />
          </motion.div>
        </div>
        
        {/* Corner decoration - enhanced */}
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-15 transition-opacity duration-300">
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-accent-cyan to-transparent rounded-tl-2xl" />
        </div>

        {/* Right edge glow on hover */}
        <motion.div
          className="absolute right-0 top-1/2 w-1 h-1/3 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.5), transparent)',
            filter: 'blur(4px)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Semi-transparent content backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950/80 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <SectionHeader
          title="Operational History"
          subtitle="My professional journey in AI and Machine Learning"
        />

        <div className="max-w-3xl mx-auto">
          {experience.map((exp, index) => (
            <TimelineItem
              key={exp.id}
              experience={exp}
              index={index}
              isLast={index === experience.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
    </section>
  );
}
