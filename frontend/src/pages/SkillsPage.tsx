import { Suspense } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SkillsSection from '../components/sections/SkillsSection';
import usePortfolioData from '../hooks/usePortfolioData';
import { Skills3DScene } from '../components/3d/LazyScenes';
import { SceneSkeleton } from '../components/ui/Skeleton';
import { SkipToMainContent } from '../components/ui/Accessibility';

export default function SkillsPage() {
  const { data } = usePortfolioData();

  return (
    <>
      <SkipToMainContent mainContentId="skills-main-content" />
      
      <PageLayout BackgroundScene={Skills3DScene}>
        <div className="min-h-screen" role="main" id="skills-main-content" aria-label="Skills page content">
          <Suspense fallback={
            <SceneSkeleton text="Loading skills section..." />
          }>
            <SkillsSection skills={data.skills} />
          </Suspense>
        </div>
      </PageLayout>
    </>
  );
}
