# Datadog Monitoring Setup Guide

This guide will help you set up Datadog monitoring for both the Portfolio frontend and backend.

## Prerequisites

- Datadog account (create one at https://www.datadoghq.com/)
- Datadog API Key (provided by you)
- Both frontend and backend repositories

## Backend Setup (Node.js/Express)

### 1. Environment Variables

Add these to your backend `.env` file (or Render environment variables):

```env
# Datadog Configuration
DATADOG_API_KEY=your_api_key_here
DATADOG_SITE=datadoghq.com
DATADOG_SERVICE=portfolio-backend
DATADOG_ENV=production
DATADOG_VERSION=1.0.0
DD_APM_ENABLED=true
DD_LOGS_INJECTION=true
DD_TRACE_ENABLED=true
```

### 2. What's Included in Backend Monitoring

The backend automatically provides:

- **APM Tracing**: All HTTP requests are automatically traced
- **Log Injection**: Logs include Datadog trace IDs for correlation
- **Custom Spans**: API endpoints create custom spans
- **Request IDs**: Each request gets a unique ID for tracking
- **Error Tracking**: Exceptions are captured with full context
- **Performance Metrics**: Response times and status codes

### 3. Verify Backend Monitoring

1. Deploy backend to Render
2. Go to Datadog → APM → Services
3. Look for "portfolio-backend" service
4. Click to view traces and logs

---

## Frontend Setup (React/Vite)

### 1. Get Datadog RUM Credentials

Follow these steps to get your Application ID and Client Token:

1. Go to Datadog Dashboard
2. Navigate to **RUM Applications**
3. Click **Create New Application**
4. Select **React** as the framework
5. Choose your deployment environment
6. You'll receive:
   - **Application ID**
   - **Client Token**

### 2. Environment Variables

Add these to your frontend `.env.local` (development) and Vercel settings (production):

```env
# Datadog Configuration
VITE_DATADOG_APPLICATION_ID=your_application_id
VITE_DATADOG_CLIENT_TOKEN=your_client_token
VITE_DATADOG_SITE=datadoghq.com
VITE_APP_VERSION=1.0.0
```

### 3. What's Included in Frontend Monitoring

The frontend automatically provides:

- **Real User Monitoring (RUM)**: Track real user interactions
- **Session Recording**: 20% of sessions are recorded (configurable)
- **User Interactions**: All clicks and form submissions tracked
- **Resource Timing**: API calls and asset loading tracked
- **Error Tracking**: Client-side errors and API errors
- **Core Web Vitals**: LCP, FID, CLS metrics
- **Long Task Detection**: Identifies performance bottlenecks
- **Log Forwarding**: Console logs sent to Datadog

### 4. Verify Frontend Monitoring

1. Deploy frontend to Vercel
2. Visit your portfolio website
3. Interact with some pages and forms
4. Go to Datadog → RUM Applications
5. Select your application to view sessions and errors

---

## Setting Up Vercel Environment Variables

### Step-by-Step:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

| Variable Name | Value | Scope |
|---------------|-------|-------|
| `VITE_DATADOG_APPLICATION_ID` | Your Application ID | Production, Preview, Development |
| `VITE_DATADOG_CLIENT_TOKEN` | Your Client Token | Production, Preview, Development |
| `VITE_GEMINI_API_KEY` | Your Gemini API Key | Production, Preview, Development |
| `VITE_ADMIN_PASSWORD` | Your admin password | Production (optional) |
| `VITE_API_BASE_URL` | `https://portfolio-backend.onrender.com` | Production |

4. Click "Save"
5. Redeploy your Vercel project

---

## Setting Up Render Environment Variables

### Step-by-Step:

1. Go to your Render service dashboard (backend)
2. Navigate to **Settings** → **Environment**
3. Add these variables:

| Variable Name | Value |
|---------------|-------|
| `DATADOG_API_KEY` | Your API key |
| `DATADOG_SERVICE` | portfolio-backend |
| `DATADOG_ENV` | production |
| `DD_TRACE_ENABLED` | true |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `PROD_FRONTEND_URL` | Your Vercel frontend URL |

4. Click "Save"
5. Redeploy your Render service

---

## Understanding the Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Your Portfolio Website                     │
│                   (Vercel Frontend)                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Datadog RUM Agent (Browser)                        │  │
│  │  - Tracks: Clicks, Form submissions, Errors        │  │
│  │  - Monitors: Page loads, API calls, Performance    │  │
│  │  - Records: 20% of sessions for playback           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┬┘
                                                              │
                                    API calls to backend      │
                                                              │
┌─────────────────────────────────────────────────────────────▼─┐
│         Portfolio Backend API (Render)                       │
│         https://portfolio-backend.onrender.com              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Datadog APM Agent (Node.js)                        │  │
│  │  - Traces: All HTTP requests                        │  │
│  │  - Monitors: Response times, Error rates            │  │
│  │  - Tracks: Custom API endpoint metrics              │  │
│  │  - Logs: All requests with trace context            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┬┘
                                                              │
                    Logs & Traces sent to                    │
                         Datadog API                         │
                                                              │
        ┌─────────────────────────────────────────────┐      │
        │      Datadog Cloud (datadoghq.com)         │◄─────┘
        │                                             │
        │  - Dashboard: Real-time metrics             │
        │  - APM: Distributed tracing                 │
        │  - RUM: User session monitoring             │
        │  - Logs: Centralized logging                │
        │  - Alerts: Performance & error alerts       │
        │  - Analytics: User behavior analysis        │
        └─────────────────────────────────────────────┘
```

---

## Datadog Dashboard Tips

### 1. Create a Custom Dashboard

1. Go to **Dashboards** → **New Dashboard**
2. Add these widgets:
   - **APM**: Service latency (portfolio-backend)
   - **RUM**: User sessions graph
   - **Logs**: Error rate over time
   - **Metrics**: API response times

### 2. Set Up Alerts

1. Go to **Monitors** → **New Monitor**
2. Create alerts for:
   - High error rates (> 5%)
   - Slow API responses (> 1000ms)
   - Backend service down
   - RUM errors increase

### 3. View Traces

1. Go to **APM** → **Traces**
2. Search for traces by:
   - Service: `portfolio-backend`
   - Endpoint: `/api/v1/portfolio`
   - Status: `error`

### 4. View Session Recordings

1. Go to **RUM Applications** → Your app
2. Select **Sessions**
3. Filter by:
   - Errors only
   - Duration > 60 seconds
   - Specific pages

---

## Common Datadog Metrics to Monitor

### Backend (APM)

- **Apdex Score**: Application Performance Index (0-1, higher is better)
- **Latency (p99)**: 99th percentile response time
- **Error Rate**: % of requests with errors
- **Throughput**: Requests per second

### Frontend (RUM)

- **Session Count**: Number of user sessions
- **Core Web Vitals**:
  - LCP: Largest Contentful Paint < 2.5s
  - FID: First Input Delay < 100ms
  - CLS: Cumulative Layout Shift < 0.1
- **Error Rate**: % of sessions with errors
- **User Impact**: % of users affected by errors

---

## Troubleshooting

### Backend Traces Not Showing

1. Check `DD_TRACE_ENABLED=true` in environment variables
2. Verify `DATADOG_API_KEY` is correct
3. Check Render logs for errors
4. Restart the Render service

### Frontend RUM Not Working

1. Verify `VITE_DATADOG_APPLICATION_ID` is set
2. Check `VITE_DATADOG_CLIENT_TOKEN` is correct
3. Check browser console for errors
4. Verify Datadog library is loaded (Network tab)

### No Logs Appearing

1. Check `DD_LOGS_INJECTION=true` in backend
2. Verify API calls are reaching the backend
3. Check Datadog Logs section (might have delay)
4. Ensure environment is set to "production" or matching value

---

## Next Steps

1. ✅ Deploy backend to Render with Datadog enabled
2. ✅ Deploy frontend to Vercel with RUM configured
3. ✅ Visit your portfolio and interact with pages
4. ✅ Check Datadog dashboards for data
5. ✅ Set up alerts for important metrics
6. ✅ Create custom dashboard for monitoring

---

## Additional Resources

- [Datadog Documentation](https://docs.datadoghq.com/)
- [Datadog RUM Setup](https://docs.datadoghq.com/real_user_monitoring/browser/)
- [Datadog APM Setup](https://docs.datadoghq.com/tracing/)
- [Datadog Alerts](https://docs.datadoghq.com/monitors/)
