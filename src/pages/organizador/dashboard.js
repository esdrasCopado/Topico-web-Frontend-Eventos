import { NavBar } from '../../components/NavBar.js'
import { getUserInfo } from '../../services/auth.js'

export class OrganizadorDashboardPage {
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
                    <h1>Panel de Organizador</h1>
                    <p>Bienvenido, ${this.user.nombreCompleto}</p>
                </div>

                <div class="dashboard-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Mis Eventos</h3>
                            <p class="stat-number">12</p>
                        </div>
                        <div class="stat-card">
                            <h3>Asistentes Total</h3>
                            <p class="stat-number">342</p>
                        </div>
                        <div class="stat-card">
                            <h3>Eventos Próximos</h3>
                            <p class="stat-number">5</p>
                        </div>
                        <div class="stat-card">
                            <h3>Ingresos</h3>
                            <p class="stat-number">$8,750</p>
                        </div>
                    </div>

                    <div class="admin-actions">
                        <h2>Acciones Rápidas</h2>
                        <div class="actions-grid">
                            <a href="/organizador/crear-evento" data-link class="action-card">
                                <h3>Crear Nuevo Evento</h3>
                                <p>Publica un nuevo evento</p>
                            </a>
                            <a href="/organizador" data-link class="action-card">
                                <h3>Mis Eventos</h3>
                                <p>Ver y editar mis eventos</p>
                            </a>
                            <a href="/organizador/estadisticas" data-link class="action-card">
                                <h3>Estadísticas</h3>
                                <p>Análisis de rendimiento</p>
                            </a>
                        </div>
                    </div>

                    <div class="recent-events">
                        <h2>Eventos Recientes</h2>
                        <div class="event-list">
                            <div class="event-item">
                                <h3>Concierto de Rock 2025</h3>
                                <p>Próximo: 15 de Noviembre</p>
                                <span class="status-badge active">Activo</span>
                            </div>
                            <div class="event-item">
                                <h3>Festival de Jazz</h3>
                                <p>Próximo: 22 de Noviembre</p>
                                <span class="status-badge active">Activo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.afterRender()
        console.log('✅ Panel de Organizador cargado')
    }
}
