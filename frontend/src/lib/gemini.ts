import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// ============================================
// RAG KNOWLEDGE BASE - Chunked Portfolio Data
// ============================================

interface KnowledgeChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

// Portfolio knowledge base split into retrievable chunks
const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // === PERSONAL INFO ===
  {
    id: 'personal-1',
    category: 'personal',
    title: 'Basic Information',
    content: `Daniel Joseph Kommu is a GenAI & Machine Learning Engineer and Data Scientist from Vijayawada, Andhra Pradesh, India. He is currently pursuing B.Tech in Computer Science with Data Science specialization (2022-2026). He is available for opportunities including internships, freelance projects, and full-time positions.`,
    keywords: ['daniel', 'who', 'name', 'about', 'introduction', 'background', 'location', 'india', 'vijayawada']
  },
  {
    id: 'personal-2',
    category: 'contact',
    title: 'Contact Information',
    content: `Contact Daniel Joseph Kommu:
    - Email: dannyjoseph3007@outlook.com
    - Phone: +91-9390217611
    - GitHub: https://github.com/d3005
    - LinkedIn: https://linkedin.com/in/daniel-joseph-kommu
    Daniel is actively looking for opportunities and responds quickly to messages.`,
    keywords: ['contact', 'email', 'phone', 'reach', 'connect', 'linkedin', 'github', 'hire', 'opportunity']
  },
  {
    id: 'personal-3',
    category: 'summary',
    title: 'Professional Summary',
    content: `Daniel is a passionate GenAI-focused Machine Learning Engineer with hands-on experience building scalable AI systems, NLP pipelines, RAG architectures, and Generative AI solutions. He has proven ability to analyze model performance on large datasets (100K+ data points), prototype research ideas, and deploy production-ready ML services. Key achievements include 95% accuracy in fraud detection, 28% CTR improvement in recommendation systems, and 30% latency reduction in ML pipelines.`,
    keywords: ['summary', 'profile', 'overview', 'passionate', 'experience', 'achievement', 'what does', 'specializes']
  },

  // === SKILLS ===
  {
    id: 'skills-genai',
    category: 'skills',
    title: 'GenAI & LLM Skills',
    content: `Daniel's Generative AI and LLM expertise includes:
    - LLM Fundamentals: Understanding of transformer architecture, attention mechanisms, and large language models
    - Prompt Engineering: Crafting effective prompts for various LLM tasks, few-shot learning, chain-of-thought prompting
    - RAG Pipelines: Building Retrieval-Augmented Generation systems for knowledge-grounded responses
    - Generative AI: Creating AI systems for text generation, summarization, and conversational AI
    - Model Evaluation: Metrics like perplexity, BLEU, ROUGE, and human evaluation frameworks`,
    keywords: ['genai', 'llm', 'large language model', 'prompt', 'rag', 'retrieval', 'generative', 'gpt', 'transformer', 'chatbot']
  },
  {
    id: 'skills-ml',
    category: 'skills',
    title: 'Machine Learning & AI Skills',
    content: `Daniel's Machine Learning and AI skills include:
    - Machine Learning: Supervised learning (classification, regression), Unsupervised learning (clustering, dimensionality reduction)
    - Natural Language Processing (NLP): Text classification, sentiment analysis, named entity recognition, text preprocessing
    - Convolutional Neural Networks (CNNs): Image classification, transfer learning, feature extraction
    - Recommender Systems: Collaborative filtering, content-based filtering, hybrid recommendation engines
    - Computer Vision: Image processing, object detection, image classification using deep learning`,
    keywords: ['machine learning', 'ml', 'ai', 'artificial intelligence', 'nlp', 'natural language', 'cnn', 'neural network', 'deep learning', 'computer vision', 'recommendation']
  },
  {
    id: 'skills-frameworks',
    category: 'skills',
    title: 'ML Frameworks & Libraries',
    content: `Daniel is proficient in these ML frameworks and libraries:
    - TensorFlow: Building and training deep learning models, TensorFlow Serving for deployment
    - PyTorch: Dynamic neural networks, research prototyping, model experimentation
    - Keras: High-level neural network API for rapid prototyping
    - Scikit-learn: Classical ML algorithms, preprocessing, model evaluation
    - Pandas: Data manipulation, analysis, and preprocessing
    - NumPy: Numerical computing, array operations
    - OpenCV: Computer vision tasks, image processing
    - XGBoost: Gradient boosting for tabular data, feature importance`,
    keywords: ['tensorflow', 'pytorch', 'keras', 'scikit', 'sklearn', 'pandas', 'numpy', 'opencv', 'xgboost', 'framework', 'library', 'tools']
  },
  {
    id: 'skills-programming',
    category: 'skills',
    title: 'Programming Languages',
    content: `Daniel's programming skills:
    - Python: Primary language for ML/AI development, data analysis, scripting (Expert level)
    - Java: Object-oriented programming, application development
    - C: Systems programming, algorithms
    - SQL: Database queries, data manipulation, analytics
    - Git/GitHub: Version control, collaboration, code management
    - Jupyter Notebooks: Interactive development, data exploration
    - Google Colab: Cloud-based ML development with GPU support`,
    keywords: ['python', 'java', 'c', 'sql', 'programming', 'code', 'coding', 'language', 'git', 'github', 'jupyter', 'colab']
  },
  {
    id: 'skills-cloud',
    category: 'skills',
    title: 'Cloud & Deployment Skills',
    content: `Daniel's cloud and deployment expertise:
    - Docker: Containerization of ML applications, reproducible environments
    - Flask: Building REST APIs, web services for ML models
    - REST APIs: Designing and implementing APIs for model serving
    - CI/CD: Continuous integration and deployment pipelines
    - AWS: Cloud services for ML deployment and scaling
    - Streamlit: Building interactive ML web applications
    - Gunicorn: Production WSGI server for Python applications
    - Model Serving: Deploying models for real-time inference`,
    keywords: ['cloud', 'aws', 'docker', 'deployment', 'deploy', 'api', 'rest', 'flask', 'streamlit', 'production', 'server', 'cicd']
  },

  // === EXPERIENCE ===
  {
    id: 'exp-qwatch',
    category: 'experience',
    title: 'GenAI Engineer Intern at QWATCH',
    content: `GenAI Engineer Intern at QWATCH Digital Security Innovations Pvt. Ltd.
    Duration: January 2025 – March 2025 (Remote)
    
    Responsibilities and Achievements:
    - Developed and enhanced Generative AI-driven security products for enterprise use cases
    - Prototyped LLM-based systems using advanced prompt engineering techniques and RAG pipelines
    - Collaborated with cross-functional teams to translate cutting-edge research ideas into deployable solutions
    - Worked on real-world security applications leveraging GenAI capabilities
    
    This was Daniel's most recent and advanced internship, focusing on GenAI and enterprise security.`,
    keywords: ['qwatch', 'genai', 'intern', 'security', 'llm', 'rag', '2025', 'recent', 'latest', 'current']
  },
  {
    id: 'exp-codingraja',
    category: 'experience',
    title: 'Data Science Intern at Coding Raja',
    content: `Data Science Intern at Coding Raja Technologies
    Duration: July 2024 – August 2024 (Remote)
    
    Responsibilities and Achievements:
    - Optimized fraud detection models on 100K+ transactions, achieving 95% accuracy
    - Reduced inference latency by 30% through systematic model comparison and optimization
    - Built a sentiment classifier on 10K+ tweets using TF-IDF vectorization and Logistic Regression
    - Gained hands-on experience with large-scale data processing and model optimization
    
    Key metrics: 95% accuracy, 30% latency reduction, 100K+ transactions processed`,
    keywords: ['coding raja', 'data science', 'fraud', 'detection', 'sentiment', 'accuracy', '95%', 'intern', '2024']
  },
  {
    id: 'exp-next24',
    category: 'experience',
    title: 'Machine Learning Intern at Next24Tech',
    content: `Machine Learning Intern at Next24Tech
    Duration: May 2024 – June 2024 (Remote)
    
    Responsibilities and Achievements:
    - Built NLP classification system for 50K+ documents achieving 88% accuracy
    - Deployed REST APIs handling 500+ requests/hour with less than 200ms latency
    - Designed scalable NLP pipelines for multi-class text classification
    - Implemented cloud-ready solutions enabling horizontal scalability
    
    Key metrics: 88% accuracy, 500+ requests/hour, <200ms latency, 50K+ documents`,
    keywords: ['next24', 'next24tech', 'nlp', 'classification', 'api', 'machine learning', 'ml', 'intern', '2024', 'documents']
  },

  // === PROJECTS ===
  {
    id: 'proj-recsys',
    category: 'projects',
    title: 'E-commerce Recommendation Engine',
    content: `Project: E-commerce Hybrid Recommendation Engine
    
    Description: Designed a sophisticated hybrid recommender system for e-commerce platforms serving 10K+ users.
    
    Technical Details:
    - Combined collaborative filtering (user-item interactions) with content-based filtering (product features)
    - Used the Surprise library for implementing recommendation algorithms
    - Built Flask backend for serving recommendations via REST API
    
    Results & Impact:
    - Improved Click-Through Rate (CTR) by 28%
    - Reduced recommendation latency by 15%
    - Successfully handled 10K+ user profiles
    
    Tech Stack: Python, Flask, Surprise, RecSys
    GitHub: https://github.com/d3005/ecommerce-product-recommendation`,
    keywords: ['recommendation', 'recommender', 'ecommerce', 'e-commerce', 'collaborative', 'filtering', 'ctr', 'shopping', 'product']
  },
  {
    id: 'proj-sentiment',
    category: 'projects',
    title: 'Tweet Sentiment Analysis',
    content: `Project: Tweet Sentiment Analysis Pipeline
    
    Description: Built an end-to-end NLP pipeline for analyzing sentiment in social media tweets.
    
    Technical Details:
    - Processed and analyzed 10K+ tweets from Twitter/X
    - Implemented TF-IDF vectorization for text feature extraction
    - Used Logistic Regression as the classification model
    - Applied comprehensive text preprocessing (tokenization, stopword removal, lemmatization)
    
    Results & Impact:
    - Achieved 85% F1-score on sentiment classification
    - Reduced model training time by 20% through preprocessing optimization
    - Created reusable NLP preprocessing pipeline
    
    Tech Stack: Python, NLP, TF-IDF, Scikit-learn, NLTK
    GitHub: https://github.com/d3005/Social-Sentiment-Analysis`,
    keywords: ['sentiment', 'analysis', 'tweet', 'twitter', 'nlp', 'social media', 'text', 'classification', 'f1']
  },
  {
    id: 'proj-grain',
    category: 'projects',
    title: 'GrainPalette - Rice Classification',
    content: `Project: GrainPalette - Rice Classification AI
    
    Description: AI-powered web application for classifying rice varieties using computer vision and deep learning.
    
    Technical Details:
    - Implemented transfer learning using MobileNetV2 architecture
    - Classifies 5 rice varieties: Arborio, Basmati, Ipsala, Jasmine, Karacadag
    - Built modern web interface with glassmorphism design
    - Features drag-and-drop image upload functionality
    - Provides agricultural recommendations based on rice type
    
    Results & Impact:
    - High accuracy classification across all 5 rice varieties
    - User-friendly interface for farmers and agricultural workers
    - Real-time inference with optimized model
    
    Tech Stack: Python, TensorFlow, MobileNetV2, Flask, Computer Vision
    GitHub: https://github.com/d3005/GRAIN_PALETTE`,
    keywords: ['grain', 'palette', 'rice', 'classification', 'computer vision', 'image', 'mobilenet', 'agriculture', 'transfer learning']
  },
  {
    id: 'proj-crime',
    category: 'projects',
    title: 'CrimeWaveML - Crime Prediction',
    content: `Project: CrimeWaveML - Crime Prediction Platform
    
    Description: AI-powered urban crime prediction and patrol optimization platform for law enforcement.
    
    Technical Details:
    - Used XGBoost for crime occurrence prediction
    - Built with Streamlit for interactive web dashboard
    - Created visualizations with Plotly for data exploration
    - Analyzed 5K+ historical crime data points
    
    Features:
    - 48-hour crime forecasting capability
    - Interactive risk heatmaps showing crime hotspots
    - Optimized patrol route generation for police departments
    - Time-series analysis of crime patterns
    
    Tech Stack: Python, XGBoost, Streamlit, Plotly, ML
    GitHub: https://github.com/d3005/CrimeWaveML`,
    keywords: ['crime', 'prediction', 'crimewave', 'police', 'patrol', 'forecast', 'heatmap', 'xgboost', 'streamlit', 'urban', 'safety']
  },
  {
    id: 'proj-house',
    category: 'projects',
    title: 'House Price Prediction',
    content: `Project: House Price Prediction System
    
    Description: Predictive model for estimating house prices using multiple ML algorithms.
    
    Technical Details:
    - Implemented multiple algorithms: Gradient Boosting, Random Forest, Linear Regression, SVR
    - Comprehensive data preprocessing and feature engineering
    - Model comparison and selection based on performance metrics
    
    Evaluation Metrics:
    - RMSE (Root Mean Square Error)
    - MSE (Mean Square Error)
    - R² Score for model fit assessment
    
    Tech Stack: Python, Jupyter Notebook, Pandas, Scikit-learn, XGBoost
    GitHub: https://github.com/d3005/House_Price_Prediction`,
    keywords: ['house', 'price', 'prediction', 'real estate', 'regression', 'gradient boosting', 'random forest', 'property']
  },

  // === EDUCATION ===
  {
    id: 'edu-btech',
    category: 'education',
    title: 'B.Tech Degree',
    content: `Bachelor of Technology (B.Tech) in Computer Science with Data Science Specialization
    Institution: Rise Krishna Sai Prakasam Group of Institutions, Ongole
    Duration: 2022 – 2026 (Currently Pursuing)
    CGPA: 7.8 / 10
    
    Daniel is in his final years of engineering, specializing in Data Science which includes courses in Machine Learning, Deep Learning, Big Data Analytics, and AI.`,
    keywords: ['btech', 'degree', 'college', 'university', 'computer science', 'data science', 'education', 'studying', 'student', 'cgpa']
  },
  {
    id: 'edu-intermediate',
    category: 'education',
    title: 'Intermediate Education',
    content: `Intermediate (12th Grade) - MPC (Mathematics, Physics, Chemistry)
    Institution: Narayana Junior College, Vijayawada
    Duration: 2020 – 2022
    CGPA: 7.2
    
    Daniel completed his intermediate education with a focus on science subjects, building a strong foundation for engineering studies.`,
    keywords: ['intermediate', '12th', 'school', 'narayana', 'mpc', 'physics', 'chemistry', 'mathematics']
  },
  {
    id: 'edu-ssc',
    category: 'education',
    title: 'SSC Education',
    content: `SSC (10th Grade)
    Institution: Narayana E-Techno School, Vijayawada
    Year: 2020
    CGPA: 10.0 (Perfect Score!)
    
    Daniel achieved a perfect 10.0 CGPA in his 10th grade, demonstrating exceptional academic performance from an early age.`,
    keywords: ['ssc', '10th', 'school', 'perfect', 'score', 'topper', '10.0']
  },

  // === CERTIFICATIONS ===
  {
    id: 'cert-all',
    category: 'certifications',
    title: 'Professional Certifications',
    content: `Daniel's Professional Certifications:
    
    1. GenAI Engineer Internship Certificate (2025)
       - Issuer: QWATCH Digital Security Innovations
       - Focus: Generative AI, LLMs, RAG systems
    
    2. AWS Academy Graduate (2024)
       - Issuer: EduSkills Foundation
       - Focus: Cloud computing, AWS services
    
    3. Deep Learning Specialization (2024)
       - Issuer: SmartInternz AIML
       - Focus: Neural networks, deep learning architectures
    
    4. ML Internship Certificate (2024)
       - Issuer: Next24Tech
       - Focus: Machine learning, NLP
    
    5. Data Science Internship (2024)
       - Issuer: Prodigy InfoTech
       - Focus: Data science, analytics
    
    Total: 5 industry-recognized certifications`,
    keywords: ['certificate', 'certification', 'aws', 'deep learning', 'credential', 'qualified', 'certified']
  },

  // === ACHIEVEMENTS ===
  {
    id: 'achievements',
    category: 'achievements',
    title: 'Key Achievements',
    content: `Daniel's Key Achievements and Stats:
    
    Professional:
    - 3 Professional Internships completed
    - 5+ Real-world ML/AI Projects built
    - 5 Industry Certifications earned
    
    Technical Metrics:
    - 95% accuracy in fraud detection models
    - 28% CTR improvement in recommendation systems
    - 30% latency reduction in ML pipelines
    - 88% accuracy in NLP document classification
    - 85% F1-score in sentiment analysis
    
    Data Scale:
    - Processed 100K+ transactions
    - Analyzed 50K+ documents
    - Built systems for 10K+ users
    
    What makes Daniel stand out:
    - Hands-on GenAI experience with actual LLM deployments
    - Full-stack ML capabilities from data to deployment
    - Measurable, real-world impact in all projects`,
    keywords: ['achievement', 'accomplish', 'stats', 'metrics', 'success', 'stand out', 'special', 'impressive', 'best']
  }
];

