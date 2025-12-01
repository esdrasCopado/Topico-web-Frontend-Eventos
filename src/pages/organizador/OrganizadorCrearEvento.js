import { NavBar } from '../../components/NavBar.js'
import { getUserInfo } from '../../services/auth.js'
import { postFormData } from '../../utils/api.js'
import { ImageDrop } from '../../components/ImageDrop.js'

export class OrganizadorCrearEventoPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar()
        this.user = getUserInfo()
        this.imageDrop = null // Instancia del ImageDrop

        this.state = {
            submitting: false,
            error: null,
            success: false
        }
    }

    renderCreateEventForm(){
        return `
            <form id="create-event-form" class="create-event-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="event-name">
                            Nombre del Evento <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="event-name"
                            name="nombre"
                            placeholder="Ej: Corona Capital 2025 - Capítulo XV"
                            required
                            maxlength="200"
                        />
                        <small class="form-hint">Máximo 200 caracteres</small>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="event-date">
                            Fecha y Hora del Evento <span class="required">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="event-date"
                            name="fecha"
                            required
                        />
                        <small class="form-hint">Selecciona la fecha y hora de inicio del evento</small>
                    </div>

                    <div class="form-group">
                        <label for="event-location">
                            Ubicación <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="event-location"
                            name="ubicacion"
                            placeholder="Ej: Autódromo Hermanos Rodríguez, Ciudad de México"
                            required
                            maxlength="300"
                        />
                        <small class="form-hint">Dirección completa del evento</small>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group full-width">
                        <label for="event-description">
                            Descripción <span class="required">*</span>
                        </label>
                        <textarea
                            id="event-description"
                            name="descripcion"
                            rows="6"
                            placeholder="Describe tu evento: qué incluye, qué pueden esperar los asistentes, artistas o actividades destacadas..."
                            required
                            maxlength="2000"
                        ></textarea>
                        <small class="form-hint">Máximo 2000 caracteres. Sé descriptivo y detallado.</small>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group full-width">
                        <label for="event-image">
                            Imagen del Evento
                        </label>
                        <div id="event-image-container"></div>
                        <small class="form-hint">Sube una imagen atractiva para tu evento (opcional, máx. 5MB)</small>
                    </div>
                </div>

                <div id="form-message" class="form-message"></div>

                <div class="form-actions">
                    <button
                        type="button"
                        id="cancel-btn"
                        class="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        id="submit-btn"
                        class="btn btn-primary"
                        ${this.state.submitting ? 'disabled' : ''}
                    >
                        ${this.state.submitting ? 'Creando...' : 'Crear Evento'}
                    </button>
                </div>
            </form>
        `
    }
    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div class="dashboard-header">
                    <h1>Panel de Organizador - Crear Evento</h1>
                    <p>Bienvenido, ${this.user.nombreCompleto}</p>
                </div>

                <div class="dashboard-content">

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
                    <div class="create-event-section">
                        <h2>Crear Nuevo Evento</h2>
                        ${this.renderCreateEventForm()}
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.afterRender()
        this.setupImageDrop()
        this.setupFormHandlers()
    }

    setupImageDrop() {
        // Crear instancia del ImageDrop
        this.imageDrop = new ImageDrop({
            maxSize: 5, // 5MB máximo
            acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
            placeholder: 'Arrastra la imagen del evento aquí o haz clic para seleccionar',
            onFileSelect: (file) => {
                if (file) {
                    console.log(' Imagen seleccionada:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`)
                } else {
                    console.log(' Imagen eliminada')
                }
            },
            onError: (error) => {
                this.showMessage(error.message, 'error')
            }
        })

        // Renderizar el ImageDrop en el contenedor
        const container = document.getElementById('event-image-container')
        if (container) {
            container.appendChild(this.imageDrop.render())
        }
    }

    setupFormHandlers() {
        const form = document.getElementById('create-event-form')
        const cancelBtn = document.getElementById('cancel-btn')

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e))
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas cancelar? Se perderán todos los datos ingresados.')) {
                    window.history.back()
                }
            })
        }
    }

    async handleSubmit(event) {
        event.preventDefault()

        if (this.state.submitting) return

        const form = event.target
        const formData = new FormData(form)

        // Extraer datos del formulario
        const nombre = formData.get('nombre')
        const fecha = formData.get('fecha')
        const ubicacion = formData.get('ubicacion')
        const descripcion = formData.get('descripcion')

        // Validaciones básicas
        if (!nombre || !fecha || !ubicacion || !descripcion) {
            this.showMessage('Por favor completa todos los campos obligatorios', 'error')
            return
        }

        // Validar que la fecha sea futura
        const eventDate = new Date(fecha)
        const now = new Date()
        if (eventDate <= now) {
            this.showMessage('La fecha del evento debe ser futura', 'error')
            return
        }

        // Convertir fecha a formato ISO con zona horaria
        const fechaISO = new Date(fecha).toISOString()

        // Validar que el usuario tenga organizadorId
        if (!this.user.organizadorId) {
            this.showMessage('Error: No tienes permisos de organizador. Por favor, contacta al administrador.', 'error')
            console.error('❌ Usuario sin organizadorId:', this.user)
            this.updateState({ submitting: false })
            return
        }

        // Crear FormData para enviar con imagen
        const submitFormData = new FormData()
        submitFormData.append('nombre', nombre.trim())
        submitFormData.append('descripcion', descripcion.trim())
        submitFormData.append('fecha', fechaISO)
        submitFormData.append('ubicacion', ubicacion.trim())

        // Convertir organizadorId a número explícitamente
        const organizadorIdNumero = parseInt(this.user.organizadorId, 10)
        submitFormData.append('organizadorId', organizadorIdNumero)

        // Agregar imagen si existe
        const imageFile = this.imageDrop?.getFile()
        if (imageFile) {
            submitFormData.append('imagen', imageFile)
            console.log('📷 Imagen incluida:', imageFile.name)
        } else {
            console.log('📷 Sin imagen')
        }

        console.log('📝 Enviando evento...')
        console.log('👤 OrganizadorId (original):', this.user.organizadorId, typeof this.user.organizadorId)
        console.log('👤 OrganizadorId (convertido):', organizadorIdNumero, typeof organizadorIdNumero)

        // Debug: mostrar todos los campos del FormData
        console.log('📦 FormData completo:')
        for (let [key, value] of submitFormData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: [File] ${value.name}`)
            } else {
                console.log(`  ${key}: ${value} (${typeof value})`)
            }
        }

        // Actualizar estado a submitting
        this.updateState({ submitting: true, error: null })

        // Enviar al backend usando postFormData
        const { data, error } = await postFormData('/eventos', submitFormData)

        if (error) {
            console.error('❌ Error al crear evento:', error)
            this.updateState({ submitting: false, error })
            this.showMessage(`Error al crear evento: ${error}`, 'error')
            return
        }

        console.log('✅ Evento creado exitosamente:', data)

        // Mostrar mensaje de éxito
        this.updateState({ submitting: false, success: true })
        this.showMessage('¡Evento creado exitosamente!', 'success')

        // Limpiar formulario e imagen
        form.reset()
        this.imageDrop?.reset()

        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = '/organizador'
        }, 2000)
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('form-message')
        if (!messageContainer) return

        messageContainer.className = `form-message ${type}`
        messageContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${type === 'success' ? '✅' : '❌'} ${message}
            </div>
        `

        // Auto-ocultar mensajes de error después de 5 segundos
        if (type === 'error') {
            setTimeout(() => {
                messageContainer.innerHTML = ''
            }, 5000)
        }
    }

    updateState(newState) {
        this.state = {
            ...this.state,
            ...newState
        }

        // Re-renderizar solo el botón de submit
        const submitBtn = document.getElementById('submit-btn')
        if (submitBtn) {
            submitBtn.disabled = this.state.submitting
            submitBtn.textContent = this.state.submitting ? 'Creando...' : 'Crear Evento'
        }
    }
}
