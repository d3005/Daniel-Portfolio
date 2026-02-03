# Complete Deployment Guide

This guide covers deploying both the Portfolio Backend (to Render) and Frontend (to Vercel) with Datadog monitoring.

---

## Phase 1: Pre-Deployment Setup

### 1.1 Backend Repository Setup

```bash
# Initialize git repository in portfolio-backend
cd D:\Portfolio-2\portfolio-backend
git init
git add .
git commit -m "Initial backend setup with Datadog integration"
```

### 1.2 Frontend Repository Preparation

```bash
# In portfolio-3d directory
cd D:\Portfolio-2\portfolio-3d
git add .
git commit -m "Add Datadog integration and deployment configs"
```

### 1.3 Push to GitHub

```bash
# For backend
cd D:\Portfolio-2\portfolio-backend
git remote add origin https://github.com/YOUR_USERNAME/portfolio-backend.git
git branch -M main
git push -u origin main

# For frontend
cd D:\Portfolio-2\portfolio-3d
git remote add origin https://github.com/YOUR_USERNAME/portfolio-3d.git
git branch -M main
git push -u origin main
```

---

## Phase 2: Deploy Backend to Render

### Step 1: Create Render Account
- Go to https://render.com
- Sign up or log in with GitHub

### Step 2: Create Web Service

1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub account
4. Select `portfolio-backend` repository
5. Fill in the form:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Standard ($12/month)

### Step 3: Configure Environment Variables

In Render dashboard, go to Service → Environment:

```
NODE_ENV=production
PORT=3000
DATADOG_API_KEY=YOUR_DATADOG_API_KEY
DATADOG_SITE=datadoghq.com
DATADOG_SERVICE=portfolio-backend
DATADOG_ENV=production
DATADOG_VERSION=1.0.0
DD_APM_ENABLED=true
DD_LOGS_INJECTION=true
DD_TRACE_ENABLED=true
FRONTEND_URL=https://portfolio.vercel.app
PROD_FRONTEND_URL=https://portfolio.vercel.app
```

