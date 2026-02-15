import { motion } from 'framer-motion';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-dark-800/50 rounded-xl ${className}`}>
      <div className="h-48 bg-dark-700/50 rounded-t-xl" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-dark-700/50 rounded w-3/4" />
        <div className="h-4 bg-dark-700/50 rounded w-full" />
        <div className="h-4 bg-dark-700/50 rounded w-5/6" />
        <div className="flex gap-2">
          <div className="h-8 bg-dark-700/50 rounded-full w-20" />
          <div className="h-8 bg-dark-700/50 rounded-full w-20" />
          <div className="h-8 bg-dark-700/50 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-dark-700/50 rounded"
          style={{ width: `${100 - (i * 15)}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-dark-700/50 animate-pulse`} />
  );
}

export function SceneSkeleton({ text = 'Loading 3D Scene...' }: { text?: string }) {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-dark-950/50 rounded-xl">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full mb-4"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-dark-400 text-sm"
      >
        {text}
      </motion.p>
      <div className="mt-4 w-48 h-2 bg-dark-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-dark-950 p-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-12">
        <SkeletonAvatar size="lg" />
        <div className="flex gap-4">
          <div className="w-24 h-8 bg-dark-700/50 rounded animate-pulse" />
          <div className="w-24 h-8 bg-dark-700/50 rounded animate-pulse" />
          <div className="w-24 h-8 bg-dark-700/50 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Hero Section Skeleton */}
      <div className="mb-16">
        <div className="h-16 bg-dark-700/50 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-8 bg-dark-700/50 rounded w-1/2 animate-pulse" />
      </div>
      
      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function ImageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-dark-800/50 ${className}`}>
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-dark-600"
        >
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}