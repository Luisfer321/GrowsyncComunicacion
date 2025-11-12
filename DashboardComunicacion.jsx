// COMUNICACION/DashboardComunicacion.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import mockApi from './mockApi';

const DashboardComunicacion = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [mensCount, setMensCount] = useState(0);
  const [notiCount, setNotiCount] = useState(0);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Mensajes',
            data: [2, 3, 4, 2, 1, 5, 0],
            backgroundColor: '#2C5F2D'
          },
          {
            label: 'Notificaciones',
            data: [1, 2, 2, 1, 3, 2, 1],
            backgroundColor: '#f2c94c'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(()=> {
    mockApi.getMensajes().then(m => setMensCount(m.length)).catch(()=>{});
    mockApi.getNotificaciones().then(n => setNotiCount(n.length)).catch(()=>{});
  }, []);

  const cards = [
    { to: "/comunicacion/notificaciones", icon: "fas fa-bell", title: "Notificaciones", text: "Revisa alertas internas de inventario y pedidos." },
    { to: "/comunicacion/mensajes", icon: "fas fa-envelope", title: "Enviar Mensaje", text: "Envía comunicaciones masivas al personal con confirmación visual." },
    { to: "/comunicacion/historial", icon: "fas fa-history", title: "Historial de Comunicación", text: "Consulta y filtra mensajes y anuncios anteriores." },
    { to: "/comunicacion/reportes", icon: "fas fa-chart-bar", title: "Reportes Internos", text: "Estadísticas y visualizaciones interactivas." },
    { to: "/comunicacion/recordatorios", icon: "fas fa-clock", title: "Recordatorios", text: "Gestiona tareas con prioridad y seguimiento visual." },
    { to: "/comunicacion/estado_pedidos", icon: "fas fa-box", title: "Estado de Pedidos", text: "Consulta tiempos y estatus en tiempo real." }
  ];

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-success text-center">📡 Centro de Comunicación Interna</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {cards.map((card, idx) => (
          <div className="col" key={idx}>
            <Link to={card.to} className="text-decoration-none">
              <div className="card h-100 border-start border-5 border-success shadow-sm">
                <div className="card-body text-center">
                  <i className={`${card.icon} fa-2x text-warning mb-3`}></i>
                  <h5 className="card-title text-success">{card.title}</h5>
                  <p className="card-text">{card.text}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 bg-white rounded shadow-sm">
        <h5 className="text-success">🔍 Últimas Acciones</h5>
        <ul>
          <li>📬 Mensajes totales: {mensCount}</li>
          <li>🔔 Notificaciones: {notiCount}</li>
          <li>📦 Pedido #2043 actualizado hace 2h.</li>
          <li>🔔 Notificación enviada: "Cierre por mantenimiento"</li>
          <li>📬 Mensaje general enviado a todo el personal</li>
          <li>⏰ Recordatorio agregado: "Verificar fertilizantes"</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-white rounded shadow-sm">
        <h5 className="text-primary mb-3">📈 Actividad Semanal</h5>
        <canvas id="graficoResumen" ref={chartRef} height="120"></canvas>
      </div>
    </div>
  );
};

export default DashboardComunicacion;