# ETAPA 1: Construcción (Dependencias y Build)
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos solo los archivos de dependencias primero (Optimización de caché Docker)
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# ETAPA 2: Producción (Imagen ligera)
FROM node:20-alpine AS runner
WORKDIR /app

# Establecemos variables de entorno para producción
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL http://localhost:5000/api 

# Copiamos solo lo necesario desde la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]