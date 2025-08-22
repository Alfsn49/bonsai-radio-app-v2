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

// Singleton del socket para que no se reconecte múltiples veces
let socket: Socket | null = null;

export function useComentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

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

  // Conectar socket solo una vez
  useEffect(() => {
    if (!socket) {
      socket = io({ path: "/api/socket" });

      socket.on("nuevo_comentario", (c: Comentario) => {
        setComentarios((prev) => [c, ...prev]);
        toast(`💬 ${c.nombre}: ${c.mensaje}`);
      });
    }

    return () => {
      if (socket) {
        socket.off("nuevo_comentario");
      }
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
