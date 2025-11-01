import { Icons } from '../utils/icons.js'

export class ListAvailableTickets {
    constructor(params) {
        this.eventoId = params.eventoId
        this.boletos = params.boletos || []
        this.onTicketSelect = params.onTicketSelect || null // Callback cuando se selecciona un ticket

        // Estado interno para cantidades seleccionadas
        this.selectedQuantities = {}
        // Estado para rastrear qué tickets están activos/expandidos
        this.activeTickets = new Set()
        // Flag para evitar adjuntar listeners múltiples veces
        this.listenersAttached = false
    }

    // Configuración de cada tipo de boleto
    // Normaliza las claves a mayúsculas para consistencia con el backend
    getTicketConfig() {
        return {
            'VIP': {
                title: 'Boleto VIP',
                description: 'Acceso exclusivo a áreas VIP, bebidas premium y más.',
                icon: Icons.tickets.vip
            },
            'GENERAL': {
                title: 'Boleto General',
                description: 'Acceso general al evento con todas las comodidades básicas.',
                icon: Icons.tickets.general
            },
            'PLATINO': {
                title: 'Boleto Platino',
                description: 'Experiencia premium con asientos preferenciales y servicios exclusivos.',
                icon: Icons.tickets.platino
            },
            'ORO': {
                title: 'Boleto Oro',
                description: 'Acceso a áreas exclusivas y servicios premium.',
                icon: Icons.tickets.oro
            }
        }
    }

