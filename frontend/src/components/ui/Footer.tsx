import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Skills', href: '/skills' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Education', href: '/education' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 md:py-16 border-t border-dark-800 bg-dark-950/50">
      {/* Gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <Link to="/" className="font-mono text-3xl font-bold gradient-text inline-block mb-4">
              DJK
            </Link>
            <p className="text-dark-400 text-sm max-w-xs mx-auto md:mx-0">
              GenAI & ML Engineer passionate about building intelligent systems and solving complex problems with AI.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h3 className="text-dark-100 font-semibold mb-4">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-dark-400 hover:text-accent-cyan transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h3 className="text-dark-100 font-semibold mb-4">Get in Touch</h3>
            <a 
              href="mailto:dannyjoseph3007@outlook.com" 
              className="text-dark-400 hover:text-accent-cyan transition-colors text-sm block mb-4"
            >
              dannyjoseph3007@outlook.com
            </a>
            
            {/* Social links */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <motion.a
                href="https://github.com/d3005"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-card rounded-lg text-dark-400 hover:text-accent-cyan transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/daniel-joseph-kommu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-card rounded-lg text-dark-400 hover:text-accent-cyan transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a
                href="mailto:dannyjoseph3007@outlook.com"
                className="p-2 glass-card rounded-lg text-dark-400 hover:text-accent-cyan transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={18} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-800 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-dark-400 text-sm flex items-center gap-2"
            >
              © {currentYear} Daniel Joseph Kommu. Crafted with
              <Heart size={14} className="text-accent-pink animate-pulse" fill="currentColor" />
              and neural precision.
            </motion.p>

            {/* Back to top */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/"
                className="text-dark-400 hover:text-accent-cyan transition-colors text-sm flex items-center gap-2"
              >
                Back to Home
                <ArrowRight size={14} className="-rotate-45" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
