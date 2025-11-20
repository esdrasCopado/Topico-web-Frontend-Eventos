# Sistema de Gestión de Eventos - Frontend

Aplicación web moderna para la gestión y compra de boletos de eventos, construida con Vanilla JavaScript, Vite y arquitectura SPA (Single Page Application).

## Características Principales

### Gestión de Usuarios y Autenticación
- Sistema de autenticación con JWT (JSON Web Tokens)
- Control de acceso basado en roles (RBAC): ADMIN, ORGANIZADOR, USER
- Guards de rutas para proteger páginas según roles
- Sesiones persistentes con localStorage
- Refresh tokens para renovación automática

### Roles y Permisos

#### ADMIN
- Panel de administración completo
- Gestión de usuarios y eventos
- Acceso a reportes y estadísticas
- Control total del sistema

#### ORGANIZADOR
- Crear y gestionar eventos propios
- Configurar tipos de boletos (VIP, General, etc.)
- Establecer precios y disponibilidad
- Ver estadísticas de ventas
- Subir imágenes de eventos

#### USER
- Explorar eventos disponibles
- Comprar boletos
- Ver órdenes y reservas
- Gestionar carrito de compras
- Perfil personalizado

### Funcionalidades de Eventos
- Listado de eventos con filtros
- Página de detalle de evento con imágenes
- Selector de boletos con contador de cantidad
- Sistema de tipos de boletos personalizables
- Carga de imágenes para eventos

### Carrito de Compras
- Visualización de órdenes pendientes y completadas
- Detalles de cada boleto en el carrito
- Resumen de compra con totales
- Estados de orden: PENDIENTE, COMPLETADA, CANCELADA
- Icono de carrito en navbar con estado activo
- Diseño responsivo y moderno

## Tecnologías Utilizadas

### Core
- **Vanilla JavaScript (ES6+)**: Sin frameworks, JavaScript puro
- **Vite**: Build tool ultra rápido para desarrollo
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones

### Arquitectura
- **SPA Router**: Sistema de enrutamiento personalizado tipo React Router
- **Componentes**: Arquitectura basada en componentes reutilizables
- **State Management**: Manejo de estado local por componente
- **API Integration**: Axios para peticiones HTTP

### Librerías
- **Axios**: Cliente HTTP para comunicación con backend
- **Feather Icons**: Iconos SVG ligeros y personalizables

## Estructura del Proyecto

