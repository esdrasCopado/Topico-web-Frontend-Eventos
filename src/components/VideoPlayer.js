
/**
 * VideoPlayer Component
 *
 * Componente de video optimizado con:
 * - Lazy loading (preload="none")
 * - Soporte para poster (imagen de vista previa)
 * - Múltiples formatos (WebM, MP4)
 * - Carga solo cuando es necesario
 *
 * @example
 * const player = new VideoPlayer({
 *   sources: [
 *     { src: '/videos/demo.webm', type: 'video/webm' },
 *     { src: '/videos/demo.mp4', type: 'video/mp4' }
 *   ],
 *   poster: '/images/video-poster.jpg',
 *   controls: true,
 *   autoplay: false,
 *   muted: false,
 *   width: '100%',
 *   height: 'auto',
 *   className: 'custom-video'
 * })
 */
export class VideoPlayer {
    constructor(options = {}) {
        this.id = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Configuración por defecto
        this.sources = options.sources || []
        this.poster = options.poster || null
        this.controls = options.controls !== undefined ? options.controls : true
        this.autoplay = options.autoplay || false
        this.muted = options.muted || false
        this.loop = options.loop || false
        this.width = options.width || '100%'
        this.height = options.height || 'auto'
        this.className = options.className || ''
        this.lazy = options.lazy !== undefined ? options.lazy : true
        // Preload: 'none' | 'metadata' | 'auto' | null (usa lazy)
        // 'auto' = Estilo Netflix: precarga todo el video
        this.preload = options.preload || null
        this.onPlay = options.onPlay || null
        this.onPause = options.onPause || null
        this.onEnded = options.onEnded || null
        this.onError = options.onError || null

        // Nuevas opciones para rotación de videos
        this.sourceUrl = options.sourceUrl || null  // URL al archivo JSON
        this.sourceKey = options.sourceKey || 'backgroundVideos'  // Clave en el JSON
        this.rotateVideos = options.rotateVideos || false  // Activar rotación automática
        this.rotateInterval = options.rotateInterval || 30000  // Intervalo de rotación (ms)
        this.onVideoChange = options.onVideoChange || null  // Callback cuando cambia de video

        this.videoElement = null
        this.loaded = false
        this.observer = null

        // Estado de rotación
        this.videos = []  // Array de videos cargados desde JSON
        this.currentVideoIndex = 0
        this.rotateTimer = null
        this.isRotating = false
    }

    /**
     * Renderiza el componente de video
     * @returns {string} HTML del video
     */
    render() {
        const sourcesHTML = this.sources
            .map(source => `<source src="${source.src}" type="${source.type}">`)
            .join('\n                ')

        const posterAttr = this.poster ? `poster="${this.poster}"` : ''

        // Determinar el valor de preload
        let preloadValue = 'metadata'
        if (this.preload) {
            // Si se especifica preload explícitamente, usarlo
            preloadValue = this.preload
        } else if (this.lazy) {
            // Si lazy está activo, no precargar nada
            preloadValue = 'none'
        }
        const preloadAttr = `preload="${preloadValue}"`

        const controlsAttr = this.controls ? 'controls' : ''
        const autoplayAttr = this.autoplay ? 'autoplay' : ''
        const mutedAttr = this.muted ? 'muted' : ''
        const loopAttr = this.loop ? 'loop' : ''

        return `
            <div class="video-player-container ${this.className}" data-video-id="${this.id}">
                <video
                    id="${this.id}"
                    class="video-player"
                    ${preloadAttr}
                    ${posterAttr}
                    ${controlsAttr}
                    ${autoplayAttr}
                    ${mutedAttr}
                    ${loopAttr}
                    width="${this.width}"
                    height="${this.height}"
                    playsinline
                >
                    ${sourcesHTML}
                    <p class="video-fallback">
                        Tu navegador no soporta el elemento video.
                        <a href="${this.sources[0]?.src || '#'}">Descargar video</a>
                    </p>
                </video>
                ${!this.lazy ? '' : '<div class="video-loading-placeholder"></div>'}
            </div>
        `
    }

