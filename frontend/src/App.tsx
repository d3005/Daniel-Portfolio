import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';

// Lazy loaded pages (for better performance)
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Admin pages (lazy loaded - only when accessing /admin routes)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));

// Custom Cursor (lazy loaded)
const CustomCursor = lazy(() => import('./components/ui/CustomCursor'));

// Context
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-dark-300">Loading...</span>
      </motion.div>
    </div>
  );
}

// Admin page loading fallback
function AdminLoader() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-dark-300">Loading Admin Panel...</span>
      </motion.div>
    </div>
  );
}

// Animated Routes wrapper for page transitions
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main Portfolio Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/skills" 
          element={
            <Suspense fallback={<PageLoader />}>
              <SkillsPage />
            </Suspense>
          } 
        />
        <Route 
          path="/experience" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ExperiencePage />
            </Suspense>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ProjectsPage />
            </Suspense>
          } 
        />
        <Route 
          path="/education" 
          element={
            <Suspense fallback={<PageLoader />}>
              <EducationPage />
            </Suspense>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ContactPage />
            </Suspense>
          } 
        />
        
        {/* Admin Routes - Lazy loaded */}
        <Route 
          path="/admin" 
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminLogin />
            </Suspense>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        {/* Custom Cursor - Global, appears on all pages */}
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
        
        <AnimatedRoutes />
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