// ============================================
// RAG IMPLEMENTATION
// ============================================

/**
 * Simple keyword-based retrieval with TF-IDF-like scoring
 * Returns the most relevant chunks based on query
 */
function retrieveRelevantChunks(query: string, topK: number = 3): KnowledgeChunk[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  // Score each chunk based on keyword matches
  const scoredChunks = KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    
    // Check keyword matches (high weight)
    for (const keyword of chunk.keywords) {
      if (queryLower.includes(keyword)) {
        score += 10;
      }
      // Partial matches
      for (const queryWord of queryWords) {
        if (keyword.includes(queryWord) || queryWord.includes(keyword)) {
          score += 3;
        }
      }
    }
    
    // Check title matches (medium weight)
    const titleLower = chunk.title.toLowerCase();
    for (const queryWord of queryWords) {
      if (titleLower.includes(queryWord)) {
        score += 5;
      }
    }
    
    // Check content matches (lower weight for broader coverage)
    const contentLower = chunk.content.toLowerCase();
    for (const queryWord of queryWords) {
      if (contentLower.includes(queryWord)) {
        score += 1;
      }
    }
    
    // Boost for category matches
    const categoryKeywords: Record<string, string[]> = {
      personal: ['who', 'about', 'daniel', 'introduction'],
      contact: ['contact', 'email', 'reach', 'hire', 'connect'],
      skills: ['skill', 'know', 'can', 'technology', 'tech', 'language', 'framework'],
      experience: ['experience', 'work', 'job', 'intern', 'company'],
      projects: ['project', 'build', 'built', 'create', 'made', 'portfolio'],
      education: ['education', 'study', 'college', 'degree', 'school', 'university'],
      certifications: ['certificate', 'certification', 'certified', 'credential'],
      achievements: ['achievement', 'accomplish', 'best', 'impressive', 'special']
    };
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (chunk.category === category) {
        for (const keyword of keywords) {
          if (queryLower.includes(keyword)) {
            score += 8;
          }
        }
      }
    }
    
    return { chunk, score };
  });
  
  // Sort by score and return top K
  return scoredChunks
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
}

