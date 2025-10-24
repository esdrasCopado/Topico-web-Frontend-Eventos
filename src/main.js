// Importar estilos globales
import './assets/css/global.css'
import './assets/css/components.css'
import './assets/css/components/NavBar.css'
import './assets/css/components/UserDropdown.css'
import './assets/css/pages/dashboard.css'

// Importar Router
import Router from './router.js'

// Importar servicios de autenticación
import { authGuard, guestGuard, ROLES } from './services/auth.js'

// Importar páginas públicas
import { HomePage } from './pages/home.js'
import { LoginPage } from './pages/login.js'
import { SignUpPage } from './pages/signUp.js'
import { ComponentsDemoPage } from './pages/components-demo.js'
import { NotFoundPage } from './pages/notFound.js'
import { UnauthorizedPage } from './pages/unauthorized.js'

// Importar páginas protegidas por rol
import { AdminDashboardPage } from './pages/admin/dashboard.js'
import { OrganizadorDashboardPage } from './pages/organizador/dashboard.js'
import { UserDashboardPage } from './pages/user/dashboard.js'

// Definir rutas (como en React Router)
const routes = [
    // ===== RUTAS PÚBLICAS =====
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/login',
        component: LoginPage,
        guard: () => guestGuard() // Solo accesible si NO está autenticado
    },
    {
        path: '/signup',
        component: SignUpPage,
        guard: () => guestGuard() // Solo accesible si NO está autenticado
    },
    {
        path: '/components',
        component: ComponentsDemoPage
    },

    // ===== RUTAS PROTEGIDAS - ADMIN =====
    {
        path: '/admin',
        component: AdminDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ADMIN] })
    },
    {
        path: '/admin/usuarios',
        component: AdminDashboardPage, // Puedes crear páginas específicas después
        guard: () => authGuard({ allowedRoles: [ROLES.ADMIN] })
    },
    {
        path: '/admin/eventos',
        component: AdminDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ADMIN] })
    },
    {
        path: '/reportes',
        component: AdminDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ADMIN] })
    },

    // ===== RUTAS PROTEGIDAS - ORGANIZADOR =====
    {
        path: '/organizador',
        component: OrganizadorDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ORGANIZADOR, ROLES.ADMIN] })
    },
    {
        path: '/organizador/crear-evento',
        component: OrganizadorDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ORGANIZADOR, ROLES.ADMIN] })
    },
    {
        path: '/organizador/estadisticas',
        component: OrganizadorDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.ORGANIZADOR, ROLES.ADMIN] })
    },

    // ===== RUTAS PROTEGIDAS - USER (cualquier usuario autenticado) =====
    {
        path: '/eventos',
        component: UserDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.USER, ROLES.ORGANIZADOR, ROLES.ADMIN] })
    },
    {
        path: '/mis-reservas',
        component: UserDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.USER, ROLES.ORGANIZADOR, ROLES.ADMIN] })
    },
    {
        path: '/perfil',
        component: UserDashboardPage,
        guard: () => authGuard({ allowedRoles: [ROLES.USER, ROLES.ORGANIZADOR, ROLES.ADMIN] })
    },

    // ===== RUTAS DE ERROR =====
    {
        path: '/unauthorized',
        component: UnauthorizedPage
    },
    // Ruta 404 - debe ir al final
    {
        path: '*',
        component: NotFoundPage
    }
]

function init() {
    // Crear instancia del router
    const router = new Router(routes)

    // Iniciar el router
    router.init()
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init)
