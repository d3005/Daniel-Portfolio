import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, Shield, Mail, Key } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

type AuthMode = 'password' | 'firebase';

export default function AdminLogin() {
  const [authMode, setAuthMode] = useState<AuthMode>('firebase');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithPassword, loginWithEmail, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin/dashboard');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;

      if (authMode === 'firebase') {
        // Firebase email/password authentication
        if (!email || !password) {
          setError('Please enter both email and password.');
          setIsLoading(false);
          return;
        }
        success = await loginWithEmail(email, password);
        if (!success) {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        // Simple password authentication
        await new Promise(resolve => setTimeout(resolve, 500));
        success = loginWithPassword(password);
        if (!success) {
          setError('Invalid password. Access denied.');
        }
      }
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center"
            >
              <Shield size={32} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-dark-100 mb-2">Admin Panel</h1>
            <p className="text-dark-400 text-sm">Manage messages and view activity</p>
          </div>

          {/* Auth Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-dark-800/50 rounded-xl">
            <button
              type="button"
              onClick={() => setAuthMode('firebase')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                authMode === 'firebase'
                  ? 'bg-primary-500 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <Mail size={16} />
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('password')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                authMode === 'password'
                  ? 'bg-primary-500 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <Key size={16} />
              Password Only
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field (only for Firebase auth) */}
            {authMode === 'firebase' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-dark-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="admin@example.com"
                    autoComplete="email"
                  />
                </div>
              </motion.div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                {authMode === 'firebase' ? 'Password' : 'Admin Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-dark-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder={authMode === 'firebase' ? 'Enter password' : 'Enter admin password'}
                  required
                  autoComplete={authMode === 'firebase' ? 'current-password' : 'off'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !password || (authMode === 'firebase' && !email)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-accent-cyan text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary-500/25"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⟳
                  </motion.span>
                  Authenticating...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </motion.button>
          </form>

          {/* Auth Mode Info */}
          <div className="mt-4 p-3 rounded-xl bg-dark-800/30 border border-dark-700/50">
            <p className="text-xs text-dark-400 text-center">
              {authMode === 'firebase' ? (
                <>🔐 Secure login with Firebase Authentication</>
              ) : (
                <>🔑 Quick access with admin password</>
              )}
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <a 
              href="/"
              className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-dark-500 mt-4">
          🔒 This area is protected. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  );
}
