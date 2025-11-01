import '../assets/css/components/Tikets.css'
import { NavBar } from '../components/NavBar.js'
import { ListAvailableTickets } from '../components/ListAvailableTickets.js'
import { TicketSelector } from '../components/TicketSelector.js'
import { Link } from '../router.js'
import { get, post } from '../utils/api.js'
import { isAuthenticated, getUserInfo } from '../services/auth.js'

export class EventDetailPage {
    constructor(params) {
        this.params = params
        this.eventId = params.id // ID del evento desde la URL
        this.navbar = new NavBar()
        this.ticketSelector = null // Instancia del TicketSelector
        this.ticketsList = null // Instancia de ListAvailableTickets

        this.state = {
            event: null,
            boletosDisponibles: [],
            estadisticasBoletos: {},
            loading: true,
            error: null,
            purchasing: false,
            selectedTickets: [] // Tickets seleccionados desde la lista
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

                    <!-- Sidebar de compra - Resumen de selección -->
                    <div class="event-purchase-card">
                        ${isAuth ? `
                            <div id="purchase-summary-container">
                                ${this.renderPurchaseSummary()}
                            </div>
                            <div id="purchase-message"></div>
                        ` : `
                            <div class="auth-required">
                                <p>Debes iniciar sesión para comprar boletos</p>
                                ${Link('/login', 'Iniciar Sesión', 'btn btn-primary btn-large')}
                            </div>
                        `}
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

        // Inicializar los componentes si el usuario está autenticado
        if (isAuthenticated()) {
            // Inicializar la lista de tickets
            if (this.ticketsList) {
                this.ticketsList.afterRender()
            }

            // Configurar el botón de compra
            this.setupPurchaseButtonFromSummary()
        }
    }

    async loadEvent() {

        // 1. Cargar datos del evento
        const { data, error } = await get(`/eventos/${this.eventId}`)

        if (error) {
            console.error('❌ Error al cargar evento:', error)
            this.updateState({ loading: false, error })
            return
        }


        // El backend puede devolver { success, data: { evento } } o directamente el evento
        const evento = data.evento || data

        // 2. Cargar boletos disponibles
        const { data: boletosData } = await get(`/boletos/evento/${this.eventId}/disponibles`)
        const boletosDisponibles = boletosData?.boletos || boletosData || []


        // 3. Cargar estadísticas de boletos (opcional)
        const { data: statsData } = await get(`/boletos/evento/${this.eventId}/estadisticas`)

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
        this.ticketsList = new ListAvailableTickets({
            eventoId: this.eventId,
            boletos: this.state.boletosDisponibles,
            onTicketSelect: (selectionData) => this.handleTicketSelection(selectionData)
        })

        return this.ticketsList.render()
    }

    /**
     * Maneja la selección de tickets desde ListAvailableTickets
     */
    handleTicketSelection(selectionData) {
        console.log('🎫 Ticket seleccionado:', selectionData)

        // Actualizar el estado con las selecciones actuales
        const allSelections = this.ticketsList.getSelectedTickets()
        this.updateState({ selectedTickets: allSelections })
    }

    /**
     * Renderiza el resumen de compra en el sidebar
     */
    renderPurchaseSummary() {
        const selectedTickets = this.state.selectedTickets || []

        if (selectedTickets.length === 0) {
            return `
                <div class="purchase-summary-empty">
                    <span class="summary-icon">🎟️</span>
                    <h4>Selecciona tus boletos</h4>
                    <p>Elige los tipos y cantidades de boletos que deseas comprar en la lista de abajo</p>
                </div>
            `
        }

        // Calcular totales
        const totalQuantity = selectedTickets.reduce((sum, ticket) => sum + ticket.cantidad, 0)
        const totalAmount = selectedTickets.reduce((sum, ticket) => sum + (ticket.precio * ticket.cantidad), 0)

        return `
            <div class="purchase-summary-content">
                <h4>Resumen de Compra</h4>

                <div class="summary-items">
                    ${selectedTickets.map(ticket => `
                        <div class="summary-item">
                            <div class="summary-item-info">
                                <span class="summary-item-type">${ticket.tipo}</span>
                                <span class="summary-item-qty">× ${ticket.cantidad}</span>
                            </div>
                            <span class="summary-item-price">$${(ticket.precio * ticket.cantidad).toLocaleString('es-MX')}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="summary-totals">
                    <div class="summary-total-row">
                        <span>Subtotal (${totalQuantity} boleto${totalQuantity > 1 ? 's' : ''}):</span>
                        <span class="summary-total-amount">$${totalAmount.toLocaleString('es-MX')}</span>
                    </div>
                    <div class="summary-total-row total">
                        <span>Total:</span>
                        <span class="summary-total-amount-final">$${totalAmount.toLocaleString('es-MX')}</span>
                    </div>
                </div>

                <button id="confirm-purchase-btn" class="btn btn-primary btn-large">
                    Confirmar Compra
                </button>
            </div>
        `
    }

    renderTicketSelector() {
        // Si no hay boletos, mostrar mensaje
        if (!this.state.boletosDisponibles || this.state.boletosDisponibles.length === 0) {
            return `
                <div class="no-tickets-available">
                    <span class="no-tickets-icon">🎫</span>
                    <p>No hay boletos disponibles para este evento</p>
                </div>
            `
        }

        // Crear instancia del TicketSelector con callback de compra
        this.ticketSelector = new TicketSelector({
            eventId: this.eventId,
            boletosDisponibles: this.state.boletosDisponibles,
            onPurchase: (purchaseData) => this.handleTicketPurchase(purchaseData)
        })

        return this.ticketSelector.render()
    }

    /**
     * Configura el botón de compra del resumen
     */
    setupPurchaseButtonFromSummary() {
        const purchaseBtn = document.getElementById('confirm-purchase-btn')
        if (!purchaseBtn) return

        purchaseBtn.addEventListener('click', async () => {
            await this.handlePurchaseFromSummary()
        })
    }

    /**
     * Maneja la compra desde el resumen (múltiples tipos de boletos)
     */
    async handlePurchaseFromSummary() {
        const selectedTickets = this.state.selectedTickets || []

        if (selectedTickets.length === 0) {
            alert('Por favor, selecciona al menos un boleto')
            return
        }

        const messageContainer = document.getElementById('purchase-message')
        const purchaseBtn = document.getElementById('confirm-purchase-btn')

        if (purchaseBtn) {
            purchaseBtn.disabled = true
            purchaseBtn.textContent = 'Procesando compra...'
        }

        try {
            const user = getUserInfo()

            // Recopilar todos los IDs de boletos según las selecciones
            const allBoletosIds = []

            for (const selection of selectedTickets) {
                const boletosDelTipo = this.state.boletosDisponibles
                    .filter(b => b.tipo === selection.tipo)
                    .slice(0, selection.cantidad)

                if (boletosDelTipo.length < selection.cantidad) {
                    throw new Error(`No hay suficientes boletos ${selection.tipo} disponibles`)
                }

                allBoletosIds.push(...boletosDelTipo.map(b => b.id))
            }

            // Calcular el total para mostrarlo al usuario (el backend también lo calculará)
            const totalAmount = selectedTickets.reduce(
                (sum, t) => sum + (t.precio * t.cantidad),
                0
            )

            // Crear la orden con el formato correcto del backend
            const { data, error } = await post('/ordenes', {
                usuarioId: user.id,
                boletoIds: allBoletosIds
            })

            if (error) {
                throw new Error(error)
            }

            const orden = data.orden || data
            console.log('✅ Orden creada:', orden)

            // Mostrar mensaje de éxito con detalles
            const ticketsSummary = selectedTickets
                .map(t => `${t.cantidad}× ${t.tipo}`)
                .join(', ')

            messageContainer.innerHTML = `
                <div class="alert alert-success">
                    ✅ ¡Compra exitosa!
                    <br><br>
                    <strong>Orden #${orden.id}</strong><br>
                    ${ticketsSummary}<br>
                    Total: $${totalAmount.toLocaleString('es-MX')}
                    <br><br>
                    ${Link('/mis-reservas', 'Ver mis boletos', 'btn btn-secondary')}
                </div>
            `

            // Recargar la página después de 3 segundos
            setTimeout(() => {
                window.location.reload()
            }, 3000)

        } catch (error) {
            console.error('❌ Error en la compra:', error)

            messageContainer.innerHTML = `
                <div class="alert alert-error">
                    ❌ Error al procesar la compra: ${error.message}
                </div>
            `

            // Rehabilitar el botón
            if (purchaseBtn) {
                purchaseBtn.disabled = false
                purchaseBtn.textContent = 'Confirmar Compra'
            }
        }
    }

    updateState(newState) {
        this.state = {
            ...this.state,
            ...newState
        }

        // Si se actualiza la selección de tickets, actualizar solo el resumen
        if (newState.selectedTickets !== undefined) {
            this.updatePurchaseSummary()
            return
        }

        // Re-renderizar solo el contenido (no toda la página)
        const container = document.getElementById('event-detail-container')
        if (container) {
            container.innerHTML = this.renderContent()

            // Re-setup event listeners después del re-render
            if (isAuthenticated()) {
                if (this.ticketsList) {
                    this.ticketsList.afterRender()
                }
                this.setupPurchaseButtonFromSummary()
            }
        }
    }

    /**
     * Actualiza solo el resumen de compra sin re-renderizar toda la página
     */
    updatePurchaseSummary() {
        const container = document.getElementById('purchase-summary-container')
        if (container) {
            container.innerHTML = this.renderPurchaseSummary()
            this.setupPurchaseButtonFromSummary()
        }
    }
}
