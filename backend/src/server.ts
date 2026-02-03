import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import tracer from 'dd-trace';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { fetchPortfolioDataFromFirebase } from './firebase.js';

// Initialize Datadog tracing before anything else
if (process.env.DD_TRACE_ENABLED === 'true') {
  tracer.init({
    service: process.env.DATADOG_SERVICE || 'portfolio-backend',
    env: process.env.DATADOG_ENV || 'development',
    version: process.env.DATADOG_VERSION || '1.0.0',
    hostname: 'localhost',
    port: 8126,
    logInjection: process.env.DD_LOGS_INJECTION === 'true',
  });
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =====================================
// Middleware
// =====================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      frontendUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.PROD_FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request ID middleware for tracking
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = req.headers['x-request-id'] as string || uuidv4();
  res.setHeader('x-request-id', req.id);
  next();
});

// Datadog APM middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const span = tracer.startSpan('http.request', {
    tags: {
      'http.method': req.method,
      'http.url': req.url,
      'http.request_id': req.id,
    },
  });

  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode);
    span.finish();
  });

  next();
});

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      request_id: req.id,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration_ms: duration,
      ddsource: 'nodejs',
      service: process.env.DATADOG_SERVICE || 'portfolio-backend',
    }));
  });

  next();
});

// =====================================
// Routes
// =====================================

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Portfolio Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: process.env.DATADOG_SERVICE || 'portfolio-backend',
    version: process.env.DATADOG_VERSION || '1.0.0',
  });
});

// API version endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'Portfolio Backend API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      portfolio: '/api/v1/portfolio',
      messages: '/api/v1/messages',
      contact: '/api/v1/contact',
      ai: '/api/v1/ai',
    },
  });
});

// Portfolio data endpoint
app.get('/api/v1/portfolio', (req: Request, res: Response) => {
  const span = tracer.startSpan('api.portfolio.get');
  
  try {
    const portfolioData = {
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

    span.setTag('portfolio.loaded', true);
    res.json(portfolioData);
  } catch (error) {
    span.setTag('error', true);
    span.log({ error });
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  } finally {
    span.finish();
  }
});

// Contact form endpoint
app.post('/api/v1/contact', (req: Request, res: Response) => {
  const span = tracer.startSpan('api.contact.post');
  
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      span.setTag('validation.failed', true);
      return res.status(400).json({
        error: 'Missing required fields: name, email, subject, message',
      });
    }

    // Log the contact message
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      type: 'contact_form',
      name,
      email,
      subject,
      request_id: req.id,
      ddsource: 'nodejs',
      service: process.env.DATADOG_SERVICE || 'portfolio-backend',
    }));

    span.setTag('contact.received', true);
    res.json({
      success: true,
      message: 'Contact message received successfully',
      data: {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    span.setTag('error', true);
    span.log({ error });
    res.status(500).json({ error: 'Failed to process contact message' });
  } finally {
    span.finish();
  }
});

// Messages endpoint (get all messages)
app.get('/api/v1/messages', (req: Request, res: Response) => {
  const span = tracer.startSpan('api.messages.get');
  
  try {
    span.setTag('messages.retrieved', true);
    res.json({
      success: true,
      messages: [],
      total: 0,
    });
  } catch (error) {
    span.setTag('error', true);
    span.log({ error });
    res.status(500).json({ error: 'Failed to fetch messages' });
  } finally {
    span.finish();
  }
});

// Firebase portfolio data endpoint (secure - no API key exposed)
app.get('/api/v1/portfolio/firebase', async (req: Request, res: Response) => {
  const span = tracer.startSpan('api.portfolio.firebase.get');
  
  try {
    const portfolioData = await fetchPortfolioDataFromFirebase();
    
    if (!portfolioData) {
      span.setTag('firebase.empty', true);
      return res.status(404).json({ error: 'Portfolio data not found in Firebase' });
    }
    
    span.setTag('firebase.loaded', true);
    res.json(portfolioData);
  } catch (error: any) {
    span.setTag('error', true);
    span.log({ error: error.message });
    console.error('Firebase error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch portfolio data from Firebase',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    span.finish();
  }
});

// AI endpoint (for AI interactions)
app.post('/api/v1/ai', (req: Request, res: Response) => {
  const span = tracer.startSpan('api.ai.post');
  
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    span.setTag('ai.request', true);
    span.setTag('ai.message_length', message.length);

    res.json({
      success: true,
      response: `Echo: ${message}`,
      context,
    });
  } catch (error) {
    span.setTag('error', true);
    span.log({ error });
    res.status(500).json({ error: 'Failed to process AI request' });
  } finally {
    span.finish();
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  const span = tracer.startSpan('http.error');
  span.setTag('error', true);
  span.log({ error: err.message });
  span.finish();

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    request_id: req.id,
  });
});

// =====================================
// Server Startup
// =====================================

app.listen(port, () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    message: `Portfolio Backend Server running`,
    port,
    environment: process.env.NODE_ENV || 'development',
    service: process.env.DATADOG_SERVICE || 'portfolio-backend',
    datadog_enabled: process.env.DD_TRACE_ENABLED === 'true',
    ddsource: 'nodejs',
  }));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
