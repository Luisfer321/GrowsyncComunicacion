// COMUNICACION/mockApi.js
const LS_KEY = "growsync_comunicacion_v1";

const initial = {
  mensajes: [
    { id: 1, id_remitente: 1, asunto: "Bienvenida", cuerpo: "Bienvenid@ al equipo", fecha: "2025-11-01" }
  ],
  pedidos: [
    { id_pedido: 101, id_usuario: 1, cliente: "María", producto: "Rosas", total: 45.0, id_estado: 1, estado: "Pendiente", fecha: "2025-11-08" },
    { id_pedido: 102, id_usuario: 1, cliente: "Juan", producto: "Suculentas", total: 30.0, id_estado: 2, estado: "En proceso", fecha: "2025-11-09" }
  ],
  notificaciones: [
    { id: 1, mensaje: "Cierre por mantenimiento", fecha: "2025-11-10" }
  ]
};

function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(initial));
      return JSON.parse(JSON.stringify(initial));
    }
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(LS_KEY, JSON.stringify(initial));
    return JSON.parse(JSON.stringify(initial));
  }
}

function writeStore(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function nextId(array, key = "id") {
  if (!array.length) return 1;
  return Math.max(...array.map(a => a[key] ?? a.id ?? 0)) + 1;
}

function delay(ms = 120) {
  return new Promise(res => setTimeout(res, ms));
}

const mockApi = {
  // Mensajes
  async getMensajes() {
    const s = readStore();
    await delay();
    return s.mensajes.slice().reverse();
  },

  async postMensaje(payload) {
    const s = readStore();
    const id = nextId(s.mensajes, "id");
    const fecha = new Date().toISOString().slice(0, 10);
    const nuevo = { id, fecha, ...payload };
    s.mensajes.push(nuevo);
    writeStore(s);
    await delay();
    return nuevo;
  },

  // Eliminar mensaje por id (para ListaMensajes)
  async deleteMensaje(id_mensaje) {
    const s = readStore();
    const idx = s.mensajes.findIndex(m => m.id === id_mensaje);
    if (idx === -1) throw new Error("Mensaje no encontrado");
    s.mensajes.splice(idx, 1);
    writeStore(s);
    await delay();
    return { ok: true, message: "Mensaje eliminado (mock)" };
  },

  // Pedidos
  async getPedidos() {
    const s = readStore();
    await delay();
    return s.pedidos.slice().reverse();
  },

  async postPedido(payload) {
    const s = readStore();
    const id_pedido = nextId(s.pedidos, "id_pedido");
    const fecha = new Date().toISOString().slice(0, 10);
    const estado = payload.id_estado === 1 ? "Pendiente" : payload.id_estado === 2 ? "En proceso" : "Enviado";
    const nuevo = { ...payload, id_pedido, fecha, estado };
    s.pedidos.push(nuevo);
    writeStore(s);
    await delay();
    return nuevo;
  },

  async putPedidoEstado(id_pedido, id_estado) {
    const s = readStore();
    const idx = s.pedidos.findIndex(p => p.id_pedido === id_pedido);
    if (idx === -1) throw new Error("Pedido no encontrado");
    s.pedidos[idx].id_estado = id_estado;
    s.pedidos[idx].estado = id_estado === 1 ? "Pendiente" : id_estado === 2 ? "En proceso" : "Enviado";
    writeStore(s);
    await delay();
    return s.pedidos[idx];
  },

  // Notificaciones
  async getNotificaciones() {
    const s = readStore();
    await delay();
    return s.notificaciones.slice().reverse();
  },

  // Utilidades
  resetEverything() {
    localStorage.removeItem(LS_KEY);
    localStorage.setItem(LS_KEY, JSON.stringify(initial));
  }
};

export default mockApi;