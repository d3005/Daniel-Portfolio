import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail, Twitter } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Skills', href: '/skills' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Education', href: '/education' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname === href;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-2 md:py-3' : 'bg-transparent py-3 md:py-5'
      }`}
    >
      <nav className="container-custom flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="font-mono text-xl md:text-2xl font-bold"
          >
            <span className="text-accent-cyan">D</span>
            <span className="text-dark-100">J</span>
            <span className="text-accent-purple">K</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.href}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 block ${
                    isActive(item.href)
                      ? 'text-accent-cyan bg-accent-cyan/10 shadow-neon-cyan/20'
                      : 'text-dark-300 hover:text-accent-cyan hover:bg-dark-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

        {/* Social Icons - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <motion.a
            href="https://github.com/d3005"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-dark-400 hover:text-accent-cyan hover:bg-dark-800/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github size={18} />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/daniel-joseph-kommu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-dark-400 hover:text-accent-cyan hover:bg-dark-800/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin size={18} />
          </motion.a>
          <motion.a
            href="mailto:dannyjoseph3007@outlook.com"
            className="p-2 rounded-lg text-dark-400 hover:text-accent-cyan hover:bg-dark-800/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Mail size={18} />
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-dark-300 hover:bg-dark-800/50"
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 h-full w-[280px] sm:w-[320px] glass border-l border-accent-cyan/20 z-50 overflow-y-auto"
            >
              {/* Close button */}
              <div className="flex justify-end p-4">
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-dark-300 hover:bg-dark-800/50"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <ul className="px-4 pb-8 space-y-1">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive(item.href)
                          ? 'text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30'
                          : 'text-dark-300 hover:text-accent-cyan hover:bg-dark-800/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
                
                {/* Social Icons - Mobile */}
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-6 pt-6 mt-4 border-t border-accent-cyan/20"
                >
                  <a 
                    href="https://github.com/d3005" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-xl glass text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    <Github size={22} />
                  </a>
                  <a 
                    href="https://linkedin.com/in/daniel-joseph-kommu" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-xl glass text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    <Linkedin size={22} />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-xl glass text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    <Twitter size={22} />
                  </a>
                  <a 
                    href="mailto:dannyjoseph3007@outlook.com" 
                    className="p-3 rounded-xl glass text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    <Mail size={22} />
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
