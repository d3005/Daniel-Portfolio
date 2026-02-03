import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import LoadingScreen from '../components/ui/LoadingScreen';
import ScrollToTop from '../components/ui/ScrollToTop';
import Footer from '../components/ui/Footer';
import HeroSection from '../components/sections/HeroSection';
import AIChatbot from '../components/ui/AIChatbot';
import usePortfolioData from '../hooks/usePortfolioData';

// Lazy loaded 3D scene
const HomeScene = lazy(() => import('../components/3d/scenes/HomeScene'));

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { data, loading } = usePortfolioData();

  useEffect(() => {
    // Minimum loading time for smooth animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {(isLoading || loading) && <LoadingScreen />}
      </AnimatePresence>

      {/* Main Content */}
      {!isLoading && (
        <>
          {/* Home 3D Scene - Morphing Blob + Particle Starfield */}
          <Suspense fallback={null}>
            <HomeScene />
          </Suspense>

          {/* Navigation */}
          <Navbar />

          {/* Main Section */}
          <motion.main 
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection profile={data.profile} />
          </motion.main>

          {/* Footer */}
          <Footer />

          {/* Scroll to Top */}
          <ScrollToTop />

          {/* AI Chatbot */}
          <AIChatbot />
        </>
      )}
    </>
  );
}
