import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/print.css'
import App from './App.tsx'
import { initAuditLogListener } from '../infrastructure/external-services/AuditLogListener'

// Khởi tạo các bộ lắng nghe sự kiện Domain
initAuditLogListener();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
