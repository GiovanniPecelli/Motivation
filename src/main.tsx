import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import logoRemoveBg from './assets/logo-removebg-preview.png'

// Create favicon dynamically
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = logoRemoveBg;
document.head.appendChild(favicon);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
