import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getIO } from "@/lib/socket";

export async function GET() {
  try {
    const comentarios = await prisma.comentario.findMany({
      orderBy: { id: "desc" },
      take: 50,
    });
    return NextResponse.json(comentarios, { status: 200 });
  } catch (error) {
    console.error("Error GET /api/comentarios:", error);
    return NextResponse.json({ error: "Error cargando comentarios" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Eliminar comentarios antiguos
    const tresDiasAntes = new Date();
    tresDiasAntes.setDate(tresDiasAntes.getDate() - 3);

    await prisma.comentario.deleteMany({
      where: { fecha_hora: { lt: tresDiasAntes } },
    });

    const nuevo = await prisma.comentario.create({
      data: { nombre: data.nombre, mensaje: data.mensaje },
    });

    try {
      const io = getIO();
      io.emit("nuevo_comentario", nuevo);
    } catch {
      console.warn("⚠️ Socket.IO no inicializado");
    }

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error("Error POST /api/comentarios:", error);
    return NextResponse.json({ error: "Error creando comentario" }, { status: 500 });
  }
}
