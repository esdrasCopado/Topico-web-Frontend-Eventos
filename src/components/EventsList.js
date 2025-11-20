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
            currentIndex: 0,  // Índice actual del carrusel (siempre empieza en 0)
            itemsPerView: 4,  // Elementos visibles por vista
            clippedElementWidth: 60  // Ancho en px del elemento cortado
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

        // Solo actualizar la posición del carrusel sin re-renderizar todo
        if (shouldRerender && this.mounted) {
            this.updateCarouselPosition()
        }
    }

    /**
     * Actualiza solo la posición del carrusel y las clases sin re-renderizar
     */
    updateCarouselPosition() {
        const container = document.getElementById(`${this.id}-container`)
        if (container) {
            // Actualizar transform
            container.style.transform = `translateX(-${this.calculateTranslateX()}%)`

            // Actualizar clase del elemento cortado
            this.updateClippedClass()

            // Actualizar visibilidad de botones
            this.updateButtonsVisibility()

            // Actualizar indicadores activos
            this.updateIndicators()
        }
    }

    /**
     * Actualiza los indicadores de posición
     */
    updateIndicators() {
        const indicators = document.querySelectorAll(`#${this.id} .carousel-indicator`)
        indicators.forEach((indicator, index) => {
            if (index === this.state.currentIndex) {
                indicator.classList.add('active')
            } else {
                indicator.classList.remove('active')
            }
        })
    }

    /**
     * Actualiza la clase del elemento cortado dinámicamente
     * Solo aplicamos sombra al elemento cortado de la derecha
     */
    updateClippedClass() {
        const container = document.getElementById(`${this.id}-container`)
        if (!container) return

        // Remover clase de todos los elementos
        const allCards = container.querySelectorAll('.event-card-clipped')
        allCards.forEach(card => card.classList.remove('event-card-clipped'))

        // Elemento cortado a la DERECHA (quinto elemento visible)
        const rightClippedIndex = this.state.currentIndex + this.state.itemsPerView
        const rightClippedCard = container.querySelector(`[data-carousel-index="${rightClippedIndex}"]`)
        if (rightClippedCard) {
            rightClippedCard.classList.add('event-card-clipped')
        }
    }

    /**
     * Actualiza la visibilidad de los botones
     */
    updateButtonsVisibility() {
        const prevBtn = document.getElementById(`${this.id}-prev`)

        const showPrev = this.state.currentIndex > 0

        if (prevBtn) {
            prevBtn.style.display = showPrev ? 'flex' : 'none'
        }
    }

    /**
     * Obtiene eventos de la API
     * Similar a una función en useEffect
     */
    async fetchEventos() {
        // Indicar que está cargando - necesita re-render completo
        this.state.loading = true
        this.state.error = null
        if (this.mounted) {
            this.reRender()
        }

        // Hacer petición
        const { data, error } = await get('/eventos')

        console.log(' Respuesta del backend:', { data, error })

        if (error) {
            console.error(' Error en fetchEventos:', error)
            this.state.error = error
            this.state.loading = false
            if (this.mounted) {
                this.reRender()
            }
            return
        }

        // Actualizar estado con los datos - necesita re-render completo
        this.state.eventos = data
        this.state.loading = false
        if (this.mounted) {
            this.reRender()
        }
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
     * Renderiza la lista de eventos con clones para efecto infinito
     */
    renderEventos() {
        if (this.state.eventos.length === 0) {
            return '<p class="no-events">No hay eventos disponibles</p>'
        }

        // Crear carrusel infinito: [original] + [clone completo]
        // Esto permite la navegación infinita sin saltos visuales
        const eventosInfinitos = [...this.state.eventos, ...this.state.eventos]

        return eventosInfinitos.map((evento, index) => {
            const eventCard = new EventCard(evento)
            const cardHtml = eventCard.render()
            const isClone = index >= this.state.eventos.length

            // Marcar clones - la clase "event-card-clipped" se agrega dinámicamente con JS
            return cardHtml.replace(
                '<a ',
                `<a data-carousel-index="${index}" data-is-clone="${isClone}" `
            )
        }).join('')
    }

    /**
     * Calcula el translateX para posicionar el carrusel
     */
    calculateTranslateX() {
        const { currentIndex, itemsPerView } = this.state

        // Cada elemento ocupa 100/itemsPerView del ancho
        const itemWidthPercent = 100 / itemsPerView

        // Desplazamiento simple
        return currentIndex * itemWidthPercent
    }

    /**
     * Calcula el ancho del elemento cortado como porcentaje
     */
    getClippedWidthPercent() {
        const containerWidth = document.querySelector('.events-container-wrapper')?.offsetWidth || 1200
        const { clippedElementWidth } = this.state
        return (clippedElementWidth / containerWidth) * 100
    }

    /**
     * Renderiza indicadores de posición (dots)
     */
    renderIndicators() {
        if (this.state.eventos.length === 0) return ''

        const totalSlides = this.state.eventos.length
        const indicators = []

        for (let i = 0; i < totalSlides; i++) {
            const isActive = i === this.state.currentIndex
            indicators.push(`
                <button
                    class="carousel-indicator ${isActive ? 'active' : ''}"
                    data-index="${i}"
                    aria-label="Ir al slide ${i + 1}"
                ></button>
            `)
        }

        return `
            <div class="carousel-indicators">
                ${indicators.join('')}
            </div>
        `
    }

    /**
     * Renderiza el componente
     */
    render() {
        const hasEvents = this.state.eventos.length > 0
        // Botón prev solo se muestra cuando currentIndex > 0
        const showPrevBtn = hasEvents && this.state.currentIndex > 0
        // Botón next siempre visible si hay eventos (carrusel infinito)
        const showNextBtn = hasEvents

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
                        <div class="events-container" id="${this.id}-container" style="transform: translateX(-${this.calculateTranslateX()}%)">
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

                    ${!this.state.loading && !this.state.error ? this.renderIndicators() : ''}
                </div>
            </div>
        `
    }

    /**
     * Navega al anterior elemento
     */
    handlePrev() {
        if (this.isAnimating || this.state.currentIndex === 0) return

        this.isAnimating = true

        // Retroceder un elemento
        this.setState({ currentIndex: this.state.currentIndex - 1 })

        setTimeout(() => {
            this.isAnimating = false
        }, 600) // Duración de la animación CSS
    }

    /**
     * Navega al siguiente elemento (carrusel infinito)
     */
    handleNext() {
        if (this.isAnimating) return

        this.isAnimating = true

        const newIndex = this.state.currentIndex + 1
        const totalEventos = this.state.eventos.length

        // Si llegamos al final del primer set, hacer el salto instantáneo al clon
        if (newIndex >= totalEventos) {
            // Primero mostramos la animación hacia el clon
            this.setState({ currentIndex: newIndex })

            // Después de la animación, saltar instantáneamente al inicio sin animación
            setTimeout(() => {
                const container = document.getElementById(`${this.id}-container`)
                if (container) {
                    // Desactivar transición temporalmente
                    container.style.transition = 'none'

                    // Saltar al inicio (índice 0)
                    this.setState({ currentIndex: 0 }, false)

                    // Forzar reflow
                    container.offsetHeight

                    // Reactivar transición
                    setTimeout(() => {
                        container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                        this.isAnimating = false
                    }, 50)
                } else {
                    this.isAnimating = false
                }
            }, 600)
        } else {
            // Navegación normal
            this.setState({ currentIndex: newIndex })
            setTimeout(() => {
                this.isAnimating = false
            }, 600)
        }
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

        // Navegación con teclado (estilo Netflix)
        this.keyboardHandler = (e) => {
            // Solo funcionar si el carrusel está visible en el viewport
            const container = document.getElementById(this.id)
            if (!container) return

            const rect = container.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0

            if (isVisible) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    this.handleNext()
                } else if (e.key === 'ArrowLeft' && this.state.currentIndex > 0) {
                    e.preventDefault()
                    this.handlePrev()
                }
            }
        }
        window.addEventListener('keydown', this.keyboardHandler)

        // Hacer petición inicial (como useEffect([]))
        this.fetchEventos().then(() => {
            // Inicializar la clase del elemento cortado después de cargar eventos
            setTimeout(() => {
                this.updateClippedClass()
            }, 100)
        })

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

        // Event listeners para los indicadores
        const indicators = document.querySelectorAll(`#${this.id} .carousel-indicator`)
        indicators.forEach((indicator) => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index)
                if (!isNaN(index) && index !== this.state.currentIndex) {
                    this.goToSlide(index)
                }
            })
        })
    }

    /**
     * Navega a un slide específico
     */
    goToSlide(index) {
        if (this.isAnimating) return

        this.isAnimating = true
        this.setState({ currentIndex: index })

        setTimeout(() => {
            this.isAnimating = false
        }, 600)
    }

    /**
     * Limpia los event listeners cuando se desmonta
     */
    unmount() {
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler)
        }
        if (this.keyboardHandler) {
            window.removeEventListener('keydown', this.keyboardHandler)
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