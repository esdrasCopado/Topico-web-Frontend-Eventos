/**
 * VideoControls Component
 *
 * Controles personalizados para el video de fondo
 * Incluye: Play/Pause, Mute/Unmute, Skip Forward/Backward
 *
 * @example
 * const controls = new VideoControls({
 *   videoPlayer: myVideoPlayer,
 *   showPlayPause: true,
 *   showMute: true,
 *   showSkip: true,
 *   skipSeconds: 10
 * })
 */
export class VideoControls {
    constructor(options = {}) {
        this.id = `video-controls-${Date.now()}`
        this.videoPlayer = options.videoPlayer || null
        this.showPlayPause = options.showPlayPause !== undefined ? options.showPlayPause : true
        this.showMute = options.showMute !== undefined ? options.showMute : true
        this.showSkip = options.showSkip !== undefined ? options.showSkip : true
        this.skipSeconds = options.skipSeconds || 10
        this.position = options.position || 'bottom-right' // 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center'

        this.isMuted = this.videoPlayer?.muted || false
        this.isPlaying = false
        this.lastVolume = 100 // Guardar el último volumen antes de mutear
    }

    /**
     * Renderiza los controles
     * @returns {string} HTML de los controles
     */
    render() {
        const positionClass = `controls-position-${this.position}`

        return `
            <div id="${this.id}" class="video-controls ${positionClass}">
                ${this.showSkip ? `
                    <button class="video-control-btn btn-skip-back" data-action="skip-back" title="Retroceder ${this.skipSeconds}s">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                        </svg>
                        <span class="skip-time">-${this.skipSeconds}s</span>
                    </button>
                ` : ''}

                ${this.showPlayPause ? `
                    <button class="video-control-btn btn-play-pause" data-action="play-pause" title="Play/Pause">
                        <svg class="icon-play" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="icon-pause" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    </button>
                ` : ''}

                ${this.showSkip ? `
                    <button class="video-control-btn btn-skip-forward" data-action="skip-forward" title="Avanzar ${this.skipSeconds}s">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 19l7-7-7-7M5 19l7-7-7-7"/>
                        </svg>
                        <span class="skip-time">+${this.skipSeconds}s</span>
                    </button>
                ` : ''}

                ${this.showMute ? `
                    <div class="volume-control-wrapper">
                        <button class="video-control-btn btn-mute" data-action="mute" title="Mute/Unmute">
                            <svg class="icon-volume" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                            <svg class="icon-mute" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                            </svg>
                        </button>
                        <div class="volume-slider-container">
                            <input
                                type="range"
                                class="volume-slider"
                                min="0"
                                max="100"
                                value="100"
                                orient="vertical"
                                title="Volumen"
                            />
                            <div class="volume-percentage">100%</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `
    }

    /**
     * Monta los controles y configura eventos
     */
    mount() {
        if (!this.videoPlayer || !this.videoPlayer.videoElement) {
            console.error('VideoControls: No se encontró el videoPlayer')
            return
        }

        const controlsElement = document.getElementById(this.id)
        if (!controlsElement) {
            console.error('VideoControls: No se encontró el elemento de controles')
            return
        }

        // Configurar eventos de los botones
        this._setupEventListeners(controlsElement)

        // Sincronizar estado inicial
        this._updatePlayPauseButton()
        this._updateMuteButton()

        // Escuchar eventos del video
        this.videoPlayer.videoElement.addEventListener('play', () => {
            this.isPlaying = true
            this._updatePlayPauseButton()
        })

        this.videoPlayer.videoElement.addEventListener('pause', () => {
            this.isPlaying = false
            this._updatePlayPauseButton()
        })

        this.videoPlayer.videoElement.addEventListener('volumechange', () => {
            this.isMuted = this.videoPlayer.videoElement.muted
            this._updateMuteButton()
        })

        console.log(`VideoControls montados: ${this.id}`)
    }

    /**
     * Configura los event listeners de los botones
     * @private
     */
    _setupEventListeners(controlsElement) {
        const buttons = controlsElement.querySelectorAll('.video-control-btn')

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault()
                const action = button.dataset.action

                switch (action) {
                    case 'play-pause':
                        this._togglePlayPause()
                        break
                    case 'mute':
                        this._toggleMute()
                        break
                    case 'skip-back':
                        this._skipBack()
                        break
                    case 'skip-forward':
                        this._skipForward()
                        break
                }
            })
        })

        // Configurar slider de volumen
        const volumeSlider = controlsElement.querySelector('.volume-slider')
        if (volumeSlider) {
            // Establecer volumen inicial
            const videoElement = this.videoPlayer.videoElement
            const initialVolume = videoElement.muted ? 0 : videoElement.volume * 100
            this.lastVolume = videoElement.volume * 100 // Guardar el volumen real
            volumeSlider.value = initialVolume
            this._updateVolumeDisplay(initialVolume)

            // Listener para cambios de volumen
            volumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value)
                this._setVolume(volume)
            })

            // Prevenir que el click en el slider cierre otros elementos
            volumeSlider.addEventListener('click', (e) => {
                e.stopPropagation()
            })
        }
    }

    /**
     * Alterna entre play y pause
     * @private
     */
    _togglePlayPause() {
        if (this.videoPlayer.videoElement.paused) {
            this.videoPlayer.play()
        } else {
            this.videoPlayer.pause()
        }
    }

    /**
     * Alterna entre mute y unmute
     * @private
     */
    _toggleMute() {
        const videoElement = this.videoPlayer.videoElement

        if (videoElement.muted) {
            // Desmutear y restaurar volumen anterior
            videoElement.muted = false
            this.isMuted = false
            videoElement.volume = this.lastVolume / 100
            this._updateVolumeDisplay(this.lastVolume)
        } else {
            // Mutear y guardar volumen actual
            this.lastVolume = videoElement.volume * 100
            videoElement.muted = true
            this.isMuted = true
            this._updateVolumeDisplay(0)
        }

        this._updateMuteButton()
    }

    /**
     * Retrocede el video
     * @private
     */
    _skipBack() {
        const currentTime = this.videoPlayer.getCurrentTime()
        this.videoPlayer.setCurrentTime(Math.max(0, currentTime - this.skipSeconds))
        this._showSkipFeedback('back')
    }

    /**
     * Avanza el video
     * @private
     */
    _skipForward() {
        const currentTime = this.videoPlayer.getCurrentTime()
        const duration = this.videoPlayer.getDuration()
        this.videoPlayer.setCurrentTime(Math.min(duration, currentTime + this.skipSeconds))
        this._showSkipFeedback('forward')
    }

    /**
     * Actualiza el icono de play/pause
     * @private
     */
    _updatePlayPauseButton() {
        const controlsElement = document.getElementById(this.id)
        if (!controlsElement) return

        const playIcon = controlsElement.querySelector('.icon-play')
        const pauseIcon = controlsElement.querySelector('.icon-pause')

        if (this.isPlaying) {
            playIcon.style.display = 'none'
            pauseIcon.style.display = 'block'
        } else {
            playIcon.style.display = 'block'
            pauseIcon.style.display = 'none'
        }
    }

    /**
     * Actualiza el icono de mute/unmute
     * @private
     */
    _updateMuteButton() {
        const controlsElement = document.getElementById(this.id)
        if (!controlsElement) return

        const volumeIcon = controlsElement.querySelector('.icon-volume')
        const muteIcon = controlsElement.querySelector('.icon-mute')

        if (this.isMuted) {
            volumeIcon.style.display = 'none'
            muteIcon.style.display = 'block'
        } else {
            volumeIcon.style.display = 'block'
            muteIcon.style.display = 'none'
        }
    }

    /**
     * Muestra feedback visual al hacer skip
     * @private
     */
    _showSkipFeedback(direction) {
        const controlsElement = document.getElementById(this.id)
        if (!controlsElement) return

        const button = controlsElement.querySelector(
            direction === 'back' ? '.btn-skip-back' : '.btn-skip-forward'
        )

        // Agregar clase de feedback
        button.classList.add('skip-feedback')

        // Remover después de la animación
        setTimeout(() => {
            button.classList.remove('skip-feedback')
        }, 300)
    }

    /**
     * Establece el volumen del video
     * @private
     * @param {number} volume - Volumen de 0 a 100
     */
    _setVolume(volume) {
        const videoElement = this.videoPlayer.videoElement
        const volumeDecimal = volume / 100

        videoElement.volume = volumeDecimal

        // Auto-unmute si se sube el volumen
        if (volume > 0 && videoElement.muted) {
            videoElement.muted = false
            this.isMuted = false
            this._updateMuteButton()
        }

        // Auto-mute si el volumen es 0
        if (volume === 0 && !videoElement.muted) {
            videoElement.muted = true
            this.isMuted = true
            this._updateMuteButton()
        }

        this._updateVolumeDisplay(volume)
    }

    /**
     * Actualiza el display del porcentaje de volumen
     * @private
     * @param {number} volume - Volumen de 0 a 100
     */
    _updateVolumeDisplay(volume) {
        const controlsElement = document.getElementById(this.id)
        if (!controlsElement) return

        const volumePercentage = controlsElement.querySelector('.volume-percentage')
        if (volumePercentage) {
            volumePercentage.textContent = `${Math.round(volume)}%`
        }

        // Actualizar slider si el volumen cambió externamente
        const volumeSlider = controlsElement.querySelector('.volume-slider')
        if (volumeSlider) {
            if (Math.abs(volumeSlider.value - volume) > 1) {
                volumeSlider.value = volume
            }
            // Actualizar variable CSS para el gradiente del progreso
            volumeSlider.style.setProperty('--volume-percentage', `${volume}%`)
        }
    }

    /**
     * Cambia la posición de los controles
     * @param {string} position - Nueva posición
     */
    setPosition(position) {
        const controlsElement = document.getElementById(this.id)
        if (!controlsElement) return

        // Remover clase anterior
        controlsElement.className = controlsElement.className
            .replace(/controls-position-\S+/g, '')

        // Agregar nueva clase
        this.position = position
        controlsElement.classList.add(`controls-position-${position}`)
    }

    /**
     * Muestra u oculta los controles
     * @param {boolean} show
     */
    toggle(show) {
        const controlsElement = document.getElementById(this.id)
        if (!controlsElement) return

        if (show) {
            controlsElement.classList.remove('hidden')
        } else {
            controlsElement.classList.add('hidden')
        }
    }

    /**
     * Limpia los controles
     */
    destroy() {
        const controlsElement = document.getElementById(this.id)
        if (controlsElement) {
            controlsElement.remove()
        }
        console.log(`VideoControls destruidos: ${this.id}`)
    }
}
