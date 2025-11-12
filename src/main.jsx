// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// global css primero (bootstrap, fontawesome y tu App.css)
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// ahora importamos App (que importa componentes)
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* basename indica a react-router que todas las rutas viven bajo /GrowsyncComunicacion */}
    <BrowserRouter basename="/GrowsyncComunicacion">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);