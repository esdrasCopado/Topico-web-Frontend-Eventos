import { Link } from '../router.js'
import { NavBar } from '../components/NavBar.js'

export class NotFoundPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Mi App',
            currentPath: window.location.pathname,
            links: [
                { path: '/', text: 'Inicio' },
                { path: '/login', text: 'Iniciar Sesión' },
                { path: '/signup', text: 'Registrarse', class: 'btn-signup' }
            ]
        })
    }

    render() {
        return `
            <div class="page-container">
                ${this.navbar.render()}
                <div class="not-found">
                    <h1>404</h1>
                    <h2>Página no encontrada</h2>
                    <p>La página que buscas no existe</p>
                    ${Link('/', 'Volver al inicio', 'btn btn-primary')}
                </div>
            </div>
        `
    }
}
