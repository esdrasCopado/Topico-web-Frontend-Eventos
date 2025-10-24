import { Link } from '../router.js'
import { NavBar } from '../components/NavBar.js'

export class LoginPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Mi App',
            currentPath: window.location.pathname,
            links: [
                { path: '/', text: 'Inicio' },
                { path: '/login', text: 'Iniciar Sesión' },
                { path: '/signup', text: 'Registrarse', class: 'btn-signup' }
            ]
        })
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div class="auth-card">
                    <h1>Iniciar Sesión</h1>
                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" class="btn btn-primary">
                            Iniciar Sesión
                        </button>
                    </form>

                    <p class="auth-link">
                        ¿No tienes cuenta?
                        ${Link('/signup', 'Regístrate aquí', 'link')}
                    </p>

                    <p class="auth-link">
                        ${Link('/', 'Volver al inicio', 'link')}
                    </p>
                </div>
            </div>
        `
    }

    // Similar a useEffect en React
    afterRender() {
        const form = document.getElementById('login-form')

        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const formData = new FormData(form)
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            }

            console.log('Login data:', data)
            alert(`Login con: ${data.email}`)

            // Aquí harías la llamada a tu API
            // y luego navegarías a la página principal
        })
    }
}