/**
 * Build context string from retrieved chunks
 */
function buildContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) {
    return "No specific information found. Provide a general helpful response about Daniel.";
  }
  
  return chunks.map(chunk => 
    `[${chunk.category.toUpperCase()}] ${chunk.title}:\n${chunk.content}`
  ).join('\n\n---\n\n');
}

// ============================================
// GEMINI PRO CONFIGURATION
// ============================================

const SYSTEM_PROMPT = `You are "June", a friendly and knowledgeable AI assistant on Daniel Joseph Kommu's portfolio website.

## Your Identity:
- Your name is June
- You represent Daniel's professional portfolio
- You're warm, helpful, and enthusiastic about Daniel's work
- Use occasional emojis to be personable (but not excessive)

## Response Guidelines:
1. **Be Accurate**: Only share information from the provided context
2. **Be Concise**: Keep responses informative but not overwhelming (2-4 paragraphs max)
3. **Be Helpful**: Guide visitors to relevant sections when appropriate
4. **Encourage Contact**: For job inquiries, encourage reaching out via email/LinkedIn
5. **Stay Professional**: Maintain a professional yet friendly tone
6. **Format Well**: Use bullet points or short paragraphs for readability

## If Asked About Things Not in Context:
- Politely say you don't have that specific information
- Redirect to what you do know about Daniel
- Suggest contacting Daniel directly for specific questions

## Important:
- Never make up information not in the context
- Always refer to Daniel in third person (he/his)
- If greeting, introduce yourself as June`;

