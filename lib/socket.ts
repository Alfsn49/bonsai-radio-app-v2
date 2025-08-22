// lib/socket.ts
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export function initIO(server: HTTPServer) {
  if (!io) {
    io = new IOServer(server, { cors: { origin: "*" } });

    io.on("connection", socket => {
      console.log("🟢 Cliente conectado", socket.id);
    });
  }
  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO no inicializado");
  return io;
}
