import { lazy, Suspense, type ComponentType } from 'react';
import { SceneSkeleton } from '../ui/Skeleton';
import { Accessible3DWrapper } from '../ui/Accessibility';

// Lazy load all 3D scenes
export const LazyHomeScene = lazy(() => import('../3d/scenes/HomeScene'));
export const LazySkillsScene = lazy(() => import('../3d/scenes/SkillsScene'));
export const LazyExperienceScene = lazy(() => import('../3d/scenes/ExperienceScene'));
export const LazyProjectsScene = lazy(() => import('../3d/scenes/ProjectsScene'));
export const LazyEducationScene = lazy(() => import('../3d/scenes/EducationScene'));
export const LazyContactScene = lazy(() => import('../3d/scenes/ContactScene'));

// Note: 3D effects are imported directly instead of lazy loaded to avoid type issues
// These are lightweight effect components that don't benefit significantly from lazy loading

interface Lazy3DSceneWrapperProps {
  component: ComponentType<any>;
  sceneName: string;
  description: string;
  fallbackText?: string;
  className?: string;
  props?: any;
}

export function Lazy3DSceneWrapper({
  component: Component,
  sceneName,
  description,
  fallbackText = 'Loading 3D scene...',
  className = '',
  props = {}
}: Lazy3DSceneWrapperProps) {
  return (
    <Accessible3DWrapper
      title={sceneName}
      description={description}
      className={className}
      interactive={false}
    >
      <Suspense fallback={<SceneSkeleton text={fallbackText} />}>
        <Component {...props} />
      </Suspense>
    </Accessible3DWrapper>
  );
}

// Pre-configured lazy scene components
export function Home3DScene(props: any) {
  return (
    <Lazy3DSceneWrapper
      component={LazyHomeScene}
      sceneName="Home 3D Scene"
      description="An interactive 3D visualization of Daniel's home portfolio section with animated elements and particle effects"
      fallbackText="Loading home scene..."
      {...props}
    />
  );
}

export function Skills3DScene(props: any) {
  return (
    <Lazy3DSceneWrapper
      component={LazySkillsScene}
      sceneName="Skills 3D Scene"
      description="A 3D visualization of Daniel's technical skills with floating skill icons and interactive elements"
      fallbackText="Loading skills visualization..."
      {...props}
    />
  );
}

export function Experience3DScene(props: any) {
  return (
    <Lazy3DSceneWrapper
      component={LazyExperienceScene}
      sceneName="Experience 3D Scene"
      description="A 3D timeline visualization of Daniel's professional experience and internships"
      fallbackText="Loading experience timeline..."
      {...props}
    />
  );
}

export function Projects3DScene(props: any) {
  return (
    <Lazy3DSceneWrapper
      component={LazyProjectsScene}
      sceneName="Projects 3D Scene"
      description="An interactive 3D showcase of Daniel's projects with floating cards and details"
      fallbackText="Loading projects gallery..."
      {...props}
    />
  );
}

export function Education3DScene(props: any) {
  return (
    <Lazy3DSceneWrapper
      component={LazyEducationScene}
      sceneName="Education 3D Scene"
      description="A 3D visualization of Daniel's educational background and certifications"
      fallbackText="Loading education scene..."
      {...props}
    />
  );
}

export function Contact3DScene(props: any) {
  return (
    <Lazy3DSceneWrapper
      component={LazyContactScene}
      sceneName="Contact 3D Scene"
      description="An interactive 3D contact section with floating elements and engagement features"
      fallbackText="Loading contact scene..."
      {...props}
    />
  );
}