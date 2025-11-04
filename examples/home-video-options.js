/**
 * OPCIONES PARA USAR VIDEO EN HOME.JS
 *
 * Aquí tienes 3 opciones diferentes para implementar videos
 * en tu página de inicio. Copia el código que prefieras.
 */

import '../assets/css/components/MainCards.css'
import '../assets/css/components/VideoPlayer.css'
import { NavBar } from '../components/NavBar.js'
import { EventsList } from '../components/EventsList.js'
import { VideoPlayer } from '../components/VideoPlayer.js'
import { VideoGallery } from '../components/VideoGallery.js'

// ============================================
// OPCIÓN 1: VIDEO DE FONDO HERO (YA IMPLEMENTADA)
// ============================================
// Video de fondo automático detrás del título
// Perfecto para: Landing pages modernas, sitios corporativos

export class HomePage_Option1 {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname
        })
        this.eventsList = new EventsList()

        // Video de fondo automático
        this.heroVideo = new VideoPlayer({
            sources: [
                { src: '/videos/hero-background.webm', type: 'video/webm' },
                { src: '/videos/hero-background.mp4', type: 'video/mp4' }
            ],
            poster: '/images/hero-poster.jpg',
            autoplay: true,
            muted: true,
            loop: true,
            controls: false,
            lazy: false,
            className: 'hero-background-video'
        })
    }

    render() {
        return `
            ${this.navbar.render()}

            <div class="page-container">
                <div class="hero" style="position: relative; overflow: hidden; min-height: 400px;">
                    <!-- Video de fondo -->
                    <div class="video-background" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;">
                        ${this.heroVideo.render()}
                        <!-- Overlay oscuro para legibilidad del texto -->
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);"></div>
                    </div>

                    <!-- Contenido sobre el video -->
                    <div style="position: relative; z-index: 1; color: white; text-align: center; padding: 60px 20px;">
                        <h1 style="font-size: 48px; margin-bottom: 20px;">Bienvenido a tu Aplicación Web</h1>
                        <p style="font-size: 20px; margin-bottom: 40px;">Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>
                    </div>

                    ${this.eventsList.render()}
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.mount()
        this.heroVideo.mount()
        this.eventsList.mount()
        console.log('HomePage opción 1: Video de fondo hero')
    }
}

// ============================================
// OPCIÓN 2: VIDEO TUTORIAL DESTACADO
// ============================================
// Video tutorial con controles arriba de los eventos
// Perfecto para: Tutoriales, demos, explicaciones

export class HomePage_Option2 {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname
        })
        this.eventsList = new EventsList()

        // Video tutorial con controles
        this.tutorialVideo = new VideoPlayer({
            sources: [
                { src: '/videos/tutorial-intro.webm', type: 'video/webm' },
                { src: '/videos/tutorial-intro.mp4', type: 'video/mp4' }
            ],
            poster: '/images/tutorial-poster.jpg',
            controls: true,
            autoplay: false,
            muted: false,
            lazy: true,  // Carga cuando es visible
            width: '100%',
            className: 'tutorial-video'
        })
    }

    render() {
        return `
            ${this.navbar.render()}

            <div class="page-container">
                <div class="hero">
                    <h1>Bienvenido a tu Aplicación Web</h1>
                    <p>Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>

                    <!-- Sección de video tutorial -->
                    <div style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
                        <h2 style="margin-bottom: 20px; font-size: 24px;">Cómo Usar la Plataforma</h2>
                        <div class="video-background">
                            ${this.tutorialVideo.render()}
                        </div>
                        <p style="margin-top: 12px; color: #666; font-size: 14px;">
                            Aprende en 3 minutos cómo crear y gestionar tus eventos
                        </p>
                    </div>

                    ${this.eventsList.render()}
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.mount()
        this.tutorialVideo.mount()
        this.eventsList.mount()
        console.log('HomePage opción 2: Video tutorial destacado')
    }
}

// ============================================
// OPCIÓN 3: GALERÍA DE VIDEOS DESTACADOS
// ============================================
// Galería de videos (estilo YouTube/Netflix)
// Perfecto para: Múltiples tutoriales, eventos pasados, testimonios

