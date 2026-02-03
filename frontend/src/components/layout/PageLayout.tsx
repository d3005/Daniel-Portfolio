import { type ReactNode, Suspense, type ComponentType } from 'react';
import { motion, type Variants } from 'framer-motion';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import ScrollToTop from '../ui/ScrollToTop';
import AIChatbot from '../ui/AIChatbot';

interface PageLayoutProps {
  children: ReactNode;
  showBackground?: boolean;
  BackgroundScene?: ComponentType;
}

// Page transition variants
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  },
};

export default function PageLayout({ 
  children, 
  showBackground = true,
  BackgroundScene 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom Background Scene */}
      {showBackground && BackgroundScene && (
        <Suspense fallback={null}>
          <BackgroundScene />
        </Suspense>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main Content with page transitions */}
      <motion.main
        className="relative z-10 flex-grow pt-16"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
