import { Link } from '../router.js'
import { NavBar } from '../components/NavBar.js'
import { post, get } from '../utils/api.js'

export class SignUpPage {
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
     * Verificar si el email ya existe
     */
    async checkEmailAvailability(email) {
        console.log('📧 Verificando disponibilidad de email:', email)

        const { data, error } = await get(`/usuarios/check-email/${encodeURIComponent(email)}`)

        if (error) {
            console.error('❌ Error al verificar email:', error)
            return { disponible: true } // Asumimos que está disponible si hay error
        }

        console.log('✅ Resultado de verificación:', data)

        // El backend puede devolver { disponible: true/false } o { exists: true/false }
        return {
            disponible: data.disponible !== false && data.exists !== true
        }
    }

    /**
     * Registrar nuevo usuario
     */
    async fetchUserRegistration(userData) {
        console.log('📝 Registrando usuario:', userData)

        const { data, error, status } = await post('/usuarios', {
            nombre: userData.nombre,
            apellidos: userData.apellidos,
            email: userData.email,
            password: userData.password,
            telefono: userData.telefono,
            rol: 'USER' // Rol por defecto
        })

        if (error) {
            console.error('❌ Error en fetchUserRegistration:', error)
            console.error('🔢 Status:', status)

            // Mensaje específico según el código de error
            let errorMessage = 'Error al registrar usuario'

            if (status === 400) {
                errorMessage = 'Datos inválidos. Verifica la información.'
            } else if (status === 409) {
                errorMessage = 'El email ya está registrado'
            } else if (status === 500) {
                errorMessage = 'Error en el servidor. Intenta más tarde.'
            } else {
                errorMessage = error || 'Error desconocido'
            }

            return { success: false, error: errorMessage, status }
        }

        console.log('✅ Usuario registrado exitosamente:', data)

        return { success: true, data }
    }

    render() {
        return `
        
                ${this.navbar.render()}
            <div class="page-container">
                <div class="auth-card">
                    <h1>Crear Cuenta</h1>

                    <!-- Contenedor para mensajes de error/éxito -->
                    <div id="message-container"></div>

                    <form id="signup-form" class="auth-form">
                        <div class="form-group">
                            <label for="name">Nombre </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Tu nombre"
                                required
                            />
                        </div>
                         <div class="form-group">
                            <label for="last-name">Apellido</label>
                            <input
                                type="text"
                                id="last-name"
                                name="last-name"
                                placeholder="Tu apellido"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="phone">Telefono</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Tu telefono"
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
        this.navbar.afterRender()

        const form = document.getElementById('signup-form')
        const messageContainer = document.getElementById('message-container')
        const submitButton = form.querySelector('button[type="submit"]')
        const emailInput = document.getElementById('email')

        // Validación de email en tiempo real (opcional)
        let emailCheckTimeout
        emailInput.addEventListener('blur', async () => {
            const email = emailInput.value.trim()

            if (!email || !email.includes('@')) return

            clearTimeout(emailCheckTimeout)
            emailCheckTimeout = setTimeout(async () => {
                const result = await this.checkEmailAvailability(email)

                if (!result.disponible) {
                    messageContainer.innerHTML = `
                        <div style="padding: 12px; background: #fff8c5; color: #9a6700; border-radius: 4px; margin-bottom: 16px;">
                            ⚠️ Este email ya está registrado
                        </div>
                    `
                } else {
                    messageContainer.innerHTML = ''
                }
            }, 500)
        })

        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const formData = new FormData(form)
            const userData = {
                nombre: formData.get('name'),
                apellidos: formData.get('last-name'),
                telefono: formData.get('phone'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirm-password')
            }

            // Limpiar mensajes previos
            messageContainer.innerHTML = ''

            // Validaciones
            if (!userData.nombre || !userData.apellidos || !userData.email || !userData.password) {
                messageContainer.innerHTML = `
                    <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-bottom: 16px;">
                        ❌ Todos los campos son obligatorios
                    </div>
                `
                return
            }

            if (userData.password !== userData.confirmPassword) {
                messageContainer.innerHTML = `
                    <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-bottom: 16px;">
                        ❌ Las contraseñas no coinciden
                    </div>
                `
                return
            }

            if (userData.password.length < 6) {
                messageContainer.innerHTML = `
                    <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-bottom: 16px;">
                        ❌ La contraseña debe tener al menos 6 caracteres
                    </div>
                `
                return
            }

            // Deshabilitar botón y mostrar loading
            submitButton.disabled = true
            submitButton.textContent = 'Registrando...'
            this.state.loading = true

            console.log('📝 Registrando usuario:', userData)

            // Verificar disponibilidad del email
            const emailCheck = await this.checkEmailAvailability(userData.email)

            if (!emailCheck.disponible) {
                messageContainer.innerHTML = `
                    <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-bottom: 16px;">
                        ❌ El email ya está registrado.
                        ${Link('/login', 'Inicia sesión', 'link')}
                    </div>
                `
                submitButton.disabled = false
                submitButton.textContent = 'Registrarse'
                this.state.loading = false
                return
            }

            // Registrar usuario
            const result = await this.fetchUserRegistration(userData)

            if (result.success) {
                messageContainer.innerHTML = `
                    <div style="padding: 12px; background: #d4edda; color: #155724; border-radius: 4px; margin-bottom: 16px;">
                        ✅ ¡Registro exitoso! Redirigiendo al login...
                    </div>
                `

                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/login'
                }, 2000)
            } else {
                messageContainer.innerHTML = `
                    <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-bottom: 16px;">
                        ❌ ${result.error}
                    </div>
                `

                submitButton.disabled = false
                submitButton.textContent = 'Registrarse'
                this.state.loading = false
            }
        })
    }
}
