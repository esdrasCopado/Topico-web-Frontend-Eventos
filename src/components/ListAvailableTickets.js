import { Icons } from '../utils/icons.js'

export class ListAvailableTickets {
    constructor(params) {
        this.eventoId = params.eventoId
        this.boletos = params.boletos || []
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

        return `
            <li class="ticket-item">
                <div class="ticket-card" data-type="${tipo}">
                    <div class="ticket-header">
                        <span class="ticket-icon">${config.icon}</span>
                        <h3 class="ticket-name">${config.title}</h3>
                    </div>
                    <p class="ticket-description">${config.description}</p>
                    <div class="ticket-footer">
                        <div class="ticket-info">
                            <span class="ticket-price">
                                ${precio > 0 ? `$${precio.toLocaleString('es-MX')}` : 'Gratis'}
                            </span>
                            <span class="ticket-availability ${cantidad < 10 ? 'low-stock' : ''}">
                                ${cantidad} disponible${cantidad !== 1 ? 's' : ''}
                            </span>
                        </div>

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

    afterRender() {}
}