```
Frontend Proyecto Web/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── global.css              # Estilos globales y variables
│   │   │   ├── components.css          # Estilos de componentes
│   │   │   ├── components/
│   │   │   │   ├── NavBar.css          # Estilos del navbar
│   │   │   │   ├── UserDropdown.css    # Dropdown de usuario
│   │   │   │   ├── ImageDrop.css       # Upload de imágenes
│   │   │   │   ├── MainCards.css       # Tarjetas principales
│   │   │   │   └── Tikets.css          # Estilos de boletos
│   │   │   └── pages/
│   │   │       ├── home.css            # Página de inicio
│   │   │       ├── dashboard.css       # Dashboards
│   │   │       └── eventDetail.css     # Detalle de eventos
│   │   └── images/                     # Imágenes estáticas
│   │
│   ├── components/                     # Componentes reutilizables
│   │   ├── NavBar.js                   # Barra de navegación
│   │   ├── Button.js                   # Botón reutilizable
│   │   ├── Card.js                     # Tarjeta base
│   │   ├── Counter.js                  # Contador de cantidad
│   │   ├── EventCard.js                # Tarjeta de evento
│   │   ├── EventsList.js               # Lista de eventos
│   │   ├── ImageDrop.js                # Componente de carga de imágenes
│   │   ├── ListAvailableTickets.js     # Lista de boletos disponibles
│   │   └── TicketSelector.js           # Selector de boletos
│   │
│   ├── pages/                          # Páginas de la aplicación
│   │   ├── home.js                     # Página principal
│   │   ├── login.js                    # Inicio de sesión
│   │   ├── signUp.js                   # Registro
│   │   ├── eventDetail.js              # Detalle de evento
│   │   ├── cartPurchase.js             # Carrito de compras
│   │   ├── notFound.js                 # Error 404
│   │   ├── unauthorized.js             # Error 401/403
│   │   ├── admin/
│   │   │   └── dashboard.js            # Dashboard admin
│   │   ├── organizador/
│   │   │   ├── dashboard.js            # Dashboard organizador
│   │   │   ├── OrganizadorCrearEvento.js
│   │   │   └── createTickets.js        # Crear boletos
│   │   └── user/
│   │       └── dashboard.js            # Dashboard usuario
│   │
│   ├── services/                       # Servicios de la aplicación
│   │   └── auth.js                     # Autenticación y autorización
│   │
│   ├── utils/                          # Utilidades
│   │   ├── api.js                      # Cliente HTTP (Axios)
│   │   └── icons.js                    # Librería de iconos SVG
│   │
│   ├── router.js                       # Sistema de enrutamiento SPA
│   └── main.js                         # Punto de entrada
│
├── index.html                          # HTML principal
├── vite.config.js                      # Configuración de Vite
└── package.json                        # Dependencias del proyecto
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Backend API corriendo en `http://localhost:3000`

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd "Frontend Proyecto Web"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Edita `src/utils/api.js` si tu backend está en otra URL:
```javascript
const API_BASE_URL = 'http://localhost:3000/api'
const IMAGE_BASE_URL = 'http://localhost:3000'
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa del build de producción
```

## Rutas de la Aplicación

### Rutas Públicas
- `/` - Página principal con listado de eventos
- `/login` - Inicio de sesión
- `/signup` - Registro de usuarios
- `/evento/:id` - Detalle de un evento específico

### Rutas Protegidas - Requieren Autenticación

#### Admin (Rol: ADMIN)
- `/admin` - Panel de administración
- `/admin/usuarios` - Gestión de usuarios
- `/admin/eventos` - Gestión de eventos
- `/reportes` - Reportes y estadísticas

#### Organizador (Rol: ORGANIZADOR, ADMIN)
- `/organizador` - Dashboard del organizador
- `/organizador/crear-evento` - Crear nuevo evento
- `/organizador/estadisticas` - Estadísticas de eventos
- `/organizador/crear-boletos/:eventId` - Crear boletos para un evento

#### Usuario (Rol: USER, ORGANIZADOR, ADMIN)
- `/eventos` - Listado de eventos
- `/mis-reservas` - Reservas del usuario
- `/perfil` - Perfil del usuario
- `/carrito` - Carrito de compras

### Rutas de Error
- `/unauthorized` - Acceso no autorizado (403)
- `*` - Página no encontrada (404)

## Componentes Principales

### NavBar
Barra de navegación adaptativa con:
- Logo y marca
- Links de navegación según rol
- Icono de carrito con estado activo
- Dropdown de usuario con perfil y logout
- Diseño responsivo

### EventCard
Tarjeta de evento que muestra:
- Imagen del evento
- Título y descripción
- Fecha y ubicación
- Estadísticas de boletos
- Botón de acción

### TicketSelector
Selector de boletos con:
- Lista de tipos disponibles
- Contador de cantidad por tipo
- Validación de disponibilidad
- Cálculo de total en tiempo real

### CartPurchasePage
Carrito de compras completo:
- Listado de órdenes
- Detalles de boletos
- Estados visuales (pendiente, completada, cancelada)
- Resumen de compra
- Total y botones de pago

## Sistema de Autenticación

### Flujo de Autenticación

1. **Login**: Usuario envía credenciales → Backend valida → Retorna tokens
2. **Storage**: Tokens se guardan en `localStorage`
3. **Interceptor**: Axios agrega token automáticamente a todas las peticiones
4. **Guards**: Router verifica permisos antes de cargar rutas
5. **Refresh**: Token se renueva automáticamente antes de expirar

