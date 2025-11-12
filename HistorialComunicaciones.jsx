// COMUNICACION/HistorialComunicaciones.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HistorialComunicaciones = () => {
  const datos = [
    { tipo: 'mensaje', titulo: 'Bienvenida', contenido: 'Le damos la bienvenida a Mariana Quesada.', fecha: '2025-04-01' },
    { tipo: 'notificacion', titulo: 'Inventario actualizado', contenido: 'Se ingresaron 20 nuevas plantas medicinales.', fecha: '2025-04-03' },
    { tipo: 'alerta', titulo: 'Mantenimiento', contenido: 'Se suspende atención el sábado por labores técnicas.', fecha: '2025-04-05' },
    { tipo: 'mensaje', titulo: 'Evento de integración', contenido: 'Recuerden asistir este viernes al evento del vivero.', fecha: '2025-04-06' }
  ];

  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const resultados = datos.filter(d => {
      const coincideTipo = tipoFiltro === 'todos' || d.tipo === tipoFiltro;
      const coincideTexto =
        d.titulo.toLowerCase().includes(texto) ||
        d.contenido.toLowerCase().includes(texto);
      return coincideTipo && coincideTexto;
    });
    setFiltrados(resultados);
  }, [tipoFiltro, busqueda]);

  return (
    <div>
      <header style={estilos.header}>
        <h1>📜 Historial de Comunicaciones</h1>
        <a href="/comunicacion" className="text-white fw-bold">Volver</a>
      </header>

      <div className="container mt-4">
        <div className="row g-3 filtros bg-white p-3 rounded shadow-sm mb-4">
          <div className="col-md-6">
            <label className="form-label">Filtrar por tipo:</label>
            <select className="form-select" value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="mensaje">Mensajes</option>
              <option value="notificacion">Notificaciones</option>
              <option value="alerta">Alertas</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Buscar por palabra clave:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: mantenimiento, evento..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div id="listaHistorial">
          {filtrados.length === 0 ? (
            <div className="alert alert-warning">No se encontraron coincidencias.</div>
          ) : (
            filtrados.map((d, idx) => (
              <div key={idx} className="card-historial mb-3 p-3 bg-white border-start border-4" style={{ borderLeftColor: '#2C5F2D', boxShadow: '0 3px 6px rgba(0,0,0,0.05)', borderRadius: 10 }}>
                <h6 className="mb-1">
                  {d.titulo}
                  <small className="float-end text-muted">{d.fecha}</small>
                </h6>
                <small className="d-block text-secondary">Tipo: {d.tipo.charAt(0).toUpperCase() + d.tipo.slice(1)}</small>
                <p className="mb-0">{d.contenido}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const estilos = {
  header: {
    backgroundColor: '#236823',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

export default HistorialComunicaciones;