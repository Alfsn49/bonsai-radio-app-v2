"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

interface Pedido {
  nombre: string;
  cancion: string;
  dedicatoria?: string;
  artista?: string;
  fecha_hora: string;
}

export default function Page() {
 const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [index, setIndex] = useState(0);
  const imagenes = Array.from({ length: 30 }, (_, i) => `slider${i + 1}.jpg`);

  // Inicializamos Socket.IO
  useEffect(() => {
    const s: Socket = io("/", { path: "/api/socket" });
    setSocket(s);

    const handleNuevoPedido = (pedido: Pedido) => {
      setPedidos((prev) => [pedido, ...prev]);
      toast(`Nuevo pedido: ${pedido.cancion} - ${pedido.artista || "Desconocido"}`);
    };

    s.on("nuevo_pedido", handleNuevoPedido);

    return () => {
      s.off("nuevo_pedido", handleNuevoPedido);
      s.disconnect();
    };
  }, []);

  // Al cargar la página
  useEffect(() => {
    fetch("/api/pedido")
      .then(res => res.json())
      .then(setPedidos);
  }, []);

  // Slider automático
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [imagenes]);

  // Función para enviar pedido
  const enviarPedido = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: Pedido = {
      nombre: formData.get("nombre") as string,
      cancion: formData.get("cancion") as string,
      dedicatoria: (formData.get("dedicatoria") as string) || "",
      artista: (formData.get("artista") as string) || "",
      fecha_hora: new Date().toISOString(),
    };

    try {
      await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setPedidos((prev) => [data, ...prev]);

      // Mostrar notificación de éxito
      toast.success(`Pedido enviado: ${data.cancion} - ${data.artista || "Desconocido"}`);

      form.reset();
    } catch (err) {
      console.error("Error al enviar pedido:", err);
      toast.error("No se pudo enviar el pedido");
    }
  };
 return (
  <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 p-6">
    <Toaster position="top-right" reverseOrder={false} />
    <h1 className="text-5xl font-extrabold text-center text-pink-600 drop-shadow mb-8">
      🎧 Bonsai Arisa 2.0 - Radio Anime
    </h1>

    {/* Contenedor principal: slider a la izquierda, form + pedidos a la derecha */}
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      {/* Slider */}
<div className="w-full rounded-2xl shadow-lg overflow-hidden relative min-h-[550px] sm:min-h-[320px] md:min-h-[600px]">
  {imagenes.length ? (
    <Image
      src={`/img/${imagenes[index]}`}
      alt="Slider"
      fill // esta es la clave
      style={{ objectFit: "cover" }} // reemplaza object-cover
    />
  ) : (
    <span className="text-white p-4">No hay imágenes</span>
  )}
</div>

      {/* Formulario + Lista de pedidos */}
      <div className="lg:w-1/2 w-full flex flex-col gap-6">
        {/* Formulario */}
        <form
  onSubmit={enviarPedido}
  className="space-y-4 p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md"
>
  <h2 className="text-xl font-semibold text-gray-700 mb-2">Haz tu pedido 🎶</h2>

  <input
    name="nombre"
    placeholder="Tu nombre"
    required
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900"
  />

  <input
    name="cancion"
    placeholder="Nombre de la canción"
    required
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900"
  />

  <input
    name="artista"
    placeholder="Artista"
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900"
  />

  <textarea
    name="dedicatoria"
    placeholder="Dedicatoria (opcional)"
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900"
  />

  <button
    type="submit"
    className="bg-pink-500 hover:bg-pink-600 text-white w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
  >
    🎵 Enviar pedido
  </button>
</form>
        {/* Lista de pedidos */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📜 Lista de pedidos</h2>
          <div className="space-y-4">
            {pedidos.length === 0 ? (
              <p className="text-gray-500 italic">No hay pedidos aún</p>
            ) : (
              pedidos.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 bg-white rounded-lg shadow p-3"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold">
                    {p.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong className="text-pink-600">{p.cancion}</strong>{" "}
                    <span className="text-gray-700">- {p.artista || "Desconocido"}</span>
                    <div className="text-sm text-gray-600">
                      Pedido por <span className="font-medium">{p.nombre}</span>
                    </div>
                    {p.dedicatoria && (
  <div className="text-gray-500 italic">&quot;{p.dedicatoria}&quot;</div>
)}
                    <div className="text-xs text-gray-400">
                      {new Date(p.fecha_hora).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Reproductor de radio debajo de todo */}
    <section className="flex justify-center mt-10">
      <iframe
        src="https://zeno.fm/player/bonsai-arisa"
        width="575"
        height="250"
        frameBorder="0"
        scrolling="no"
        className="rounded-xl shadow-lg"
        allow="autoplay"
      ></iframe>
    </section>
  </div>
);

}