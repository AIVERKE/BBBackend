# Guía del Frontend

La interfaz de Orko está construida con **Vue 3** y **Vuetify**, enfocada en la velocidad y la facilidad de uso para el personal de los locales.

## Estructura de la Aplicación

### 1. Vistas (`src/views/`)
- `LoginView.vue` / `RegisterView.vue`: Portales de acceso.
- `CashierDashboardView.vue`: Interfaz rápida para cajeros/staff.
- `MenuView.vue`: Vista para que los clientes finales vean el menú y pidan.
- `AnalyticsView.vue`: Gráficos técnicos para administradores.

### 2. Gestión de Estado (`src/store/`)
Usamos **Pinia** para mantener datos globales:
- `auth.ts`: Almacena el token, perfil de usuario y permisos.
- `ui.ts`: Controla estados visuales como el modo oscuro y notificaciones.

### 3. Servicios (`src/services/`)
Capa de comunicación que encapsula llamadas a Axios:
- `api.ts`: Configuración base (interceptores de token).
- `order.service.ts`, `product.service.ts`, etc.

## Integración de WebSockets

El frontend se conecta automáticamente al servidor de notificaciones al iniciar sesión. 
- Usamos la librería `socket.io-client`.
- Escucha eventos globales (ej: `newOrder`) para mostrar notificaciones tipo "Toast" inmediatas.

## Estándares de Diseño

- **Vuetify components**: No usamos CSS plano a menos que sea necesario.
- **Responsividad**: Todos los paneles deben ser operables desde un teléfono (Android/iOS) para uso en salón.
