import { Link } from '../router.js'
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
                        { path: '/organizador/estadisticas', text: 'Estadísticas' }
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
                <button id="user-menu-btn-${this.id}" class="user-menu-trigger" aria-expanded="false">
                    <span class="user-avatar">${this.user.iniciales}</span>
                    <span class="user-name-display">${this.user.nombre}</span>
                    <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
                    </svg>
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
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M10.561 8.073a6.005 6.005 0 003.432-5.142.75.75 0 11.458 1.432 4.5 4.5 0 01-2.562 4.048 4.5 4.5 0 01-2.462.48A4.5 4.5 0 015.5 4.5a.75.75 0 111.5 0 3 3 0 006 0 .75.75 0 111.5 0c0 .647-.144 1.26-.401 1.808z"/>
                            </svg>
                            Mi Perfil
                        </a>

                        ${this.renderRoleSpecificLinks()}

                        <a href="/configuracion" data-link class="dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.990.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"/>
                            </svg>
                            Configuración
                        </a>
                    </nav>

                    <div class="dropdown-divider"></div>

                    <button id="logout-btn-${this.id}" class="dropdown-item dropdown-logout">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 13.25V2.75zm10.44 4.5H6.75a.75.75 0 000 1.5h5.69l-1.97 1.97a.75.75 0 101.06 1.06l3.25-3.25a.75.75 0 000-1.06l-3.25-3.25a.75.75 0 10-1.06 1.06l1.97 1.97z"/>
                        </svg>
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zm0 1.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25H1.75z"/>
                        <path d="M5 5.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 015 5.25zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 015 8.25zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"/>
                    </svg>
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