import { initIO } from "@/lib/socket";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Inicializa Socket.IO en el primer request
export async function GET(req: Request, { socket }: any) {
  if (!socket.server.io) {
    initIO(socket.server);
    socket.server.io = true;
    console.log("✅ Socket.IO inicializado");
  }

  return new Response(JSON.stringify({ message: "Socket.IO endpoint" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
