import { Server } from "socket.io";

let io: Server | null = null;

/**
 * Inicializa Socket.IO si aún no existe
 * Se llama desde el endpoint de socket en el primer request
 */
export function initIO(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: { origin: "*" }, // cambiar según tus dominios
    });

    io.on("connection", (socket) => {
      console.log("🟢 Cliente conectado", socket.id);
    });
  }
  return io;
}

/**
 * Retorna el singleton
 */
export function getIO() {
  if (!io) throw new Error("Socket.IO no inicializado");
  return io;
}