    renderTicket(tipo, boletos) {
        const config = this.getTicketConfig()[tipo]
        if (!config) return ''

        // Contar cuántos boletos de este tipo hay disponibles
        const cantidad = boletos.length

        // Obtener el precio (asumiendo que todos los boletos del mismo tipo tienen el mismo precio)
        const precio = boletos[0]?.precio || 0

        // Obtener cantidad seleccionada actual
        const selectedQty = this.selectedQuantities[tipo] || 0
        // Verificar si este ticket está activo/expandido
        const isActive = this.activeTickets.has(tipo)

        return `
            <li class="ticket-item">
                <div class="ticket-card ${isActive ? 'active' : ''} ${selectedQty > 0 ? 'selected' : ''}" data-type="${tipo}" data-precio="${precio}" data-disponibles="${cantidad}">
                    <div class="ticket-header">
                        <span class="ticket-icon">${config.icon}</span>
                        <div class="ticket-header-info">
                            <h3 class="ticket-name">${config.title}</h3>
                            <span class="ticket-price">
                                ${precio > 0 ? `$${precio.toLocaleString('es-MX')}` : 'Gratis'}
                            </span>
                        </div>
                    </div>
                    <div class="ticket-main">
                        <div class="ticket-description">
                            <p class="ticket-description">${config.description}</p>
                        </div>
                        <div class="ticket-info">
                            <span class="ticket-availability ${cantidad < 10 ? 'low-stock' : ''}">
                                ${cantidad} disponible${cantidad !== 1 ? 's' : ''}
                            </span>
                        </div>
                        ${isActive ? `
                            <div class="ticket-quantity-control">
                                <button
                                    class="quantity-btn-list"
                                    data-action="decrease"
                                    data-tipo="${tipo}"
                                    ${selectedQty <= 0 ? 'disabled' : ''}
                                >
                                    -
                                </button>
                                <input
                                    id="quantity-input-list-${tipo}"
                                    type="number"
                                    class="quantity-input-list"
                                    data-tipo="${tipo}"
                                    value="${selectedQty}"
                                    min="0"
                                    max="${cantidad}"
                                    readonly
                                />
                                <button
                                    class="quantity-btn-list"
                                    data-action="increase"
                                    data-tipo="${tipo}"
                                    ${selectedQty >= cantidad ? 'disabled' : ''}
                                >
                                    +
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </li>
        `
    }

    render() {
        if (!this.boletos || this.boletos.length === 0) {
            return `
                <div class="no-tickets-message">
                    <p>No hay boletos disponibles en este momento</p>
                </div>
            `
        }

        // Agrupar boletos por tipo (normalizando a mayúsculas)
        const boletosPorTipo = this.boletos.reduce((acc, boleto) => {
            // Normalizar el tipo a mayúsculas para consistencia
            const tipo = boleto.tipo ? boleto.tipo.toUpperCase() : 'GENERAL'
            if (!acc[tipo]) {
                acc[tipo] = []
            }
            acc[tipo].push(boleto)
            return acc
        }, {})

        // Renderizar cada tipo de boleto
        const ticketsHTML = Object.entries(boletosPorTipo)
            .map(([tipo, boletos]) => this.renderTicket(tipo, boletos))
            .join('')

        return `
            <ul class="tickets-list">
                ${ticketsHTML}
            </ul>
        `
    }

    /**
     * Activa/desactiva un ticket (muestra/oculta controles)
     */
    toggleTicket(tipo) {
        const wasActive = this.activeTickets.has(tipo)

        if (wasActive) {
            // Si ya está activo, desactivarlo
            this.activeTickets.delete(tipo)
            console.log('❌ Desactivando ticket:', tipo)
        } else {
            // Activar este ticket
            this.activeTickets.add(tipo)
            console.log('✅ Activando ticket:', tipo)
        }

        // En lugar de re-renderizar todo, solo actualizar esta tarjeta específica
        this.updateTicketCard(tipo, !wasActive)
    }

    /**
     * Actualiza solo una tarjeta específica sin re-renderizar todo
     */
    updateTicketCard(tipo, isActive) {
        console.log('🔄 updateTicketCard llamado:', tipo, 'isActive:', isActive)

        const card = document.querySelector(`.ticket-card[data-type="${tipo}"]`)
        if (!card) {
            console.log('❌ Tarjeta no encontrada:', tipo)
            return
        }

        const ticketMain = card.querySelector('.ticket-main')
        if (!ticketMain) {
            console.log('❌ ticketMain no encontrado')
            return
        }

        // Actualizar clase active
        if (isActive) {
            card.classList.add('active')
            console.log('✅ Clase active agregada')
        } else {
            card.classList.remove('active')
            console.log('❌ Clase active removida')
        }

        // Obtener datos de la tarjeta
        const selectedQty = this.selectedQuantities[tipo] || 0
        const cantidad = parseInt(card.dataset.disponibles)

        // Buscar si ya existen los controles
        let controlsContainer = ticketMain.querySelector('.ticket-quantity-control')
        console.log('🔍 Controles existentes:', controlsContainer ? 'Sí' : 'No')

        if (isActive) {
            // Si debe estar activo y no tiene controles, crearlos
            if (!controlsContainer) {
                console.log('➕ Creando controles...')
                const ticketInfo = ticketMain.querySelector('.ticket-info')
                if (ticketInfo) {
                    const controlsHTML = `
                        <div class="ticket-quantity-control">
                            <button
                                class="quantity-btn-list"
                                data-action="decrease"
                                data-tipo="${tipo}"
                                ${selectedQty <= 0 ? 'disabled' : ''}
                            >
                                -
                            </button>
                            <input
                                id="quantity-input-list-${tipo}"
                                type="number"
                                class="quantity-input-list"
                                data-tipo="${tipo}"
                                value="${selectedQty}"
                                min="0"
                                max="${cantidad}"
                                readonly
                            />
                            <button
                                class="quantity-btn-list"
                                data-action="increase"
                                data-tipo="${tipo}"
                                ${selectedQty >= cantidad ? 'disabled' : ''}
                            >
                                +
                            </button>
                        </div>
                    `
                    ticketInfo.insertAdjacentHTML('afterend', controlsHTML)
                    console.log('✅ Controles insertados')
                    // Los event listeners ya están adjuntados por delegación
                } else {
                    console.log('❌ ticketInfo no encontrado')
                }
            } else {
                console.log('⚠️ Controles ya existen')
            }
        } else {
            // Si debe estar inactivo, eliminar los controles
            if (controlsContainer) {
                controlsContainer.remove()
                console.log('🗑️ Controles eliminados')
            }
        }
    }

    /**
     * Aumenta la cantidad de un tipo de boleto
     */
    increaseQuantity(tipo) {
        const card = document.querySelector(`.ticket-card[data-type="${tipo}"]`)
        if (!card) return

        const maxDisponibles = parseInt(card.dataset.disponibles)
        const currentQty = this.selectedQuantities[tipo] || 0

        if (currentQty < maxDisponibles) {
            this.selectedQuantities[tipo] = currentQty + 1
            this.updateQuantityControls(tipo)
            this.notifySelection(tipo)
        }
    }

    /**
     * Disminuye la cantidad de un tipo de boleto
     */
    decreaseQuantity(tipo) {
        const currentQty = this.selectedQuantities[tipo] || 0

        if (currentQty > 0) {
            this.selectedQuantities[tipo] = currentQty - 1
            this.updateQuantityControls(tipo)
            this.notifySelection(tipo)
        }
    }

    /**
     * Actualiza solo los controles de cantidad (input y botones) sin re-renderizar
     */
    updateQuantityControls(tipo) {
        const card = document.querySelector(`.ticket-card[data-type="${tipo}"]`)
        if (!card) return

        const maxDisponibles = parseInt(card.dataset.disponibles)
        const currentQty = this.selectedQuantities[tipo] || 0

        // Actualizar el input
        const input = document.getElementById(`quantity-input-list-${tipo}`)
        if (input) {
            input.value = currentQty
        }

        // Actualizar botones
        const decreaseBtn = card.querySelector('.quantity-btn-list[data-action="decrease"]')
        const increaseBtn = card.querySelector('.quantity-btn-list[data-action="increase"]')

        if (decreaseBtn) {
            decreaseBtn.disabled = currentQty <= 0
        }

        if (increaseBtn) {
            increaseBtn.disabled = currentQty >= maxDisponibles
        }

        // Actualizar clase 'selected' en la tarjeta
        if (currentQty > 0) {
            card.classList.add('selected')
        } else {
            card.classList.remove('selected')
        }
    }

    /**
     * Notifica al componente padre sobre la selección
     */
    notifySelection(tipo) {
        if (this.onTicketSelect && typeof this.onTicketSelect === 'function') {
            const card = document.querySelector(`.ticket-card[data-type="${tipo}"]`)
            if (!card) return

            const selectionData = {
                tipo,
                cantidad: this.selectedQuantities[tipo] || 0,
                precio: parseFloat(card.dataset.precio),
                disponibles: parseInt(card.dataset.disponibles)
            }

            this.onTicketSelect(selectionData)
        }
    }

    /**
     * Obtiene todas las selecciones actuales
     */
    getSelectedTickets() {
        return Object.entries(this.selectedQuantities)
            .filter(([_, qty]) => qty > 0)
            .map(([tipo, cantidad]) => {
                const card = document.querySelector(`.ticket-card[data-type="${tipo}"]`)
                return {
                    tipo,
                    cantidad,
                    precio: parseFloat(card?.dataset.precio || 0),
                    disponibles: parseInt(card?.dataset.disponibles || 0)
                }
            })
    }

    /**
     * Actualiza la vista del componente
     */
    updateView() {
        const container = document.getElementById('available-tickets')
        if (container) {
            container.innerHTML = this.render()
            this.attachEventListeners()
        }
    }

    /**
     * Adjunta event listeners usando delegación de eventos
     */
    attachEventListeners() {
        // Solo adjuntar listeners una vez
        if (this.listenersAttached) {
            console.log('⚠️ Listeners ya adjuntados, saltando...')
            return
        }

        const container = document.getElementById('available-tickets')
        if (!container) {
            console.log('❌ Contenedor no encontrado')
            return
        }

        console.log('✅ Adjuntando listeners por primera vez')

        // Usar delegación de eventos en el contenedor
        // Esto asegura que los listeners funcionen incluso después de actualizaciones del DOM
        container.addEventListener('click', (e) => {
            // Manejar clicks en botones de cantidad
            const button = e.target.closest('.quantity-btn-list')
            if (button) {
                e.stopPropagation()
                const action = button.dataset.action
                const tipo = button.dataset.tipo

                console.log('🔘 Click en botón:', action, tipo)

                if (action === 'increase') {
                    this.increaseQuantity(tipo)
                } else if (action === 'decrease') {
                    this.decreaseQuantity(tipo)
                }
                return
            }

            // Manejar clicks en tarjetas para activar/desactivar
            const card = e.target.closest('.ticket-card')
            if (card) {
                // Evitar que el click en inputs active esto
                if (e.target.classList.contains('quantity-input-list')) {
                    return
                }

                const tipo = card.dataset.type
                console.log('🖱️ Click en tarjeta:', tipo, 'Activo:', this.activeTickets.has(tipo))

                // Activar o desactivar según el estado actual
                this.toggleTicket(tipo)
            }
        })

        this.listenersAttached = true
    }

    afterRender() {
        this.attachEventListeners()
    }
}