import '../../assets/css/components/Tikets.css'
import { NavBar } from "../../components/NavBar"
import { get, post } from "../../utils/api.js"
import { Icons } from "../../utils/icons"

export class createTickets {
    constructor(params) {
        this.params = params
        this.navBar = new NavBar()
        this.selectedTickets = [] // Array para almacenar las configuraciones de tickets seleccionados
        this.eventId = params.eventId || null // ID del evento (viene de los parámetros de la URL)
        this.eventName = 'Cargando...' // Nombre del evento
        this.eventData = null
    }

    // Obtiene información del evento desde el backend
    async fetchEventData() {
        if (!this.eventId) {
            console.error('No se proporcionó un ID de evento')
            return
        }

        try {
            // La función get() de api.js devuelve { data, error }
            const { data, error } = await get(`/eventos/${this.eventId}`)

            if (error) {
                throw new Error(error)
            }

            // data ya viene procesado (puede ser el objeto evento directamente o dentro de .data)
            this.eventData = data
            this.eventName = this.eventData?.nombre || 'Evento sin nombre'


        } catch (error) {
            console.error(' Error al obtener evento:', error)
            this.eventName = 'Error al cargar evento'
        }
    }   

    // Renderiza las tarjetas de tipos de boletos con sus formularios
    renderCreateTickets() {
        return `
            <h3>Seleccione el tipo de boleto y configure sus datos</h3>

            <div class="tickets-grid">
                <div class="ticket-card" data-type="VIP">
                    <div class="ticket-header">
                        <span class="ticket-icon">${Icons.tickets.vip}</span>
                        <h3 class="ticket-name">Boleto VIP</h3>
                    </div>
                    <div class="ticket-form">
                        <div class="form-group">
                            <label for="vip-cantidad">Cantidad:</label>
                            <input type="number" id="vip-cantidad" min="1" placeholder="Ej: 50" />
                        </div>
                        <div class="form-group">
                            <label for="vip-precio">Precio ($):</label>
                            <input type="number" id="vip-precio" min="0" step="0.01" placeholder="Ej: 500.00" />
                        </div>
                        <button class="btn btn-primary btn-sm add-ticket-btn" data-type="VIP">
                            Agregar
                        </button>
                    </div>
                </div>

                <div class="ticket-card" data-type="ORO">
                    <div class="ticket-header">
                        <span class="ticket-icon">${Icons.tickets.oro}</span>
                        <h3 class="ticket-name">Boleto Oro</h3>
                    </div>
                    <div class="ticket-form">
                        <div class="form-group">
                            <label for="oro-cantidad">Cantidad:</label>
                            <input type="number" id="oro-cantidad" min="1" placeholder="Ej: 100" />
                        </div>
                        <div class="form-group">
                            <label for="oro-precio">Precio ($):</label>
                            <input type="number" id="oro-precio" min="0" step="0.01" placeholder="Ej: 250.00" />
                        </div>
                        <button class="btn btn-primary btn-sm add-ticket-btn" data-type="ORO">
                            Agregar
                        </button>
                    </div>
                </div>

                <div class="ticket-card" data-type="PLATINO">
                    <div class="ticket-header">
                        <span class="ticket-icon">${Icons.tickets.platino}</span>
                        <h3 class="ticket-name">Boleto Platino</h3>
                    </div>
                    <div class="ticket-form">
                        <div class="form-group">
                            <label for="platino-cantidad">Cantidad:</label>
                            <input type="number" id="platino-cantidad" min="1" placeholder="Ej: 75" />
                        </div>
                        <div class="form-group">
                            <label for="platino-precio">Precio ($):</label>
                            <input type="number" id="platino-precio" min="0" step="0.01" placeholder="Ej: 350.00" />
                        </div>
                        <button class="btn btn-primary btn-sm add-ticket-btn" data-type="PLATINO">
                            Agregar
                        </button>
                    </div>
                </div>

                <div class="ticket-card" data-type="GENERAL">
                    <div class="ticket-header">
                        <span class="ticket-icon">${Icons.tickets.general}</span>
                        <h3 class="ticket-name">Boleto General</h3>
                    </div>
                    <div class="ticket-form">
                        <div class="form-group">
                            <label for="general-cantidad">Cantidad:</label>
                            <input type="number" id="general-cantidad" min="1" placeholder="Ej: 200" />
                        </div>
                        <div class="form-group">
                            <label for="general-precio">Precio ($):</label>
                            <input type="number" id="general-precio" min="0" step="0.01" placeholder="Ej: 150.00" />
                        </div>
                        <button class="btn btn-primary btn-sm add-ticket-btn" data-type="GENERAL">
                            Agregar
                        </button>
                    </div>
                </div>
            </div>

            ${this.renderSelectedTickets()}
        `
    }

