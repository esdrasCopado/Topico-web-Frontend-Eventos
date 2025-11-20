import '../assets/css/components/getEventsOrganizador.css'
import { getUserInfo } from '../services/auth.js'
import { get } from '../utils/api.js'
import { Icons } from '../utils/icons.js'

export class getEventsOrganizador {
    constructor() {
        this.events = []
        this.loading = true
        this.error = null
        this.user = getUserInfo()
    }

    // Obtiene los eventos del organizador desde el backend
    async fetchEvents() {
        try {
            this.loading = true
            this.error = null

            // Según BACKEND-ENDPOINTS.md línea 358
            // Usar organizadorId si existe, sino usar el id del usuario
            const organizadorId = this.user?.organizadorId || this.user?.id

            if (!organizadorId) {
                throw new Error('No se encontró el ID del organizador')
            }

            console.log('📡 Obteniendo eventos para organizadorId:', organizadorId)

            // La función get() de api.js devuelve { data, error }
            const { data, error } = await get(`/eventos/organizador/${organizadorId}`)

            if (error) {
                throw new Error(error)
            }

            // data ya viene procesado por api.js (línea 53)
            this.events = Array.isArray(data) ? data : []
            this.loading = false

            console.log('✅ Eventos obtenidos:', this.events.length)

            return this.events

        } catch (error) {
            console.error('❌ Error fetching events:', error)
            this.error = error.message
            this.loading = false
            throw error
        }
    }

    // Renderiza cada evento como una tarjeta clickeable
    renderEventCard(event) {
        return `
            <div class="event-card-selector" data-event-id="${event.id}">
                <div class="event-card-header">
                    <h3 class="event-card-title">${event.nombre || 'Sin nombre'}</h3>
                    <span class="event-card-date">
                        ${Icons.calendar}
                        ${new Date(event.fecha).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                <div class="event-card-body">
                    <p class="event-card-description">${event.descripcion || 'Sin descripción'}</p>
                    <div class="event-card-stats">
                        <div class="stat">
                            <span class="stat-icon">${Icons.tickets.general}</span>
                            <span class="stat-label">Boletos vendidos:</span>
                            <span class="stat-value">${event.boletos_vendidos || 0}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-icon">${Icons.price}</span>
                            <span class="stat-label">Ingresos:</span>
                            <span class="stat-value">$${parseFloat(event.ingresos || 0).toLocaleString('es-MX')}</span>
                        </div>
                    </div>
                </div>
                <div class="event-card-footer">
                    <a href="/organizador/crear-boletos/${event.id}" data-link class="btn btn-primary">
                        ${Icons.tickets.general}
                        Crear Boletos para este Evento
                    </a>
                </div>
            </div>
        `
    }

    // Renderiza la lista completa de eventos
    renderEvents() {
        if (this.loading) {
            return `
                <div class="loading-state">
                    <p>Cargando eventos...</p>
                </div>
            `
        }

        if (this.error) {
            return `
                <div class="error-state">
                    <p>${Icons.warning} Error: ${this.error}</p>
                    <button id="retry-fetch-events" class="btn btn-secondary">
                        Reintentar
                    </button>
                </div>
            `
        }

        if (this.events.length === 0) {
            return `
                <div class="empty-state">
                    <h3>No tienes eventos creados aún</h3>
                    <p>Crea tu primer evento para poder generar boletos.</p>
                    <a href="/organizador/crear-evento" data-link class="btn btn-primary">
                        Crear Nuevo Evento
                    </a>
                </div>
            `
        }

        return `
            <div class="events-selector-grid">
                ${this.events.map(event => this.renderEventCard(event)).join('')}
            </div>
        `
    }

    render() {
        return `
            <div class="events-organizer-selector">
                <div class="selector-header">
                    <h2>Selecciona un Evento</h2>
                    <p>Elige el evento para el cual deseas crear boletos</p>
                </div>
                ${this.renderEvents()}
            </div>
        `
    }

    // Adjunta event listeners después de renderizar
    attachEventListeners() {
        // Botón de reintentar en caso de error
        const retryBtn = document.getElementById('retry-fetch-events')
        if (retryBtn) {
            retryBtn.addEventListener('click', async () => {
                await this.fetchEvents()
                this.updateView()
            })
        }
    }

    // Actualiza la vista sin recargar toda la página
    updateView() {
        const container = document.querySelector('.events-organizer-selector')
        if (container) {
            container.innerHTML = this.render()
            this.attachEventListeners()
        }
    }

    // Método llamado después de que el DOM esté listo
    async afterRender() {
        await this.fetchEvents()
        this.updateView()
        this.attachEventListeners()
    }
}