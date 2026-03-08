# Guía de Despliegue

Esta guía describe cómo llevar Orko a un entorno de producción.

## Requisitos de Servidor

- VPS con Ubuntu 22.04+ o servicios tipo AWS EC2.
- Node.js runtime instalado.
- Instancia de PostgreSQL (RDS, Cloud SQL o local).

## Pasos de Despliegue

### 1. Construir el Backend
```bash
cd BBBackend
npm install
npm run build
```
Generará una carpeta `dist/`. Úsala para correr con un manejador de procesos como **PM2**:
`pm2 start dist/main.js --name orko-api`

### 2. Construir el Frontend
```bash
cd BBFrontend
npm install
npm run build
```
Esto generará archivos estáticos en `dist/`. Sírvelos usando un servidor web como **Nginx** o cárgalos a un S3/Vercel.

### 3. Configuración de Nginx (Ejemplo)
```nginx
server {
    listen 80;
    server_name orko.com;

    location / {
        root /var/www/orko-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Variables de Entorno (Producción)
Asegúrate de cambiar `JWT_SECRET` y las credenciales de base de datos a valores altamente seguros y rotar las claves periódicamente.
