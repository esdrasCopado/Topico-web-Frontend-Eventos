import { Link } from '../router.js'
import { NavBar } from '../components/NavBar.js'
import { post } from '../utils/api.js'

export class LoginPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname,
            links: [
                { path: '/', text: 'Inicio' },
                { path: '/login', text: 'Iniciar Sesión' },
                { path: '/signup', text: 'Registrarse', class: 'btn-signup' }
            ]
        })
        this.state = {
            loading: false,
            error: null
        }
    }
    /**
     * Actualiza el estado y re-renderiza el componente
     */
    setState(newState, shouldRerender = true) {
        this.state = {
            ...this.state,
            ...newState
        }

    }

    /**
     * Autenticación de usuario
     */
    async fetchUserAuth(email, password) {
        console.log('🔐 Intentando autenticar usuario:', email)

        const { data, error, status } = await post('/usuarios/login', { email, password })

        if (error) {
            console.error('❌ Error en fetchUserAuth:', error)
            console.error('🔢 Status:', status)

            // Mensaje específico según el código de error
            let errorMessage = 'Error al iniciar sesión'

            if (status === 401) {
                errorMessage = 'Email o contraseña incorrectos'
            } else if (status === 404) {
                errorMessage = 'Usuario no encontrado'
            } else if (status === 500) {
                errorMessage = 'Error en el servidor. Intenta más tarde.'
            } else {
                errorMessage = error || 'Error desconocido'
            }

            return { success: false, error: errorMessage, status }
        }

        console.log('✅ Login exitoso, datos recibidos:', data)

        // La respuesta viene en formato: { success, message, data: { user, tokens } }
        // Extraer los datos correctamente
        const responseData = data.data || data
        const tokens = responseData.tokens || {}
        const user = responseData.user || {}

        // Guardar accessToken
        if (tokens.accessToken && typeof tokens.accessToken === 'string') {
            localStorage.setItem('authToken', tokens.accessToken)
            console.log('💾 Access Token guardado en localStorage')
        }

        // Guardar refresh token si existe
        if (tokens.refreshToken) {
            localStorage.setItem('refreshToken', tokens.refreshToken)
            console.log('💾 Refresh Token guardado en localStorage')
        }

        // Guardar información del usuario si existe
        if (user && Object.keys(user).length > 0) {
            localStorage.setItem('user', JSON.stringify(user))
            console.log('💾 Información del usuario guardada:', user)
        }

        // Opcional: guardar timestamp de login
        localStorage.setItem('loginTimestamp', Date.now().toString())

        return { success: true, data: responseData }
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div class="auth-card">
                    <h1>Iniciar Sesión</h1>

                    <!-- Contenedor para mensajes de error -->
                    <div id="error-container"></div>

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
        const errorContainer = document.getElementById('error-container')
        const submitButton = form.querySelector('button[type="submit"]')

        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const formData = new FormData(form)
            const email = formData.get('email')
            const password = formData.get('password')

            // Limpiar errores previos
            errorContainer.innerHTML = ''

            // Deshabilitar botón y mostrar loading
            submitButton.disabled = true
            submitButton.textContent = 'Iniciando sesión...'

            this.setState({ loading: true, error: null }, false)

            const result = await this.fetchUserAuth(email, password)

            if (result.success) {
                // Mostrar mensaje de éxito
                errorContainer.innerHTML = `
                    <div style="padding: 12px; background: #d4edda; color: #155724; border-radius: 4px; margin-bottom: 16px;">
                        ✅ Login exitoso. Redirigiendo...
                    </div>
                `

                // Redirigir a la página principal después de un breve delay
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            } else {
                // Mostrar error
                errorContainer.innerHTML = `
                    <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-bottom: 16px;">
                        ❌ ${result.error}
                    </div>
                `

                // Rehabilitar botón
                submitButton.disabled = false
                submitButton.textContent = 'Iniciar Sesión'

                this.setState({
                    loading: false,
                    error: result.error
                }, false)
            }
        })
    }
}
