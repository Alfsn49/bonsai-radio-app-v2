// app/api/socket/route.ts
import { Server } from "socket.io";
import type { NextRequest } from "next/server";
import { getIO } from "@/lib/socket";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

let io: Server | null = null;

export async function GET(req: NextRequest, res: any) {
  if (!res.socket.server.io) {
    getIO(res); // inicializa el singleton
  }

  return new Response(JSON.stringify({ message: "Socket.IO listo" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = (_req: NextRequest) => {
  return new Response(JSON.stringify({ message: "Socket.IO POST endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// Inicializa Socket.IO en el servidor Next.js
export async function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      cors: { origin: "*" },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🟢 Cliente conectado", socket.id);
    });
  }
  res.end();
}