    // Renderiza la lista de tickets seleccionados
    renderSelectedTickets() {
        if (this.selectedTickets.length === 0) {
            return `
                <div class="selected-tickets-section">
                    <h3>${Icons.check} Tickets Configurados</h3>
                    <div class="no-tickets-message">
                        No hay tickets configurados aún. Seleccione un tipo de ticket arriba y complete los datos.
                    </div>
                </div>
            `
        }

        const ticketsList = this.selectedTickets.map((ticket, index) => `
            <div class="ticket-item">
                <div class="ticket-item-info">
                    <div class="ticket-item-type">${ticket.tipo}</div>
                    <div class="ticket-item-details">
                        Cantidad: ${ticket.cantidad} | Precio: $${parseFloat(ticket.precio).toFixed(2)}
                    </div>
                </div>
                <button class="ticket-item-remove" data-index="${index}">
                    Eliminar
                </button>
            </div>
        `).join('')

        return `
            <div class="selected-tickets-section">
                <h3>${Icons.check} Tickets Configurados (${this.selectedTickets.length})</h3>
                <div class="tickets-list">
                    ${ticketsList}
                </div>
                <div class="create-tickets-actions">
                    <button id="clear-tickets-btn" class="btn btn-secondary">
                        Limpiar Todo
                    </button>
                    <button id="create-tickets-btn" class="btn btn-primary">
                        Crear ${this.selectedTickets.length} Tipo(s) de Boletos
                    </button>
                </div>
            </div>
        `
    }

    // Agrega un ticket a la lista de seleccionados
    addTicket(tipo, cantidad, precio) {
        // Validar que no exista ya un ticket de este tipo
        const existingIndex = this.selectedTickets.findIndex(t => t.tipo === tipo)

        if (existingIndex !== -1) {
            alert(`Ya existe una configuración para boletos ${tipo}. Por favor, elimínela primero si desea agregar una nueva.`)
            return false
        }

        // Agregar el ticket
        this.selectedTickets.push({
            tipo,
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio)
        })

