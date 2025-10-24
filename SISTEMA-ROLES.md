# Sistema de Autenticación y Roles (RBAC)

## Resumen

Este proyecto implementa un sistema completo de **Role-Based Access Control (RBAC)** que permite:

- ✅ Autenticación de usuarios con JWT
- ✅ Autorización basada en roles (ADMIN, ORGANIZADOR, USER)
- ✅ Rutas protegidas por rol
- ✅ NavBar dinámico según el rol del usuario
- ✅ Interceptores HTTP para agregar tokens automáticamente
- ✅ Manejo de sesiones expiradas

---

## Roles Disponibles

### 1. **ADMIN** (Administrador)
- Acceso total al sistema
- Puede gestionar usuarios, eventos y ver reportes
- Rutas exclusivas: `/admin/*`, `/reportes`

### 2. **ORGANIZADOR**
- Puede crear y gestionar sus propios eventos
- Rutas exclusivas: `/organizador/*`
- También tiene acceso a rutas de usuarios normales

### 3. **USER** (Usuario normal)
- Puede explorar eventos y hacer reservas
- Rutas exclusivas: `/eventos`, `/mis-reservas`, `/perfil`

---

## Estructura de Archivos

```
src/
├── services/
│   └── auth.js                 # Servicio de autenticación y roles
├── utils/
│   └── api.js                  # Interceptores HTTP con tokens
├── components/
│   └── NavBar.js               # NavBar dinámico por rol
├── pages/
│   ├── admin/
│   │   └── dashboard.js        # Panel de administrador
│   ├── organizador/
│   │   └── dashboard.js        # Panel de organizador
│   ├── user/
│   │   └── dashboard.js        # Panel de usuario
│   ├── login.js                # Página de login
│   ├── signUp.js               # Página de registro
│   └── unauthorized.js         # Página 403
├── router.js                   # Router con soporte para guards
└── main.js                     # Configuración de rutas protegidas
```

---

## Cómo Funciona

### 1. **Login y Almacenamiento de Sesión**

