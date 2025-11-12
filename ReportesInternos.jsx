// COMUNICACION/ReportesInternos.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ReportesInternos = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Mensajes', 'Notificaciones', 'Alertas'],
        datasets: [{
          label: 'Cantidad',
          data: [8, 5, 3], // datos estáticos de ejemplo (fachada)
          backgroundColor: ['#2C5F2D', '#f2c94c', '#e74c3c'],
          borderWidth: 1
        }]
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

  const exportarExcel = () => {
    alert('📁 Simulación de exportación a Excel (fachada)');
  };

  const exportarPDF = () => {
    alert('📄 Simulación de exportación a PDF (fachada)');
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-success">📊 Reportes de Comunicación</h1>
        <button className="btn btn-outline-success fw-bold" onClick={() => navigate('/comunicacion')}>Volver</button>
      </div>

      <div className="p-4 bg-white rounded shadow-sm mb-4">
        <h5 className="text-success mb-3">📈 Actividad por Tipo de Comunicación</h5>
        <canvas id="graficoComunicacion" ref={chartRef} />
      </div>

      <div className="p-4 bg-white rounded shadow-sm">
        <h5 className="text-success mb-3">📋 Resumen de Actividad Reciente</h5>
        <table className="table table-bordered">
          <thead className="table-success">
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>2025-04-10</td><td>Mensaje</td><td>Bienvenida enviada a nuevo colaborador</td></tr>
            <tr><td>2025-04-09</td><td>Notificación</td><td>Pedido #2043 preparado</td></tr>
            <tr><td>2025-04-08</td><td>Alerta</td><td>Mantenimiento programado comunicado</td></tr>
            <tr><td>2025-04-06</td><td>Mensaje</td><td>Invitación a evento del vivero</td></tr>
            <tr><td>2025-04-04</td><td>Notificación</td><td>Inventario actualizado</td></tr>
          </tbody>
        </table>
        <div className="d-flex gap-2">
          <button className="btn btn-warning" onClick={exportarExcel}>📁 Exportar a Excel</button>
          <button className="btn btn-warning" onClick={exportarPDF}>📄 Exportar a PDF</button>
        </div>
      </div>
    </div>
  );
};

export default ReportesInternos;