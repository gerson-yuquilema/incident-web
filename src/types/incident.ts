export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResponse {
  data: Incident[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Representa un evento del historial que viene de MongoDB
export interface IncidentEvent {
  id: string;
  incidentId: string;
  eventType: string;
  timestamp: string;
  payload: unknown; // Aquí viene la respuesta del mock o los cambios de estado
}

// Representa la respuesta combinada de SQL y MongoDB
export interface IncidentDetailResponse {
  incident: Incident;
  timeline: IncidentEvent[];
}