    /**
     * Monta el componente después del render
     * Configura eventos y lazy loading
     */
    async mount() {
        this.videoElement = document.getElementById(this.id)

        if (!this.videoElement) {
            console.error(`VideoPlayer: No se encontró el elemento con id ${this.id}`)
            return
        }

        // Si hay una URL de fuente JSON, cargar los videos
        if (this.sourceUrl) {
            await this._loadVideosFromJson()
        }

        // Configurar eventos
        this._setupEventListeners()

        // Configurar lazy loading con IntersectionObserver
        if (this.lazy) {
            this._setupLazyLoading()
        }

        // Nota: La rotación automática ahora se maneja con el evento 'ended' en _setupEventListeners
        // No necesitamos _startRotation() con setInterval
    }

    /**
     * Carga videos desde un archivo JSON
     * @private
     */
    async _loadVideosFromJson() {
        try {
            const response = await fetch(this.sourceUrl)

            if (!response.ok) {
                throw new Error(`Error al cargar ${this.sourceUrl}: ${response.status}`)
            }

            const data = await response.json()
            this.videos = data[this.sourceKey] || []

            if (this.videos.length === 0) {
                console.warn(`VideoPlayer ${this.id}: No se encontraron videos en "${this.sourceKey}"`)
                return
            }

            // Usar el primer video
            this.currentVideoIndex = 0
            this._updateVideoSource(this.videos[0])

        } catch (error) {
            console.error(`VideoPlayer ${this.id}: Error cargando videos desde JSON:`, error)
        }
    }

    /**
     * Actualiza la fuente del video
     * @private
     */
    _updateVideoSource(videoData) {
        if (!this.videoElement || !videoData) return

        // Pausar el video actual
        this.videoElement.pause()

        // Actualizar sources
        this.sources = videoData.sources || []
        this.poster = videoData.poster || null

        // Actualizar el poster
        if (this.poster) {
            this.videoElement.poster = this.poster
        }

        // Limpiar sources existentes
        while (this.videoElement.firstChild) {
            this.videoElement.removeChild(this.videoElement.firstChild)
        }

        // Agregar nuevas sources
        this.sources.forEach(source => {
            const sourceElement = document.createElement('source')
            sourceElement.src = source.src
            sourceElement.type = source.type
            this.videoElement.appendChild(sourceElement)
        })

        // Recargar el video
        this.videoElement.load()

        // Si estaba en autoplay, reproducir
        if (this.autoplay) {
            this.play()
        }

        // Llamar callback si existe
        if (this.onVideoChange) {
            this.onVideoChange(this.currentVideoIndex, videoData)
        }
    }

    /**
     * Configura los event listeners del video
     */
    _setupEventListeners() {
        if (this.onPlay) {
            this.videoElement.addEventListener('play', () => this.onPlay(this))
        }

        if (this.onPause) {
            this.videoElement.addEventListener('pause', () => this.onPause(this))
        }

        if (this.onEnded) {
            this.videoElement.addEventListener('ended', () => this.onEnded(this))
        }

        if (this.onError) {
            this.videoElement.addEventListener('error', (e) => this.onError(e, this))
        }

        // Rotación automática cuando termina el video
        if (this.rotateVideos && this.videos.length > 1) {
            this.videoElement.addEventListener('ended', () => {
                console.log(`Video ${this.id}: Terminó, cambiando al siguiente...`)
                this.nextVideo()
            })
        }

        // Log de debugging
        this.videoElement.addEventListener('loadstart', () => {
            console.log(`Video ${this.id}: Comenzando carga`)
        })

        this.videoElement.addEventListener('loadeddata', () => {
            console.log(`Video ${this.id}: Datos cargados`)
            this.loaded = true
        })
    }

