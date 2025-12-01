import { NavBar } from '../components/NavBar.js'
export class ConfigurationPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar()
    }
    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div class="configuration-header">
                    <h1>Configuración de la Cuenta</h1>
                    <p>Gestiona tus preferencias y ajustes de cuenta</p>
                </div>
                <div class="configuration-content">
                    <div class="config-section">
                        <h2>Preferencias de Tema</h2>
                        <button onclick="window.toggleTheme()" id="theme-toggle-btn" class="theme-toggle-btn">Cambiar Tema</button>
                    </div>
                    <div class="config-section">
                        <h2>Notificaciones</h2>
                        <label>
                            <input type="checkbox" id="email-notifications" checked>
                            Recibir notificaciones por correo electrónico
                        </label>
                    </div>
                    <div class="config-section">
                        <h2>Seguridad</h2>
                        <button id="change-password-btn" class="change-password-btn">Cambiar Contraseña</button>
                    </div>
                </div>
            </div>
        `
    }
}