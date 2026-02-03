import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { PortfolioData } from '../types/portfolio';

// Default data to use when Firebase is loading or unavailable
const defaultData: PortfolioData = {
  profile: {
    name: "Daniel Joseph Kommu",
    title: "GenAI & ML Engineer",
    subtitle: "GenAI Engineer | Machine Learning Engineer | Data Scientist",
    summary: "GenAI-focused Machine Learning Engineer with experience building scalable AI systems, NLP pipelines, and Generative AI solutions. Proven ability to analyze model performance on large datasets, prototype research ideas, and deploy production-ready ML services.",
    email: "dannyjoseph3007@outlook.com",
    phone: "+91-9390217611",
    location: "Vijayawada, Andhra Pradesh, India",
    image: "/portfolio.jpeg",
    resume: "/Daniel_Resume.pdf",
    social: {
      github: "https://github.com/d3005",
      linkedin: "https://linkedin.com/in/daniel-joseph-kommu",
      twitter: "https://twitter.com"
    },
    stats: {
      internships: 3,
      projects: 4,
      certifications: 5
    }
  },
  skills: [
    {
      id: "1",
      icon: "Brain",
      title: "GenAI & LLMs",
      description: "Building intelligent systems with cutting-edge AI",
      technologies: ["LLM Fundamentals", "Prompt Engineering", "RAG Pipelines", "Generative AI", "Model Evaluation"],
      color: "#818cf8"
    },
    {
      id: "2",
      icon: "Cpu",
      title: "AI / Machine Learning",
      description: "Creating predictive models and intelligent systems",
      technologies: ["Machine Learning", "NLP", "CNNs", "Recommender Systems", "Computer Vision"],
      color: "#22d3ee"
    },
    {
      id: "3",
      icon: "Layers",
      title: "ML Frameworks",
      description: "Expert in industry-standard ML tools",
      technologies: ["TensorFlow", "PyTorch", "Keras", "scikit-learn", "Pandas", "NumPy", "OpenCV"],
      color: "#f472b6"
    },
    {
      id: "4",
      icon: "Code",
      title: "Programming",
      description: "Building robust applications with clean code",
      technologies: ["Python", "Java", "C", "SQL", "Git", "Jupyter", "Google Colab"],
      color: "#34d399"
    },
    {
      id: "5",
      icon: "Cloud",
      title: "Systems & Cloud",
      description: "Deploying scalable cloud solutions",
      technologies: ["Docker", "Flask", "REST APIs", "CI/CD", "AWS", "GitHub"],
      color: "#fb923c"
    },
    {
      id: "6",
      icon: "Server",
      title: "Deployment",
      description: "Production-ready model serving",
      technologies: ["Flask", "Gunicorn", "REST APIs", "Model Serving", "Cloud Scalability"],
      color: "#a78bfa"
    }
  ],
  experience: [
    {
      id: "1",
      title: "GenAI Engineer Intern",
      company: "QWATCH Digital Security Innovations Pvt. Ltd.",
      location: "Remote",
      duration: "Jan 2025 – Mar 2025",
      description: [
        "Developed and enhanced Generative AI–driven security products for enterprise use cases",
        "Prototyped LLM-based systems using prompt engineering and RAG pipelines",
        "Collaborated with cross-functional teams to translate research ideas into deployable solutions"
      ],
      type: "internship"
    },
    {
      id: "2",
      title: "Data Science Intern",
      company: "Coding Raja Technologies",
      location: "Remote",
      duration: "Jul 2024 – Aug 2024",
      description: [
        "Optimized fraud detection models on 100K+ transactions, achieving 95% accuracy",
        "Reduced inference latency by 30% through model comparison and optimization",
        "Built a sentiment classifier on 10K+ tweets with TF-IDF + Logistic Regression"
      ],
      type: "internship"
    },
    {
      id: "3",
      title: "Machine Learning Intern",
      company: "Next24Tech",
      location: "Remote",
      duration: "May 2024 – Jun 2024",
      description: [
        "Built NLP classification system for 50K+ documents with 88% accuracy",
        "Deployed REST APIs handling 500+ requests/hour with <200ms latency",
        "Designed NLP pipelines for multi-class classification enabling cloud scalability"
      ],
      type: "internship"
    }
  ],
  projects: [
    {
      id: "1",
      title: "E-commerce Hybrid Recommendation Engine",
      description: "Designed hybrid recommender for 10K+ users using collaborative and content-based filtering. Improved CTR by 28% and reduced latency by 15%.",
      image: "/projects/recsys.png",
      tags: ["Python", "Flask", "Surprise", "RecSys"],
      github: "https://github.com/d3005/ecommerce-product-recommendation",
      metrics: "28% CTR improvement"
    },
    {
      id: "2",
      title: "Tweet Sentiment Analysis Pipeline",
      description: "Built NLP pipeline on 10K+ tweets achieving 85% F1-score. Reduced training time by 20% through preprocessing optimization using TF-IDF and Logistic Regression.",
      image: "/projects/sentiment.png",
      tags: ["Python", "NLP", "TF-IDF", "Scikit-learn"],
      github: "https://github.com/d3005/Social-Sentiment-Analysis",
      metrics: "85% F1-score"
    },
    {
      id: "3",
      title: "GrainPalette - Rice Classification AI",
      description: "AI-powered web app using MobileNetV2 transfer learning to classify 5 rice varieties (Arborio, Basmati, Ipsala, Jasmine, Karacadag) with agricultural recommendations. Features glassmorphism UI with drag-drop upload.",
      image: "/projects/grain.png",
      tags: ["Python", "TensorFlow", "MobileNetV2", "Flask", "Computer Vision"],
      github: "https://github.com/d3005/GRAIN_PALETTE",
      metrics: "5 Rice Varieties"
    },
    {
      id: "4",
      title: "CrimeWaveML - Crime Prediction Platform",
      description: "AI-powered urban crime prediction and patrol optimization platform using XGBoost. Features 48-hour crime forecasting, interactive risk heatmaps, and optimized patrol route generation with 5K+ data points.",
      image: "/projects/crime.png",
      tags: ["Python", "XGBoost", "Streamlit", "Plotly", "ML"],
      github: "https://github.com/d3005/CrimeWaveML",
      demo: "https://crime-wave-ml.vercel.app",
      metrics: "48-hr Forecasting"
    }
  ],
  education: [
    {
      id: "1",
      degree: "B.Tech in Computer Science (Data Science)",
      institution: "Rise Krishna Sai Prakasam Group of Institutions, Ongole",
      duration: "2022 – 2026 (Pursuing)",
      grade: "CGPA: 7.8 / 10",
      icon: "GraduationCap"
    },
    {
      id: "2",
      degree: "Intermediate (MPC)",
      institution: "Narayana Junior College, Vijayawada",
      duration: "2020 – 2022",
      grade: "CGPA: 7.2",
      icon: "School"
    },
    {
      id: "3",
      degree: "SSC",
      institution: "Narayana E-Techno School, Vijayawada",
      duration: "2020",
      grade: "CGPA: 10.0",
      icon: "BookOpen"
    }
  ],
  certifications: [
    {
      id: "1",
      title: "GenAI Engineer Internship",
      issuer: "QWATCH Digital Security Innovations",
      year: "2025",
      icon: "Cpu",
      link: "/certificates/Qwtch_certificate.pdf"
    },
    {
      id: "2",
      title: "AWS Academy Graduate",
      issuer: "EduSkills Foundation",
      year: "2024",
      icon: "Cloud",
      link: "/certificates/Eduskills.pdf"
    },
    {
      id: "3",
      title: "Deep Learning Specialization",
      issuer: "SmartInternz AIML",
      year: "2024",
      icon: "Brain",
      link: "/certificates/Certificate - SmartInternz.pdf"
    },
    {
      id: "4",
      title: "ML Internship Certificate",
      issuer: "Next24Tech",
      year: "2024",
      icon: "Award",
      link: "/certificates/Next24_Certificate.pdf"
    },
    {
      id: "5",
      title: "Data Science Internship",
      issuer: "Prodigy InfoTech",
      year: "2024",
      icon: "Cpu",
      link: "/certificates/Prodigy_Certificate.pdf"
    }
  ]
};

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const portfolioRef = ref(database, 'portfolio');
    
    const unsubscribe = onValue(portfolioRef, (snapshot) => {
      if (snapshot.exists()) {
        const firebaseData = snapshot.val();
        setData({ ...defaultData, ...firebaseData });
      } else {
        // Use default data if no Firebase data
        setData(defaultData);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firebase error:", err);
      setError(err.message);
      setData(defaultData); // Fallback to default data
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { data, loading, error };
};

export default usePortfolioData;
