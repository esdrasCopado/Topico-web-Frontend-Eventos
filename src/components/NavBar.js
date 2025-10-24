import { Link } from '../router.js'

export class NavBar {
    
    constructor(props = {}) {
        this.brand = props.brand || 'Mi App'
        this.links = props.links || []

        this.currentPath = props.currentPath || window.location.pathname
        this.user = props.user || null
        this.id = `navbar-${Math.random().toString(36).substr(2, 9)}`
    }

    render() {
        return ` 
            <nav class="navbar" id="${this.id}">
                <div class="navbar-brand">
                    ${Link('/', this.brand, 'brand-link')}
                </div>
                <div class="navbar-links">
                   ${this.renderLinks()}
                </div>
                ${this.user ? this.renderUser() : ''}  
            </nav>
        `
    }

    renderLinks() {
        return this.links.map(link => {
            const isActive = this.currentPath === link.path
            const activeClass = isActive ? 'active' : ''
            return Link(link.path, link.text, `nav-link ${activeClass}`)
        }).join('')
    }

    renderUser() {
        return `
            <div class="navbar-user">
                <span class="user-name">Hola, ${this.user.name}</span>
                ${Link('/logout', 'Cerrar Sesión', 'btn-logout')}
            </div>
        `
    }

    mount() {
        // Aquí irían event listeners si los necesitas
        // Por ahora puede estar vacío
    }
}