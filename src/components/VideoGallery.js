import { VideoPlayer } from './VideoPlayer.js'

/**
 * VideoGallery Component
 *
 * Galería de videos optimizada con:
 * - Carga progresiva (un video a la vez)
 * - IntersectionObserver para lazy loading
 * - Precarga inteligente del siguiente video
 * - Control de reproducción automática
 *
 * @example
 * const gallery = new VideoGallery({
 *   videos: [
 *     {
 *       sources: [
 *         { src: '/videos/video1.webm', type: 'video/webm' },
 *         { src: '/videos/video1.mp4', type: 'video/mp4' }
 *       ],
 *       poster: '/images/poster1.jpg',
 *       title: 'Video 1',
 *       description: 'Descripción del video 1'
 *     },
 *     // ... más videos
 *   ],
 *   layout: 'grid', // 'grid' | 'list' | 'carousel'
 *   autoPreload: true,
 *   columns: 3
 * })
 */
export class VideoGallery {
    constructor(options = {}) {
        this.id = `video-gallery-${Date.now()}`
        this.videos = options.videos || []
        this.layout = options.layout || 'grid' // 'grid', 'list', 'carousel'
        this.autoPreload = options.autoPreload !== undefined ? options.autoPreload : true
        this.columns = options.columns || 3
        this.gap = options.gap || '20px'
        this.className = options.className || ''

        // Estado interno
        this.videoPlayers = []
        this.currentlyPlaying = null
        this.preloadIndex = 0
        this.mounted = false
    }

    /**
     * Renderiza la galería de videos
     * @returns {string} HTML de la galería
     */
    render() {
        const layoutClass = `gallery-layout-${this.layout}`
        const columnsStyle = this.layout === 'grid' ? `--columns: ${this.columns}; --gap: ${this.gap};` : ''

        const videosHTML = this.videos
            .map((videoData, index) => this._renderVideoCard(videoData, index))
            .join('\n')

        return `
            <div id="${this.id}" class="video-gallery ${layoutClass} ${this.className}" style="${columnsStyle}">
                ${videosHTML}
            </div>
        `
    }

