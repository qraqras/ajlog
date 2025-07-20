import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Scrum } from './scrum.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Scrum />
  </StrictMode>,
)
