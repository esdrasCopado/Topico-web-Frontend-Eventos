

/**
 * Componente para seleccionar boletos de un evento
 * Permite seleccionar tipo de boleto y cantidad
 * Calcula el total y maneja el estado de la compra
 */
export class TicketSelector {
    constructor(options = {}) {
        this.eventId = options.eventId || null
        this.boletosDisponibles = options.boletosDisponibles || []
        this.onPurchase = options.onPurchase || null // Callback cuando se confirma la compra

        // Estado interno
        this.state = {
            selectedTicket: null, // Boleto seleccionado { tipo, precio, disponibles }
            quantity: 1,
            total: 0
        }
    }

    /**
     * Agrupa los boletos por tipo y cuenta disponibles
     */
    groupTicketsByType() {
        const grouped = {}

        this.boletosDisponibles.forEach(boleto => {
            const tipo = boleto.tipo || 'GENERAL'

            if (!grouped[tipo]) {
                grouped[tipo] = {
                    tipo,
                    precio: boleto.precio || 0,
                    disponibles: 0,
                    boletos: []
                }
            }

            grouped[tipo].disponibles++
            grouped[tipo].boletos.push(boleto)
        })

        return Object.values(grouped)
    }

    /**
     * Obtiene el icono según el tipo de boleto
     */
    getTicketIcon(tipo) {
        const icons = {
            VIP: '👑',
            ORO: '🥇',
            PLATINO: '💎',
            GENERAL: '🎫'
        }
        return icons[tipo] || '🎟️'
    }

    /**
     * Obtiene el color según el tipo de boleto
     */
    getTicketColor(tipo) {
        const colors = {
            VIP: '#8b5cf6',      // Púrpura
            ORO: '#f59e0b',      // Dorado
            PLATINO: '#06b6d4',  // Cyan
            GENERAL: '#10b981'   // Verde
        }
        return colors[tipo] || '#6366f1'
    }

