import { Link } from '../router.js'
import { NavBar } from '../components/NavBar.js'
import { post } from '../utils/api.js'

export class SignUpPage {
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

    /**
     * Actualiza el estado y re-renderiza el componente
     */
    setState(newState, shouldRerender = true) {
        this.state= {
            ...this.state,
            ...newState
        }
        
    }

    /**
     * Autenticación de usuario
     */
    async fetchUserAuth() {
        const { data, error } = await post('/usuarios/login')

        if (error) {
            console.error('Error en fetchUserAuth:', error)
            return
        }
    }


    render() {
        return `
            <div class="page-container">
                ${this.navbar.render()}
                <div class="auth-card">
                    <h1>Crear Cuenta</h1>
                    <form id="signup-form" class="auth-form">
                        <div class="form-group">
                            <label for="name">Nombre completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

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
                                minlength="6"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="confirm-password">Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirm-password"
                                placeholder="••••••••"
                                minlength="6"
                                required
                            />
                        </div>

                        <button type="submit" class="btn btn-primary">
                            Registrarse
                        </button>
                    </form>

                    <p class="auth-link">
                        ¿Ya tienes cuenta?
                        ${Link('/login', 'Inicia sesión aquí', 'link')}
                    </p>

                    <p class="auth-link">
                        ${Link('/', 'Volver al inicio', 'link')}
                    </p>
                </div>
            </div>
        `
    }

    afterRender() {
        const form = document.getElementById('signup-form')

        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const formData = new FormData(form)
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirm-password')
            }

            // Validar contraseñas
            if (data.password !== data.confirmPassword) {
                alert('Las contraseñas no coinciden')
                return
            }

            console.log('SignUp data:', data)
            alert(`Registro exitoso: ${data.name}`)

            // Aquí harías la llamada a tu API
            // y luego navegarías al login o directamente a la app
        })
    }
}
