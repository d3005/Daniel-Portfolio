# Portfolio Backend API Documentation

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://portfolio-backend-XXXXX.onrender.com`

## Authentication

Currently, the API uses request ID correlation for tracking. For admin endpoints, Firebase authentication will be added.

## Request/Response Format

All requests and responses use JSON format.

### Standard Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "request_id": "unique-request-id"
}
```

---

## Endpoints

### Health & Status

#### GET /health

Check if the server is running and get status information.

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Portfolio Backend is running",
  "timestamp": "2024-02-03T20:48:00.000Z",
  "uptime": 1234.56,
  "environment": "production",
  "service": "portfolio-backend",
  "version": "1.0.0"
}
```

**Use Case**: 
- Health checks from monitoring services
- Verifying backend is operational
- Checking service version

---

#### GET /api/v1

Get API documentation and available endpoints.

**Response (200 OK):**
```json
{
  "message": "Portfolio Backend API v1",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "portfolio": "/api/v1/portfolio",
    "messages": "/api/v1/messages",
    "contact": "/api/v1/contact",
    "ai": "/api/v1/ai"
  }
}
```

---

### Portfolio Data

#### GET /api/v1/portfolio

Get all portfolio information including skills, experience, projects, and education.

**Query Parameters**: None

**Response (200 OK):**
```json
{
  "name": "Daniel Joseph Kommu",
  "title": "GenAI & ML Engineer",
  "summary": "Passionate about building intelligent systems...",
  "location": "India",
  "email": "daniel@example.com",
  "social": {
    "github": "https://github.com/danielkommu",
    "linkedin": "https://linkedin.com/in/danielkommu",
    "twitter": "https://twitter.com/danielkommu"
  },
  "skills": [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "GenAI",
    "LangChain",
    "RAG",
    "React",
    "TypeScript",
    "Firebase",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB"
  ],
  "experience": [
    {
      "id": "1",
      "company": "Tech Company 1",
      "position": "AI/ML Intern",
      "duration": "3 months",
      "description": "Worked on LLM applications and RAG systems"
    }
  ],
  "projects": [
    {
      "id": "1",
      "name": "AI Chatbot",
      "description": "RAG-powered chatbot using LangChain and Gemini",
      "technologies": ["Python", "LangChain", "Gemini"],
      "github": "https://github.com/...",
      "demo": "https://..."
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "University Name",
      "degree": "B.Tech",
      "field": "Computer Science",
      "year": "2024"
    }
  ]
}
```

**Use Case**: 
- Frontend portfolio page loads
- Public portfolio API
- Resume generation
- JSON export

---

### Contact Form

#### POST /api/v1/contact

Submit a contact form message. This endpoint accepts contact information and stores it for admin review.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration Opportunity",
  "message": "I'd like to discuss a project opportunity..."
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contact message received successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-02-03T20:48:00.000Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: name, email, subject, message"
}
```

**Validation:**
- `name`: Required, string
- `email`: Required, valid email format
- `subject`: Required, string (1-200 characters)
- `message`: Required, string (1-5000 characters)

**Use Case**: 
- Contact form submissions from frontend
- Email notifications to admin
- Contact message logging

**Rate Limiting**: 
- 10 messages per IP per hour (recommended)

---

### Messages Management

#### GET /api/v1/messages

Get all contact messages (admin only).

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `sort` (optional): Sort by field (default: `-timestamp`)

**Response (200 OK):**
```json
{
  "success": true,
  "messages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Collaboration",
      "message": "Message content...",
      "timestamp": "2024-02-03T20:48:00.000Z",
      "read": false
    }
  ],
  "total": 15,
  "offset": 0,
  "limit": 50
}
```

**Use Case**: 
- Admin dashboard message list
- Message management
- Filtering and pagination

**Authentication**: 
- Requires admin role (Firebase auth)

---

### AI Endpoint

#### POST /api/v1/ai

Process AI requests. Can be used for extended conversations or AI-powered features.

**Request Body:**
```json
{
  "message": "What are Daniel's main skills?",
  "context": {
    "conversation_id": "optional-id",
    "user_id": "optional-user-id"
  }
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "response": "Daniel's main skills include...",
  "context": {
    "conversation_id": "optional-id",
    "tokens_used": 250
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Message is required"
}
```

**Use Case**: 
- Extended AI conversations
- Backend AI processing
- Future chatbot improvements

---

## Headers & Metadata

### Request Headers

```
Content-Type: application/json
X-Request-ID: optional-unique-id  # Optional, server generates if missing
User-Agent: Your-App/1.0
```

### Response Headers

```
X-Request-ID: unique-request-id  # For request tracing
Content-Type: application/json
Access-Control-Allow-Origin: your-frontend-url
Cache-Control: public, max-age=60
```

---

## Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Endpoint doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |
| 503 | Service Unavailable | Server maintenance |

---

## Rate Limiting

### Recommended Limits (can be configured)

- **Public endpoints**: 100 requests per minute per IP
- **Contact endpoint**: 10 requests per hour per IP
- **Admin endpoints**: 1000 requests per minute (with auth)

---

## CORS Configuration

### Allowed Origins

- Frontend development: `http://localhost:5173`
- Frontend production: `https://portfolio-XXXXX.vercel.app`

### Allowed Methods

- GET
- POST
- PUT
- DELETE
- OPTIONS

### Allowed Headers

- Content-Type
- Authorization

---

## Request/Response Examples

### Example 1: Get Portfolio Data

```bash
curl -X GET https://portfolio-backend-XXXXX.onrender.com/api/v1/portfolio \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "name": "Daniel Joseph Kommu",
  "title": "GenAI & ML Engineer",
  ...
}
```

---

### Example 2: Submit Contact Form

```bash
curl -X POST https://portfolio-backend-XXXXX.onrender.com/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Project Inquiry",
    "message": "I have an interesting project..."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Contact message received successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-02-03T20:48:00.000Z"
  }
}
```

---

### Example 3: Check Health

```bash
curl -X GET https://portfolio-backend-XXXXX.onrender.com/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Portfolio Backend is running",
  "timestamp": "2024-02-03T20:48:00.000Z",
  "uptime": 1234.56,
  "environment": "production",
  "service": "portfolio-backend",
  "version": "1.0.0"
}
```

---

## Integration with Frontend

### JavaScript/TypeScript Example

```typescript
// Base API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch portfolio data
async function getPortfolioData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/portfolio`);
    if (!response.ok) throw new Error('Failed to fetch portfolio');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Submit contact form
async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) throw new Error('Failed to submit form');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check backend health
async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
```

---

## Monitoring & Logging

### Datadog Integration

All API calls are automatically tracked in Datadog:

- **Service**: `portfolio-backend`
- **Environment**: Production
- **Traces**: Available in Datadog APM
- **Logs**: All requests logged with trace IDs
- **Metrics**: Latency, error rate, throughput

---

## Future Enhancements

Planned for future versions:

- [ ] Message storage in database
- [ ] Admin message management endpoint
- [ ] Email notifications
- [ ] User authentication system
- [ ] API key management
- [ ] Webhook support
- [ ] GraphQL endpoint
- [ ] WebSocket for real-time updates

---

## Support

For issues or questions:

1. Check Render logs: https://dashboard.render.com
2. Check Datadog: https://app.datadoghq.com
3. Review this documentation
4. Create GitHub issue

---

**API Version**: 1.0.0  
**Last Updated**: February 3, 2026  
**Status**: Production Ready
