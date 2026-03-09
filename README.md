# Orko - Sistema Integral para Gestión de Negocios (SaaS) 🚀

Bienvenido a **Orko**, una plataforma SaaS multitenant diseñada para modernizar la gestión de restaurantes, cafeterías y locales comerciales. Este repositorio unifica tanto el motor de servicios (Backend) como la interfaz de usuario (Frontend).

## 📂 Estructura del Proyecto

El proyecto está organizado como un monorepo simple para facilitar el desarrollo:

- **[BBBackend](./BBBackend)**: Motor construido con NestJS (Node.js) y PostgreSQL. Maneja la lógica de negocio, seguridad, y persistencia de datos.
- **[BBFrontend](./BBFrontend)**: Interfaz de usuario moderna construida con Vue 3, Vite y Vuetify.

---

## 🛠️ Requisitos Globales

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (v18.x o superior)
- **NPM** (incluido con Node.js)
- **PostgreSQL** (v14 o superior)

---

## 🚀 Guía Rápida de Inicio

Sigue estos pasos para levantar todo el entorno localmente:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd orko
```

### 2. Configurar el Backend
```bash
cd BBBackend
npm install
# Crea un archivo .env basado en .env.example y configura tu base de datos
npm run migration:run
npm run seed  # Genera datos de prueba automáticamente
npm run start:dev
```

### 3. Configurar el Frontend
Abre una nueva terminal:
```bash
cd BBFrontend
npm install
npm run dev
```

---

## 👥 Usuarios de Prueba (Seeds)

Al ejecutar el comando `npm run seed` en el Backend, se generan datos y usuarios de prueba para facilitar el desarrollo. Todos los usuarios tienen la misma contraseña:

**Contraseña para todos los usuarios:** `password123`

### Super Administrador Global
- **Email:** `super@orko.com`
- **Rol:** `SUPER_USER`

### Tenants (Negocios)
Se crean 3 negocios de prueba. Para cada uno se generan los siguientes accesos:

**1. Restaurante Gourmet Orko:**
- **Admin:** `admin@restaurantegourmetorko.com`
- **Staff 1:** `staff1@restaurantegourmetorko.com`
- **Staff 2:** `staff2@restaurantegourmetorko.com`

**2. Cafetería Central:**
- **Admin:** `admin@cafeteríacentral.com`
- **Staff 1:** `staff1@cafeteríacentral.com`
- **Staff 2:** `staff2@cafeteríacentral.com`

**3. Bar La Noche:**
- **Admin:** `admin@barlanoche.com`
- **Staff 1:** `staff1@barlanoche.com`
- **Staff 2:** `staff2@barlanoche.com`

> **Nota:** También se generan clientes (ej. `cliente1_1`, `cliente2_1`...) y datos falsos de categorías, productos, pedidos y asistencias para evaluar la plataforma al instante.

---

## 🏗️ Arquitectura y Tecnologías

### Backend (NestJS)
- **Multi-tenancy**: Aislamiento de datos por negocio.
- **Seguridad**: Autenticación vía JWT con roles.
- **Comunicación**: WebSockets (Socket.io) para actualizaciones en tiempo real.
- **Reporting**: Generación de tickets en PDF y analíticas de negocio.

### Frontend (Vue 3)
- **Estado**: Pinia para manejo de estados globales.
- **Estilo**: Vuetify 3 para una interfaz premium y responsiva.
- **API**: Axios con interceptores para manejo automático de tokens y errores.

---

## 📚 Recursos de Documentación

Para una comprensión más profunda del sistema, consulta las guías técnicas detalladas en la carpeta [`/docs`](./docs):

- 🏗️ **[Arquitectura](./docs/architecture.md)**: Detalles sobre el modelo Multi-tenant y flujo de datos.
- 💾 **[Base de Datos](./docs/database.md)**: Diagrama de entidad-relación y gestión de persistencia.
- 🔌 **[Guía de API](./docs/api_guide.md)**: Cómo interactuar con los servicios y autenticación.
- 🖼️ **[Guía de Frontend](./docs/frontend_guide.md)**: Estructura de vistas, estados y componentes.
- 🚀 **[Guía de Despliegue](./docs/deployment.md)**: Pasos para llevar el sistema a producción.

---

## 🤝 Cómo Contribuir

1. Crea una rama para tu nueva funcionalidad: `git checkout -b feature/nueva-funcionalidad`.
2. Realiza tus cambios y asegúrate de seguir los estándares del proyecto (Prettier/ESLint).
3. Realiza un commit descriptivo: `git commit -m "feat: agrega nueva funcionalidad"`.
4. Envía tus cambios: `git push origin feature/nueva-funcionalidad`.

---

© 2026 Orko - Advanced Business Management.
