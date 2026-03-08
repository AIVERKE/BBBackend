# Guía de la API y Autenticación

La API de Orko está diseñada bajo principios RESTful y utiliza JSON como formato de intercambio.

## Autenticación

Todas las rutas privadas requieren un **Bearer Token** en el encabezado `Authorization`.

```http
GET /api/v1/orders
Authorization: Bearer <JWT_TOKEN>
```

### Proceso de Login
1. Envía credenciales a `/auth/login`.
2. Recibe un `accessToken`.
3. El token contiene el `role` y el `tenantId` codificados.

## Convenciones de Respuesta

### Éxito (200, 201)
```json
{
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Error (400, 401, 403, 500)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## Endpoints Principales

- **AUTH**: `/auth/login`, `/auth/register-customer`
- **TENANTS**: `/tenants` (Gestión de perfiles de negocio)
- **ORDERS**: `/orders` (Creación y tracking de pedidos)
- **ANALYTICS**: `/analytics` (Reportes de ventas y staff)
- **PRODUCTS**: `/products` y `/categories` (Gestión de inventario)

## Swagger UI
En entorno de desarrollo, puedes explorar y probar la API en:
`http://localhost:3000/api/docs`