Cuando un usuario hace login ([login.js:36-90](src/pages/login.js#L36-L90)):

```javascript
// El backend devuelve:
{
  success: true,
  data: {
    user: { id, email, nombre, apellidos, rol: "ORGANIZADOR" },
    tokens: {
      accessToken: "eyJhbGciOiJ...",
      refreshToken: "eyJhbGciOiJ..."
    }
  }
}

// Se guarda en localStorage:
localStorage.setItem('authToken', tokens.accessToken)
localStorage.setItem('refreshToken', tokens.refreshToken)
localStorage.setItem('user', JSON.stringify(user))
```

---

### 2. **Verificación de Roles**

El servicio [auth.js](src/services/auth.js) proporciona funciones para verificar roles:

```javascript
import { isAuthenticated, getUserRole, hasRole, isAdmin } from './services/auth.js'

// Verificar si está autenticado
if (isAuthenticated()) { ... }

// Obtener rol actual
const rol = getUserRole() // "ADMIN", "ORGANIZADOR", "USER"

// Verificar rol específico
if (hasRole(ROLES.ADMIN)) { ... }

// Funciones auxiliares
if (isAdmin()) { ... }
if (isOrganizador()) { ... }
```

---

### 3. **Protección de Rutas**

Las rutas se protegen usando **guards** ([main.js:26-113](src/main.js#L26-L113)):

```javascript
const routes = [
    // Ruta protegida solo para ADMIN
    {
        path: '/admin',
        component: AdminDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ADMIN] })
    },

    // Ruta protegida para ORGANIZADOR y ADMIN
    {
        path: '/organizador',
        component: OrganizadorDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ORGANIZADOR, ROLES.ADMIN] })
    },

    // Ruta solo para usuarios NO autenticados
    {
        path: '/login',
        component: LoginPage,
        guard: () => guestGuard()
    }
]
```

**Cómo funciona:**
1. El router ejecuta el `guard` antes de renderizar la página ([router.js:99-107](src/router.js#L99-L107))
2. Si el guard retorna `false`, la navegación se bloquea
3. El guard redirige automáticamente a `/login` o `/unauthorized`

---

### 4. **NavBar Dinámico**

El NavBar se adapta automáticamente según el rol ([NavBar.js:23-67](src/components/NavBar.js#L23-L67)):

```javascript
// ADMIN ve:
Inicio | Panel Admin | Usuarios | Gestión Eventos | Reportes | [Logout]

// ORGANIZADOR ve:
Inicio | Mis Eventos | Crear Evento | Estadísticas | [Logout]

// USER ve:
Inicio | Eventos | Mis Reservas | Mi Perfil | [Logout]

// No autenticado ve:
Inicio | Iniciar Sesión | Registrarse
```

---

### 5. **Interceptores HTTP**

Todos los requests HTTP incluyen automáticamente el token ([api.js:9-45](src/utils/api.js#L9-L45)):

```javascript
// Interceptor de peticiones - Agrega el token
axios.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor de respuestas - Maneja tokens expirados
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout() // Cierra sesión y redirige a /login
        }
        return Promise.reject(error)
    }
)
```

---

## Cómo Usar

### **Crear una nueva página protegida**

```javascript
// 1. Crear la página
import { NavBar } from '../components/NavBar.js'
import { getUserInfo } from '../services/auth.js'

export class MiPaginaProtegida {
    constructor(params) {
        this.navbar = new NavBar()
        this.user = getUserInfo()
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <h1>Bienvenido, ${this.user.nombreCompleto}</h1>
                <p>Tu rol es: ${this.user.rol}</p>
            </div>
        `
    }

    afterRender() {
        this.navbar.afterRender()
    }
}

// 2. Agregar la ruta en main.js
import { MiPaginaProtegida } from './pages/mi-pagina.js'

const routes = [
    {
        path: '/mi-pagina',
        component: MiPaginaProtegida,
        guard: () => authGuard({ allowedRoles: [ROLES.ORGANIZADOR, ROLES.ADMIN] })
    }
]
```

---

### **Renderizado condicional por rol**

```javascript
import { isAdmin, isOrganizador, getUserRole, ROLES } from './services/auth.js'

render() {
    return `
        <div>
            ${isAdmin() ? `
                <button>Panel de Administrador</button>
            ` : ''}

            ${isOrganizador() ? `
                <button>Crear Evento</button>
            ` : ''}

            ${getUserRole() === ROLES.USER ? `
                <p>Eres un usuario normal</p>
            ` : ''}
        </div>
    `
}
```

---

### **Hacer peticiones HTTP con token**

```javascript
import { get, post } from './utils/api.js'

// El token se agrega automáticamente
const { data, error } = await get('/eventos')
const { data, error } = await post('/eventos', { nombre: 'Mi Evento' })

// No necesitas hacer nada más, el interceptor lo maneja
```

---

### **Cerrar sesión**

```javascript
import { logout } from './services/auth.js'

// Limpia localStorage y redirige a /login
logout()
```

---

## Flujo Completo de Autenticación

```
1. Usuario visita /login
2. Ingresa credenciales (email, password)
3. Se envía POST /api/usuarios/login
4. Backend valida y devuelve { user, tokens }
5. Frontend guarda en localStorage:
   - authToken
   - refreshToken
   - user (con rol)
6. Usuario es redirigido según su rol:
   - ADMIN → /admin
   - ORGANIZADOR → /organizador
   - USER → /eventos
7. NavBar se actualiza automáticamente
8. Todas las peticiones HTTP incluyen el token
9. Si el token expira (401), se redirige a /login
```

---

## Testing del Sistema

### **Test 1: Login como ORGANIZADOR**

```
1. Ir a /login
2. Email: usuario@ejemplo.com
3. Password: MiPassword123!
4. ✅ Debe redirigir a /
5. ✅ NavBar debe mostrar: Inicio | Mis Eventos | Crear Evento | Estadísticas
6. ✅ Debe aparecer botón "Cerrar Sesión" con nombre del usuario
```

### **Test 2: Intentar acceder a ruta protegida sin login**

```
1. Cerrar sesión
2. Escribir en URL: /admin
3. ✅ Debe redirigir a /login
```

### **Test 3: Intentar acceder a ruta de otro rol**

```
1. Login como USER
2. Escribir en URL: /admin
3. ✅ Debe redirigir a /unauthorized (403)
```

### **Test 4: Token expirado**

```
1. Login exitoso
2. Esperar a que expire el token (o eliminarlo de localStorage)
3. Hacer una petición HTTP
4. ✅ Debe redirigir automáticamente a /login
```

---

## API del Servicio de Autenticación

### Funciones Principales

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `isAuthenticated()` | Verifica si hay sesión activa | `boolean` |
| `getCurrentUser()` | Obtiene usuario del localStorage | `Object \| null` |
| `getUserRole()` | Obtiene el rol del usuario | `string \| null` |
| `getUserInfo()` | Info formateada del usuario | `Object` |
| `hasRole(role)` | Verifica rol específico | `boolean` |
| `hasAnyRole(roles[])` | Verifica si tiene alguno de los roles | `boolean` |
| `isAdmin()` | Verifica si es admin | `boolean` |
| `isOrganizador()` | Verifica si es organizador | `boolean` |
| `logout()` | Cierra sesión y redirige | `void` |
| `authGuard({ allowedRoles })` | Guard para rutas protegidas | `boolean` |
| `guestGuard()` | Guard para rutas de invitados | `boolean` |

---

## Notas de Seguridad

⚠️ **Importante:**

1. **localStorage es vulnerable a XSS**: Considera usar cookies httpOnly si tu backend lo soporta
2. **Validación en el backend**: SIEMPRE valida roles en el backend, el frontend es solo UX
3. **Tokens JWT**: Asegúrate de que el backend use tokens con expiración corta
4. **HTTPS en producción**: Nunca uses HTTP en producción

---

## Próximos Pasos

- [ ] Crear páginas específicas para cada sección de admin
- [ ] Implementar refresh token automático
- [ ] Agregar animaciones de transición entre rutas
- [ ] Crear sistema de permisos más granular
- [ ] Implementar 2FA (autenticación de dos factores)

---

**Última actualización:** 2025-10-24
