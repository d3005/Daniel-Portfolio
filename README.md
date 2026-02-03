# Full-Stack Portfolio Application

React frontend with Express backend and Datadog monitoring.

## Structure

```
├── frontend/     # React + Vite (Vercel)
└── backend/      # Express.js (Render)
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Three.js, Framer Motion, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript, Firebase Admin SDK
- **Monitoring**: Datadog (APM, RUM, Logs)

## Features

- **3D Portfolio**: Interactive 3D environment built with Three.js
- **AI Chatbot**: Intelligent chatbot integration powered by Google Gemini
- **Secure API**: Backend-mediated access to portfolio data (Firebase)
- **Monitoring**: Full-stack observability with Datadog APM and RUM
- **Admin Panel**: Secure admin authentication and message management

## Quick Start

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_key
VITE_ADMIN_PASSWORD=your_password
VITE_DATADOG_APPLICATION_ID=your_id
VITE_DATADOG_CLIENT_TOKEN=your_token
```

**Backend (.env):**
```
NODE_ENV=development
PORT=3000
DATADOG_API_KEY=your_key
DATADOG_SERVICE=portfolio-backend
DD_TRACE_ENABLED=true
FIREBASE_DATABASE_URL=your_firebase_url
```

## Deployment

1. **Frontend:** Deploy `frontend/` folder to Vercel
2. **Backend:** Deploy `backend/` folder to Render

See `DEPLOYMENT_GUIDE.md` for details.

## License

MIT
