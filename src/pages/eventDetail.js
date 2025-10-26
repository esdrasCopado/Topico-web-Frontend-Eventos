import { NavBar } from '../components/NavBar.js'
import { ListAvailableTickets } from '../components/ListAvailableTickets.js'
import { Link } from '../router.js'
import { get, post } from '../utils/api.js'
import { isAuthenticated, getUserInfo } from '../services/auth.js'

export class EventDetailPage {
    constructor(params) {
        this.params = params
        this.eventId = params.id // ID del evento desde la URL
        this.navbar = new NavBar()

        this.state = {
            event: null,
            boletosDisponibles: [],
            estadisticasBoletos: {},
            loading: true,
            error: null,
            purchasing: false
        }
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div id="event-detail-container">
                    ${this.renderContent()}
                </div>
            </div>
        `
    }

    renderContent() {
        if (this.state.loading) {
            return this.renderLoading()
        }

        if (this.state.error) {
            return this.renderError()
        }

        if (!this.state.event) {
            return this.renderNotFound()
        }

        return this.renderEvent()
    }

    renderLoading() {
        return `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Cargando evento...</p>
            </div>
        `
    }

    renderError() {
        return `
            <div class="error-container">
                <h2>Error al cargar el evento</h2>
                <p>${this.state.error}</p>
                ${Link('/', 'Volver al inicio', 'btn btn-primary')}
            </div>
        `
    }

    renderNotFound() {
        return `
            <div class="error-container">
                <h1>404</h1>
                <h2>Evento no encontrado</h2>
                <p>El evento que buscas no existe o ha sido eliminado.</p>
                ${Link('/', 'Volver al inicio', 'btn btn-primary')}
            </div>
        `
    }

    renderEvent() {
        const event = this.state.event
        const isAuth = isAuthenticated()

        // Formatear fecha
        const eventDate = new Date(event.fecha)
        const formattedDate = eventDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        return `
            <div class="event-detail">
                <!-- Breadcrumb -->
                <nav class="breadcrumb">
                    ${Link('/', 'Inicio')} / ${Link('/eventos', 'Eventos')} / ${event.nombre}
                </nav>

                <!-- Hero del evento -->
                <div class="event-hero">
                    <div class="event-hero-content">
                        <h1>${event.nombre}</h1>
                        <p class="event-subtitle">${event.descripcion}</p>

                        <div class="event-meta">
                            <span class="meta-item">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2.5zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z"/>
                                </svg>
                                ${formattedDate}
                            </span>
                            <span class="meta-item">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"/>
                                </svg>
                                ${event.ubicacion}
                            </span>
                        </div>
                    </div>

                    <!-- Sidebar de compra -->
                    <div class="event-purchase-card">
                        <div class="price-section">
                            ${event.precio > 0 ? `
                                <div class="price">
                                    <span class="price-label">Precio</span>
                                    <span class="price-amount">$${event.precio.toLocaleString('es-MX')}</span>
                                </div>
                            ` : `
                                <div class="price-free">
                                    <span class="price-amount">Gratis</span>
                                </div>
                            `}

                            <div class="availability">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75z"/>
                                </svg>
                                <span class="${this.state.boletosDisponibles?.length < 10 ? 'low-availability' : ''}">
                                    ${this.state.boletosDisponibles?.length || 0} boletos disponibles
                                </span>
                            </div>
                           <!-- se activara cuando se haya seleccionado un boleto 
                            <div class="ticket-number">
                                <a class="btn btn-secondary btn-small">-</a>
                                <span>1</span>
                                <a class="btn btn-secondary btn-small">+</a>
                            </div>
                            -->
                        </div>
                        ${isAuth ? `
                            <button id="purchase-btn" class="btn btn-primary btn-large" ${!this.state.boletosDisponibles || this.state.boletosDisponibles.length === 0 ? 'disabled' : ''}>
                                ${!this.state.boletosDisponibles || this.state.boletosDisponibles.length === 0 ? 'Agotado' : 'Comprar Boleto'}
                            </button>
                        ` : `
                            <div class="auth-required">
                                <p>Debes iniciar sesión para comprar boletos</p>
                                ${Link('/login', 'Iniciar Sesión', 'btn btn-primary btn-large')}
                            </div>
                        `}

                        <div id="purchase-message"></div>
                    </div>
                </div>

                <!-- Detalles completos -->
                <div class="event-details-full">
                    <section class="Tickets-section">
                        <h2>Boletos disponibles</h2>
                        <div id="available-tickets">
                            ${this.renderTicketsList()}
                        </div>
                    </section>
                    <section class="detail-section">
                        <h2>Descripción del evento</h2>
                        <p>${event.descripcion}</p>
                    </section>

                    <section class="detail-section">
                        <h2>Información adicional</h2>
                        <dl class="info-list">
                            <dt>Categoría</dt>
                            <dd>${event.categoria || 'Sin categoría'}</dd>

                            <dt>Organizador</dt>
                            <dd>Organizador #${event.organizador_id}</dd>

                            <dt>Cupo total</dt>
                            <dd>${event.cupo_disponible} personas</dd>

                            <dt>Estado</dt>
                            <dd>
                                <span class="status-badge ${event.cupo_disponible > 0 ? 'active' : 'sold-out'}">
                                    ${event.cupo_disponible > 0 ? 'Disponible' : 'Agotado'}
                                </span>
                            </dd>
                        </dl>
                    </section>

                    <section class="detail-section">
                        <h2>Ubicación</h2>
                        <div class="location-card">
                            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                            <div>
                                <strong>${event.ubicacion}</strong>
                                <p>Consulta el mapa para más detalles</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `
    }

    async afterRender() {
        this.navbar.afterRender()

        // Cargar datos del evento
        await this.loadEvent()

        // Setup del botón de compra
        if (isAuthenticated()) {
            this.setupPurchaseButton()
        }
    }

    async loadEvent() {
        console.log('📥 Cargando evento ID:', this.eventId)

        // 1. Cargar datos del evento
        const { data, error } = await get(`/eventos/${this.eventId}`)

        if (error) {
            console.error('❌ Error al cargar evento:', error)
            this.updateState({ loading: false, error })
            return
        }

        console.log('✅ Evento cargado:', data)

        // El backend puede devolver { success, data: { evento } } o directamente el evento
        const evento = data.evento || data

        // 2. Cargar boletos disponibles
        const { data: boletosData } = await get(`/boletos/evento/${this.eventId}/disponibles`)
        const boletosDisponibles = boletosData?.boletos || boletosData || []

        console.log('🎫 Boletos disponibles:', boletosDisponibles.length)
        console.log('🎫 Datos completos de boletos:', boletosDisponibles)

        // 3. Cargar estadísticas de boletos (opcional)
        const { data: statsData } = await get(`/boletos/evento/${this.eventId}/estadisticas`)
        console.log('📊 Estadísticas de boletos:', statsData)

        this.updateState({
            event: evento,
            boletosDisponibles: boletosDisponibles,
            estadisticasBoletos: statsData || {},
            loading: false,
            error: null
        })
    }

    setupPurchaseButton() {
        const purchaseBtn = document.getElementById('purchase-btn')
        if (!purchaseBtn) return

        purchaseBtn.addEventListener('click', async () => {
            await this.purchaseTicket()
        })
    }

    async purchaseTicket() {
        if (this.state.purchasing) return

        const messageContainer = document.getElementById('purchase-message')
        const purchaseBtn = document.getElementById('purchase-btn')

        this.updateState({ purchasing: true })
        purchaseBtn.disabled = true
        purchaseBtn.textContent = 'Procesando...'

        console.log('🎫 Comprando boleto para evento:', this.eventId)

        const user = getUserInfo()

        // Verificar que haya boletos disponibles
        if (!this.state.boletosDisponibles || this.state.boletosDisponibles.length === 0) {
            messageContainer.innerHTML = `
                <div class="alert alert-error">
                    ❌ No hay boletos disponibles para este evento
                </div>
            `
            purchaseBtn.disabled = false
            purchaseBtn.textContent = 'Comprar Boleto'
            this.updateState({ purchasing: false })
            return
        }

        // Tomar el primer boleto disponible
        const boleto = this.state.boletosDisponibles[0]
        console.log('Usuario info:', user.id)
        // Crear orden de compra
        const { data, error } = await post('/ordenes', {
            usuario_id: user.id,
            boletos_ids: [boleto.id],
            cantidad_boletos: 1,
            total: this.state.event.precio || 0,
            metodo_pago: 'tarjeta' // Ajusta según tu backend
        })

        if (error) {
            console.error('❌ Error al crear orden:', error)

            messageContainer.innerHTML = `
                <div class="alert alert-error">
                    ❌ Error al procesar la compra: ${error}
                </div>
            `

            purchaseBtn.disabled = false
            purchaseBtn.textContent = 'Comprar Boleto'
            this.updateState({ purchasing: false })
            return
        }

        console.log('✅ Orden creada exitosamente:', data)

        const orden = data.orden || data

        // Si la orden requiere pago, procesarlo
        if (orden.estado === 'pendiente' && orden.id) {
            console.log('💳 Procesando pago de orden:', orden.id)

            const { data: pagoData, error: pagoError } = await post(`/ordenes/${orden.id}/pagar`, {
                metodo_pago: 'tarjeta',
                datos_pago: {
                    // Aquí irían los datos de pago reales
                    // Por ahora lo dejamos vacío para pruebas
                }
            })

            if (pagoError) {
                console.error('❌ Error al procesar pago:', pagoError)

                messageContainer.innerHTML = `
                    <div class="alert alert-error">
                        ❌ Error al procesar el pago: ${pagoError}
                        <br>
                        ${Link('/ordenes', 'Ver mis órdenes', 'btn btn-secondary')}
                    </div>
                `

                purchaseBtn.disabled = false
                purchaseBtn.textContent = 'Comprar Boleto'
                this.updateState({ purchasing: false })
                return
            }

            console.log('✅ Pago procesado exitosamente:', pagoData)
        }

        messageContainer.innerHTML = `
            <div class="alert alert-success">
                ✅ ¡Boleto comprado exitosamente!
                <br>
                Orden #${orden.id}
                <br>
                ${Link('/ordenes', 'Ver mis órdenes', 'btn btn-secondary')}
            </div>
        `

        this.updateState({ purchasing: false })

        // Recargar boletos disponibles
        setTimeout(() => {
            window.location.reload()
        }, 2000)
    }

    renderTicketsList() {
        // Crear una instancia del componente pasando todos los boletos y el ID del evento
        const ticketsList = new ListAvailableTickets({
            eventoId: this.eventId,
            boletos: this.state.boletosDisponibles
        })

        return ticketsList.render()
    }

    updateState(newState) {
        this.state = {
            ...this.state,
            ...newState
        }

        // Re-renderizar solo el contenido (no toda la página)
        const container = document.getElementById('event-detail-container')
        if (container) {
            container.innerHTML = this.renderContent()

            // Re-setup event listeners después del re-render
            if (isAuthenticated()) {
                this.setupPurchaseButton()
            }
        }
    }
}
