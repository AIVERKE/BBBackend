# Arquitectura del Sistema Orko

Orko está diseñado como una plataforma **SaaS Multi-tenant** de alto rendimiento. Esta guía explica los pilares arquitectónicos que sostienen el sistema.

## 1. Modelo Multi-Tenancy

El aislamiento de datos es el corazón de Orko. Cada registro en la base de datos (excepto los Super Usuarios) está vinculado a un `tenant_id`.

- **Aislamiento lógico**: Todas las entidades principales (`User`, `Product`, `Order`, `Customer`, etc.) tienen una relación con la tabla `Tenant`.
- **Inyección Automática**: En el Backend, usamos decoradores personalizados para extraer el `tenantId` del token JWT, asegurando que un usuario solo pueda ver u operar sobre los datos de su propio negocio.

## 2. Capas del Backend (NestJS)

El backend sigue una arquitectura modular y orientada a servicios:

1.  **Controllers**: Manejan las peticiones HTTP, validan la entrada básica y despachan a los servicios.
2.  **Services**: Contienen la lógica de negocio pura. Son independientes del transporte (HTTP/WebSockets).
3.  **Gateways**: Manejan la comunicación bidireccional vía WebSockets para notificaciones en tiempo real.
4.  **Entities**: Definiciones de TypeORM que mapean los objetos de TypeScript a tablas de PostgreSQL.
5.  **DTOs (Data Transfer Objects)**: Definen el contrato de datos para entrada y salida, asegurando validaciones estrictas (`class-validator`).

## 3. Seguridad y Flujo de Autenticación

- **Passport JWT**: Usado para proteger todas las rutas privadas.
- **Roles y Permisos**: 
    - `SUPER_USER`: Acceso global a todos los tenants.
    - `ADMIN`: Gestión total de su propio tenant.
    - `EMPLOYEE`: Operaciones de venta y asistencia.
    - `CUSTOMER`: Interfaz limitada de visualización y pedidos.

## 4. Comunicación en Tiempo Real

Usamos **Socket.io** para mantener sincronizados el Backend y el Frontend sin recargas:
- Al crear un nuevo pedido, se emite un evento al canal del tenant correspondiente.
- Los paneles de cajeros y administradores escuchan estos eventos para actualizar la UI instantáneamente.
