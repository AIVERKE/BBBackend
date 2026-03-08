# BBBackend - Sistema SaaS para Restaurantes 🚀

**BBBackend** es un potente motor de backend construido con **NestJS**, diseñado específicamente para funcionar como un modelo de negocio SaaS (Software as a Service) para restaurantes y locales comerciales.

## 🌟 Características Principales

- **Arquitectura Multi-tenant**: Aislamiento total de datos por local comercial mediante `tenantId`.
- **Inteligencia de Negocios (BI)**: Dashboard de analíticas en tiempo real (Ventas, Top Productos, Rendimiento de Staff).
- **Notificaciones en Tiempo Real**: WebSockets (Socket.io) blindados con JWT para alertas de nuevos pedidos y cambios de estado.
- **Gestión Multimedia**: Sistema local de subida y despacho de imágenes para menús y productos.
- **Generación de Tickets PDF**: Emisión automática de comprobantes de pago con diseño térmico y códigos QR.
- **Seguridad Robusta**: Autenticación JWT y Roles de Usuario (SuperUser, Admin, Employee, Customer).

---

## 🛠️ Requisitos Técnicos

- **Node.js**: v16+ (Recomendado v18+)
- **NPM / Yarn**
- **Base de Datos**: PostgreSQL (Configurado vía TypeORM)
- **TypeScript**: v5+

---

## 🚀 Guía de Inicio Rápido

### 1. Clonar e Instalar
```bash
git clone <tu-repositorio>
cd BBBackend
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz proyeto basándote en lo siguiente:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=bbbackend

# Security
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRATION=1d

# App
PORT=3000
APP_HOST=http://localhost:3000
```

### 3. Base de Datos y Migraciones
El sistema utiliza migraciones para asegurar la integridad de la estructura.
```bash
# Ejecutar migraciones
npm run migration:run
```

### 4. Poblado de Datos (Seeding)
Para facilitar el desarrollo, hemos incluido un script automatizado de generación masiva de datos:
```bash
# Limpia la base de datos y genera 3 locales, usuarios, productos y pedidos históricos
npm run seed
```
- *Consulta [test_credentials.md](../test_credentials.md) para ver las cuentas generadas automáticamente.*

### 5. Iniciar el Servidor
```bash
# Desarrollo
npm run start:dev

# Producción (Build & Start)
npm run build
npm run start:prod
```

---

## 📁 Estructura de Carpetas

- `src/`: Código fuente de la aplicación.
  - `auth/`: Lógica de seguridad y JWT.
  - `tenants/`: Gestión de negocios (Multi-tenancy).
  - `analytics/`: Módulo de BI y Reportes.
  - `orders/`: Gestión de pedidos y generación de tickets PDF.
  - `uploads/`: Controlador de archivos multimedia.
  - `notifications/`: Gateway de WebSockets.
- `docs/`: Documentación adicional y scripts de base de datos.
- `uploads/`: (Generada al correr) Almacenamiento local de imágenes.

---

## 🛡️ Notas de Seguridad
- El sistema utiliza un decorador personalizado `@TenantId()` que extrae automáticamente el contexto del local desde el token JWT.
- Todas las consultas a la base de datos están forzadas a filtrar por `tenantId`, imposibilitando la fuga de datos entre negocios.

---
