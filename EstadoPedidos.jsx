// COMUNICACION/EstadoPedidos.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import mockApi from './mockApi';

const EstadoPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [clienteActual, setClienteActual] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarModalMensaje, setMostrarModalMensaje] = useState(false);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    id_usuario: 1,
    cliente: '',
    producto: '',
    total: '',
    id_estado: 1
  });

  useEffect(() => {
    let mounted = true;
    mockApi.getPedidos()
      .then(data => { if (mounted) setPedidos(data); })
      .catch(err => console.error("Error al cargar pedidos (mock):", err));
    return () => mounted = false;
  }, []);

  const cambiarEstado = (id_pedido, id_estado_actual) => {
    const siguiente = id_estado_actual === 1 ? 2 : id_estado_actual === 2 ? 3 : 1;
    mockApi.putPedidoEstado(id_pedido, siguiente)
      .then(updated => {
        setPedidos(prev =>
          prev.map(p => p.id_pedido === id_pedido ? { ...p, ...updated } : p)
        );
      })
      .catch(err => {
        console.error("Error al actualizar estado (mock):", err);
        alert("No se pudo actualizar el estado (mock).");
      });
  };

  const verDetalles = (pedido) => {
    alert(`📦 Pedido #${pedido.id_pedido}\n\nCliente: ${pedido.cliente}\nProducto: ${pedido.producto}\nFecha: ${pedido.fecha}\nEstado actual: ${pedido.estado}`);
  };

  const abrirModal = (pedido) => {
    setClienteActual(pedido);
    setMensaje('');
    setMostrarModalMensaje(true);
  };

  const cerrarModal = () => {
    setMostrarModalMensaje(false);
    setMensaje('');
  };

  const enviarMensaje = () => {
    if (!mensaje.trim()) return alert('⚠️ El mensaje no puede estar vacío');

    mockApi.postMensaje({
      id_remitente: 1,
      asunto: `Mensaje sobre Pedido #${clienteActual.id_pedido}`,
      cuerpo: mensaje
    })
      .then(() => {
        alert(`📤 Mensaje enviado correctamente a ${clienteActual.cliente} (mock)`);
        cerrarModal();
      })
      .catch(err => {
        console.error(err);
        alert('❌ Error al enviar el mensaje (mock)');
      });
  };

  const agregarPedido = (e) => {
    e.preventDefault();
    const nuevo = {
      ...nuevoPedido,
      total: parseFloat(nuevoPedido.total),
      id_estado: parseInt(nuevoPedido.id_estado, 10),
    };
    mockApi.postPedido(nuevo)
      .then(data => {
        setPedidos(prev => [{ ...data }, ...prev]);
        setModalAgregar(false);
        setNuevoPedido({ id_usuario: 1, cliente: '', producto: '', total: '', id_estado: 1 });
      })
      .catch(err => {
        console.error("Error al agregar pedido (mock):", err);
        alert("No se pudo agregar el pedido (mock).");
      });
  };

  const filtrados = pedidos.filter(p => {
    const clienteMatch = p.cliente?.toLowerCase().includes(busqueda.toLowerCase()) ?? false;
    const productoMatch = p.producto?.toLowerCase().includes(busqueda.toLowerCase()) ?? false;
    const estadoMatch = !filtroEstado || p.estado === filtroEstado;
    return estadoMatch && (clienteMatch || productoMatch);
  });

  const conteo = {
    total: pedidos.length,
    pendiente: pedidos.filter(p => p.id_estado === 1).length,
    proceso: pedidos.filter(p => p.id_estado === 2).length,
    enviado: pedidos.filter(p => p.id_estado === 3).length,
  };

  return (
    <div>
      <header style={estilos.header}>
        <h1>📦 Estado de Pedidos</h1>
        <a href="/comunicacion" className="text-white fw-bold">Volver</a>
      </header>
      <div className="container mt-4">
        <button className="btn btn-success mb-3" onClick={() => setModalAgregar(true)}>
          ➕ Agregar Pedido
        </button>

        <div className="filter-bar d-flex flex-wrap justify-content-between gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por cliente o producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <select
            className="form-select"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Enviado">Enviado</option>
          </select>
        </div>

        <h5>📋 Pedidos Recientes</h5>
        <table className="table table-bordered">
          <thead className="table-success">
            <tr>
              <th># Pedido</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id_pedido}>
                <td>{p.id_pedido}</td>
                <td>{p.cliente}</td>
                <td>{p.producto}</td>
                <td>{p.fecha}</td>
                <td><span className={`badge ${estadoClase(p.estado)}`}>{p.estado}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => cambiarEstado(p.id_pedido, p.id_estado)}>Actualizar Estado</button>
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => verDetalles(p)}>Ver Detalles</button>
                  <button className="btn btn-sm btn-outline-success" onClick={() => abrirModal(p)}>Enviar Mensaje</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="stats p-3 bg-white rounded shadow-sm mt-4">
          <h5>📊 Estadísticas</h5>
          <p>Total de pedidos: {conteo.total}</p>
          <p>🟡 Pendientes: {conteo.pendiente}</p>
          <p>🔵 En proceso: {conteo.proceso}</p>
          <p>✅ Enviados: {conteo.enviado}</p>
        </div>
      </div>

      {mostrarModalMensaje && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={cerrarModal}
        >
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📬 Enviar mensaje al cliente</h5>
                <button className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Para:</strong> {clienteActual?.cliente}</p>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Escribe el mensaje..."
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={enviarMensaje}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalAgregar && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={agregarPedido}>
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">➕ Nuevo Pedido</h5>
                  <button type="button" className="btn-close" onClick={() => setModalAgregar(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoPedido.cliente}
                      onChange={e => setNuevoPedido({ ...nuevoPedido, cliente: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Producto</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoPedido.producto}
                      onChange={e => setNuevoPedido({ ...nuevoPedido, producto: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total (₡)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={nuevoPedido.total}
                      onChange={e => setNuevoPedido({ ...nuevoPedido, total: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={nuevoPedido.id_estado}
                      onChange={e => setNuevoPedido({ ...nuevoPedido, id_estado: e.target.value })}
                    >
                      <option value={1}>Pendiente</option>
                      <option value={2}>En proceso</option>
                      <option value={3}>Enviado</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success w-100">Guardar Pedido</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const estadoNombre = (id_estado) => {
  if (id_estado === 1) return 'Pendiente';
  if (id_estado === 2) return 'En proceso';
  if (id_estado === 3) return 'Enviado';
  return 'Desconocido';
};

const estadoClase = (estado) => {
  if (estado === 'Pendiente') return 'bg-warning text-dark';
  if (estado === 'En proceso') return 'bg-info text-white';
  if (estado === 'Enviado') return 'bg-success text-white';
  return '';
};

const estilos = {
  header: {
    backgroundColor: '#236823',
    padding: '1rem 2rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

export default EstadoPedidos;