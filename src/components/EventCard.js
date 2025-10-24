import { Link } from '../router.js'

export class EventCard {
    constructor(props = {}) {
        this.id = props.id
        // Mapear campos del backend (español) a propiedades del componente
        this.nombre = props.nombre || props.name
        this.descripcion = props.descripcion || props.description
        this.ubicacion = props.ubicacion || props.location
        this.fecha = props.fecha || props.date
        this.organizadorId = props.organizador_id
    }

    render() {
        return `
            <div id="${this.id}" class="event-card">
                ${this.nombre ? `<h3 class="event-name">${this.nombre}</h3>` : ''}
                ${this.descripcion ? `<p class="event-description">${this.descripcion}</p>` : ''}
                ${this.ubicacion ? `
                    <p class="event-location">
                        📍 ${this.ubicacion}
                    </p>
                ` : ''}
                ${this.fecha ? `
                    <p class="event-date">
                        📅 ${new Date(this.fecha).toLocaleDateString('es-ES')}
                    </p>
                ` : ''}
            </div>
        `
    }
}