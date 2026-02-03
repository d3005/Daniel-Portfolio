# Daniel Joseph Kommu's Portfolio - Monorepo

Complete full-stack portfolio application with React frontend, Node.js backend, and Datadog monitoring.

## 📁 Project Structure

```
Daniel-Portfolio/
├── frontend/                    # React 3D Portfolio (Deployed to Vercel)
│   ├── src/                    # React components and pages
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vercel.json            # Vercel deployment config
│   ├── vite.config.ts         # Vite build config
│   └── README.md
│
├── backend/                     # Express.js API (Deployed to Render)
│   ├── src/                    # TypeScript server code
│   ├── package.json
│   ├── render.yaml            # Render deployment config
│   ├── tsconfig.json
│   └── README.md
│
└── Documentation files (root)
    ├── DEPLOYMENT_GUIDE.md
    ├── DEPLOYMENT_CHECKLIST.md
    ├── DATADOG_SETUP_GUIDE.md
    ├── API_DOCUMENTATION.md
    └── DEPLOYMENT_SUMMARY.md
```

## 🚀 Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

## 📊 Project Overview

### Frontend (React + Vite)
- 3D interactive portfolio with Three.js
- Framer Motion animations
- Datadog RUM monitoring
- Admin authentication
- AI chatbot powered by Google Gemini
- Fully responsive design

**Technologies**: React 19, TypeScript, Tailwind CSS, Three.js, Vite

**Deployment**: Vercel (https://portfolio-XXXXX.vercel.app)

### Backend (Express.js)
- RESTful API with 6 endpoints
- Datadog APM tracing
- CORS configuration
- Request tracking
- Contact form handling
- Portfolio data API

**Technologies**: Node.js, Express.js, TypeScript, Datadog

**Deployment**: Render (https://portfolio-backend-XXXXX.onrender.com)

### Monitoring (Datadog)
- Full-stack APM tracing
- RUM session recording
- Centralized logging
- Performance dashboards
- Alert management

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Complete step-by-step deployment instructions
- **DEPLOYMENT_CHECKLIST.md** - Quick reference checklist
- **DATADOG_SETUP_GUIDE.md** - Datadog configuration guide
- **API_DOCUMENTATION.md** - Backend API reference
- **DEPLOYMENT_SUMMARY.md** - Architecture overview
- **frontend/README.md** - Frontend setup instructions
- **backend/README.md** - Backend setup instructions

## 🔗 Important Links

| Service | Link |
|---------|------|
| Frontend Dev | http://localhost:5173 |
| Backend Dev | http://localhost:3000 |
| Backend Health | http://localhost:3000/health |
| Vercel Dashboard | https://vercel.com/dashboard |
| Render Dashboard | https://dashboard.render.com |
| Datadog Dashboard | https://app.datadoghq.com |

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_key
VITE_ADMIN_PASSWORD=DJ@3007
VITE_DATADOG_APPLICATION_ID=your_id
VITE_DATADOG_CLIENT_TOKEN=your_token
```

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATADOG_API_KEY=your_key
DATADOG_SERVICE=portfolio-backend
DD_TRACE_ENABLED=true
```

## 🚢 Deployment

### Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import `frontend` directory
3. Configure environment variables
4. Deploy

### Deploy Backend to Render
1. Go to https://render.com
2. Create Web Service from `backend` directory
3. Configure environment variables
4. Deploy

See **DEPLOYMENT_GUIDE.md** for detailed instructions.

## 📊 Monitoring Setup

All deployments include Datadog monitoring:

- **APM**: Backend traces and performance metrics
- **RUM**: Frontend sessions and user interactions
- **Logs**: Centralized log aggregation
- **Dashboards**: Custom monitoring dashboards

See **DATADOG_SETUP_GUIDE.md** for setup instructions.

## 📝 API Endpoints

### Health & Status
- `GET /health` - Server health check
- `GET /api/v1` - API info

### Portfolio Data
- `GET /api/v1/portfolio` - Get portfolio information

### Contact
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/messages` - Get messages (admin)

### AI
- `POST /api/v1/ai` - AI endpoint

See **API_DOCUMENTATION.md** for full details.

## 🔐 Security

- HTTPS on all endpoints
- CORS properly configured
- Environment variables for secrets
- Security headers (Helmet)
- Request validation

## 💡 Features

✅ Full-stack deployment  
✅ Real-time monitoring with Datadog  
✅ API-first architecture  
✅ TypeScript for type safety  
✅ Production-ready error handling  
✅ Session recording and playback  
✅ Automated CI/CD  
✅ 3D portfolio experience  
✅ AI chatbot integration  
✅ Admin authentication  

## 🛠️ Build & Deploy

### Build Frontend
```bash
cd frontend
npm run build
```

### Build Backend
```bash
cd backend
npm run build
```

### Local Testing
```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev
```

## 📞 Support

For deployment and setup help:
1. Check relevant documentation files
2. Review Render/Vercel dashboards for logs
3. Check Datadog for monitoring data
4. Review API documentation

## 📄 License

MIT

## 👤 Author

Daniel Joseph Kommu

---

**Status**: ✅ Production Ready

Last Updated: February 3, 2026
