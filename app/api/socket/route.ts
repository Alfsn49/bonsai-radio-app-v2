import { NextRequest } from "next/server";
import { Server } from "socket.io";
import { NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  return NextResponse.json({ message: "Socket.IO endpoint" });
};

export const POST = (req: NextRequest) => {
  return NextResponse.json({ message: "Socket.IO POST endpoint" });
};

// Este archivo será usado solo para inicializar el servidor Socket.IO
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

let io: Server | null = null;

export async function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Cliente conectado a Socket.IO");
    });
  }
  res.end();
}