### Estructura de Usuario

```javascript
{
  id: 594,
  nombre: "Juan",
  apellidos: "Pérez",
  email: "juan@example.com",
  rol: "USER",
  organizadorId: null,
  artistaId: null,
  telefono: "1234567890",
  fechaRegistro: "2025-01-15T10:30:00Z"
}
```

### Tokens

```javascript
localStorage.setItem('authToken', 'eyJhbGc...')      // Access token
localStorage.setItem('refreshToken', 'eyJhbGc...')   // Refresh token
localStorage.setItem('user', JSON.stringify(user))   // User data
```

## API Integration

### Estructura de Peticiones

```javascript
import { get, post, put, del, postFormData } from './utils/api.js'

// GET request
const { data, error } = await get('/eventos')

// POST request
const { data, error } = await post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
})

// POST con archivos
const formData = new FormData()
formData.append('image', file)
const { data, error } = await postFormData('/eventos/imagen', formData)
```

### Endpoints Principales

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/refresh` - Renovar token

#### Eventos
- `GET /eventos` - Listar eventos
- `GET /eventos/:id` - Detalle de evento
- `POST /eventos` - Crear evento (ORGANIZADOR)
- `PUT /eventos/:id` - Actualizar evento (ORGANIZADOR)
- `POST /eventos/:id/imagen` - Subir imagen (ORGANIZADOR)

#### Boletos
- `GET /boletos/evento/:eventoId` - Boletos de un evento
- `GET /boletos/:id` - Detalle de boleto
- `POST /boletos` - Crear boleto (ORGANIZADOR)

#### Órdenes
- `GET /ordenes/usuario/:usuarioId` - Órdenes de un usuario
- `POST /ordenes` - Crear orden
- `PUT /ordenes/:id` - Actualizar orden

## Estilos y Diseño

### Variables CSS

El proyecto usa variables CSS para mantener consistencia:

```css
/* Colores */
--primary-color: #646cff
--primary-hover: #535bf2
--danger-color: #cf222e
--success-color: #1a7f37
--warning-color: #bf8700
--info-color: #0969da

/* Spacing */
--spacing-xs: 0.5rem
--spacing-sm: 0.75rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem

/* Typography */
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
```

### Diseño Responsivo

- **Desktop**: Grid layout, sidebar fijo, navbar completo
- **Tablet** (< 768px): Grid adaptativo, navbar compacto
- **Mobile** (< 480px): Columna única, menú hamburguesa

## Buenas Prácticas Implementadas

### Código
-  Componentes reutilizables y modulares
-  Separación de responsabilidades (SoC)
-  DRY (Don't Repeat Yourself)
-  Naming conventions consistentes
-  Comentarios en código complejo
### Seguridad
-  Tokens en localStorage (no cookies por simplicidad)
-  Guards de rutas para control de acceso
-  Validación de roles en frontend y backend
-  Sanitización de inputs
-  HTTPS en producción (recomendado)

### Performance
-  Lazy loading de imágenes
-  Código minificado en producción
-  Tree shaking con Vite
-  CSS optimizado
-  Peticiones HTTP optimizadas

### UX/UI
-  Feedback visual en todas las acciones
-  Loading states
-  Error handling amigable
-  Animaciones suaves
-  Diseño consistente

## Próximas Funcionalidades

- [ ] Integración con pasarela de pago (Stripe/PayPal)
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Sistema de búsqueda avanzado
- [ ] Filtros de eventos por categoría/fecha
- [ ] Chat de soporte
- [ ] Descarga de boletos en PDF
- [ ] Códigos QR para validación de boletos
- [ ] Sistema de reseñas y calificaciones
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es parte de un trabajo académico.

## Contacto

Para preguntas o sugerencias, contacta al equipo de desarrollo.

---

**Desarrollado con usando Vanilla JavaScript y Vite**
