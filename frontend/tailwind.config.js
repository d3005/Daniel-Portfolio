/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyber Blue/Purple Neon Theme
        primary: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a4bcfd',
          400: '#8093f9',
          500: '#5b6cf2',  // Main cyber blue
          600: '#4a4ee6',
          700: '#3d3bcc',
          800: '#3433a5',
          900: '#2f3082',
          950: '#0a0a1f',  // Deep cyber dark
        },
        accent: {
          cyan: '#00f5ff',      // Neon cyan
          purple: '#bf00ff',    // Neon purple
          pink: '#ff00f5',      // Neon pink
          blue: '#00a8ff',      // Electric blue
          green: '#00ff88',     // Neon green
        },
        neon: {
          blue: '#00d4ff',
          purple: '#a855f7',
          pink: '#ec4899',
          cyan: '#22d3ee',
        },
        dark: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f1729',
          900: '#0a0e1a',
          950: '#050509',  // Almost black
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Orbitron', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'cyber-flicker': 'cyber-flicker 0.15s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(91, 108, 242, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(91, 108, 242, 0.8)' },
        },
        'neon-pulse': {
          '0%, 100%': { 
            textShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff',
            boxShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff'
          },
          '50%': { 
            textShadow: '0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 20px #00f5ff',
            boxShadow: '0 0 5px #00f5ff, 0 0 10px #00f5ff'
          },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'cyber-flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(135deg, #5b6cf2 0%, #00f5ff 50%, #bf00ff 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
