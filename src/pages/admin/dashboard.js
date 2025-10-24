import { NavBar } from '../../components/NavBar.js'
import { getUserInfo } from '../../services/auth.js'

export class AdminDashboardPage {
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
                    <h1>Panel de Administración</h1>
                    <p>Bienvenido, ${this.user.nombreCompleto}</p>
                </div>

                <div class="dashboard-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Total Usuarios</h3>
                            <p class="stat-number">1,234</p>
                        </div>
                        <div class="stat-card">
                            <h3>Eventos Activos</h3>
                            <p class="stat-number">45</p>
                        </div>
                        <div class="stat-card">
                            <h3>Organizadores</h3>
                            <p class="stat-number">89</p>
                        </div>
                        <div class="stat-card">
                            <h3>Ingresos del Mes</h3>
                            <p class="stat-number">$25,430</p>
                        </div>
                    </div>

                    <div class="admin-actions">
                        <h2>Acciones Rápidas</h2>
                        <div class="actions-grid">
                            <a href="/admin/usuarios" data-link class="action-card">
                                <h3>Gestionar Usuarios</h3>
                                <p>Ver, editar y administrar usuarios</p>
                            </a>
                            <a href="/admin/eventos" data-link class="action-card">
                                <h3>Gestionar Eventos</h3>
                                <p>Aprobar, editar y eliminar eventos</p>
                            </a>
                            <a href="/reportes" data-link class="action-card">
                                <h3>Ver Reportes</h3>
                                <p>Estadísticas y análisis detallados</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.afterRender()
        console.log('✅ Panel de Administración cargado')
    }
}
