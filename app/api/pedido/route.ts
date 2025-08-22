// app/api/pedido/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getIO } from "@/lib/socket"; // importamos nuestro singleton de socket

export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(pedidos, { status: 200 });
  } catch (error) {
    console.error("Error GET /api/pedido:", error);
    return NextResponse.json({ error: "Error cargando pedidos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Borrar pedidos viejos (3 días)
    await prisma.pedido.deleteMany({
      where: { fecha_hora: { lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } },
    });

    const nuevo = await prisma.pedido.create({ data });

    try {
      const io = getIO();
      io.emit("nuevo_pedido", nuevo);
    } catch {
      console.warn("⚠️ Socket.IO no inicializado");
    }

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error("Error POST /api/pedido:", error);
    return NextResponse.json({ error: "Error creando pedido" }, { status: 500 });
  }
}
