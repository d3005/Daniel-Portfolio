import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import ContactSection from '../components/sections/ContactSection';
import usePortfolioData from '../hooks/usePortfolioData';

// Lazy load the 3D scene
const ContactScene = lazy(() => import('../components/3d/scenes/ContactScene'));

// Section loading fallback
function SectionLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-dark-400 text-sm">Loading...</span>
      </motion.div>
    </div>
  );
}

export default function ContactPage() {
  const { data } = usePortfolioData();

  return (
    <PageLayout BackgroundScene={ContactScene}>
      <div className="min-h-screen">
        <Suspense fallback={<SectionLoader />}>
          <ContactSection profile={data.profile} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
