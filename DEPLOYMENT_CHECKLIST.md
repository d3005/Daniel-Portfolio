# Deployment Checklist - Quick Reference

## Pre-Deployment (Do These First)

### GitHub Setup
- [ ] Backend repository created on GitHub
- [ ] Frontend repository created on GitHub
- [ ] Both repositories have initial commits
- [ ] `.gitignore` files in place
- [ ] README files updated

### Accounts Created
- [ ] Render account created (https://render.com)
- [ ] Vercel account created (https://vercel.com)
- [ ] Datadog account created (https://datadoghq.com)
- [ ] GitHub account connected to Render
- [ ] GitHub account connected to Vercel

### API Keys Gathered
- [ ] Datadog API Key: `_______________________`
- [ ] Datadog Application ID (for RUM): `_______________________`
- [ ] Datadog Client Token (for RUM): `_______________________`
- [ ] Google Gemini API Key: `_______________________`
- [ ] Admin Password set: `DJ@3007`

---

## Backend Deployment to Render

### Prerequisites
- [ ] Backend code ready in GitHub
- [ ] All dependencies in package.json
- [ ] TypeScript build works locally
- [ ] .env.example file created
- [ ] render.yaml configuration file ready

### Render Configuration
- [ ] Create new Web Service in Render
- [ ] Connect to portfolio-backend GitHub repo
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `DATADOG_API_KEY=<your_key>`
  - [ ] `DATADOG_SERVICE=portfolio-backend`
  - [ ] `DATADOG_ENV=production`
  - [ ] `DATADOG_VERSION=1.0.0`
  - [ ] `DD_TRACE_ENABLED=true`
  - [ ] `DD_LOGS_INJECTION=true`
  - [ ] `DD_APM_ENABLED=true`
  - [ ] `FRONTEND_URL=http://localhost:5173` (temporary)
  - [ ] `PROD_FRONTEND_URL=<frontend_url>` (update after frontend deployment)

### Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete
- [ ] Note backend URL: `https://portfolio-backend-XXXXX.onrender.com`
- [ ] Test health endpoint: `/health`
- [ ] Verify API endpoints respond

### Post-Deployment Verification
- [ ] Health check passes: `GET /health` → 200 OK
- [ ] Portfolio endpoint works: `GET /api/v1/portfolio`
- [ ] Contact endpoint accepts POST
- [ ] Datadog logs appearing
- [ ] No errors in Render logs

---

## Frontend Deployment to Vercel

### Prerequisites
- [ ] Frontend code ready in GitHub
- [ ] vercel.json configuration file ready
- [ ] .vercelignore file ready
- [ ] All dependencies in package.json
- [ ] Build works locally: `npm run build`
- [ ] Backend URL available

### Vercel Configuration
- [ ] Import portfolio-3d repository from GitHub
- [ ] Framework preset: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment Variables set:
  - [ ] `VITE_API_BASE_URL=https://portfolio-backend-XXXXX.onrender.com`
  - [ ] `VITE_GEMINI_API_KEY=<your_key>`
  - [ ] `VITE_ADMIN_PASSWORD=DJ@3007`
  - [ ] `VITE_DATADOG_APPLICATION_ID=<your_id>`
  - [ ] `VITE_DATADOG_CLIENT_TOKEN=<your_token>`
  - [ ] `VITE_DATADOG_SITE=datadoghq.com`
  - [ ] `VITE_APP_VERSION=1.0.0`

### Deployment
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Note frontend URL: `https://portfolio-XXXXX.vercel.app`
- [ ] Deployment shows as "Ready"

### Post-Deployment Verification
- [ ] Frontend loads without errors
- [ ] Homepage displays correctly
- [ ] All navigation links work
- [ ] Images and styles load
- [ ] 3D scenes render
- [ ] No CORS errors in console

---

## Post-Deployment Configuration

### Update Backend with Frontend URL

In Render Dashboard → portfolio-backend Service → Environment:
- [ ] Update `FRONTEND_URL=https://portfolio-XXXXX.vercel.app`
- [ ] Update `PROD_FRONTEND_URL=https://portfolio-XXXXX.vercel.app`
- [ ] Save changes (triggers redeploy)

### Test Full Integration

- [ ] Frontend loads
- [ ] API calls reach backend
- [ ] Contact form works
- [ ] Admin login functions
- [ ] Chatbot responds
- [ ] No CORS errors

---

## Datadog Configuration

### RUM Setup (Frontend Monitoring)

- [ ] Go to Datadog → RUM Applications
- [ ] Create new application: "Portfolio Frontend"
- [ ] Select framework: React
- [ ] Copy Application ID and Client Token
- [ ] Update Vercel environment variables
- [ ] Redeploy frontend
- [ ] Verify RUM data appears in Datadog

### APM Setup (Backend Monitoring)

- [ ] Go to Datadog → APM → Services
- [ ] Verify "portfolio-backend" service appears
- [ ] Check traces are being collected
- [ ] View latency and error metrics
- [ ] Confirm log injection working

### Dashboard Setup

- [ ] Go to Datadog → Dashboards
- [ ] Create "Portfolio Monitoring" dashboard
- [ ] Add backend metrics widget
- [ ] Add frontend RUM widget
- [ ] Add logs widget
- [ ] Save dashboard

### Alerts Setup

- [ ] Create Alert: Backend error rate > 5%
- [ ] Create Alert: Backend latency p99 > 1000ms
- [ ] Create Alert: Backend service down
- [ ] Create Alert: RUM error rate > 3%
- [ ] Set alert notification channels (email, Slack, etc.)

---

## Testing & Verification

### Functional Testing

- [ ] Homepage loads (`/`)
- [ ] Skills page loads (`/skills`)
- [ ] Experience page loads (`/experience`)
- [ ] Projects page loads (`/projects`)
- [ ] Education page loads (`/education`)
- [ ] Contact page loads (`/contact`)
- [ ] Contact form submits successfully
- [ ] Admin page accessible (`/admin`)
- [ ] Admin login with password works
- [ ] Admin dashboard loads
- [ ] Chatbot opens and responds
- [ ] All 3D scenes render

### Performance Testing

- [ ] Frontend load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] No CORS errors
- [ ] Images optimized

### Monitoring Testing

- [ ] Datadog APM shows traces
- [ ] Datadog RUM shows sessions
- [ ] Logs appear in Datadog
- [ ] Metrics display correctly
- [ ] Alerts trigger appropriately

---

## Production Readiness

### Security

- [ ] All sensitive keys in environment variables
- [ ] No secrets in git repositories
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on backend
- [ ] Rate limiting configured (optional)

### Performance

- [ ] CDN enabled (Vercel default)
- [ ] Caching headers set correctly
- [ ] Database connections optimized (if applicable)
- [ ] Asset optimization done
- [ ] Lazy loading implemented

### Reliability

- [ ] Health checks working
- [ ] Monitoring and alerts configured
- [ ] Error logging enabled
- [ ] Backup strategy planned
- [ ] Disaster recovery plan ready

### Documentation

- [ ] README files updated
- [ ] API documentation available
- [ ] Environment variables documented
- [ ] Deployment steps documented
- [ ] Troubleshooting guide created

---

## Monitoring URLs

Save these for quick access:

- **Frontend URL**: `https://portfolio-XXXXX.vercel.app`
- **Backend URL**: `https://portfolio-backend-XXXXX.onrender.com`
- **Render Dashboard**: `https://dashboard.render.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Datadog Dashboard**: `https://app.datadoghq.com`
- **Backend Health**: `https://portfolio-backend-XXXXX.onrender.com/health`

---

## Maintenance Schedule

### Daily
- [ ] Check Datadog dashboard for alerts
- [ ] Monitor error rates

### Weekly
- [ ] Review performance metrics
- [ ] Check user feedback
- [ ] Review logs for issues

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning

### Quarterly
- [ ] Major updates
- [ ] Feature releases
- [ ] Infrastructure review

---

## Rollback Plan

If deployment fails:

1. Check Render logs for backend errors
2. Check Vercel deployment logs for frontend errors
3. Verify environment variables are correct
4. Revert recent changes in Git if needed
5. Manual rebuild if necessary

**Backend Rollback:**
```bash
# In Render dashboard:
# 1. Go to Deployments
# 2. Select previous successful deployment
# 3. Click "Redeploy"
```

**Frontend Rollback:**
```bash
# In Vercel dashboard:
# 1. Go to Deployments
# 2. Find previous successful deployment
# 3. Click the three dots menu
# 4. Select "Promote to Production"
```

---

## Success Criteria

All items must be checked before marking deployment as complete:

- [ ] Frontend accessible and fully functional
- [ ] Backend API operational and responding
- [ ] All pages load without errors
- [ ] Admin panel works
- [ ] Chatbot functional
- [ ] Contact form working
- [ ] Datadog collecting traces (backend)
- [ ] Datadog collecting sessions (frontend)
- [ ] Alerts configured and testing
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] CORS not blocking requests
- [ ] Environment variables all set
- [ ] Documentation complete
- [ ] Team notified of deployment

---

## Sign-Off

- **Frontend Deployed**: _____________________ (Date/Time)
- **Backend Deployed**: _____________________ (Date/Time)
- **Datadog Configured**: _____________________ (Date/Time)
- **All Tests Passing**: _____________________ (Date/Time)
- **Production Live**: _____________________ (Date/Time)

---

**Last Updated**: February 3, 2026
**Status**: Ready for Deployment