// Chat session for conversation continuity
let chatSession: ReturnType<ReturnType<typeof genAI.getGenerativeModel>['startChat']> | null = null;
let conversationHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

/**
 * Initialize or get Gemini Pro chat session
 */
async function getOrCreateChatSession() {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });

  if (!chatSession) {
    chatSession = model.startChat({
      history: conversationHistory,
    });
  }
  
  return chatSession;
}

/**
 * Main RAG-powered message handler
 */
export async function sendMessage(query: string): Promise<string> {
  try {
    // Check if API key is configured
    if (!API_KEY || API_KEY === '' || API_KEY === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured, using fallback');
      return getFallbackResponse(query);
    }

    // Step 1: Retrieve relevant chunks (RAG - Retrieval)
    const relevantChunks = retrieveRelevantChunks(query, 4);
    const context = buildContext(relevantChunks);
    
    console.log('RAG Retrieved chunks:', relevantChunks.map(c => c.title));

    // Step 2: Build the augmented prompt
    const augmentedPrompt = `${SYSTEM_PROMPT}

## Retrieved Context (Use this information to answer):
${context}

## User Question:
${query}

## Your Response as June:`;

    // Step 3: Generate response with Gemini Pro
    const session = await getOrCreateChatSession();
    const result = await session.sendMessage(augmentedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Store in conversation history for context continuity
    conversationHistory.push(
      { role: 'user', parts: [{ text: query }] },
      { role: 'model', parts: [{ text }] }
    );
    
    // Keep history manageable (last 10 exchanges)
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }
    
    return text;
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Reset session on error
    chatSession = null;
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('API_KEY_INVALID')) {
        console.warn('Invalid Gemini API key');
        return getFallbackResponse(query);
      }
      if (error.message.includes('quota') || error.message.includes('RATE_LIMIT') || error.message.includes('429')) {
        return "I've reached my conversation limit for now. Feel free to explore the portfolio or contact Daniel directly at dannyjoseph3007@outlook.com! 😊";
      }
      if (error.message.includes('SAFETY')) {
        return "I can't respond to that particular query. Let me know if you'd like to learn about Daniel's skills, projects, or experience! 🙂";
      }
    }
    
    // Return fallback response for any other errors
    return getFallbackResponse(query);
  }
}

