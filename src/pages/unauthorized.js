import { NavBar } from '../components/NavBar.js'
import { Link } from '../router.js'

export class UnauthorizedPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar()
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div class="error-container">
                    <h1 class="error-code">403</h1>
                    <h2>Acceso Denegado</h2>
                    <p>No tienes permiso para acceder a esta página.</p>
                    <p>Esta sección requiere privilegios específicos que tu cuenta no posee.</p>
                    <div style="margin-top: 20px;">
                        ${Link('/', 'Volver al Inicio', 'btn btn-primary')}
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.afterRender()
    }
}
