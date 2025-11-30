import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; 
import { CartProvider } from './context/CartContext'; 
import './index.css';

const container = document.getElementById('root');

if (!container) {

  throw new Error("No se pudo encontrar el elemento root. Asegúrate de que existe en index.html.");
}


ReactDOM.createRoot(container).render(
  <React.StrictMode>
  
    <AuthProvider>
      <CartProvider> 
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);