"use client";

import { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { usePedidos } from "./api/hooks/usePedidos";
import { useComentarios } from "./api/hooks/useComentarios";

export default function Page() {
  const { pedidos, enviarPedido } = usePedidos(); // 👈 lo usamos aquí
  const [index, setIndex] = useState(0);

  const { comentarios, enviarComentario } = useComentarios();
   const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Ref para scroll automático
  const comentariosRef = useRef<HTMLDivElement>(null);

  const handleComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !mensaje) return;
    enviarComentario(nombre, mensaje);
    setMensaje("");
    setNombre("");
  };


  // Slider con 30 imágenes
  const imagenes = Array.from({ length: 30 }, (_, i) => `slider${i + 1}.jpg`);

  // Slider automático
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [imagenes]);

  // Manejo del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const nuevo = {
  nombre: formData.get("nombre") as string,
  cancion: formData.get("cancion") as string,
  artista: (formData.get("artista") as string) || "",
  dedicatoria: (formData.get("dedicatoria") as string) || "",
};

    try {
      await enviarPedido(nuevo);
      form.reset(); // limpiar el form después de enviar
    } catch (err) {
      console.error("Error al enviar pedido:", err);
    }
  };
   // Scroll automático al recibir un comentario nuevo
  useEffect(() => {
    if (comentariosRef.current) {
      comentariosRef.current.scrollTop = comentariosRef.current.scrollHeight;
    }
  }, [comentarios]);

 return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 p-6">
  <Toaster position="top-right" reverseOrder={false} />
  <h1 className="text-5xl font-extrabold text-center text-pink-600 drop-shadow mb-8">
    🎧 Bonsai Arisa 2.0 - Radio Anime
  </h1>

  {/* Contenedor principal con 3 columnas */}
  <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
    {/* Columna 1: Slider */}
    <div className="w-full lg:w-1/3 rounded-2xl shadow-lg overflow-hidden relative min-h-[550px] sm:min-h-[320px] md:min-h-[600px]">
      {imagenes.length ? (
        <Image
          src={`/img/${imagenes[index]}`}
          alt="Slider"
          fill
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span className="text-white p-4">No hay imágenes</span>
      )}
    </div>

    {/* Columna 2: Formulario + lista de pedidos */}
    <div className="w-full lg:w-1/3 flex flex-col gap-6">
      {/* Formulario de pedidos */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Haz tu pedido 🎶
        </h2>

        <input name="nombre" placeholder="Tu nombre" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900" />
        <input name="cancion" placeholder="Nombre de la canción" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900" />
        <input name="artista" placeholder="Artista" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900" />
        <textarea name="dedicatoria" placeholder="Dedicatoria (opcional)" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white placeholder-gray-500 text-gray-900" />

        <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300">
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
            pedidos.map((p) => (
              <div key={p.id} className="flex items-start space-x-3 bg-white rounded-lg shadow p-3">
                <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold">
                  {p.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong className="text-pink-600">{p.cancion}</strong>{" "}
                  <span className="text-gray-700">- {p.artista || "Desconocido"}</span>
                  <div className="text-sm text-gray-600">
                    Pedido por <span className="font-medium">{p.nombre}</span>
                  </div>
                  {p.dedicatoria && <div className="text-gray-500 italic">&quot;{p.dedicatoria}&quot;</div>}
                  <div className="text-xs text-gray-400">{new Date(p.fecha_hora).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* Columna 3: Comentarios */}
    <div className="w-full lg:w-1/3 flex flex-col gap-4">
      <div ref={comentariosRef} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg max-h-[700px] overflow-y-auto flex-1">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">💬 Comentarios en vivo</h2>

        {comentarios.length === 0 ? (
          <p className="text-gray-500 italic text-center">No hay comentarios aún</p>
        ) : (
          <div className="space-y-3">
            {comentarios.map((c) => (
              <div key={c.id} className="bg-white rounded-lg p-3 shadow flex flex-col justify-between">
                <div>
                  <span className="font-bold text-pink-600">{c.nombre}:</span> {c.mensaje}
                </div>
                <div className="text-xs text-gray-400 mt-2">{new Date(c.fecha_hora).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario de comentarios */}
<form onSubmit={handleComentario} className="flex flex-col gap-2 mt-2">
  <input
    value={nombre}
    onChange={(e) => setNombre(e.target.value)}
    placeholder="Tu nombre"
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900"
    required
  />

  <textarea
    value={mensaje}
    onChange={(e) => setMensaje(e.target.value)}
    placeholder="Escribe tu comentario"
    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 resize-none h-32"
    required
  />

  <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300">
    Enviar
  </button>
</form>
    </div>
  </div>

  {/* Reproductor de radio */}
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
