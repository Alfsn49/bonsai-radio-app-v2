"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";  // ✅ cambiar a react-hot-toast

export interface Pedido {
  id: number;
  nombre: string;
  cancion: string;
  artista?: string;
  dedicatoria?: string;
  fecha_hora: string;
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // 🔹 Cargar pedidos iniciales
  useEffect(() => {
    const cargarPedidos = async () => {
  try {
    const res = await fetch("/api/pedido", { cache: "no-store" }); // evita caching
    if (!res.ok) throw new Error(`Error cargando pedidos: ${res.status}`);
    const data: Pedido[] = await res.json();
    setPedidos(data);
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    toast.error("No se pudo cargar la lista de pedidos"); // opcional
  }
};

    cargarPedidos();
  }, []);

  // 🔹 Conectar socket
  useEffect(() => {
    const s: Socket = io({ path: "/api/socket" });
    setSocket(s);

    const handleNuevoPedido = (pedido: Pedido) => {
      setPedidos((prev) => {
        // Evitar duplicados (ej: cuando POST ya devolvió el pedido)
        if (prev.find((p) => p.id === pedido.id)) {
          return prev;
        }
        return [pedido, ...prev];
      });

      // ✅ toast con react-hot-toast
      toast.success(`🎶 Nuevo pedido: ${pedido.cancion} - ${pedido.artista || "Desconocido"}`);
    };

    s.on("nuevo_pedido", handleNuevoPedido);

    return () => {
      s.off("nuevo_pedido", handleNuevoPedido);
      s.disconnect();
    };
  }, []);

  // 🔹 Función para enviar un nuevo pedido
  const enviarPedido = async (nuevo: Omit<Pedido, "id" | "fecha_hora">) => {
    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });
      if (!res.ok) throw new Error("Error al enviar pedido");
      const pedido: Pedido = await res.json();

      // Agregar localmente por si el socket tarda
      setPedidos((prev) => {
        if (prev.find((p) => p.id === pedido.id)) return prev;
        return [pedido, ...prev];
      });

      return pedido;
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      throw error;
    }
  };

  return { pedidos, enviarPedido };
}
