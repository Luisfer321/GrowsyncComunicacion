// COMUNICACION/ListaMensajes.jsx
import React, { useState, useEffect } from 'react';
import mockApi from './mockApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListaMensajes = () => {
  const [mensajes, setMensajes] = useState([]);

  const fetchMensajes = () => {
    mockApi.getMensajes()
      .then(data => setMensajes(data))
      .catch(err => console.error("Error al cargar mensajes (mock):", err));
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  const eliminarMensaje = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este mensaje?")) return;

    mockApi.deleteMensaje(id)
      .then(res => {
        alert(res.message || "Mensaje eliminado (mock)");
        fetchMensajes(); // refrescar la lista
      })
      .catch(err => {
        console.error("Error al eliminar mensaje (mock):", err);
        alert("No se pudo eliminar el mensaje (mock).");
      });
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">📬 Lista de Mensajes</h2>
      {mensajes.length === 0 ? (
        <p>No hay mensajes almacenados.</p>
      ) : (
        <div className="list-group">
          {mensajes.map(m => (
            <div key={m.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <h5>{m.asunto}</h5>
                <p>{m.cuerpo}</p>
                <small>📅 {new Date(m.fecha).toLocaleString()}</small>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => eliminarMensaje(m.id)}>
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaMensajes;