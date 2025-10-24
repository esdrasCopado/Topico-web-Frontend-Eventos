import { Link } from '../router.js'
import { NavBar } from '../components/NavBar.js'
import { EventsList } from '../components/EventsList.js'

export class HomePage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname
        })
        this.eventsList = new EventsList()
    }

    render() {
        return `
        
                ${this.navbar.render()}

            <div class="page-container">
                <div class="hero">
                    <h1>Bienvenido a tu Aplicación Web</h1>
                    <p>Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>

                    <div class="hero-buttons">
                        ${Link('/login', 'Iniciar Sesión', 'btn btn-primary')}
                        ${Link('/signup', 'Crear Cuenta', 'btn btn-secondary')}
                    </div>

                    ${this.eventsList.render()}

                    <div class="features">
                        <div class="feature-card">
                            <h3>⚡ Rápido</h3>
                            <p>Construido con Vite para desarrollo ultrarrápido</p>
                        </div>
                        <div class="feature-card">
                            <h3>🎯 SPA Routing</h3>
                            <p>Navegación sin recargas, como React Router</p>
                        </div>
                        <div class="feature-card clickable" id="components-card">
                            <h3>🧩 Componentes</h3>
                            <p>Ver ejemplos de componentes reutilizables</p>
                            ${Link('/components', '→ Ver Demo', 'btn btn-primary')}
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.mount()
        this.eventsList.mount()  // ← Esto hace la petición HTTP!
        console.log('HomePage cargada')
    }
}