    /**
     * Configura lazy loading usando IntersectionObserver
     * El video solo se carga cuando está visible en el viewport
     */
    _setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px', // Comenzar a cargar 50px antes de que sea visible
            threshold: 0.1 // 10% del video debe ser visible
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loaded) {
                    console.log(`Video ${this.id}: Entrando en viewport, cargando...`)
                    this.load()
                    this.observer.unobserve(entry.target)
                }
            })
        }, options)

        this.observer.observe(this.videoElement)
    }

    /**
     * Carga manualmente el video
     */
    load() {
        if (this.videoElement && !this.loaded) {
            this.videoElement.load()
            this.loaded = true
        }
    }

    /**
     * Reproduce el video
     * @returns {Promise}
     */
    async play() {
        if (!this.videoElement) return

        // Si no está cargado, cargarlo primero
        if (!this.loaded) {
            this.load()
        }

        try {
            await this.videoElement.play()
        } catch (error) {
            console.error(`Error al reproducir video ${this.id}:`, error)
        }
    }

    /**
     * Pausa el video
     */
    pause() {
        if (this.videoElement) {
            this.videoElement.pause()
        }
    }

    /**
     * Alterna entre play y pause
     */
    togglePlay() {
        if (!this.videoElement) return

        if (this.videoElement.paused) {
            this.play()
        } else {
            this.pause()
        }
    }

    /**
     * Establece el tiempo actual del video
     * @param {number} time - Tiempo en segundos
     */
    setCurrentTime(time) {
        if (this.videoElement) {
            this.videoElement.currentTime = time
        }
    }

    /**
     * Obtiene el tiempo actual del video
     * @returns {number} Tiempo en segundos
     */
    getCurrentTime() {
        return this.videoElement ? this.videoElement.currentTime : 0
    }

    /**
     * Obtiene la duración total del video
     * @returns {number} Duración en segundos
     */
    getDuration() {
        return this.videoElement ? this.videoElement.duration : 0
    }

    /**
     * Establece el volumen
     * @param {number} volume - Volumen entre 0 y 1
     */
    setVolume(volume) {
        if (this.videoElement) {
            this.videoElement.volume = Math.max(0, Math.min(1, volume))
        }
    }

    /**
     * Obtiene el estado del video
     * @returns {Object} Estado actual
     */
    getState() {
        if (!this.videoElement) return null

        return {
            paused: this.videoElement.paused,
            currentTime: this.videoElement.currentTime,
            duration: this.videoElement.duration,
            volume: this.videoElement.volume,
            muted: this.videoElement.muted,
            loaded: this.loaded,
            currentVideoIndex: this.currentVideoIndex,
            totalVideos: this.videos.length,
            isRotating: this.isRotating
        }
    }

    /**
     * Detiene la rotación automática
     * (La rotación ahora se maneja con el evento 'ended', pero mantenemos este método por compatibilidad)
     */
    stopRotation() {
        this.rotateVideos = false
    }

    /**
     * Cambia al siguiente video
     */
    nextVideo() {
        if (this.videos.length <= 1) return

        this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length
        this._updateVideoSource(this.videos[this.currentVideoIndex])
    }

    /**
     * Cambia al video anterior
     */
    previousVideo() {
        if (this.videos.length <= 1) return

        this.currentVideoIndex = this.currentVideoIndex - 1
        if (this.currentVideoIndex < 0) {
            this.currentVideoIndex = this.videos.length - 1
        }
        this._updateVideoSource(this.videos[this.currentVideoIndex])
    }

    /**
     * Cambia a un video específico por índice
     * @param {number} index - Índice del video
     */
    goToVideo(index) {
        if (index < 0 || index >= this.videos.length) {
            console.warn(`VideoPlayer ${this.id}: Índice ${index} fuera de rango`)
            return
        }

        this.currentVideoIndex = index
        this._updateVideoSource(this.videos[this.currentVideoIndex])
    }

    /**
     * Obtiene información del video actual
     * @returns {Object|null} Datos del video actual
     */
    getCurrentVideoInfo() {
        if (this.videos.length === 0) return null

        return {
            index: this.currentVideoIndex,
            total: this.videos.length,
            data: this.videos[this.currentVideoIndex]
        }
    }

    /**
     * Recarga los videos desde el JSON
     */
    async reloadVideos() {
        if (!this.sourceUrl) {
            console.warn(`VideoPlayer ${this.id}: No hay sourceUrl configurada`)
            return
        }

        await this._loadVideosFromJson()
    }

    /**
     * Limpia el componente y libera recursos
     */
    destroy() {
        // Detener rotación
        this.stopRotation()

        if (this.observer) {
            this.observer.disconnect()
        }

        if (this.videoElement) {
            this.videoElement.pause()
            this.videoElement.src = ''
            this.videoElement.load()
        }

    }
}
