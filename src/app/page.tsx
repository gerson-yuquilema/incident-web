"use client";

import { useEffect, useState, useCallback } from "react";
import { Incident, PagedResponse } from "../types/incident";
import Link from "next/link";

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para filtros y paginación
  const [status, setStatus] = useState("");   
  const [severity, setSeverity] = useState(""); 
  const [page, setPage] = useState(1);         
  const [totalRecords, setTotalRecords] = useState(0);

  // Envolvemos fetchIncidents en useCallback para memorizarla.
  // Esto evita que la función se genere de nuevo a menos que cambien status, severity o page.
  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      const queryParams = new URLSearchParams({
        status: status,
        severity: severity,
        page: page.toString(),
        pageSize: "10"
      });

      const response = await fetch(`${apiUrl}/incidents?${queryParams}`);
      if (!response.ok) throw new Error("Error al conectar con la API");
      
      const result: PagedResponse = await response.json();
      setIncidents(result.data);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [status, severity, page]); // Dependencias de la función memoizada

  // El efecto ahora depende únicamente de la función memoizada fetchIncidents
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Incidentes</h1>
            <p className="text-slate-500 mt-1">Consola central de monitoreo de servicios.</p>
          </div>
          <Link 
            href="/create" 
            className="inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
          >
            <span className="mr-2 text-xl">+</span> Nuevo Incidente
          </Link>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 items-end">
          <div className="flex flex-col min-w-[180px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Filtrar por Estado</label>
            <select 
              value={status} 
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Todos los Estados</option>
              <option value="OPEN">Abierto (OPEN)</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="RESOLVED">Resuelto</option>
            </select>
          </div>

          <div className="flex flex-col min-w-[180px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nivel de Severidad</label>
            <select 
              value={severity} 
              onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Cualquier Severidad</option>
              <option value="HIGH">Alta (HIGH)</option>
              <option value="MEDIUM">Media (MEDIUM)</option>
              <option value="LOW">Baja (LOW)</option>
            </select>
          </div>

          <div className="ml-auto pb-1">
            <span className="text-xs font-medium text-slate-400 italic">
              Mostrando {incidents.length} de {totalRecords} registros
            </span>
          </div>
        </div>

        {/* Tabla de Incidentes */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Incidente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Severidad</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Servicio</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{incident.title}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">Ref: {incident.id.substring(0,8)}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      incident.severity === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
                      incident.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wide ${
                      incident.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                      incident.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                      {incident.serviceId}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/${incident.id}`} 
                      className="text-indigo-600 font-bold text-sm hover:text-indigo-900 transition-colors"
                    >
                      Detalle →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button 
              disabled={page === 1 || loading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
            >
              ← Anterior
            </button>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-slate-400">Página</span>
               <span className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-black text-indigo-600">{page}</span>
            </div>
            <button 
              disabled={incidents.length < 10 || loading}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
            >
              Siguiente →
            </button>
          </div>
          
          {loading && <div className="p-12 text-center text-slate-400 animate-pulse">Consultando base de datos...</div>}
          {error && <div className="p-12 text-center text-red-500 font-bold">{error}</div>}
        </div>
      </div>
    </main>
  );
}