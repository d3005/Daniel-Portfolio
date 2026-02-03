import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
      className="fixed inset-0 z-[9999] bg-dark-950 flex flex-col items-center justify-center"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-dark-950 to-dark-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="font-mono text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary-400 via-accent-cyan to-primary-500 bg-[length:200%_200%] bg-clip-text text-transparent"
        >
          DJK
        </motion.div>

        {/* Loading bar */}
        <div className="mt-8 w-64 h-1 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="h-full w-1/2 bg-gradient-to-r from-primary-500 via-accent-cyan to-primary-400 rounded-full"
          />
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-dark-400 text-sm tracking-widest uppercase"
        >
          Initializing Interface...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