export class HomePage_Option3 {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname
        })
        this.eventsList = new EventsList()

        // Galería de videos
        this.videoGallery = new VideoGallery({
            videos: [
                {
                    sources: [
                        { src: '/videos/intro.webm', type: 'video/webm' },
                        { src: '/videos/intro.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/intro-poster.jpg',
                    title: 'Introducción a la Plataforma',
                    description: 'Conoce las funcionalidades principales'
                },
                {
                    sources: [
                        { src: '/videos/crear-evento.webm', type: 'video/webm' },
                        { src: '/videos/crear-evento.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/crear-evento-poster.jpg',
                    title: 'Cómo Crear tu Primer Evento',
                    description: 'Guía paso a paso para organizadores'
                },
                {
                    sources: [
                        { src: '/videos/comprar-tickets.webm', type: 'video/webm' },
                        { src: '/videos/comprar-tickets.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/tickets-poster.jpg',
                    title: 'Comprar Tickets',
                    description: 'Proceso de compra fácil y rápido'
                }
            ],
            layout: 'grid',  // 'grid', 'list', o 'carousel'
            columns: 3,
            autoPreload: true
        })
    }

    render() {
        return `
            ${this.navbar.render()}

            <div class="page-container">
                <div class="hero">
                    <h1>Bienvenido a tu Aplicación Web</h1>
                    <p>Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>

                    <!-- Sección de galería de videos -->
                    <div style="margin: 60px 0;">
                        <h2 style="margin-bottom: 30px; font-size: 28px; text-align: center;">Tutoriales Destacados</h2>
                        <div class="video-background">
                            ${this.videoGallery.render()}
                        </div>
                    </div>

                    ${this.eventsList.render()}
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.mount()
        this.videoGallery.mount()
        this.eventsList.mount()
        console.log('HomePage opción 3: Galería de videos')
    }
}

// ============================================
// OPCIÓN 4: CARRUSEL DE VIDEOS (ESTILO NETFLIX)
// ============================================
// Videos en carrusel horizontal
// Perfecto para: Eventos destacados, testimonios en video

export class HomePage_Option4 {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname
        })
        this.eventsList = new EventsList()

        // Carrusel de videos
        this.carousel = new VideoGallery({
            videos: [
                {
                    sources: [
                        { src: '/videos/evento1.webm', type: 'video/webm' },
                        { src: '/videos/evento1.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/evento1-poster.jpg',
                    title: 'Festival de Música 2024'
                },
                {
                    sources: [
                        { src: '/videos/evento2.webm', type: 'video/webm' },
                        { src: '/videos/evento2.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/evento2-poster.jpg',
                    title: 'Conferencia Tech'
                },
                {
                    sources: [
                        { src: '/videos/evento3.webm', type: 'video/webm' },
                        { src: '/videos/evento3.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/evento3-poster.jpg',
                    title: 'Exposición de Arte'
                },
                {
                    sources: [
                        { src: '/videos/evento4.webm', type: 'video/webm' },
                        { src: '/videos/evento4.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/evento4-poster.jpg',
                    title: 'Evento Deportivo'
                }
            ],
            layout: 'carousel',
            autoPreload: true
        })
    }

    render() {
        return `
            ${this.navbar.render()}

            <div class="page-container">
                <div class="hero">
                    <h1>Bienvenido a tu Aplicación Web</h1>
                    <p>Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>

                    <!-- Carrusel de videos -->
                    <div style="margin: 60px 0;">
                        <h2 style="margin-bottom: 20px; font-size: 24px;">Eventos Destacados</h2>
                        <div class="video-background">
                            ${this.carousel.render()}
                        </div>
                    </div>

                    ${this.eventsList.render()}
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.mount()
        this.carousel.mount()
        this.eventsList.mount()
        console.log('HomePage opción 4: Carrusel de videos')
    }
}

// ============================================
// OPCIÓN 5: COMBINADO (Hero + Galería)
// ============================================
// Video de fondo + galería de tutoriales abajo
// Perfecto para: Máximo impacto visual

export class HomePage_Option5 {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar({
            brand: 'Eventos App',
            currentPath: window.location.pathname
        })
        this.eventsList = new EventsList()

        // Video de fondo
        this.heroVideo = new VideoPlayer({
            sources: [
                { src: '/videos/hero.webm', type: 'video/webm' },
                { src: '/videos/hero.mp4', type: 'video/mp4' }
            ],
            poster: '/images/hero-poster.jpg',
            autoplay: true,
            muted: true,
            loop: true,
            controls: false,
            lazy: false
        })

        // Galería de tutoriales
        this.tutorialsGallery = new VideoGallery({
            videos: [
                {
                    sources: [
                        { src: '/videos/tutorial1.webm', type: 'video/webm' },
                        { src: '/videos/tutorial1.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/tutorial1-poster.jpg',
                    title: 'Tutorial 1',
                    description: 'Primeros pasos'
                },
                {
                    sources: [
                        { src: '/videos/tutorial2.webm', type: 'video/webm' },
                        { src: '/videos/tutorial2.mp4', type: 'video/mp4' }
                    ],
                    poster: '/images/tutorial2-poster.jpg',
                    title: 'Tutorial 2',
                    description: 'Funciones avanzadas'
                }
            ],
            layout: 'grid',
            columns: 2,
            autoPreload: true
        })
    }

    render() {
        return `
            ${this.navbar.render()}

            <!-- Hero con video de fondo -->
            <div style="position: relative; overflow: hidden; min-height: 500px; margin-bottom: 80px;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;">
                    ${this.heroVideo.render()}
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);"></div>
                </div>
                <div style="position: relative; z-index: 1; color: white; text-align: center; padding: 120px 20px;">
                    <h1 style="font-size: 56px; margin-bottom: 20px;">Bienvenido a Eventos App</h1>
                    <p style="font-size: 24px;">Tu plataforma de eventos</p>
                </div>
            </div>

            <div class="page-container">
                <div class="hero">
                    <!-- Galería de tutoriales -->
                    <div style="margin-bottom: 60px;">
                        <h2 style="margin-bottom: 30px; font-size: 28px; text-align: center;">Aprende a Usar la Plataforma</h2>
                        ${this.tutorialsGallery.render()}
                    </div>

                    ${this.eventsList.render()}
                </div>
            </div>
        `
    }

    afterRender() {
        this.navbar.mount()
        this.heroVideo.mount()
        this.tutorialsGallery.mount()
        this.eventsList.mount()
        console.log('HomePage opción 5: Combinado (Hero + Galería)')
    }
}

// ============================================
// INSTRUCCIONES DE USO
// ============================================

/*

CÓMO ELEGIR LA MEJOR OPCIÓN:

1. OPCIÓN 1 (Video de Fondo Hero) - YA IMPLEMENTADA
   ✓ Usa cuando: Quieres impacto visual inmediato
   ✓ Mejor para: Landing pages, sitios corporativos
   ✓ Requiere: 1 video corto (15-30s) de alta calidad

2. OPCIÓN 2 (Video Tutorial Destacado)
   ✓ Usa cuando: Quieres explicar cómo funciona la plataforma
   ✓ Mejor para: Nuevos usuarios, onboarding
   ✓ Requiere: 1 video tutorial (2-5 min)

3. OPCIÓN 3 (Galería de Videos)
   ✓ Usa cuando: Tienes múltiples videos importantes
   ✓ Mejor para: Tutoriales variados, testimonios
   ✓ Requiere: 3+ videos cortos (1-3 min cada uno)

4. OPCIÓN 4 (Carrusel Estilo Netflix)
   ✓ Usa cuando: Quieres mostrar eventos pasados/futuros
   ✓ Mejor para: Promocionar eventos, contenido destacado
   ✓ Requiere: 4+ videos cortos (30s-1min)

5. OPCIÓN 5 (Combinado)
   ✓ Usa cuando: Quieres máximo impacto + información
   ✓ Mejor para: Sitios grandes con mucho contenido
   ✓ Requiere: 1 video hero + 2+ tutoriales

PARA CAMBIAR DE OPCIÓN:
1. Copia el contenido de la clase que prefieras
2. Reemplaza el contenido de HomePage en home.js
3. Asegúrate de importar los componentes necesarios

IMPORTANTE:
- Todos los videos deben estar en public/videos/
- Todos los posters en public/images/posters/
- Siempre llamar mount() en afterRender()
- Optimiza tus videos primero (ver VIDEO_OPTIMIZATION_GUIDE.md)

*/
