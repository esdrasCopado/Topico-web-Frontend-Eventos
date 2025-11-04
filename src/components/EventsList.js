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
            error: null,
            currentIndex: 0,  // Índice actual del carrusel
            itemsPerView: 4   // Elementos visibles por vista
        }

        this.id = `events-list-${Math.random().toString(36).substr(2, 9)}`
        this.mounted = false  // Flag para saber si ya está montado
        this.isAnimating = false  // Flag para evitar múltiples clicks durante animación
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
        const showPrevBtn = this.state.currentIndex > 0
        const showNextBtn = this.state.currentIndex < this.state.eventos.length - this.state.itemsPerView

        return `
            <div id="${this.id}" class="events-list">
                <h2>Eventos Disponibles</h2>

                <div class="carousel-wrapper">
                    ${showPrevBtn && !this.state.loading && !this.state.error ? `
                        <button class="carousel-btn carousel-btn-prev" id="${this.id}-prev" aria-label="Anterior">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                    ` : ''}

                    <div class="events-container-wrapper">
                        <div class="events-container" style="transform: translateX(-${this.state.currentIndex * (100 / this.state.itemsPerView)}%)">
                            ${this.state.loading ? this.renderLoading() : ''}
                            ${this.state.error ? this.renderError() : ''}
                            ${!this.state.loading && !this.state.error ? this.renderEventos() : ''}
                        </div>
                    </div>

                    ${showNextBtn && !this.state.loading && !this.state.error ? `
                        <button class="carousel-btn carousel-btn-next" id="${this.id}-next" aria-label="Siguiente">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        `
    }

    /**
     * Navega al anterior conjunto de elementos
     */
    handlePrev() {
        if (this.isAnimating || this.state.currentIndex === 0) return

        this.isAnimating = true
        this.setState({ currentIndex: Math.max(0, this.state.currentIndex - this.state.itemsPerView) })

        setTimeout(() => {
            this.isAnimating = false
        }, 600) // Duración de la animación CSS
    }

    /**
     * Navega al siguiente conjunto de elementos
     */
    handleNext() {
        if (this.isAnimating) return

        const maxIndex = this.state.eventos.length - this.state.itemsPerView

        // Si llegamos al final, volver al inicio
        if (this.state.currentIndex >= maxIndex) {
            this.isAnimating = true
            this.setState({ currentIndex: 0 })
            setTimeout(() => {
                this.isAnimating = false
            }, 600)
            return
        }

        this.isAnimating = true
        this.setState({
            currentIndex: Math.min(maxIndex, this.state.currentIndex + this.state.itemsPerView)
        })

        setTimeout(() => {
            this.isAnimating = false
        }, 600)
    }

    /**
     * Ajusta itemsPerView según el tamaño de pantalla
     */
    updateItemsPerView() {
        const width = window.innerWidth
        let itemsPerView = 4

        if (width < 640) {
            itemsPerView = 1
        } else if (width < 1024) {
            itemsPerView = 2
        } else if (width < 1280) {
            itemsPerView = 3
        }

        if (this.state.itemsPerView !== itemsPerView) {
            this.setState({ itemsPerView, currentIndex: 0 })
        }
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

        // Ajustar itemsPerView según tamaño de pantalla
        this.updateItemsPerView()

        // Listener para cambios de tamaño de ventana
        this.resizeHandler = () => this.updateItemsPerView()
        window.addEventListener('resize', this.resizeHandler)

        // Hacer petición inicial (como useEffect([]))
        this.fetchEventos()

        // Event listeners
        this.attachEventListeners()
    }

    /**
     * Adjunta los event listeners a los botones
     */
    attachEventListeners() {
        const prevBtn = document.getElementById(`${this.id}-prev`)
        const nextBtn = document.getElementById(`${this.id}-next`)
        const retryBtn = document.getElementById(`${this.id}-retry`)

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.handlePrev())
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.handleNext())
        }

        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.fetchEventos())
        }
    }

    /**
     * Limpia los event listeners cuando se desmonta
     */
    unmount() {
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler)
        }
        this.mounted = false
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

            // Re-montar event listeners
            this.attachEventListeners()
        }
    }
}