<img width="1308" height="586" alt="image" src="https://github.com/user-attachments/assets/24a724e4-badf-46ed-8ba3-196e49240b55" />

# 🌐 Incident Management Web (Next.js + Tailwind)

Dashboard moderno para la gestión y monitorización de incidentes técnicos, enfocado en la claridad visual y la eficiencia operativa.

## 🛠️ Stack Tecnológico
- **Framework:** Next.js 14+ (App Router).
- **Estilos:** Tailwind CSS (Clean UI Design).
- **Lenguaje:** TypeScript (Tipado estricto).
- **Testing:** Jest + React Testing Library.

## 🏗️ Decisiones de Arquitectura y Tradeoffs
- **Server Components vs Client Components:** Se utilizó el nuevo App Router de Next.js. Las páginas principales se benefician del renderizado en servidor (SSR) para SEO y performance inicial, mientras que los componentes interactivos (como la tabla con filtros y paginación) utilizan `'use client'` para manejar el estado dinámico sin recargar la página.
- **Tailwind CSS:** Se eligió Tailwind en lugar de librerías de componentes prefabricados (como Material UI o Bootstrap) para tener control absoluto sobre el diseño personalizado del Dashboard y reducir el peso del bundle final.
- **Jerarquía Visual:** Se implementaron *badges* semánticos (Rojo para `HIGH`, Ámbar para `MEDIUM`, Esmeralda para `LOW`) para reducir la carga cognitiva del operador del sistema al momento de priorizar incidentes.

## 🔐 Variables de Entorno Necesarias
Para conectar este frontend con la API, configure el archivo `.env.local` en la raíz del proyecto (o use las inyectadas por Docker):

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL base de la API del Backend | `http://localhost:5000/api` |

## 🚀 Cómo Correr (Pasos Exactos)

### Opción 1: Vía Docker Compose (Recomendada)
Este proyecto está orquestado junto con el backend en el repositorio `incident-infra`.
```bash
# Desde el repositorio de infraestructura
docker compose up --build
```

### Opción 2: Desarrollo Local (Standalone)
Si desea correr solo el frontend para desarrollo:

### 1. Instalar dependencias:
´´´bash
npm install
´´´

### 2. Levantar el servidor de desarrollo:
´´´bash
npm run dev
´´´

### 3. Acceder en el navegador a:
´´´bash
http://localhost:3000
´´´

🧪 Pruebas y Calidad
Para cumplir con los estándares de calidad y los requisitos técnicos de la prueba:

Unit/Integration Tests: Ejecute npm test para correr la suite de Jest y validar que los componentes de la interfaz, el ruteo y las tablas se renderizan correctamente basándose en datos mockeados.

CI/CD: El repositorio cuenta con GitHub Actions configurado para validar el Linter y los Tests en cada Pull Request.

📝 Pendientes (Roadmap)
Actualizaciones en Tiempo Real: Integración de WebSockets (ej. SignalR o Socket.io) para reflejar los cambios de estado de los incidentes en el dashboard sin necesidad de refrescar o paginar.

Autenticación: Proteger la vista de "Crear Incidente" utilizando un flujo de JWT (JSON Web Tokens).
