import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  loginWithPassword: (password: string) => boolean;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authMethod: 'password' | 'firebase' | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// Fallback password from environment variable or default
// In production, set VITE_ADMIN_PASSWORD in Vercel environment variables
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'DJ@3007';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<'password' | 'firebase' | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Timeout to prevent infinite loading (max 5 seconds)
    const timeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 5000);

    // Check for existing session (password auth)
    const adminSession = sessionStorage.getItem('admin_authenticated');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
      setAuthMethod('password');
      if (isMounted) {
        setLoading(false);
      }
      clearTimeout(timeout);
      return;
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isMounted) return;
      
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        setAuthMethod('firebase');
      } else if (!adminSession) {
        // Only clear if no password session exists
        setUser(null);
        setIsAuthenticated(false);
        setAuthMethod(null);
      }
      setLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // Simple password authentication (fallback)
  const loginWithPassword = (password: string): boolean => {
    const trimmedPassword = password.trim();
    const trimmedAdminPassword = ADMIN_PASSWORD.trim();
    
    if (trimmedPassword === trimmedAdminPassword) {
      setIsAuthenticated(true);
      setAuthMethod('password');
      sessionStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    
    // Debug log (remove in production)
    console.log('Password mismatch:', {
      input: trimmedPassword,
      expected: trimmedAdminPassword,
      inputLength: trimmedPassword.length,
      expectedLength: trimmedAdminPassword.length
    });
    
    return false;
  };

  // Firebase email/password authentication (recommended)
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setIsAuthenticated(true);
      setAuthMethod('firebase');
      return true;
    } catch (error) {
      console.error('Firebase login error:', error);
      return false;
    }
  };

  // Logout from both methods
  const logout = async () => {
    // Clear password session
    sessionStorage.removeItem('admin_authenticated');
    
    // Sign out from Firebase
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    setAuthMethod(null);
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      loginWithPassword, 
      loginWithEmail, 
      logout,
      authMethod 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
