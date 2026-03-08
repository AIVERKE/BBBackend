# Orko Frontend - Interfaz de Gestión 🎨

Este es el cliente del sistema Orko, construido con **Vue 3** y **Vuetify** para ofrecer una experiencia de usuario rápida, premium y altamente responsiva.

## 🌟 Características

- **Dashboard de Analíticas**: Visualización interactiva con gráficos de rendimiento.
- **Gestión Multi-negocio**: Interfaz adaptativa según el rol y negocio del usuario.
- **Punto de Venta (POS)**: Sistema optimizado para cajeros con escaneo de pedidos QR.
- **Editor de Menús**: Gestión dinámica de categorías, productos e imágenes.
- **Diseño Responsive**: Optimizado para dispositivos móviles y tablets.

## 🛠️ Stack Tecnológico

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API + Script Setup).
- **UI Kit**: [Vuetify 3](https://vuetifyjs.com/) para componentes Material Design.
- **Store**: [Pinia](https://pinia.vuejs.org/) para gestión de estado.
- **Router**: [Vue Router 4](https://router.vuejs.org/).
- **Build Tool**: [Vite](https://vitejs.dev/).
- **API Client**: [Axios](https://axios-http.com/).

## 🚀 Instalación y Desarrollo

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar API**:
   Asegúrate de que el Backend esté corriendo en el puerto configurado (por defecto `http://localhost:3000`).

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

## 📁 Estructura Principal

- `src/views/`: Todas las páginas principales del sistema.
- `src/components/`: Componentes reutilizables.
- `src/services/`: Capa de servicios para comunicación con la API.
- `src/store/`: Definición de estados globales (Auth, UI, etc.).
- `src/router/`: Configuración de rutas y guardias de seguridad.

---
© 2026 Orko Frontend Team.
