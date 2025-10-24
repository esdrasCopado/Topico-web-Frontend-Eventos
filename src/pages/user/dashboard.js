import { NavBar } from '../../components/NavBar.js'
import { getUserInfo } from '../../services/auth.js'

export class UserDashboardPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar()
        this.user = getUserInfo()
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div class="dashboard-header">
                    <h1>Mi Panel</h1>
                    <p>Bienvenido, ${this.user.nombreCompleto}</p>
                </div>

                <div class="dashboard-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Mis Reservas</h3>
                            <p class="stat-number">8</p>
                        </div>
                        <div class="stat-card">
                            <h3>Eventos Próximos</h3>
                            <p class="stat-number">3</p>
                        </div>
                        <div class="stat-card">
                            <h3>Eventos Pasados</h3>
                            <p class="stat-number">5</p>
                        </div>
                        <div class="stat-card">
                            <h3>Favoritos</h3>
                            <p class="stat-number">12</p>
                        </div>
                    </div>

                    <div class="admin-actions">
                        <h2>Acciones Rápidas</h2>
                        <div class="actions-grid">
                            <a href="/eventos" data-link class="action-card">
                                <h3>Explorar Eventos</h3>
                                <p>Descubre nuevos eventos</p>
                            </a>
                            <a href="/mis-reservas" data-link class="action-card">
                                <h3>Mis Reservas</h3>
                                <p>Ver mis boletos y reservas</p>
                            </a>
                            <a href="/perfil" data-link class="action-card">
                                <h3>Mi Perfil</h3>
                                <p>Editar información personal</p>
                            </a>
                        </div>
                    </div>

                    <div class="recent-events">
                        <h2>Próximos Eventos</h2>
                        <div class="event-list">
                            <div class="event-item">
                                <h3>Concierto de Rock 2025</h3>
                                <p>15 de Noviembre - 8:00 PM</p>
                                <span class="status-badge confirmed">Confirmado</span>
                            </div>
                            <div class="event-item">
                                <h3>Festival de Jazz</h3>
                                <p>22 de Noviembre - 7:00 PM</p>
                                <span class="status-badge confirmed">Confirmado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.afterRender()
        console.log('✅ Panel de Usuario cargado')
    }
}
