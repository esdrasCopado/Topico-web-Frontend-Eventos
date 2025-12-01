import { NavBar } from '../../components/NavBar.js'
import { getUserInfo } from '../../services/auth.js'
import { getEventsOrganizador } from '../../components/getEventsOrganizador.js'

export class OrganizadorDashboardPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar()
        this.user = getUserInfo()
        this.eventsSelector = new getEventsOrganizador()
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
                            <a href="/admin/artistas" data-link class="action-card">
                                <h3>Gestionar Artistas</h3>
                                <p>Ver, editar y administrar artistas</p>
                            </a>
                        </div>
                    </div>

                    <div class="my-events-section">
                        <h2>Mis Eventos</h2>
                        ${this.eventsSelector.render()}
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.afterRender()
        this.eventsSelector.afterRender()
        console.log('✅ Panel de Organizador cargado')
    }
}
