// COMUNICACION/Notificaciones.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Usamos la misma clave que mockApi para que todo esté sincronizado
const LS_KEY = "growsync_comunicacion_v1";

// Helper: lee store (si no existe crea la estructura base)
function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const base = { mensajes: [], pedidos: [], notificaciones: [], /* recordatorios opcionales */ };
      localStorage.setItem(LS_KEY, JSON.stringify(base));
      return base;
    }
    return JSON.parse(raw);
  } catch (e) {
    const base = { mensajes: [], pedidos: [], notificaciones: [] };
    localStorage.setItem(LS_KEY, JSON.stringify(base));
    return base;
  }
}
function writeStore(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}
function nextIdFor(arr, key = 'id') {
  if (!arr || arr.length === 0) return 1;
  return Math.max(...arr.map(x => x[key] ?? x.id ?? 0)) + 1;
}

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [ordenFiltro, setOrdenFiltro] = useState("reciente");
  const [nuevoTipo, setNuevoTipo] = useState("inventario");
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [nuevoIcono, setNuevoIcono] = useState("");
  const porPagina = 3;

  useEffect(() => {
    cargarNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarNotificaciones = () => {
    const store = readStore();
    const raw = store.notificaciones || [];
    // adaptamos si vienen con distintas claves
    const adaptadas = raw.map(n => ({
      id: n.id ?? n.id_notificacion ?? nextIdFor(raw, 'id'),
      tipo: n.tipo ?? 'inventario',
      texto: n.texto ?? n.mensaje ?? n.text,
      icono: n.icono ?? n.icon ?? '',
      fecha: (n.fecha ?? (new Date()).toISOString()).split('T')[0]
    }));
    // asegurar orden por fecha descendente
    adaptadas.sort((a,b) => b.fecha.localeCompare(a.fecha));
    setNotificaciones(adaptadas);
  };

  const aplicarFiltrosYOrden = () => {
    let filtradas = notificaciones.filter(n => tipoFiltro === 'todos' || n.tipo === tipoFiltro);
    filtradas.sort((a, b) => ordenFiltro === 'reciente' ? b.fecha.localeCompare(a.fecha) : a.fecha.localeCompare(b.fecha));
    return filtradas;
  };

  const notificacionesVisibles = aplicarFiltrosYOrden().slice(paginaActual * porPagina, (paginaActual + 1) * porPagina);

  const borrarNotificacion = (id) => {
    if (!window.confirm("¿Eliminar notificación?")) return;
    try {
      const store = readStore();
      store.notificaciones = (store.notificaciones || []).filter(n => (n.id ?? n.id_notificacion) !== id);
      writeStore(store);
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert("Error al borrar notificación: " + (err.message || err));
    }
  };

  const crearNotificacion = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) {
      alert("El mensaje es obligatorio");
      return;
    }
    const store = readStore();
    const arr = store.notificaciones || [];
    const id = nextIdFor(arr, 'id');
    const newObj = {
      id,
      tipo: nuevoTipo,
      mensaje: nuevoMensaje,
      icono: nuevoIcono,
      fecha: new Date().toISOString().split('T')[0]
    };
    // Guardar en store (mantenemos misma estructura original posible)
    arr.unshift(newObj);
    store.notificaciones = arr;
    writeStore(store);

    // actualizar estado adaptado
    setNotificaciones(prev => [{
      id: newObj.id,
      tipo: newObj.tipo,
      texto: newObj.mensaje,
      icono: newObj.icono,
      fecha: newObj.fecha
    }, ...prev]);

    setNuevoMensaje('');
    setNuevoIcono('');
    setNuevoTipo('inventario');
    alert("Notificación creada (mock)");
    setPaginaActual(0);
  };

  return (
    <>
      <header className="bg-success text-white p-3 d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">🔔 Notificaciones</h1>
        <div>
          <a href="/" className="text-white fw-bold me-3 text-decoration-none">Inicio</a>
          <a href="/comunicacion" className="text-white fw-bold text-decoration-none">Dashboard</a>
        </div>
      </header>

      <div className="container py-4">
        <form onSubmit={crearNotificacion} className="mb-4 bg-white p-4 rounded shadow-sm">
          <h5>Crear nueva notificación</h5>
          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select className="form-select" value={nuevoTipo} onChange={e => setNuevoTipo(e.target.value)}>
              <option value="inventario">Inventario</option>
              <option value="pedido">Pedido</option>
              <option value="alerta">Alerta</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Mensaje</label>
            <textarea
              className="form-control"
              value={nuevoMensaje}
              onChange={e => setNuevoMensaje(e.target.value)}
              required
              placeholder="Texto de la notificación"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Icono (clase FontAwesome)</label>
            <input
              type="text"
              className="form-control"
              value={nuevoIcono}
              onChange={e => setNuevoIcono(e.target.value)}
              placeholder="Ej: fa-leaf"
            />
            <small className="text-muted">Opcional, por ejemplo: fa-leaf, fa-box, fa-wrench</small>
          </div>
          <button type="submit" className="btn btn-success">Crear Notificación</button>
        </form>

        <div className="row g-3 bg-white p-4 rounded shadow-sm mb-4">
          <div className="col-md-6">
            <label className="form-label">Tipo:</label>
            <select className="form-select" value={tipoFiltro} onChange={e => { setTipoFiltro(e.target.value); setPaginaActual(0); }}>
              <option value="todos">Todas</option>
              <option value="inventario">Inventario</option>
              <option value="pedido">Pedido</option>
              <option value="alerta">Alerta</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Orden:</label>
            <select className="form-select" value={ordenFiltro} onChange={e => { setOrdenFiltro(e.target.value); setPaginaActual(0); }}>
              <option value="reciente">Más reciente</option>
              <option value="antiguo">Más antiguo</option>
            </select>
          </div>
        </div>

        {notificacionesVisibles.length === 0 ? (
          <div className="alert alert-warning">No hay notificaciones que mostrar.</div>
        ) : (
          notificacionesVisibles.map((n) => (
            <div
              key={n.id}
              className="notificacion d-flex justify-content-between align-items-center bg-white p-3 mb-3 rounded shadow-sm border-start border-5"
              style={{ borderColor: '#f2c94c' }}
            >
              <div className="texto">
                <p className="mb-1">
                  <i className={`fas ${n.icono} me-2 text-success`}></i>
                  <strong>{n.texto}</strong>
                </p>
                <small>📅 {n.fecha}</small>
              </div>
              <div className="acciones">
                <button className="btn btn-outline-warning btn-sm" onClick={() => borrarNotificacion(n.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}

        <div className="paginacion d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-success" onClick={() => setPaginaActual(p => Math.max(0, p - 1))}>⬅️ Anterior</button>
          <button className="btn btn-success" onClick={() => {
            const maxPage = Math.floor(Math.max(0, aplicarFiltrosYOrden().length - 1) / porPagina);
            setPaginaActual(p => Math.min(maxPage, p + 1));
          }}>Siguiente ➡️</button>
        </div>
      </div>
    </>
  );
};

export default Notificaciones;