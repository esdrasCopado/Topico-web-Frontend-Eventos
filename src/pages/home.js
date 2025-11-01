import '../assets/css/components/MainCards.css'
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

                    ${this.eventsList.render()}
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