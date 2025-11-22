import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { loadToken } from './services/api'

loadToken() // cargar token al inicio

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
