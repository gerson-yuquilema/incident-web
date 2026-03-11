"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IncidentDetailResponse } from "../../types/incident";

export default function IncidentDetail() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<IncidentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchIncidentDetail = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/incidents/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error("Incidente no encontrado");
        throw new Error("Error al cargar el detalle");
      }
      
      const result: IncidentDetailResponse = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIncidentDetail();
  }, [fetchIncidentDetail]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/incidents/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Error al actualizar el estado");
       
      await fetchIncidentDetail();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al cambiar el estado.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-indigo-600 font-bold">Sincronizando con el clúster...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold">Error de Conexión</h2>
        <p>{error}</p>
        <Link href="/" className="inline-block mt-4 text-sm font-bold underline">Volver al Dashboard</Link>
      </div>
    </div>
  );

  if (!data) return null;

  const { incident, timeline } = data;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            <span className="mr-2">←</span> Volver a la Consola
          </Link>
          <div className="flex gap-2">
             <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-200">
               {incident.serviceId}
             </span>
             <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
               incident.severity === 'HIGH' ? 'bg-red-100 text-red-700 border-red-200' :
               incident.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200' :
               'bg-emerald-100 text-emerald-700 border-emerald-200'
             }`}>
               {incident.severity}
             </span>
          </div>
        </div>

        {/* Tarjeta de Información Principal */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{incident.title}</h1>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs mb-8">
              <span className="bg-slate-100 px-2 py-0.5 rounded">ID: {incident.id}</span>
              <span>•</span>
              <span>Creado: {new Date(incident.createdAt).toLocaleString()}</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Descripción del Incidente</h3>
              <p className="text-slate-700 leading-relaxed">
                {incident.description || "No se proporcionó una descripción técnica para este ticket."}
              </p>
            </div>

            {/* Acciones de Estado */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-500">Estado Actual:</span>
                <span className={`px-4 py-1.5 rounded-lg text-sm font-black shadow-sm ${
                  incident.status === 'OPEN' ? 'bg-blue-600 text-white' :
                  incident.status === 'IN_PROGRESS' ? 'bg-orange-500 text-white' :
                  'bg-emerald-600 text-white'
                }`}>
                  {incident.status}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                  disabled={updating || incident.status === "IN_PROGRESS" || incident.status === "RESOLVED"}
                  className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-100"
                >
                  Asignar a Progreso
                </button>
                <button 
                  onClick={() => handleStatusChange("RESOLVED")}
                  disabled={updating || incident.status === "RESOLVED"}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-100"
                >
                  Marcar como Resuelto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auditoría MongoDB (Timeline) */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-extrabold text-slate-900">Historial de Auditoría</h2>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest">NoSQL (MongoDB)</span>
          </div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-300 before:to-slate-100">
            {timeline.map((event) => (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-indigo-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                   <span className="text-[10px]">●</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
                  <div className="flex items-center justify-between space-x-2 mb-2">
                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{event.eventType}</div>
                    <time className="font-mono text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{new Date(event.timestamp).toLocaleTimeString()}</time>
                  </div>
                  <div className="text-slate-500 text-xs mb-4 italic">{new Date(event.timestamp).toLocaleDateString()}</div>
                  <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
                    <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto scrollbar-hide">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}