/**
 * Ejemplos de uso del auto-scroll
 * Este archivo muestra diferentes configuraciones y casos de uso
 */

import { initAutoScroll } from '../src/utils/smoothScroll.js'

// ============================================
// EJEMPLO 1: Configuración básica (default)
// ============================================
export function basicAutoScroll() {
    const cleanup = initAutoScroll()

    // Para limpiar después (útil en SPAs)
    return cleanup
}

// ============================================
// EJEMPLO 2: Scroll más lento y suave
// ============================================
export function slowAutoScroll() {
    const cleanup = initAutoScroll({
        scrollDuration: 2.5,  // 2.5 segundos (más lento)
        scrollOffset: -150,    // Más espacio arriba
        debounceDelay: 200     // Más tolerante a múltiples scrolls
    })

    return cleanup
}

// ============================================
// EJEMPLO 3: Scroll rápido y directo
// ============================================
export function fastAutoScroll() {
    const cleanup = initAutoScroll({
        scrollDuration: 0.6,  // Muy rápido
        scrollOffset: 0,      // Sin offset
        debounceDelay: 50     // Respuesta más inmediata
    })

    return cleanup
}

// ============================================
// EJEMPLO 4: Scroll a diferentes secciones según viewport
// ============================================
export function responsiveAutoScroll() {
    const isMobile = window.innerWidth < 768

    const cleanup = initAutoScroll({
        targetSelector: isMobile ? '#hero-mobile' : '#hero-container',
        scrollDuration: isMobile ? 0.8 : 1.2,
        scrollOffset: isMobile ? -80 : -100,
        debounceDelay: isMobile ? 150 : 100
    })

    return cleanup
}

// ============================================
// EJEMPLO 5: Auto-scroll con callback personalizado
// ============================================
export function autoScrollWithTracking() {
    // Crear una versión extendida que incluye analytics
    const originalCleanup = initAutoScroll({
        scrollDuration: 1.2,
        scrollOffset: -100
    })

    // Simular tracking de analytics
    console.log('📊 Auto-scroll activado - enviar a analytics')

    // Enviar evento a Google Analytics (ejemplo)
    if (window.gtag) {
        window.gtag('event', 'auto_scroll_triggered', {
            event_category: 'User Interaction',
            event_label: 'Homepage Hero Scroll'
        })
    }

    return originalCleanup
}

// ============================================
// EJEMPLO 6: Deshabilitar en ciertas condiciones
// ============================================
export function conditionalAutoScroll() {
    // No activar auto-scroll si el usuario ya ha scrolleado
    const hasScrolled = window.scrollY > 50

    // No activar en modo reducción de movimiento (accesibilidad)
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches

    if (hasScrolled || prefersReducedMotion) {
        console.log('⏸️ Auto-scroll deshabilitado')
        return () => {} // Cleanup vacío
    }

    return initAutoScroll()
}

// ============================================
// EJEMPLO 7: Auto-scroll solo en primera visita
// ============================================
export function firstVisitAutoScroll() {
    const hasVisited = localStorage.getItem('hasVisitedHome')

    if (hasVisited) {
        console.log('👤 Usuario recurrente - auto-scroll deshabilitado')
        return () => {}
    }

    // Marcar como visitado
    localStorage.setItem('hasVisitedHome', 'true')

    console.log('🎉 Primera visita - auto-scroll activado')
    return initAutoScroll()
}

// ============================================
// EJEMPLO 8: Auto-scroll con delay inicial
// ============================================
export function delayedAutoScroll() {
    let cleanup = () => {}

    // Esperar 1 segundo antes de activar el auto-scroll
    setTimeout(() => {
        cleanup = initAutoScroll()
    }, 1000)

    return () => {
        cleanup()
    }
}

// ============================================
// EJEMPLO 9: Auto-scroll múltiple (varios targets)
// ============================================
export function multiTargetAutoScroll() {
    let currentTarget = 0
    const targets = ['#hero-container', '#features', '#testimonials']

    const scrollToNext = () => {
        if (currentTarget >= targets.length) return

        const cleanup = initAutoScroll({
            targetSelector: targets[currentTarget],
            scrollDuration: 1.0,
            scrollOffset: -50
        })

        currentTarget++

        return cleanup
    }

    // Scroll al primer target inmediatamente
    return scrollToNext()
}

// ============================================
// EJEMPLO 10: Auto-scroll con interrupción permitida
// ============================================
export function interruptibleAutoScroll() {
    let isScrolling = false
    let cleanup = () => {}

    const handleInterruption = (e) => {
        if (isScrolling) {
            console.log('🛑 Auto-scroll interrumpido por el usuario')
            cleanup()
            window.lenis?.stop()
            isScrolling = false
        }
    }

    // Iniciar auto-scroll
    cleanup = initAutoScroll({
        scrollDuration: 2.0  // Más largo para permitir interrupción
    })

    isScrolling = true

    // Permitir interrupción después de 500ms
    setTimeout(() => {
        window.addEventListener('wheel', handleInterruption, { once: true })
        window.addEventListener('touchmove', handleInterruption, { once: true })
    }, 500)

    // Cleanup después de la duración
    setTimeout(() => {
        isScrolling = false
    }, 2000)

    return () => {
        cleanup()
        window.removeEventListener('wheel', handleInterruption)
        window.removeEventListener('touchmove', handleInterruption)
    }
}

// ============================================
// EJEMPLO 11: Auto-scroll con detección de dirección
// ============================================
export function directionalAutoScroll() {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
        const currentScrollY = window.scrollY
        const scrollingDown = currentScrollY > lastScrollY

        if (scrollingDown) {
            console.log('⬇️ Scroll hacia abajo detectado')
            return initAutoScroll({
                targetSelector: '#hero-container',
                scrollOffset: -100
            })
        } else {
            console.log('⬆️ Scroll hacia arriba detectado - sin auto-scroll')
            return () => {}
        }
    }

    return handleScroll()
}

// ============================================
// USO EN COMPONENTES
// ============================================

/**
 * Ejemplo de uso en una clase de página
 */
export class ExamplePage {
    constructor() {
        this.autoScrollCleanup = null
    }

    afterRender() {
        // Activar auto-scroll después de que la página esté renderizada
        this.autoScrollCleanup = initAutoScroll({
            targetSelector: '#main-content',
            scrollDuration: 1.5,
            scrollOffset: -120
        })
    }

    destroy() {
        // Limpiar cuando se destruya la página
        if (this.autoScrollCleanup) {
            this.autoScrollCleanup()
            this.autoScrollCleanup = null
        }
    }
}
