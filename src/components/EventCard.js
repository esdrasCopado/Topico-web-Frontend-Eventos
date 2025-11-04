
import { getApiBaseUrl } from '../utils/api.js'
export class EventCard {
    constructor(props = {}) {
        this.id = props.id
        // Mapear campos del backend (español) a propiedades del componente
        this.nombre = props.nombre || props.name
        this.descripcion = props.descripcion || props.description
        this.ubicacion = props.ubicacion || props.location
        this.fecha = props.fecha || props.date
        this.organizadorId = props.organizador_id || props.organizadorId
        this.precio = props.precio || props.price || 0
        this.cupoDisponible = props.cupo_disponible || props.availableSeats || 0
        // Mapear imagenUrl (del backend) o imagen o image
        this.imagenUrl = props.imagenUrl || props.imagen || props.image || ''
    }

    render() {
        // Formatear fecha
        const formattedDate = this.fecha
            ? new Date(this.fecha).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'Fecha por confirmar'

        // Construir URL de la imagen
        const imageUrl = this.imagenUrl
            ? `${getApiBaseUrl()}${this.imagenUrl}`
            : null

        return `
            <a href="/evento/${this.id}" data-link class="event-card">
                ${imageUrl ? `
                    <div class="event-image-container">
                        <img src="${imageUrl}" alt="${this.nombre}" class="event-image" onerror="this.parentElement.style.display='none'" />
                    </div>
                ` : ''}

                ${this.nombre ? `<h3 class="event-name">${this.nombre}</h3>` : ''}

                <div class="event-card-overlay">
                    ${this.descripcion ? `<p class="event-description">${this.descripcion}</p>` : ''}

                    <div class="event-details">
                        ${this.ubicacion ? `
                            <p class="event-location">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"/>
                                </svg>
                                ${this.ubicacion.split(',')[0]}
                            </p>
                        ` : ''}

                        ${this.fecha ? `
                            <p class="event-date">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2.5zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z"/>
                                </svg>
                                ${formattedDate}
                            </p>
                        ` : ''}
                    </div>

                    <div class="event-cta">
                        <span>Ver detalles</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"/>
                        </svg>
                    </div>
                </div>
            </a>
        `
    }
}