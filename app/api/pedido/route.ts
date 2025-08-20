import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

interface Pedido {
  nombre: string;
  cancion: string;
  dedicatoria?: string;
  artista?: string;
  fecha_hora: string;
}

export async function POST(req: NextRequest) {
  const body: Pedido = await req.json(); // Tipamos body como Pedido
  const { nombre, cancion, dedicatoria, artista, fecha_hora } = body;

  const db = await getDb();
  await db.run(`DELETE FROM pedidos WHERE fecha_hora <= datetime('now', '-3 days')`);

  await db.run(
    `INSERT INTO pedidos (nombre, cancion, dedicatoria, artista, fecha_hora) VALUES (?, ?, ?, ?, ?)`,
    nombre,
    cancion,
    dedicatoria || "",
    artista || "",
    fecha_hora
  );

  // Emitimos el nuevo pedido vía Socket.IO
  if ((req as any).socket?.server?.io) {
    const io = (req as any).socket.server.io;
    io.emit("nuevo_pedido", body);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const db = await getDb();
  const pedidos = await db.all(`SELECT * FROM pedidos ORDER BY id DESC`);
  return NextResponse.json(pedidos);
}
