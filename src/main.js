// Importar estilos globales
import './assets/css/global.css'
import './assets/css/components.css'
import './assets/css/components/NavBar.css'

// Importar Router
import Router from './router.js'

// Importar páginas
import { HomePage } from './pages/home.js'
import { LoginPage } from './pages/login.js'
import { SignUpPage } from './pages/signUp.js'
import { ComponentsDemoPage } from './pages/components-demo.js'
import { NotFoundPage } from './pages/notFound.js'

// Definir rutas (como en React Router)
const routes = [
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/signup',
        component: SignUpPage
    },
    {
        path: '/components',
        component: ComponentsDemoPage
    },
    // Ruta 404 - debe ir al final
    {
        path: '*',
        component: NotFoundPage
    }
]

// Función principal de la aplicación
function init() {
    // Crear instancia del router
    const router = new Router(routes)

    // Iniciar el router
    router.init()

    console.log('Aplicación iniciada con Vite ⚡')
    console.log('Router activado - Navegación SPA lista')
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init)