    /**
     * Renderiza la lista de tipos de boletos disponibles
     */
    renderTicketList() {
        const ticketTypes = this.groupTicketsByType()

        if (ticketTypes.length === 0) {
            return `
                <div class="no-tickets-available">
                    <span class="no-tickets-icon">🎫</span>
                    <p>No hay boletos disponibles</p>
                </div>
            `
        }

        return `
            <div class="ticket-types-list">
                <h4>Tipos de Boletos Disponibles</h4>
                ${ticketTypes.map(ticket => `
                    <div
                        class="ticket-type-item ${this.state.selectedTicket?.tipo === ticket.tipo ? 'selected' : ''}"
                        data-tipo="${ticket.tipo}"
                        data-precio="${ticket.precio}"
                        data-disponibles="${ticket.disponibles}"
                        style="--ticket-color: ${this.getTicketColor(ticket.tipo)}"
                    >
                        <div class="ticket-type-header">
                            <span class="ticket-type-icon">${this.getTicketIcon(ticket.tipo)}</span>
                            <div class="ticket-type-info">
                                <h5>${ticket.tipo}</h5>
                                <span class="ticket-type-available">${ticket.disponibles} disponibles</span>
                            </div>
                            <span class="ticket-type-price">$${ticket.precio.toLocaleString('es-MX')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }

    /**
     * Renderiza el selector de cantidad y resumen
     */
    renderQuantitySelector() {
        if (!this.state.selectedTicket) {
            return `
                <div class="quantity-selector-placeholder">
                    <p>Selecciona un tipo de boleto arriba</p>
                </div>
            `
        }

        const { selectedTicket, quantity } = this.state
        const maxQuantity = selectedTicket.disponibles

        return `
            <div class="quantity-selector-container">
                <div class="selected-ticket-summary">
                    <span class="selected-ticket-icon">${this.getTicketIcon(selectedTicket.tipo)}</span>
                    <div class="selected-ticket-info">
                        <h5>Boleto ${selectedTicket.tipo}</h5>
                        <span class="selected-ticket-price">$${selectedTicket.precio.toLocaleString('es-MX')} c/u</span>
                    </div>
                </div>

                <div class="quantity-control">
                    <label>Cantidad:</label>
                    <div class="quantity-buttons">
                        <button
                            class="quantity-btn"
                            id="decrease-qty"
                            ${quantity <= 1 ? 'disabled' : ''}
                        >
                            -
                        </button>
                        <input
                            id="quantity-input"
                            type="number"
                            value="${quantity}"
                            min="1"
                            max="${maxQuantity}"
                            readonly
                        />
                        <button
                            class="quantity-btn"
                            id="increase-qty"
                            ${quantity >= maxQuantity ? 'disabled' : ''}
                        >
                            +
                        </button>
                    </div>
                    <span class="quantity-hint">Máximo: ${maxQuantity}</span>
                </div>

                <div class="purchase-summary">
                    <div class="summary-row">
                        <span>Subtotal (${quantity} boleto${quantity > 1 ? 's' : ''}):</span>
                        <span class="summary-value">$${(selectedTicket.precio * quantity).toLocaleString('es-MX')}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span class="summary-value-total">$${(selectedTicket.precio * quantity).toLocaleString('es-MX')}</span>
                    </div>
                </div>

                <button id="confirm-purchase-btn" class="btn btn-primary btn-large">
                    Confirmar Compra
                </button>
            </div>
        `
    }

    /**
     * Renderiza el componente completo
     */
    render() {
        return `
            <div class="ticket-selector">
                ${this.renderTicketList()}
                ${this.renderQuantitySelector()}
            </div>
        `
    }

    /**
     * Selecciona un tipo de boleto
     */
    selectTicket(tipo, precio, disponibles) {
        this.state.selectedTicket = { tipo, precio: parseFloat(precio), disponibles: parseInt(disponibles) }
        this.state.quantity = 1
        this.updateView()
    }

    /**
     * Aumenta la cantidad
     */
    increaseQuantity() {
        if (this.state.quantity < this.state.selectedTicket.disponibles) {
            this.state.quantity++
            this.updateView()
        }
    }

    /**
     * Disminuye la cantidad
     */
    decreaseQuantity() {
        if (this.state.quantity > 1) {
            this.state.quantity--
            this.updateView()
        }
    }

    /**
     * Actualiza la vista del componente
     */
    updateView() {
        const container = document.getElementById('ticket-selector-container')
        if (container) {
            container.innerHTML = this.render()
            this.attachEventListeners()
        }
    }

    /**
     * Maneja la confirmación de compra
     */
    handlePurchase() {
        if (!this.state.selectedTicket) {
            alert('Por favor, selecciona un tipo de boleto')
            return
        }

        if (this.state.quantity < 1 || this.state.quantity > this.state.selectedTicket.disponibles) {
            alert('Cantidad inválida')
            return
        }

        // Preparar los datos de la compra
        const purchaseData = {
            eventId: this.eventId,
            ticketType: this.state.selectedTicket.tipo,
            quantity: this.state.quantity,
            unitPrice: this.state.selectedTicket.precio,
            total: this.state.selectedTicket.precio * this.state.quantity
        }

        // Llamar al callback si existe
        if (this.onPurchase && typeof this.onPurchase === 'function') {
            this.onPurchase(purchaseData)
        } else {
            console.log('Compra confirmada:', purchaseData)
        }
    }

    /**
     * Adjunta los event listeners
     */
    attachEventListeners() {
        // Event listeners para seleccionar tipo de boleto
        const ticketItems = document.querySelectorAll('.ticket-type-item')
        ticketItems.forEach(item => {
            item.addEventListener('click', () => {
                const tipo = item.dataset.tipo
                const precio = item.dataset.precio
                const disponibles = item.dataset.disponibles
                this.selectTicket(tipo, precio, disponibles)
            })
        })

        // Event listeners para los botones de cantidad
        const decreaseBtn = document.getElementById('decrease-qty')
        const increaseBtn = document.getElementById('increase-qty')
        const purchaseBtn = document.getElementById('confirm-purchase-btn')

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => this.decreaseQuantity())
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => this.increaseQuantity())
        }

        if (purchaseBtn) {
            purchaseBtn.addEventListener('click', () => this.handlePurchase())
        }
    }

    /**
     * Método llamado después de renderizar en el DOM
     */
    afterRender() {
        this.attachEventListeners()
    }
}
