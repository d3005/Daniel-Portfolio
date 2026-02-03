# Portfolio Backend API

Backend service for Daniel Joseph Kommu's 3D Portfolio website. Built with Express.js and TypeScript, with Datadog APM monitoring integration.

## Features

- RESTful API endpoints for portfolio data
- Contact form submission handling
- Datadog APM tracing and logging
- CORS support for frontend integration
- Security headers with Helmet
- Request ID tracking and correlation
- Health check endpoint
- Error handling and logging

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Datadog API Key (for APM monitoring)

## Installation

```bash
cd portfolio-backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Key environment variables:
- `NODE_ENV`: Set to `production` for Render deployment
- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: Frontend URL for CORS (e.g., https://yourdomain.vercel.app)
- `DATADOG_API_KEY`: Your Datadog API key
- `DATADOG_SERVICE`: Service name for Datadog
- `DD_TRACE_ENABLED`: Enable Datadog tracing (true/false)

## Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Linting
npm run lint

# Run tests
npm test
```

## API Endpoints

### Health Check
- `GET /health` - Check server health and status

### API Version
- `GET /api/v1` - Get API documentation and available endpoints

### Portfolio Data
- `GET /api/v1/portfolio` - Get portfolio information

### Contact Form
- `POST /api/v1/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "Your message here"
  }
  ```

### Messages
- `GET /api/v1/messages` - Get all contact messages (admin)

### AI Endpoint
- `POST /api/v1/ai` - Process AI requests
  ```json
  {
    "message": "Your question here",
    "context": "Optional context"
  }
  ```

## Datadog Integration

The backend is pre-configured with Datadog APM tracing. Key features:

- **Automatic HTTP instrumentation**: All requests are traced
- **Request ID correlation**: Each request gets a unique ID for tracking
- **Log injection**: Datadog context is injected into logs
- **Custom spans**: API endpoints create custom spans for detailed tracing

### Datadog Tags

All traces and logs include:
- `service`: Service name (portfolio-backend)
- `env`: Environment (development/production)
- `version`: Service version

## Deployment to Render

1. Push code to GitHub repository
2. Connect repository to Render
3. Create new Web Service from GitHub
4. Configure environment variables (from `.env.example`)
5. Deploy

Render will automatically:
- Build the project (`npm run build`)
- Start the server (`npm start`)
- Monitor health checks (`/health` endpoint)

## CORS Configuration

The backend allows requests from:
- Frontend development server (localhost:5173)
- Frontend production URL (from `FRONTEND_URL` env var)
- Configured `PROD_FRONTEND_URL`

## Security

- Helmet.js for security headers
- CORS validation
- Request validation
- Error handling (no sensitive data leaks)

## Monitoring

View logs and traces in Datadog:
1. Go to Datadog dashboard
2. Navigate to APM → Services
3. Select "portfolio-backend" service
4. View traces, logs, and metrics

## License

MIT
