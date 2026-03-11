"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateIncident() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title.trim() || !serviceId.trim()) {
      setError("El título y el ID del servicio son campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, severity, serviceId }),
      });

      if (!response.ok) throw new Error("No se pudo establecer conexión con el servidor de incidentes.");

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error crítico de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navegación y Título */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="group flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Volver al Listado
          </Link>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Paso 1 de 1</span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Encabezado del Formulario */}
          <div className="bg-indigo-600 p-8 text-white">
            <h1 className="text-2xl font-bold">Reportar Nuevo Incidente</h1>
            <p className="text-indigo-100 mt-1 text-sm opacity-90">
              Proporciona los detalles técnicos para iniciar el proceso de resolución.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm animate-pulse">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            {/* Fila del Título */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Título del Incidente *</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="Ej: Interrupción en la pasarela de pagos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Fila de Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Descripción Técnica</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-32 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-900 resize-none placeholder:text-slate-400"
                placeholder="Describe el comportamiento observado y los pasos para reproducirlo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Fila de Configuración (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nivel de Severidad</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 cursor-pointer appearance-none"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="LOW">🟢 Baja (LOW)</option>
                  <option value="MEDIUM">🟡 Media (MEDIUM)</option>
                  <option value="HIGH">🔴 Alta (HIGH)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">ID del Servicio *</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    placeholder="Ej: api-auth-v1"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">#</span>
                </div>
              </div>
            </div>

            {/* Botón de Acción */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full overflow-hidden rounded-xl py-4 font-bold text-white transition-all shadow-xl ${
                  loading 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200"
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Integrando con Microservicios...
                    </>
                  ) : (
                    "Registrar Incidente en el Stack"
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}