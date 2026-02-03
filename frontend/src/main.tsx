import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeDatadog } from './lib/datadog'
import './index.css'
import App from './App.tsx'

// Initialize Datadog monitoring as early as possible
initializeDatadog()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
