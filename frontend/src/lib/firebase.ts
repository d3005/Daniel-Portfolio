// Secure Firebase data access through backend API
// API key is no longer exposed in frontend code

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Fetch portfolio data from backend (which securely connects to Firebase)
export const fetchPortfolioData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/firebase`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    // Fallback to static data if backend is unavailable
    return getStaticPortfolioData();
  }
};

// Fallback static portfolio data
const getStaticPortfolioData = () => {
  return {
    name: 'Daniel Joseph Kommu',
    title: 'GenAI & ML Engineer',
    summary: 'Passionate about building intelligent systems and data-driven solutions',
    location: 'India',
    email: 'daniel@example.com',
    social: {
      github: 'https://github.com/danielkommu',
      linkedin: 'https://linkedin.com/in/danielkommu',
      twitter: 'https://twitter.com/danielkommu',
    },
    skills: [
      'Python', 'Machine Learning', 'Deep Learning', 'GenAI',
      'LangChain', 'RAG', 'React', 'TypeScript', 'Firebase',
      'AWS', 'Docker', 'PostgreSQL', 'MongoDB'
    ],
    experience: [
      {
        id: '1',
        company: 'Tech Company 1',
        position: 'AI/ML Intern',
        duration: '3 months',
        description: 'Worked on LLM applications and RAG systems',
      },
      {
        id: '2',
        company: 'Tech Company 2',
        position: 'Backend Intern',
        duration: '3 months',
        description: 'Built RESTful APIs and database optimization',
      },
    ],
    projects: [
      {
        id: '1',
        name: 'AI Chatbot',
        description: 'RAG-powered chatbot using LangChain and Gemini',
        technologies: ['Python', 'LangChain', 'Gemini'],
        github: '#',
        demo: '#',
      },
    ],
    education: [
      {
        id: '1',
        institution: 'University Name',
        degree: 'B.Tech',
        field: 'Computer Science',
        year: '2024',
      },
    ],
  };
};

// Export empty objects for backward compatibility
// (in case any other components import these)
export const app = null;
export const database = null;
export const auth = null;
export const analytics = null;
