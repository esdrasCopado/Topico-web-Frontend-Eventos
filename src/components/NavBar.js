import { Link } from '../router.js'
import { Icons } from '../utils/icons.js'
import { isAuthenticated, getUserInfo, logout, getUserRole, ROLES } from '../services/auth.js'

export class NavBar {

    constructor(props = {}) {
        this.brand = props.brand || 'Mi App'

        // Si no se pasan links, generar automáticamente según el rol
        this.links = props.links || this.getDefaultLinks()

        this.currentPath = props.currentPath || window.location.pathname

        // Obtener usuario automáticamente si está autenticado
        this.user = props.user || (isAuthenticated() ? getUserInfo() : null)

        this.id = `navbar-${Math.random().toString(36).substr(2, 9)}`
    }

    /**
     * Genera links por defecto según el rol del usuario
     */
    getDefaultLinks() {
        const userRole = getUserRole()
        const links = []

        // Link de inicio - siempre visible
        links.push({ path: '/', text: 'Inicio' })

        if (isAuthenticated()) {
            // Links según el rol
            switch (userRole) {
                case ROLES.ADMIN:
                    links.push(
                        { path: '/admin', text: 'Panel Admin' },
                        { path: '/admin/usuarios', text: 'Usuarios' },
                        { path: '/admin/eventos', text: 'Gestión Eventos' },
                        { path: '/reportes', text: 'Reportes' }
                    )
                    break

                case ROLES.ORGANIZADOR:
                    links.push(
                        { path: '/organizador', text: 'Mis Eventos' },
                        { path: '/organizador/crear-evento', text: 'Crear Evento' },
                        { path: '/organizador/estadisticas', text: 'Estadísticas' },
                        { path: '/organizador/crear-boletos', text: 'Crear Boletos' }
                    )
                    break

                case ROLES.USER:
                    links.push(
                        { path: '/eventos', text: 'Eventos' },
                        { path: '/mis-reservas', text: 'Mis Reservas' },
                        { path: '/perfil', text: 'Mi Perfil' }
                    )
                    break
            }
        } else {
            // Links para usuarios no autenticados
            links.push(
                { path: '/login', text: 'Iniciar Sesión' },
                { path: '/signup', text: 'Registrarse', class: 'btn-signup' }
            )
        }

        return links
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
                <div class="navbar-user-cart">
                    ${this.user ? this.renderUser() : ''}
                    ${this.renderCartPurchase()}
                </div>
            </nav>
        `
    }
    renderCartPurchase(){
        // Detectar si estamos en la página del carrito para marcarla como activa
        const isActive = window.location.pathname === '/carrito'
        const activeClass = isActive ? 'active' : ''

        return `
            <div class="navbar-cart">
                <a href="/carrito" data-link class="${activeClass}" title="Carrito de compras">
                    ${Icons.shoppingCart}
                </a>
            </div>
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
                <button id="user-menu-btn-${this.id}" class="user-menu-trigger" aria-expanded="false">
                    <span class="user-avatar">${this.user.iniciales}</span>
                    <span class="user-name-display">${this.user.nombre}</span>
                    ${Icons.dropDownArrow}
                </button>

                <div id="user-dropdown-${this.id}" class="user-dropdown" hidden>
                    <div class="dropdown-header">
                        <div class="dropdown-user-info">
                            <strong>${this.user.nombreCompleto}</strong>
                            <span class="dropdown-email">${this.user.email}</span>
                        </div>
                        <span class="user-badge">${this.user.rol}</span>
                    </div>

                    <div class="dropdown-divider"></div>

                    <nav class="dropdown-menu">
                        <a href="/perfil" data-link class="dropdown-item">
                            ${Icons.user}
                            Mi Perfil
                        </a>

                        ${this.renderRoleSpecificLinks()}

                        <a href="/configuracion" data-link class="dropdown-item">
                            ${Icons.settings}
                            Configuración
                        </a>
                    </nav>

                    <div class="dropdown-divider"></div>

                    <button id="logout-btn-${this.id}" class="dropdown-item dropdown-logout">
                        ${Icons.logOut}
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        `
    }

    renderRoleSpecificLinks() {
        const userRole = this.user.rol

        const links = {
            ADMIN: `
                <a href="/admin" data-link class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75z"/>
                        <path d="M8 4a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 018 4z"/>
                    </svg>
                    Panel Admin
                </a>
                <a href="/reportes" data-link class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"/>
                    </svg>
                    Reportes
                </a>
            `,
            ORGANIZADOR: `
                <a href="/organizador" data-link class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75z"/>
                    </svg>
                    Mis Eventos
                </a>
                <a href="/organizador/crear-evento" data-link class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 4a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 018 4z"/>
                    </svg>
                    Crear Evento
                </a>
            `,
            USER: `
                <a href="/eventos" data-link class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75z"/>
                    </svg>
                    Explorar Eventos
                </a>
                <a href="/mis-reservas" data-link class="dropdown-item">
                    ${Icons.events}
                    Mis Reservas
                </a>
            `
        }

        return links[userRole] || ''
    }

    afterRender() {
        if (!this.user) return

        const menuBtn = document.getElementById(`user-menu-btn-${this.id}`)
        const dropdown = document.getElementById(`user-dropdown-${this.id}`)
        const logoutBtn = document.getElementById(`logout-btn-${this.id}`)

        if (!menuBtn || !dropdown) return

        // Toggle del dropdown
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            const isOpen = !dropdown.hasAttribute('hidden')

            if (isOpen) {
                this.closeDropdown()
            } else {
                this.openDropdown()
            }
        })

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!dropdown.hasAttribute('hidden') && !dropdown.contains(e.target)) {
                this.closeDropdown()
            }
        })

        // Cerrar dropdown al presionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !dropdown.hasAttribute('hidden')) {
                this.closeDropdown()
                menuBtn.focus()
            }
        })

        // Cerrar dropdown al hacer clic en un link
        const dropdownLinks = dropdown.querySelectorAll('[data-link]')
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeDropdown()
            })
        })

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault()
                if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                    logout()
                }
            })
        }
    }

    openDropdown() {
        const menuBtn = document.getElementById(`user-menu-btn-${this.id}`)
        const dropdown = document.getElementById(`user-dropdown-${this.id}`)

        if (dropdown && menuBtn) {
            dropdown.removeAttribute('hidden')
            menuBtn.setAttribute('aria-expanded', 'true')
        }
    }

    closeDropdown() {
        const menuBtn = document.getElementById(`user-menu-btn-${this.id}`)
        const dropdown = document.getElementById(`user-dropdown-${this.id}`)

        if (dropdown && menuBtn) {
            dropdown.setAttribute('hidden', '')
            menuBtn.setAttribute('aria-expanded', 'false')
        }
    }

    mount() {
        this.afterRender()
    }
}