    /**
     * Renderiza una tarjeta individual de video
     * @private
     */
    _renderVideoCard(videoData, index) {
        const playerId = `player-${this.id}-${index}`

        // Crear instancia del VideoPlayer
        const player = new VideoPlayer({
            ...videoData,
            lazy: true,
            controls: true,
            className: 'gallery-video',
            onPlay: () => this._handleVideoPlay(index),
            onEnded: () => this._handleVideoEnded(index)
        })

        // Guardar referencia
        this.videoPlayers.push(player)

        return `
            <div class="video-card" data-video-index="${index}">
                ${player.render()}
                ${videoData.title || videoData.description ? `
                    <div class="video-card-info">
                        ${videoData.title ? `<h3 class="video-title">${videoData.title}</h3>` : ''}
                        ${videoData.description ? `<p class="video-description">${videoData.description}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `
    }

    /**
     * Monta el componente después del render
     */
    mount() {
        if (this.mounted) return

        // Montar todos los VideoPlayers
        this.videoPlayers.forEach(player => player.mount())

        // Configurar precarga progresiva si está habilitada
        if (this.autoPreload) {
            this._setupProgressivePreload()
        }

        this.mounted = true
        console.log(`VideoGallery ${this.id}: Montada con ${this.videoPlayers.length} videos`)
    }

    /**
     * Configura la precarga progresiva de videos
     * Carga un video a la vez en orden
     * @private
     */
    _setupProgressivePreload() {
        // Esperar un momento antes de comenzar la precarga
        setTimeout(() => {
            this._preloadNext()
        }, 1000)
    }

    /**
     * Precarga el siguiente video en la cola
     * @private
     */
    _preloadNext() {
        if (this.preloadIndex >= this.videoPlayers.length) {
            console.log('VideoGallery: Todos los videos precargados')
            return
        }

        const player = this.videoPlayers[this.preloadIndex]

        console.log(`VideoGallery: Precargando video ${this.preloadIndex + 1}/${this.videoPlayers.length}`)

        // Cargar el video
        player.load()

        // Escuchar cuando termine de cargar para precargar el siguiente
        const videoElement = player.videoElement

        const onLoadedData = () => {
            console.log(`VideoGallery: Video ${this.preloadIndex + 1} cargado`)
            this.preloadIndex++

            // Precargar el siguiente después de un breve delay
            setTimeout(() => {
                this._preloadNext()
            }, 500)

            videoElement.removeEventListener('loadeddata', onLoadedData)
        }

        const onError = () => {
            console.error(`VideoGallery: Error cargando video ${this.preloadIndex + 1}`)
            this.preloadIndex++

            // Continuar con el siguiente incluso si hay error
            setTimeout(() => {
                this._preloadNext()
            }, 500)

            videoElement.removeEventListener('error', onError)
        }

        videoElement.addEventListener('loadeddata', onLoadedData)
        videoElement.addEventListener('error', onError)
    }

    /**
     * Maneja cuando un video comienza a reproducirse
     * @private
     */
    _handleVideoPlay(index) {
        console.log(`VideoGallery: Video ${index} comenzó a reproducirse`)

        // Pausar cualquier otro video que esté reproduciéndose
        if (this.currentlyPlaying !== null && this.currentlyPlaying !== index) {
            this.videoPlayers[this.currentlyPlaying].pause()
        }

        this.currentlyPlaying = index
    }

    /**
     * Maneja cuando un video termina de reproducirse
     * @private
     */
    _handleVideoEnded(index) {
        console.log(`VideoGallery: Video ${index} terminó`)

        // Opcional: reproducir el siguiente automáticamente
        // this.playNext()
    }

    /**
     * Reproduce un video específico por su índice
     * @param {number} index
     */
    playVideo(index) {
        if (index >= 0 && index < this.videoPlayers.length) {
            this.videoPlayers[index].play()
        }
    }

    /**
     * Pausa un video específico por su índice
     * @param {number} index
     */
    pauseVideo(index) {
        if (index >= 0 && index < this.videoPlayers.length) {
            this.videoPlayers[index].pause()
        }
    }

    /**
     * Pausa todos los videos
     */
    pauseAll() {
        this.videoPlayers.forEach(player => player.pause())
        this.currentlyPlaying = null
    }

    /**
     * Reproduce el siguiente video
     */
    playNext() {
        if (this.currentlyPlaying !== null) {
            const nextIndex = this.currentlyPlaying + 1
            if (nextIndex < this.videoPlayers.length) {
                this.playVideo(nextIndex)
            }
        }
    }

    /**
     * Reproduce el video anterior
     */
    playPrevious() {
        if (this.currentlyPlaying !== null) {
            const prevIndex = this.currentlyPlaying - 1
            if (prevIndex >= 0) {
                this.playVideo(prevIndex)
            }
        }
    }

    /**
     * Obtiene el video actualmente reproduciéndose
     * @returns {VideoPlayer|null}
     */
    getCurrentVideo() {
        if (this.currentlyPlaying !== null) {
            return this.videoPlayers[this.currentlyPlaying]
        }
        return null
    }

    /**
     * Obtiene todos los videos cargados
     * @returns {Array<boolean>}
     */
    getLoadedStatus() {
        return this.videoPlayers.map(player => player.loaded)
    }

    /**
     * Precarga manualmente todos los videos restantes
     * Útil cuando el usuario interactúa y quieres acelerar la carga
     */
    preloadAll() {
        console.log('VideoGallery: Precargando todos los videos restantes...')
        this.videoPlayers.forEach((player, index) => {
            if (!player.loaded) {
                setTimeout(() => {
                    player.load()
                }, index * 200) // Delay escalonado para no sobrecargar
            }
        })
    }

    /**
     * Limpia la galería y libera recursos
     */
    destroy() {
        this.videoPlayers.forEach(player => player.destroy())
        this.videoPlayers = []
        this.currentlyPlaying = null
        this.mounted = false
        console.log(`VideoGallery ${this.id}: Destruida`)
    }
}
