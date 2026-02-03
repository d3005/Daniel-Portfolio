import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
}

export default function SectionHeader({ title, subtitle, gradient = true }: SectionHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <motion.h2
        className={`heading-2 mb-4 ${gradient ? 'gradient-text' : 'text-dark-100'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          className="body-large max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Animated underline */}
      <motion.div
        className="flex justify-center mt-6"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="h-1 w-24 bg-gradient-to-r from-primary-500 via-accent-cyan to-primary-400 rounded-full" />
      </motion.div>
    </motion.div>
  );
}
