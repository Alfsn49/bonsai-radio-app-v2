import { Server } from "socket.io";
import type { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

let io: Server | null = null;

export const GET = (_req: NextRequest) => {
  return new Response(JSON.stringify({ message: "Socket.IO endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST = (_req: NextRequest) => {
  return new Response(JSON.stringify({ message: "Socket.IO POST endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// Inicializa Socket.IO
export async function handler(req: unknown, res: any) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Cliente conectado a Socket.IO");
    });
  }
  res.end();
}
