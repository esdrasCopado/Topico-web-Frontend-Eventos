import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Inicializa Lenis (smooth scroll)
 * Biblioteca de scroll suave para una mejor experiencia de usuario
 *
 * @returns {Lenis} Instancia de Lenis
 */
export function initSmoothScroll() {
    // Configuración de Lenis
    const lenis = new Lenis({
        duration: 1.2,        // Duración de la animación de scroll (en segundos)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Función de easing personalizada
        direction: 'vertical', // Dirección del scroll: 'vertical' o 'horizontal'
        gestureDirection: 'vertical', // Dirección del gesto
        smooth: true,          // Activar scroll suave
        mouseMultiplier: 1,    // Multiplicador de velocidad del mouse
        smoothTouch: false,    // Desactivar en touch (mejor rendimiento móvil)
        touchMultiplier: 2,    // Multiplicador de velocidad del touch
        infinite: false,       // Scroll infinito
    })

    // Función de animación
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Logs para debugging
    console.log('✨ Lenis smooth scroll inicializado')

    // Eventos útiles
    lenis.on('scroll', (e) => {
        // Puedes usar esto para sincronizar animaciones con el scroll
        // console.log('Scroll position:', e.scroll)
    })

    // Retornar la instancia para control externo
    return lenis
}

/**
 * Detener el scroll (útil para modales)
 * @param {Lenis} lenis - Instancia de Lenis
 */
export function stopScroll(lenis) {
    if (lenis) {
        lenis.stop()
    }
}

/**
 * Reanudar el scroll
 * @param {Lenis} lenis - Instancia de Lenis
 */
export function startScroll(lenis) {
    if (lenis) {
        lenis.start()
    }
}

/**
 * Scroll suave a una posición específica
 * @param {Lenis} lenis - Instancia de Lenis
 * @param {number|string|HTMLElement} target - Posición, selector o elemento
 * @param {Object} options - Opciones adicionales
 */
export function scrollTo(lenis, target, options = {}) {
    if (lenis) {
        lenis.scrollTo(target, {
            offset: 0,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            ...options
        })
    }
}

/**
 * Auto-scroll al primer contenido al detectar interacción del usuario
 * Implementa un scroll automático suave que se dispara una sola vez
 * cuando el usuario hace su primera interacción con la página
 *
 * @param {Object} options - Opciones de configuración
 * @param {string} options.targetSelector - Selector del elemento objetivo (default: '#hero-container')
 * @param {number} options.scrollDuration - Duración de la animación en segundos (default: 1.2)
 * @param {number} options.scrollOffset - Offset en píxeles (default: -100)
 * @param {number} options.debounceDelay - Delay para el debounce del wheel en ms (default: 100)
 * @param {Lenis} options.lenis - Instancia de Lenis (opcional)
 * @returns {Function} Función de cleanup para remover listeners
 */
export function initAutoScroll(options = {}) {
    const {
        targetSelector = '#hero-container',
        scrollDuration = 1.2,
        scrollOffset = -100,
        debounceDelay = 100,
        lenis = window.lenis
    } = options

    let hasTriggered = false
    let isAnimating = false
    let wheelTimeout

    const preventScroll = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const unlockScroll = () => {
        isAnimating = false
        ;['wheel', 'touchmove'].forEach(event =>
            window.removeEventListener(event, preventScroll)
        )
    }

    const lockScroll = () => {
        ;['wheel', 'touchmove'].forEach(event =>
            window.addEventListener(event, preventScroll, { passive: false })
        )
    }

    const executeAutoScroll = () => {
        if (hasTriggered || isAnimating) return

        hasTriggered = true
        isAnimating = true
        cleanupListeners()
        lockScroll()

        const target = document.querySelector(targetSelector)

        if (!target) {
            console.warn(`⚠️ Auto-scroll: Target "${targetSelector}" no encontrado`)
            return unlockScroll()
        }

        const finish = () => setTimeout(unlockScroll, scrollDuration * 1000)

        if (lenis) {
            console.log('✨ Auto-scroll con Lenis hacia:', targetSelector)
            lenis.scrollTo(targetSelector, {
                offset: scrollOffset,
                duration: scrollDuration,
                onComplete: unlockScroll,
            })
        } else {
            console.log('✨ Auto-scroll nativo hacia:', targetSelector)
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            finish()
        }
    }

    const handleWheel = () => {
        if (hasTriggered || isAnimating) return
        clearTimeout(wheelTimeout)
        wheelTimeout = setTimeout(executeAutoScroll, debounceDelay)
    }

    const handleTouch = () => {
        if (!hasTriggered && !isAnimating) executeAutoScroll()
    }

    const handleKeyPress = (e) => {
        const keys = ['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp']
        if (keys.includes(e.code) && !hasTriggered && !isAnimating) {
            executeAutoScroll()
        }
    }

    const cleanupListeners = () => {
        window.removeEventListener('wheel', handleWheel)
        window.removeEventListener('touchmove', handleTouch)
        window.removeEventListener('keydown', handleKeyPress)
    }

    const initListeners = () => {
        window.addEventListener('wheel', handleWheel, { passive: true })
        window.addEventListener('touchmove', handleTouch, { passive: true })
        window.addEventListener('keydown', handleKeyPress)
    }

    // Inicializar listeners
    initListeners()
    console.log('🎯 Auto-scroll inicializado para:', targetSelector)

    // Retornar función de cleanup
    return cleanupListeners
}
