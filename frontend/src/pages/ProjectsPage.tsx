import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import ProjectsSection from '../components/sections/ProjectsSection';
import usePortfolioData from '../hooks/usePortfolioData';

// Lazy load the 3D scene
const ProjectsScene = lazy(() => import('../components/3d/scenes/ProjectsScene'));

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

export default function ProjectsPage() {
  const { data } = usePortfolioData();

  return (
    <PageLayout BackgroundScene={ProjectsScene}>
      <div className="min-h-screen">
        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection projects={data.projects} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
