import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

interface FlipCardProps {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
}

export function FlipCard({ 
  title, 
  description, 
  technologies,
  image,
  github,
  demo 
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rotateY = useSpring(isFlipped ? 180 : 0, {
    stiffness: 300,
    damping: 30,
  });

  const scale = useSpring(1, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (isHovered) {
      scale.set(1.02);
    } else {
      scale.set(1);
    }
  }, [isHovered, scale]);

  return (
    <motion.div
      style={{ perspective: 1000, scale }}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsFlipped(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsFlipped(false);
      }}
      className="w-full h-80 cursor-pointer"
    >
      <motion.div
        style={{ rotateY, transformStyle: 'preserve-3d' }}
        className="w-full h-full relative"
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 backface-hidden glass-card p-6 flex flex-col justify-between"
          style={{ transform: 'rotateY(0deg)' }}
        >
          {image && (
            <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-dark-400 text-sm line-clamp-2">{description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {technologies.slice(0, 3).map((tech) => (
              <span 
                key={tech}
                className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-full"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="px-2 py-1 text-xs bg-dark-700 text-dark-400 rounded-full">
                +{technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 backface-hidden glass-card p-6 flex flex-col justify-center items-center"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <h3 className="text-xl font-bold text-accent-cyan mb-4">{title}</h3>
          
          <p className="text-dark-300 text-sm text-center mb-6">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {technologies.map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1 text-xs bg-accent-cyan/10 text-accent-cyan rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {github && (
              <motion.a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white text-sm transition-colors"
              >
                <Github size={16} />
                Code
              </motion.a>
            )}
            {demo && (
              <motion.a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-cyan rounded-lg text-white text-sm"
              >
                <ExternalLink size={16} />
                Live
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default FlipCard;
