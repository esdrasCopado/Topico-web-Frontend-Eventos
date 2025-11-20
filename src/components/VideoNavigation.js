/**
 * VideoNavigation Component
 *
 * Botones de navegación (anterior/siguiente) para el VideoPlayer
 * Se posicionan a los costados del video para cambiar entre videos
 *
 * @example
 * const navigation = new VideoNavigation({
 *   videoPlayer: myVideoPlayer,
 *   showIndicators: true
 * })
 */
export class VideoNavigation {
    constructor(options = {}) {
        this.id = `video-navigation-${Date.now()}`
        this.videoPlayer = options.videoPlayer || null
        this.showIndicators = options.showIndicators !== undefined ? options.showIndicators : true
        this.onNavigate = options.onNavigate || null
    }

    /**
     * Renderiza los botones de navegación
     * @returns {string} HTML de los botones
     */
    render() {
        return `
            <div id="${this.id}" class="video-navigation">
                <!-- Botón Anterior -->
                <button class="video-nav-btn video-nav-prev" data-action="prev" title="Video anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <!-- Botón Siguiente -->
                <button class="video-nav-btn video-nav-next" data-action="next" title="Video siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        `
    }

    /**
     * Monta el componente después del render
     */
    mount() {
        if (!this.videoPlayer) {
            console.error('VideoNavigation: No se encontró el videoPlayer')
            return
        }

        console.log('VideoNavigation: VideoPlayer encontrado:', this.videoPlayer)
        console.log('VideoNavigation: Videos disponibles:', this.videoPlayer.videos)
        console.log('VideoNavigation: Total de videos:', this.videoPlayer.videos ? this.videoPlayer.videos.length : 0)

        const navElement = document.getElementById(this.id)
        if (!navElement) {
            console.error('VideoNavigation: No se encontró el elemento de navegación')
            return
        }

        console.log('VideoNavigation: Elemento de navegación encontrado:', navElement)

        // Configurar eventos
        this._setupEventListeners(navElement)

        // Actualizar indicadores
        if (this.showIndicators) {
            this._updateIndicators()
        }

        // Actualizar estado de botones
        this._updateButtonStates()

        // Escuchar cambios de video
        if (this.videoPlayer.onVideoChange) {
            const originalCallback = this.videoPlayer.onVideoChange
            this.videoPlayer.onVideoChange = (index, videoData) => {
                originalCallback(index, videoData)
                this._updateIndicators()
                this._updateButtonStates()
            }
        } else {
            this.videoPlayer.onVideoChange = () => {
                this._updateIndicators()
                this._updateButtonStates()
            }
        }

        console.log(`VideoNavigation ${this.id}: Montado`)
    }

    /**
     * Configura los event listeners de los botones
     * @private
     */
    _setupEventListeners(navElement) {
        const prevBtn = navElement.querySelector('.video-nav-prev')
        const nextBtn = navElement.querySelector('.video-nav-next')

        console.log('VideoNavigation: Configurando event listeners')
        console.log('VideoNavigation: prevBtn encontrado:', prevBtn)
        console.log('VideoNavigation: nextBtn encontrado:', nextBtn)

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                console.log('VideoNavigation: Evento click detectado en prevBtn')
                e.preventDefault()
                e.stopPropagation()
                this._handlePrevious()
            })
        } else {
            console.error('VideoNavigation: No se encontró el botón anterior')
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                console.log('VideoNavigation: Evento click detectado en nextBtn')
                e.preventDefault()
                e.stopPropagation()
                this._handleNext()
            })
        } else {
            console.error('VideoNavigation: No se encontró el botón siguiente')
        }

        // Soporte para teclado (flechas izquierda/derecha)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this._handlePrevious()
            } else if (e.key === 'ArrowRight') {
                this._handleNext()
            }
        })
    }

    /**
     * Maneja el click en el botón anterior
     * @private
     */
    _handlePrevious() {
        console.log('VideoNavigation: Click en botón anterior')
        if (!this.videoPlayer) {
            console.error('VideoNavigation: No hay videoPlayer disponible')
            return
        }

        console.log('VideoNavigation: Llamando a previousVideo()')
        this.videoPlayer.previousVideo()

        if (this.onNavigate) {
            this.onNavigate('prev', this.videoPlayer.currentVideoIndex)
        }
    }

    /**
     * Maneja el click en el botón siguiente
     * @private
     */
    _handleNext() {
        console.log('VideoNavigation: Click en botón siguiente')
        if (!this.videoPlayer) {
            console.error('VideoNavigation: No hay videoPlayer disponible')
            return
        }

        console.log('VideoNavigation: Llamando a nextVideo()')
        this.videoPlayer.nextVideo()

        if (this.onNavigate) {
            this.onNavigate('next', this.videoPlayer.currentVideoIndex)
        }
    }

    /**
     * Actualiza los indicadores de posición
     * @private
     */
    _updateIndicators() {
        if (!this.showIndicators) return

        const indicatorContainer = document.getElementById(`${this.id}-indicator`)
        if (!indicatorContainer) return

        const totalVideos = this.videoPlayer.videos.length
        const currentIndex = this.videoPlayer.currentVideoIndex

        // Generar los dots
        const dotsHTML = Array.from({ length: totalVideos }, (_, i) => {
            const activeClass = i === currentIndex ? 'active' : ''
            return `<div class="video-nav-dot ${activeClass}"></div>`
        }).join('')

        indicatorContainer.innerHTML = dotsHTML
    }

    /**
     * Actualiza el estado de los botones (habilitado/deshabilitado)
     * @private
     */
    _updateButtonStates() {
        const navElement = document.getElementById(this.id)
        if (!navElement) return

        const prevBtn = navElement.querySelector('.video-nav-prev')
        const nextBtn = navElement.querySelector('.video-nav-next')

        // Verificar si los videos ya están cargados
        if (!this.videoPlayer.videos || this.videoPlayer.videos.length === 0) {
            // Videos aún no cargados, habilitar botones de todas formas
            if (prevBtn) prevBtn.disabled = false
            if (nextBtn) nextBtn.disabled = false
            return
        }

        const totalVideos = this.videoPlayer.videos.length

        // Si solo hay un video, ocultar la navegación
        if (totalVideos <= 1) {
            navElement.classList.add('single-video')
            return
        } else {
            navElement.classList.remove('single-video')
        }

        // La navegación es circular, siempre habilitada cuando hay múltiples videos
        if (prevBtn) {
            prevBtn.disabled = false
        }

        if (nextBtn) {
            nextBtn.disabled = false
        }
    }

    /**
     * Muestra u oculta los botones de navegación
     * @param {boolean} show
     */
    toggle(show) {
        const navElement = document.getElementById(this.id)
        if (!navElement) return

        if (show) {
            navElement.style.display = 'flex'
        } else {
            navElement.style.display = 'none'
        }
    }

    /**
     * Limpia el componente
     */
    destroy() {
        const navElement = document.getElementById(this.id)
        if (navElement) {
            navElement.remove()
        }

        const indicatorElement = document.getElementById(`${this.id}-indicator`)
        if (indicatorElement) {
            indicatorElement.remove()
        }

        console.log(`VideoNavigation ${this.id}: Destruido`)
    }
}
