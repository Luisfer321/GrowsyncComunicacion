// COMUNICACION/Recordatorios.jsx (versión robusta)
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LS_KEY = "growsync_comunicacion_v1";

const PRIORIDAD_ICONOS = {
  alta: "fa-exclamation-circle",
  media: "fa-bell",
  baja: "fa-check-circle"
};

function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const base = { mensajes: [], pedidos: [], notificaciones: [], recordatorios: [] };
      localStorage.setItem(LS_KEY, JSON.stringify(base));
      return base;
    }
    return JSON.parse(raw);
  } catch (e) {
    const base = { mensajes: [], pedidos: [], notificaciones: [], recordatorios: [] };
    localStorage.setItem(LS_KEY, JSON.stringify(base));
    return base;
  }
}
function writeStore(obj) { localStorage.setItem(LS_KEY, JSON.stringify(obj)); }
function nextIdFor(arr, key = 'id_recordatorio') {
  if (!arr || arr.length === 0) return 1;
  return Math.max(...arr.map(x => x[key] ?? x.id_recordatorio ?? 0)) + 1;
}

const SAMPLE_RECORDATORIOS = [
  { id_recordatorio: 1, mensaje: "Verificar fertilizantes y ph del suelo", fecha_limite: (()=>{const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10);})(), prioridad: "alta", completado:false },
  { id_recordatorio: 2, mensaje: "Reordenar macetas medianas", fecha_limite: (()=>{const d=new Date(); d.setDate(d.getDate()+5); return d.toISOString().slice(0,10);})(), prioridad: "media", completado:false },
  { id_recordatorio: 3, mensaje: "Capacitación: Manejo seguro de fertilizantes", fecha_limite: (()=>{const d=new Date(); d.setDate(d.getDate()+12); return d.toISOString().slice(0,10);})(), prioridad: "baja", completado:false },
  { id_recordatorio: 4, mensaje: "Revisar estado del pedido #2043", fecha_limite: (()=>{const d=new Date(); d.setDate(d.getDate()-1); return d.toISOString().slice(0,10);})(), prioridad: "media", completado:false }
];