**Replace `https://portfolio.vercel.app` with your actual Vercel URL (you'll know this after deploying frontend)**

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Wait for deployment to complete (2-5 minutes)
4. Note your backend URL: `https://portfolio-backend-XXXXX.onrender.com`

### Step 5: Verify Backend Deployment

```bash
# Test health check
curl https://portfolio-backend-XXXXX.onrender.com/health

# Expected response:
# {"status":"ok","message":"Portfolio Backend is running",...}
```

---

## Phase 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Select `portfolio-3d` repository
4. Click "Import"

### Step 3: Configure Environment Variables

In Vercel → Project Settings → Environment Variables, add:

```
VITE_API_BASE_URL=https://portfolio-backend-XXXXX.onrender.com
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
VITE_ADMIN_PASSWORD=DJ@3007
VITE_DATADOG_APPLICATION_ID=YOUR_DATADOG_APP_ID
VITE_DATADOG_CLIENT_TOKEN=YOUR_DATADOG_CLIENT_TOKEN
VITE_DATADOG_SITE=datadoghq.com
VITE_APP_VERSION=1.0.0
```

**Important**: Replace placeholders with actual values:
- `portfolio-backend-XXXXX.onrender.com` - Your Render backend URL
- `YOUR_GEMINI_API_KEY` - Your Google Gemini API key
- `YOUR_DATADOG_APP_ID` - Datadog Application ID
- `YOUR_DATADOG_CLIENT_TOKEN` - Datadog Client Token

### Step 4: Configure Build Settings

1. Go to Project Settings → General
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy
3. Wait for deployment to complete (1-3 minutes)
4. Note your frontend URL: `https://portfolio-XXXXX.vercel.app`

### Step 6: Verify Frontend Deployment

- Visit your Vercel URL
- Check that all pages load
- Verify admin login works
- Test chatbot functionality

---

## Phase 4: Update Backend with Frontend URL

Now that you have your Vercel URL, update the backend:

### In Render Dashboard:

1. Go to Service → Environment
2. Update these variables:
   ```
   FRONTEND_URL=https://portfolio-XXXXX.vercel.app
   PROD_FRONTEND_URL=https://portfolio-XXXXX.vercel.app
   ```
3. Click "Save Changes"
4. Render will automatically redeploy

---

## Phase 5: Datadog Configuration

### Step 1: Get Datadog RUM Credentials

1. Go to Datadog Dashboard
2. Navigate to RUM & Session Replay
3. Click "Create New Application"
4. Select "React" framework
5. You'll receive:
   - **Application ID**
   - **Client Token**

### Step 2: Update Frontend Environment Variables

In Vercel Settings, add/update:

```
VITE_DATADOG_APPLICATION_ID=your_app_id
VITE_DATADOG_CLIENT_TOKEN=your_client_token
```

Then redeploy frontend.

### Step 3: Create Custom Dashboard

1. Go to Datadog → Dashboards
2. Click "Create Dashboard"
3. Add these widgets:

**Backend Monitoring:**
- Service: portfolio-backend
- Latency (p99)
- Error rate
- Throughput

**Frontend Monitoring:**
- RUM sessions
- User errors
- Core Web Vitals
- Page views

### Step 4: Set Up Alerts

1. Go to Datadog → Monitors → New Monitor
2. Create monitors for:
   - Backend error rate > 5%
   - Backend latency p99 > 1000ms
   - Backend service down
   - RUM error rate > 3%

---

## Phase 6: Verification & Testing

### Checklist:

- [ ] Backend health check responds (GET /health)
- [ ] Frontend homepage loads
- [ ] All portfolio pages accessible
- [ ] Admin login works
- [ ] AI chatbot responds
- [ ] Contact form submits
- [ ] Datadog APM shows backend traces
- [ ] Datadog RUM shows frontend sessions
- [ ] Environment variables all set
- [ ] CORS working (frontend can call backend)

### Manual Testing:

```bash
# Test backend API
curl -X GET https://portfolio-backend-XXXXX.onrender.com/api/v1/portfolio

# Test contact endpoint
curl -X POST https://portfolio-backend-XXXXX.onrender.com/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

### Browser Testing:

1. Open your Vercel frontend URL
2. Open DevTools → Network tab
3. Navigate through pages
4. Check that API calls reach your backend
5. Check Console for any errors

---

## Phase 7: Monitoring Setup

### View Backend Metrics:

1. Datadog Dashboard
2. APM → Services
3. Select "portfolio-backend"
4. View:
   - Traces
   - Latency
   - Error rate
   - Dependencies

### View Frontend Metrics:

1. Datadog Dashboard
2. RUM Applications
3. Select your app
4. View:
   - Sessions
   - Pages
   - Errors
   - Core Web Vitals

### View Combined Traces:

1. APM → Traces
2. Search by service name
3. View full request flow from frontend to backend

---

## Troubleshooting

### Backend Not Deploying

1. Check Render logs: Service → Logs
2. Look for build errors
3. Verify environment variables are set
4. Check Node version (must be >= 18)

### Frontend Not Loading

1. Check Vercel deployment logs
2. Verify build completed successfully
3. Check that API URL is correct in env vars
4. Test: `curl https://portfolio-backend-XXXXX.onrender.com/health`

### CORS Errors

1. Frontend getting blocked?
2. Check backend CORS config includes frontend URL
3. Update backend environment variables
4. Redeploy backend

### Datadog Not Showing Data

**Backend:**
- Verify `DD_TRACE_ENABLED=true`
- Check logs for Datadog connection errors
- Make some API calls to generate traces

**Frontend:**
- Check browser console for Datadog errors
- Verify Application ID and Client Token are correct
- Make sure RUM library is loaded

### Still Having Issues?

1. Check logs:
   - Backend: Render → Logs
   - Frontend: Vercel → Deployments → Logs
2. Test locally first:
   - `npm run dev` for frontend
   - `npm run dev` for backend
3. Verify environment variables match exactly
4. Check firewall/network settings

---

## Post-Deployment

### 1. Update DNS (Optional)

If you have a custom domain:

**For Vercel Frontend:**
1. Vercel → Project Settings → Domains
2. Add custom domain
3. Update DNS records (Vercel provides instructions)

**For Render Backend:**
1. Render → Service → Settings → Custom Domain
2. Add custom domain
3. Update DNS records

### 2. Enable HTTPS

- Vercel: Automatic with custom domain
- Render: Automatic for onrender.com domains

### 3. Setup CI/CD

**GitHub Actions for Automated Deployment:**

Both Vercel and Render integrate with GitHub automatically:
- Commits to `main` branch auto-deploy
- Preview deployments for pull requests

### 4. Monitoring & Logging

**Set up log aggregation:**
1. All logs flow to Datadog
2. Create alerts for errors
3. Monitor performance metrics
4. Track user behavior

### 5. Performance Optimization

**After deployment:**
1. Check Vercel Analytics
2. Check backend response times in Datadog
3. Optimize slow endpoints
4. Add caching if needed

---

## Daily Operations

### Monitoring Checklist

Daily:
- [ ] Check Datadog dashboard for alerts
- [ ] Monitor error rates (< 1%)
- [ ] Check backend latency (< 500ms)
- [ ] Review user sessions
- [ ] Check contact form submissions

Weekly:
- [ ] Review performance trends
- [ ] Analyze user behavior
- [ ] Check for slow API endpoints
- [ ] Review error logs

### Common Maintenance Tasks

**Update Dependencies:**
```bash
# Backend
cd portfolio-backend
npm update
npm audit fix
git push

# Frontend
cd portfolio-3d
npm update
npm audit fix
git push
```

**Check Deployment Status:**
- Render: Service → Status
- Vercel: Project → Deployments

**Scale Backend (if needed):**
- Render → Service → Plan → Upgrade to Pro ($29/month)

---

## Success Indicators

Your deployment is successful when:

✅ Frontend loads at `https://your-domain.vercel.app`
✅ Backend API responds at `https://your-domain.onrender.com`
✅ All pages and features work
✅ Admin panel accessible
✅ Chatbot functional
✅ Contact form works
✅ Datadog shows traces and sessions
✅ No console errors
✅ Performance is good (< 1s page load)
✅ Monitoring alerts configured

---

## Next Steps

1. **Scale Backend**: If handling lots of traffic, upgrade Render plan
2. **Add Database**: Connect PostgreSQL for storing contacts
3. **Add Email Service**: Send emails for contact form
4. **Add Analytics**: Deeper user behavior tracking
5. **Add Search**: Implement portfolio search feature
6. **Mobile App**: Consider React Native version
7. **API Documentation**: Add Swagger/OpenAPI docs

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Datadog Docs**: https://docs.datadoghq.com
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

**Document Updated**: February 3, 2026
**Status**: Ready for Deployment
