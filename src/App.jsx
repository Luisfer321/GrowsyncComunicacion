// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import DashboardComunicacion from '../DashboardComunicacion.jsx';
import EnviarMensaje from '../EnviarMensaje.jsx';
import ListaMensajes from '../ListaMensajes.jsx';
import EstadoPedidos from '../EstadoPedidos.jsx';
import HistorialComunicaciones from '../HistorialComunicaciones.jsx';
import Notificaciones from '../Notificaciones.jsx';
import Recordatorios from '../Recordatorios.jsx';
import ReportesInternos from '../ReportesInternos.jsx';

const App = () => {
  return (
    <div>
      {/* Header minimalista con hoja SVG */}
      <nav className="app-header d-flex align-items-center justify-content-between px-4">
        <div className="brand-container d-flex align-items-center gap-3">
          {/* SVG inline — dos tonos, con fondo crema para contraste */}
          <svg
            className="brand-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
          >
            {/* círculo de fondo crema */}
            <circle cx="32" cy="32" r="28" fill="var(--crema)" />
            {/* hoja: dos capas para darle profundidad */}
            <path
              d="M44.5 20.5c-6.2 0-11.5 3.7-15.2 7.4-3.8 3.9-8.9 9.3-8.9 9.3s5.6-1 10.4-4.9c4.2-3.4 9.9-8.8 14.9-8.8 2.2 0 4.8-1.8 4.8-4.3 0-2.5-2.6-3.7-6-3.7z"
              fill="var(--verde)"
              opacity="0.95"
            />
            <path
              d="M30.5 42.2c3.1-3.2 6.8-6.5 11.3-8.6-4.4 1.7-8.2 4.7-11.1 7.9-2.1 2.3-3.7 4.8-3.7 4.8s1.9-0.4 3.5-0.1z"
              fill="rgba(20,90,30,0.12)"
            />
          </svg>

          <span className="brand-text">GrowSync</span>
        </div>
      </nav>

      {/* Rutas (no visibles en header) */}
      <Routes>
        <Route path="/" element={<DashboardComunicacion />} />
        <Route path="/comunicacion" element={<DashboardComunicacion />} />
        <Route path="/comunicacion/mensajes" element={<EnviarMensaje />} />
        <Route path="/comunicacion/lista-mensajes" element={<ListaMensajes />} />
        <Route path="/comunicacion/estado_pedidos" element={<EstadoPedidos />} />
        <Route path="/comunicacion/historial" element={<HistorialComunicaciones />} />
        <Route path="/comunicacion/notificaciones" element={<Notificaciones />} />
        <Route path="/comunicacion/recordatorios" element={<Recordatorios />} />
        <Route path="/comunicacion/reportes" element={<ReportesInternos />} />
      </Routes>
    </div>
  );
};

export default App;