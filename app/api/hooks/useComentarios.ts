// app/api/hooks/useComentarios.ts
"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";


export interface Comentario {
  id: number;
  nombre: string;
  mensaje: string;
  fecha_hora: string;
}

export function useComentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Cargar iniciales
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("/api/comentarios", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data: Comentario[] = await res.json();
        setComentarios(data);
      } catch (e) {
        console.error("Error cargando comentarios", e);
        toast.error("No se pudieron cargar los comentarios");
      }
    };
    cargar();
  }, []);

  // Conectar socket
  useEffect(() => {
    const s: Socket = io({ path: "/api/socket" });
    setSocket(s);

    const handleNuevo = (c: Comentario) => {
      setComentarios((prev) => [c, ...prev]);
      toast(`💬 ${c.nombre}: ${c.mensaje}`);
    };

    s.on("nuevo_comentario", handleNuevo);

    return () => {
      s.off("nuevo_comentario", handleNuevo);
      s.disconnect();
    };
  }, []);

  // Enviar comentario
  const enviarComentario = async (nombre: string, mensaje: string) => {
    const res = await fetch("/api/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, mensaje }),
    });
    if (!res.ok) throw new Error("Error al enviar comentario");
    const nuevo: Comentario = await res.json();

    setComentarios((prev) => [nuevo, ...prev]); // optimista
    return nuevo;
  };

  return { comentarios, enviarComentario };
}