        return true
    }

    // Elimina un ticket de la lista
    removeTicket(index) {
        this.selectedTickets.splice(index, 1)
    }

    // Limpia todos los tickets seleccionados
    clearAllTickets() {
        this.selectedTickets = []
    }

    // Actualiza la vista de tickets seleccionados
    updateSelectedTicketsView() {
        const container = document.querySelector('.create-event-section')
        if (container) {
            const h2 = container.querySelector('h2')
            container.innerHTML = ''
            container.appendChild(h2)
            container.innerHTML += this.renderCreateTickets()
            this.attachEventListeners()
        }
    }

    // Valida los datos del formulario
    validateTicketForm(tipo) {
        const typePrefix = tipo.toLowerCase()
        const cantidadInput = document.getElementById(`${typePrefix}-cantidad`)
        const precioInput = document.getElementById(`${typePrefix}-precio`)

        const cantidad = cantidadInput?.value
        const precio = precioInput?.value

        if (!cantidad || cantidad <= 0) {
            alert('Por favor, ingrese una cantidad válida (mayor a 0)')
            cantidadInput?.focus()
            return null
        }

        if (!precio || precio < 0) {
            alert('Por favor, ingrese un precio válido (mayor o igual a 0)')
            precioInput?.focus()
            return null
        }

        return { cantidad, precio }
    }

    // Limpia el formulario de un tipo de ticket
    clearTicketForm(tipo) {
        const typePrefix = tipo.toLowerCase()
        const cantidadInput = document.getElementById(`${typePrefix}-cantidad`)
        const precioInput = document.getElementById(`${typePrefix}-precio`)
        const card = document.querySelector(`.ticket-card[data-type="${tipo}"]`)

        if (cantidadInput) cantidadInput.value = ''
        if (precioInput) precioInput.value = ''
        if (card) card.classList.remove('selected')
    }

    // Crea los boletos en el backend
    async createTicketsInBackend() {
        if (this.selectedTickets.length === 0) {
            alert('Por favor, configure al menos un tipo de boleto antes de continuar.')
            return
        }

        if (!this.eventId) {
            alert('Error: No se ha especificado un ID de evento. Por favor, vuelva a la página de eventos.')
            return
        }

        try {
            // Mostrar loading
            const createBtn = document.getElementById('create-tickets-btn')
            if (createBtn) {
                createBtn.disabled = true
                createBtn.textContent = 'Creando boletos...'
            }

            // Preparar el payload con todas las configuraciones
            const payload = {
                eventoId: parseInt(this.eventId),
                configuraciones: this.selectedTickets.map(ticket => ({
                    tipo: ticket.tipo, // Mantener en mayúsculas: VIP, ORO, PLATINO, GENERAL
                    cantidad: ticket.cantidad,
                    precio: parseFloat(ticket.precio)
                }))
            }

          

            // Enviar UNA SOLA petición con todas las configuraciones
            const { data, error } = await post('/boletos/lote', payload)

            if (error) {
                throw new Error(error)
            }



            // Contar el total de boletos creados
            const totalBoletos = this.selectedTickets.reduce((sum, ticket) => {
                return sum + ticket.cantidad
            }, 0)

            alert(`¡Boletos creados exitosamente!\n\nTotal: ${totalBoletos} boletos\nTipos: ${this.selectedTickets.length}`)

            // Limpiar la lista
            this.clearAllTickets()
            this.updateSelectedTicketsView()

            // Redirigir al usuario al dashboard del organizador
            setTimeout(() => {
                window.location.href = '/organizador'
            }, 1500)

        } catch (error) {
            console.error('Error al crear boletos:', error)
            alert(`Error al crear los boletos: ${error.message}`)
        } finally {
            // Restaurar botón
            const createBtn = document.getElementById('create-tickets-btn')
            if (createBtn) {
                createBtn.disabled = false
                createBtn.textContent = `Crear ${this.selectedTickets.length} Tipo(s) de Boletos`
            }
        }
    }

    // Adjunta todos los event listeners
    attachEventListeners() {
        // Event listeners para las tarjetas de tickets (toggle selección visual)
        const ticketCards = document.querySelectorAll('.ticket-card')
        ticketCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Evitar que el click en inputs o botones afecte la card
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                    return
                }
                card.classList.toggle('selected')
            })
        })

        // Event listeners para los botones "Agregar"
        const addButtons = document.querySelectorAll('.add-ticket-btn')
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation()
                const tipo = button.dataset.type
                const formData = this.validateTicketForm(tipo)

                if (formData) {
                    const success = this.addTicket(tipo, formData.cantidad, formData.precio)
                    if (success) {
                        this.clearTicketForm(tipo)
                        this.updateSelectedTicketsView()
                    }
                }
            })
        })

        // Event listeners para los botones "Eliminar" de tickets seleccionados
        const removeButtons = document.querySelectorAll('.ticket-item-remove')
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index)
                this.removeTicket(index)
                this.updateSelectedTicketsView()
            })
        })

        // Event listener para el botón "Limpiar Todo"
        const clearBtn = document.getElementById('clear-tickets-btn')
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro de que desea eliminar todas las configuraciones de boletos?')) {
                    this.clearAllTickets()
                    this.updateSelectedTicketsView()
                }
            })
        }

        // Event listener para el botón "Crear Boletos"
        const createBtn = document.getElementById('create-tickets-btn')
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createTicketsInBackend()
            })
        }
    }

    render() {
        return `
            ${this.navBar.render()}
            <div class="page-container">
                <div class="dashboard-header">
                    <h1>Panel de Organizador - Crear Boletos</h1>
                    <p>Evento: <strong>${this.eventName}</strong> (ID: ${this.eventId || 'No especificado'})</p>
                    <a href="/organizador" data-link class="btn btn-secondary">
                        Volver a Mis Eventos
                    </a>
                </div>

                <div class="dashboard-content">
                    <div class="create-event-section">
                        <h2>Configurar Boletos para el Evento</h2>
                        ${this.renderCreateTickets()}
                    </div>
                </div>
            </div>
        `
    }

    // Actualiza la vista del nombre del evento en el header
    updateEventNameInView() {
        const eventNameElement = document.querySelector('.dashboard-header p strong')
        if (eventNameElement) {
            eventNameElement.textContent = this.eventName
        }
    }

    // Método llamado después de que el DOM esté listo
    async afterRender() {
        // Primero cargar la información del evento
        await this.fetchEventData()
        this.updateEventNameInView()

        // Luego adjuntar los event listeners
        this.attachEventListeners()
    }
}