/**
 * Reset conversation history (for new sessions)
 */
export function resetConversation() {
  chatSession = null;
  conversationHistory = [];
}

// ============================================
// FALLBACK RESPONSES (when API unavailable)
// ============================================

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Retrieve relevant chunks even for fallback
  const chunks = retrieveRelevantChunks(message, 2);
  
  // Greeting responses
  if (lowerMessage.match(/^(hi|hello|hey|greetings|howdy)/)) {
    return "Hi there! 👋 I'm June, Daniel's AI assistant! I can tell you about Daniel's skills in GenAI & Machine Learning, his projects, work experience, and how to contact him. What would you like to know?";
  }
  
  // Use retrieved chunks for relevant responses
  if (chunks.length > 0) {
    const primaryChunk = chunks[0];
    
    // Build response based on chunk category
    switch (primaryChunk.category) {
      case 'personal':
      case 'summary':
        return "Daniel Joseph Kommu is a passionate GenAI & Machine Learning Engineer! 🧠 He's currently pursuing B.Tech in Computer Science with Data Science specialization (2022-2026). He has hands-on experience building scalable AI systems, NLP pipelines, RAG architectures, and Generative AI solutions. He's completed 3 professional internships and has 5+ real-world ML/AI projects. Would you like to know about his skills or projects?";
      
      case 'contact':
        return "Great! Daniel would love to connect! 📧\n\n• **Email**: dannyjoseph3007@outlook.com\n• **LinkedIn**: linkedin.com/in/daniel-joseph-kommu\n• **GitHub**: github.com/d3005\n\nHe's available for internships, freelance projects, or full-time opportunities. Head to the Contact page to send him a message!";
      
      case 'skills':
        return "Daniel has impressive technical skills! 💻\n\n• **GenAI & LLMs**: Prompt Engineering, RAG Pipelines, Model Evaluation\n• **ML/AI**: NLP, CNNs, Recommender Systems, Computer Vision\n• **Frameworks**: TensorFlow, PyTorch, Keras, Scikit-learn\n• **Languages**: Python, Java, C, SQL\n• **Cloud & Deployment**: AWS, Docker, Flask, REST APIs\n\nWant to see his projects that showcase these skills?";
      
      case 'experience':
        return "Daniel has completed 3 professional internships! 💼\n\n1. **GenAI Engineer Intern** @ QWATCH (Jan-Mar 2025) - Built LLM-based security products\n2. **Data Science Intern** @ Coding Raja Technologies (Jul-Aug 2024) - 95% accuracy fraud detection\n3. **ML Intern** @ Next24Tech (May-Jun 2024) - NLP classification for 50K+ documents\n\nCheck out the Experience page for more details!";
      
      case 'projects':
        return "Daniel has built some amazing projects! 🚀\n\n1. **E-commerce Recommendation Engine** - Hybrid recommender with 28% CTR improvement\n2. **Tweet Sentiment Analysis** - NLP pipeline with 85% F1-score\n3. **GrainPalette** - Rice classification AI using MobileNetV2\n4. **CrimeWaveML** - Crime prediction platform with 48-hr forecasting\n\nYou can explore them in detail on the Projects page!";
      
      case 'education':
        return "Daniel is pursuing his B.Tech in Computer Science (Data Science) at Rise Krishna Sai Prakasam Group of Institutions, Ongole (2022-2026) with a CGPA of 7.8. 🎓 He also scored a perfect 10.0 CGPA in his 10th grade!";
      
      case 'certifications':
        return "Daniel has earned several industry certifications! 📜\n\n• GenAI Engineer Internship - QWATCH (2025)\n• AWS Academy Graduate - EduSkills (2024)\n• Deep Learning Specialization - SmartInternz (2024)\n• ML Internship Certificate - Next24Tech (2024)\n• Data Science Internship - Prodigy InfoTech (2024)";
      
      case 'achievements':
        return "Daniel has impressive achievements! 🏆\n\n• 95% accuracy in fraud detection\n• 28% CTR improvement in recommendations\n• 30% latency reduction in ML pipelines\n• Processed 100K+ transactions\n• 3 internships, 5+ projects, 5 certifications\n\nHe brings measurable impact to every project!";
    }
  }
  
  // Default response
  return "I'm June, Daniel's AI assistant! 👋 I can help you learn about:\n\n• Daniel's background and skills\n• His ML/AI projects\n• Work experience and internships\n• Education and certifications\n• How to contact him\n\nWhat would you like to know?";
}

// ============================================
// EXPORTS
// ============================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const QUICK_SUGGESTIONS = [
  "Who is Daniel?",
  "What are his skills?",
  "Tell me about his projects",
  "Work experience?",
  "How to contact him?",
];

export default { sendMessage, resetConversation, QUICK_SUGGESTIONS };
