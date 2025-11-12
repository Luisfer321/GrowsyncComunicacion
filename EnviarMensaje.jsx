// COMUNICACION/EnviarMensaje.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import mockApi from './mockApi';

const EnviarMensaje = () => {
  const navigate = useNavigate();
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [plantilla, setPlantilla] = useState("");

  const aplicarPlantilla = (value) => {
    switch (value) {
      case "mantenimiento":
        return "Estimado equipo, se informa que este viernes se realizará un mantenimiento general. Gracias por su comprensión.";
      case "bienvenida":
        return "Damos la más cordial bienvenida a nuestro nuevo compañero. ¡Le deseamos muchos éxitos!";
      case "evento":
        return "Les recordamos que este sábado se realizará el evento anual del vivero. ¡Los esperamos!";
      default:
        return "";
    }
  };

  const handlePlantillaChange = (e) => {
    const value = e.target.value;
    setPlantilla(value);
    setMensaje(aplicarPlantilla(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!asunto.trim() || !mensaje.trim()) return;

    mockApi.postMensaje({
      id_remitente: 1,
      asunto: asunto,
      cuerpo: mensaje
    })
      .then(() => {
        alert("📨 Mensaje enviado correctamente (modo offline)!");
        setAsunto("");
        setMensaje("");
        setPlantilla("");
      })
      .catch(err => {
        console.error(err);
        alert("Error enviando mensaje (mock).");
      });
  };

  return (
    <>
      <header className="bg-success text-white p-3 d-flex justify-content-between align-items-center">
        <h1>📨 Enviar Mensaje</h1>
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/comunicacion/lista-mensajes")}
        >
          Ver Mensajes
        </button>
      </header>

      <div className="container my-4" style={{ maxWidth: "900px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="asunto" className="form-label">Asunto</label>
            <input
              type="text"
              className="form-control"
              id="asunto"
              placeholder="Ej: Aviso importante de mantenimiento"
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mensaje" className="form-label">Mensaje</label>
            <textarea
              id="mensaje"
              rows="5"
              className="form-control"
              placeholder="Escribe aquí el contenido del mensaje..."
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="plantilla" className="form-label">Usar Plantilla</label>
            <select
              id="plantilla"
              className="form-select"
              value={plantilla}
              onChange={handlePlantillaChange}
            >
              <option value="">-- Sin plantilla --</option>
              <option value="mantenimiento">🔧 Aviso de Mantenimiento</option>
              <option value="bienvenida">👋 Bienvenida nuevo colaborador</option>
              <option value="evento">📅 Recordatorio de evento</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">Enviar a todos los empleados</button>
        </form>
      </div>
    </>
  );
};

export default EnviarMensaje;