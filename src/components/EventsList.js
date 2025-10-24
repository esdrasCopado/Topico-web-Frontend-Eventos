import { EventCard } from './EventCard.js'
import { get } from '../utils/api.js'

/**
 * Componente que lista eventos desde la API
 * Similar a usar useState + useEffect en React
 */
export class EventsList {
    constructor(props = {}) {
        // Estado del componente (como useState)
        this.state = {
            eventos: [],
            loading: true,
            error: null
        }

        this.id = `events-list-${Math.random().toString(36).substr(2, 9)}`
        this.mounted = false  // Flag para saber si ya está montado
    }

    /**
     * Actualiza el estado y re-renderiza
     * Similar a setState en React
     */
    setState(newState, shouldRerender = true) {
        this.state = { ...this.state, ...newState }

        // Solo re-renderizar si ya está montado
        if (shouldRerender && this.mounted) {
            this.reRender()
        }
    }

    /**
     * Obtiene eventos de la API
     * Similar a una función en useEffect
     */
    async fetchEventos() {
        // Indicar que está cargando
        this.setState({ loading: true, error: null })

        // Hacer petición
        const { data, error } = await get('/eventos')

        console.log(' Respuesta del backend:', { data, error })

        if (error) {
            console.error(' Error en fetchEventos:', error)
            this.setState({
                error: error,
                loading: false
            })
            return
        }

        // Actualizar estado con los datos
        this.setState({
            eventos: data,
            loading: false
        })
    }

    /**
     * Renderiza el estado de carga
     */
    renderLoading() {
        return `
            <div class="loading">
                <p>Cargando eventos...</p>
            </div>
        `
    }

    /**
     * Renderiza el error
     */
    renderError() {
        return `
            <div class="error">
                <p>❌ Error: ${this.state.error}</p>
                <button id="${this.id}-retry">Reintentar</button>
            </div>
        `
    }

    /**
     * Renderiza la lista de eventos
     */
    renderEventos() {
        if (this.state.eventos.length === 0) {
            return '<p class="no-events">No hay eventos disponibles</p>'
        }

        return this.state.eventos.map(evento => {
            const eventCard = new EventCard(evento)
            return eventCard.render()
        }).join('')
    }

    /**
     * Renderiza el componente
     */
    render() {
        return `
            <div id="${this.id}" class="events-list">
                <h2>Eventos Disponibles</h2>
                
                <div class="events-container">
                    ${this.state.loading ? this.renderLoading() : ''}
                    ${this.state.error ? this.renderError() : ''}
                    ${!this.state.loading && !this.state.error ? this.renderEventos() : ''}
                </div>
            </div>
        `
    }

    /**
     * Similar a useEffect en React
     * Se ejecuta después de que el componente se monta
     */
    mount() {
        // Evitar múltiples montajes
        if (this.mounted) {
            console.warn('EventsList ya está montado, evitando duplicación')
            return
        }

        this.mounted = true

        // Hacer petición inicial (como useEffect([]))
        this.fetchEventos()

        // Event listener para reintentar
        const retryBtn = document.getElementById(`${this.id}-retry`)
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.fetchEventos())
        }
    }

    /**
     * Re-renderiza SOLO este componente
     */
    reRender() {
        const container = document.getElementById(this.id)
        if (container) {
            const temp = document.createElement('div')
            temp.innerHTML = this.render()
            container.outerHTML = temp.innerHTML

            // Solo re-montar event listeners (NO hacer fetch de nuevo)
            const retryBtn = document.getElementById(`${this.id}-retry`)
            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.fetchEventos())
            }
        }
    }
}