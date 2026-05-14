# Stage 1: Build con Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve con Nginx
FROM nginx:1.25-alpine AS runtime
# Creamos el usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiamos la carpeta dist de Vite
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🚨 CLAVE: Dar permisos al usuario no root sobre las carpetas de Nginx
RUN chown -R appuser:appgroup /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

USER appuser
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
