# Integración de Lenis - Smooth Scroll

## ¿Qué es Lenis?

Lenis es una librería de smooth scroll (scroll suave) que mejora significativamente la experiencia de navegación en tu sitio web. Es ligera, rápida y ofrece una sensación premium similar a la de sitios web profesionales.

## Instalación

```bash
npm install lenis
```

## Configuración en tu proyecto

### 1. Inicialización Global

Lenis ya está configurado globalmente en `src/main.js` y se inicializa automáticamente cuando la aplicación carga.

```javascript
// En main.js (ya implementado)
import { initSmoothScroll } from './utils/smoothScroll.js'

function init() {
    const lenis = initSmoothScroll()
    window.lenis = lenis  // Accesible globalmente
    // ...
}
```

### 2. Configuración Personalizada

En `src/utils/smoothScroll.js` puedes ajustar la configuración:

```javascript
const lenis = new Lenis({
    duration: 1.2,        // Duración del scroll (1.2 segundos)
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,   // Velocidad con mouse
    smoothTouch: false,   // Desactivado en móvil para mejor rendimiento
})
```

## Uso Básico

### Scroll a una sección

```javascript
// Scroll a un ID específico
window.lenis.scrollTo('#eventos', {
    offset: -80,     // Offset para navbar
    duration: 1.5
})

// Scroll a un elemento
const elemento = document.querySelector('.mi-seccion')
window.lenis.scrollTo(elemento)

// Scroll a una posición específica (píxeles)
window.lenis.scrollTo(500)
```

### Links con anchor (#)

```javascript
// En cualquier componente
const links = document.querySelectorAll('a[href^="#"]')

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        const target = link.getAttribute('href')
        window.lenis.scrollTo(target, {
            offset: -80,
            duration: 1.5
        })
    })
})
```

### Botón "Scroll to Top"

```javascript
function scrollToTop() {
    window.lenis.scrollTo(0, { duration: 1.2 })
}
```

## Características Avanzadas

### 1. Detener/Reanudar Scroll (para modales)

```javascript
// Al abrir un modal
window.lenis.stop()

// Al cerrar el modal
window.lenis.start()
```

### 2. Escuchar eventos de scroll

```javascript
window.lenis.on('scroll', (e) => {
    console.log('Posición:', e.scroll)
    console.log('Progreso (0-1):', e.progress)
    console.log('Velocidad:', e.velocity)
})
```

### 3. Efecto Parallax

```javascript
window.lenis.on('scroll', ({ scroll }) => {
    const elementos = document.querySelectorAll('[data-parallax]')

    elementos.forEach(el => {
        const speed = el.dataset.parallax || 0.5
        const yPos = -(scroll * speed)
        el.style.transform = `translateY(${yPos}px)`
    })
})
```

**Uso en HTML:**
```html
<div data-parallax="0.3">Parallax lento</div>
<div data-parallax="0.8">Parallax rápido</div>
```

### 4. Navbar que se oculta al hacer scroll

```javascript
let lastScroll = 0

window.lenis.on('scroll', ({ scroll }) => {
    const direction = scroll > lastScroll ? 'down' : 'up'
    const navbar = document.querySelector('.navbar')

    if (direction === 'down' && scroll > 100) {
        navbar.classList.add('navbar-hidden')
    } else {
        navbar.classList.remove('navbar-hidden')
    }

    lastScroll = scroll
})
```

**CSS necesario:**
```css
.navbar-hidden {
    transform: translateY(-100%);
    transition: transform 0.3s ease;
}
```

## Integración con Componentes

### En NavBar.js

```javascript
export class NavBar {
    mount() {
        this.afterRender()
        this.setupScrollEffect()
        this.setupSmoothScrollLinks()  // Agregar esto
    }

    setupSmoothScrollLinks() {
        const links = document.querySelectorAll('.nav-link[href^="#"]')

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const targetId = link.getAttribute('href').substring(1)

                if (window.lenis) {
                    window.lenis.scrollTo(`#${targetId}`, {
                        offset: -80,
                        duration: 1.5
                    })
                }
            })
        })
    }
}
```

### En HomePage.js

```javascript
export class HomePage {
    afterRender() {
        // ... código existente

        // Agregar scroll suave al botón "Ver más eventos"
        const verMasBtn = document.querySelector('.ver-mas-eventos')
        if (verMasBtn) {
            verMasBtn.addEventListener('click', () => {
                window.lenis.scrollTo('#lista-eventos', {
                    offset: -100,
                    duration: 1.2
                })
            })
        }
    }
}
```

## Rendimiento

### Optimizaciones aplicadas:

1. **`smoothTouch: false`** - Desactiva smooth scroll en dispositivos táctiles para mejor rendimiento
2. **`requestAnimationFrame`** - Usa RAF para animaciones fluidas
3. **Lazy loading** - Lenis se integra bien con lazy loading de imágenes/videos

### Detección de conexión lenta:

Ya tienes implementada la detección de conexión en `home.js`:

```javascript
afterRender() {
    if('connection' in navigator) {
        if(navigator.connection.effectiveType.includes('2g') ||
           navigator.connection.effectiveType.includes('3g')) {
            // En conexiones lentas, podrías desactivar Lenis
            window.lenis?.destroy()
        }
    }
}
```

## Ventajas de Lenis

✅ **Ligero**: ~3KB gzipped
✅ **Rendimiento**: 60fps constantes
✅ **Fácil de usar**: API simple e intuitiva
✅ **Personalizable**: Múltiples opciones de configuración
✅ **Compatible**: Funciona en todos los navegadores modernos
✅ **Sin dependencias**: No requiere jQuery ni otras librerías

## Recursos

- [Documentación oficial](https://github.com/studio-freight/lenis)
- [Demos interactivas](https://lenis.studiofreight.com/)
- Ejemplos de uso en: `examples/lenis-usage-examples.js`

## Troubleshooting

**Problema: El scroll no es suave**
- Verifica que Lenis esté inicializado: `console.log(window.lenis)`
- Revisa la consola para errores

**Problema: Conflicto con videos**
- Los videos pueden interferir con el smooth scroll
- Solución: Ajusta `mouseMultiplier` en la configuración

**Problema: Rendimiento en móvil**
- `smoothTouch: false` ya está configurado
- Considera desactivar Lenis en conexiones muy lentas
