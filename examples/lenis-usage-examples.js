/**
 * EJEMPLOS DE USO DE LENIS
 *
 * Este archivo contiene ejemplos de cómo usar Lenis en diferentes situaciones
 */

// ============================================
// EJEMPLO 1: Scroll a una sección específica
// ============================================

// En cualquier componente, puedes hacer scroll a una sección:
function scrollToSection(sectionId) {
    if (window.lenis) {
        window.lenis.scrollTo(`#${sectionId}`, {
            offset: -80,  // Offset para el navbar sticky
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        })
    }
}

// Uso:
// scrollToSection('eventos')

// ============================================
// EJEMPLO 2: Botón "Scroll to Top"
// ============================================

function scrollToTop() {
    if (window.lenis) {
        window.lenis.scrollTo(0, {
            duration: 1.2
        })
    }
}

// ============================================
// EJEMPLO 3: Detener/Reanudar scroll (para modales)
// ============================================

function openModal() {
    // Detener scroll cuando se abre un modal
    if (window.lenis) {
        window.lenis.stop()
    }
}

function closeModal() {
    // Reanudar scroll cuando se cierra el modal
    if (window.lenis) {
        window.lenis.start()
    }
}

// ============================================
// EJEMPLO 4: Scroll con anchor links
// ============================================

// En tu NavBar o cualquier componente con links:
function setupSmoothScrollLinks() {
    const links = document.querySelectorAll('a[href^="#"]')

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const target = link.getAttribute('href')

            if (window.lenis) {
                window.lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.5
                })
            }
        })
    })
}

// ============================================
// EJEMPLO 5: Sincronizar animaciones con scroll
// ============================================

// Puedes escuchar el evento de scroll para activar animaciones:
if (window.lenis) {
    window.lenis.on('scroll', (e) => {
        const scrollProgress = e.progress // 0 a 1
        const scrollPosition = e.scroll   // Posición en píxeles

        // Ejemplo: Cambiar opacidad de un elemento según el scroll
        const hero = document.querySelector('.hero')
        if (hero) {
            hero.style.opacity = 1 - scrollProgress
        }
    })
}

// ============================================
// EJEMPLO 6: Integración con el NavBar
// ============================================

// En NavBar.js, podrías agregar:
export class NavBar {
    // ... código existente

    setupSmoothScrollLinks() {
        const navLinks = this.element.querySelectorAll('a[href^="#"]')

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const targetId = link.getAttribute('href').substring(1)

                if (window.lenis) {
                    window.lenis.scrollTo(`#${targetId}`, {
                        offset: -80,  // Altura del navbar
                        duration: 1.5
                    })
                }
            })
        })
    }
}

// ============================================
// EJEMPLO 7: Scroll horizontal (para galerías)
// ============================================

// Si necesitas scroll horizontal en una galería:
function initHorizontalScroll() {
    const horizontalLenis = new Lenis({
        orientation: 'horizontal',  // Horizontal en lugar de vertical
        gestureOrientation: 'horizontal',
        wrapper: document.querySelector('.horizontal-gallery'),
        content: document.querySelector('.horizontal-gallery-content')
    })

    function raf(time) {
        horizontalLenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return horizontalLenis
}

// ============================================
// EJEMPLO 8: Parallax con Lenis
// ============================================

// Efecto parallax sincronizado con Lenis:
if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
        // Elementos con efecto parallax
        const parallaxElements = document.querySelectorAll('[data-parallax]')

        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5
            const yPos = -(scroll * speed)
            el.style.transform = `translateY(${yPos}px)`
        })
    })
}

// Uso en HTML:
// <div data-parallax="0.3">Contenido con parallax lento</div>
// <div data-parallax="0.8">Contenido con parallax rápido</div>

// ============================================
// EJEMPLO 9: Lazy loading de imágenes con Lenis
// ============================================

if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
        const lazyImages = document.querySelectorAll('img[data-src]:not([data-loaded])')

        lazyImages.forEach(img => {
            const rect = img.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0

            if (isVisible) {
                img.src = img.dataset.src
                img.setAttribute('data-loaded', 'true')
            }
        })
    })
}

// ============================================
// EJEMPLO 10: Detección de dirección de scroll
// ============================================

let lastScroll = 0

if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
        const direction = scroll > lastScroll ? 'down' : 'up'

        // Ocultar navbar al hacer scroll down, mostrar al hacer scroll up
        const navbar = document.querySelector('.navbar')
        if (navbar) {
            if (direction === 'down' && scroll > 100) {
                navbar.classList.add('navbar-hidden')
            } else {
                navbar.classList.remove('navbar-hidden')
            }
        }

        lastScroll = scroll
    })
}

export {
    scrollToSection,
    scrollToTop,
    openModal,
    closeModal,
    setupSmoothScrollLinks
}
