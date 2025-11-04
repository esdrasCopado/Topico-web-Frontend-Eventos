import '../assets/css/pages/home.css'
import '../assets/css/components/MainCards.css'
import '../assets/css/components/VideoControls.css'
import '../assets/css/components/VideoNavigation.css'
import { NavBar } from '../components/NavBar.js'
import { EventsList } from '../components/EventsList.js'
import { VideoPlayer } from '../components/VideoPlayer.js'
import { VideoControls } from '../components/VideoControls.js'
import { VideoNavigation } from '../components/VideoNavigation.js'
import { initAutoScroll } from '../utils/smoothScroll.js'

export class HomePage {
    constructor(params) {
        this.params = params
        this.cleanupAutoScroll = null  // Guardar función de cleanup

        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname
        })
        this.eventsList = new EventsList()

        this.heroVideo = new VideoPlayer({
            sourceUrl: '/source.json',           // Cargar videos desde JSON
            sourceKey: 'backgroundVideos',       // Clave en el JSON
            rotateVideos: true,                  // Activar rotación automática
            rotateInterval: 30000,               // Cambiar video cada 30 segundos
            autoplay: true,                      // Reproducir automáticamente
            muted: true,                         // Necesario para autoplay
            loop: true,                          // Repetir cada video
            controls: false,                     // Sin controles nativos (usaremos personalizados)
            lazy: false,                         // Cargar inmediatamente
            preload: 'metadata',                     // Estilo Netflix: precarga todo el video
            className: 'hero-background-video'
        })

        this.videoControls = new VideoControls({
            videoPlayer: null,  // Se asignará después de montar el video
            showPlayPause: true,
            showMute: true,
            showSkip: true,
            skipSeconds: 10,
            position: 'bottom-right'  // 'bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left'
        })

        this.videoNavigation = new VideoNavigation({
            videoPlayer: null,  // Se asignará después de montar el video
            showIndicators: true,
            onNavigate: (direction, index) => {
                console.log(`Navegando ${direction} al video ${index}`)
            }
        })



    }

    render() {
        return `

            ${this.navbar.render()}

            <div class="video-background fade-bottom-strong">
                ${this.heroVideo.render()}
                ${this.videoNavigation.render()}
            </div>

            <!-- Controles personalizados del video -->
            ${this.videoControls.render()}

            <div class="page-container">
                <div id="hero-container" class="hero" style="position: relative; overflow: hidden;">
                    ${this.eventsList.render()}
                </div>
            </div>
        `
    }

    afterRender() {
        if('connection' in navigator) {
            console.log('Información de conexión detectada:', navigator.connection)
            if(navigator.connection.type === 'cellular' || navigator.connection.effectiveType.includes('2g') || navigator.connection.effectiveType.includes('3g')) {
                // se detecta conexión celular o lenta, pausar el video
                this.heroVideo.pause()
            }
        }

        this.navbar.mount()
        this.heroVideo.mount()  // Montar el video de fondo

        // Asignar el videoPlayer a los controles y montarlos
        this.videoControls.videoPlayer = this.heroVideo
        this.videoControls.mount()

        // Asignar el videoPlayer a la navegación y montarla
        this.videoNavigation.videoPlayer = this.heroVideo
        this.videoNavigation.mount()

        this.eventsList.mount()  // ← Esto hace la petición HTTP!

        // Inicializar auto-scroll después de que todo esté montado
        this.cleanupAutoScroll = initAutoScroll({
            targetSelector: '#hero-container',
            scrollDuration: 1,
            scrollOffset: -100,
            debounceDelay: 100,
            lenis: window.lenis  // Usar la instancia global de Lenis si existe
        })
    }

    // Método de limpieza para cuando se destruya la página (útil en SPAs)
    destroy() {
        if (this.cleanupAutoScroll) {
            this.cleanupAutoScroll()
            this.cleanupAutoScroll = null
        }
    }
}