const Recordatorios = () => {
  const [recordatorios, setRecordatorios] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaPrioridad, setNuevaPrioridad] = useState("alta");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const s = readStore();
    // si no existe recordatorios o no es array o está vacío -> inicializar con SAMPLE
    if (!s.recordatorios || !Array.isArray(s.recordatorios) || s.recordatorios.length === 0) {
      s.recordatorios = SAMPLE_RECORDATORIOS;
      writeStore(s);
      setRecordatorios(s.recordatorios);
      return;
    }
    setRecordatorios(s.recordatorios || []);
  }, []);

  const recordatoriosFiltrados = recordatorios.filter(r => filtro === "todas" || r.prioridad === filtro);

  const persistAndSet = (next) => {
    const s = readStore();
    s.recordatorios = next;
    writeStore(s);
    setRecordatorios(next);
  };

  const eliminarRecordatorio = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este recordatorio?")) return;
    const next = recordatorios.filter(r => r.id_recordatorio !== id);
    persistAndSet(next);
  };

  const marcarComoCompletado = (id) => {
    const next = recordatorios.map(r => r.id_recordatorio === id ? { ...r, completado: true } : r);
    persistAndSet(next);
  };

  const agregarNuevo = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !nuevaFecha) return;
    const s = readStore();
    const id = nextIdFor(s.recordatorios || []);
    const nuevo = { id_recordatorio: id, mensaje: nuevoMensaje.trim(), fecha_limite: nuevaFecha, prioridad: nuevaPrioridad, completado:false };
    const next = [...(s.recordatorios || []), nuevo];
    persistAndSet(next);
    setNuevoMensaje(""); setNuevaFecha(""); setNuevaPrioridad("alta"); setModalVisible(false);
  };

  const estaPorVencer = (fecha) => {
    const hoy = new Date();
    const fechaLimite = new Date(fecha);
    const diffDias = (fechaLimite - hoy) / (1000 * 60 * 60 * 24);
    return diffDias <= 2 && diffDias >= 0;
  };

  return (
    <>
      <header className="d-flex justify-content-between align-items-center bg-success text-white p-3 mb-4" style={{ backgroundColor: "#236823" }}>
        <h1>📋 Recordatorios</h1>
        <div>
          <a href="/" className="text-white me-3 fw-bold text-decoration-none">Inicio</a>
          <a href="/comunicacion/dashboard" className="text-white fw-bold text-decoration-none">Dashboard</a>
        </div>
      </header>

      <main className="container" style={{ maxWidth: "1000px" }}>
        <div className="filtros bg-white p-4 rounded shadow mb-4">
          <label htmlFor="prioridadFiltro" className="form-label">Filtrar por prioridad:</label>
          <select id="prioridadFiltro" className="form-select" value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {recordatoriosFiltrados.length === 0 ? (
          <div className="alert alert-warning">No hay recordatorios con esa prioridad.</div>
        ) : (
          recordatoriosFiltrados.map((r) => (
            <div key={r.id_recordatorio} className={`recordatorio d-flex justify-content-between align-items-center flex-wrap mb-3 p-3 rounded shadow ${r.completado ? "text-muted text-decoration-line-through" : ""}`}
              style={{ backgroundColor: r.completado ? "#f0f0f0" : "white", borderLeft: `6px solid ${ r.prioridad === "alta" ? "red" : r.prioridad === "media" ? "orange" : "green" }` }}>
              <div className="texto flex-grow-1 pe-3">
                <p className="mb-1"><i className={`fas ${PRIORIDAD_ICONOS[r.prioridad]} me-2`}></i><strong>{r.mensaje}</strong></p>
                <small>📅 Fecha límite: {r.fecha_limite} — Prioridad: {r.prioridad.toUpperCase()}</small>
                {estaPorVencer(r.fecha_limite) && !r.completado && (<div className="mt-2 alert alert-danger py-1 px-2 d-inline-block" style={{ fontSize: "0.9rem" }}>⚠️ ¡Está por vencer!</div>)}
              </div>
              <div className="acciones d-flex flex-column gap-2">
                <button className="btn btn-success btn-sm" disabled={r.completado} onClick={() => marcarComoCompletado(r.id_recordatorio)}>✔ Completado</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarRecordatorio(r.id_recordatorio)}>🗑️ Eliminar</button>
              </div>
            </div>
          ))
        )}

        <button className="floating-btn btn btn-success" style={{ position: "fixed", bottom: "20px", right: "20px", borderRadius: "50%", padding: "15px", fontSize: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.08)" }} onClick={() => setModalVisible(true)} aria-label="Agregar nuevo recordatorio">+</button>

        {modalVisible && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document"><div className="modal-content">
              <div className="modal-header bg-success text-white"><h5 className="modal-title">Nuevo Recordatorio</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalVisible(false)}></button>
              </div>
              <form onSubmit={agregarNuevo}>
                <div className="modal-body">
                  <div className="mb-3"><label htmlFor="mensajeNuevo" className="form-label">Mensaje</label>
                    <input type="text" id="mensajeNuevo" className="form-control" value={nuevoMensaje} onChange={e => setNuevoMensaje(e.target.value)} required autoFocus />
                  </div>
                  <div className="mb-3"><label htmlFor="fechaNuevo" className="form-label">Fecha límite</label>
                    <input type="date" id="fechaNuevo" className="form-control" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} required />
                  </div>
                  <div className="mb-3"><label htmlFor="prioridadNuevo" className="form-label">Prioridad</label>
                    <select id="prioridadNuevo" className="form-select" value={nuevaPrioridad} onChange={e => setNuevaPrioridad(e.target.value)}>
                      <option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer"><button type="submit" className="btn btn-success w-100">Agregar</button></div>
              </form>
            </div></div>
          </div>
        )}
      </main>
    </>
  );
};

export default Recordatorios;