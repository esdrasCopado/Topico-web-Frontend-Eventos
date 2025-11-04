# Guía de Auto-Scroll

## ¿Qué hace el auto-scroll?

El auto-scroll es una funcionalidad que detecta la **primera interacción** del usuario con la página (scroll con rueda, touch, o teclas) y automáticamente hace scroll suave hacia el contenido principal (`#hero-container`).

## Características principales

### ✅ Soporta múltiples vueltas de rueda del ratón
- **Debounce de 100ms**: Si el usuario hace múltiples scrolls rápidos, el sistema espera 100ms después del último scroll antes de ejecutar la animación
- **No corta la transición**: Una vez iniciada la animación, se bloquea el scroll manual hasta que termine
- **Se ejecuta solo una vez**: Después de la primera activación, el auto-scroll se desactiva permanentemente

### 🎯 Eventos que disparan el auto-scroll

1. **Wheel (rueda del ratón)**
   - Con debounce de 100ms
   - Acumula múltiples vueltas antes de ejecutar

2. **Touch (pantallas táctiles)**
   - Ejecución inmediata al detectar movimiento

3. **Teclado**
   - Teclas: `ArrowDown`, `ArrowUp`, `Space`, `PageDown`, `PageUp`
   - Ejecución inmediata

### 🔒 Protección durante la animación

Mientras el scroll automático está activo:
- ❌ Se bloquean eventos `wheel` y `touchmove`
- ❌ El usuario no puede interrumpir la animación
- ✅ La transición se completa suavemente

## Configuración

La función está en [`src/utils/smoothScroll.js`](../src/utils/smoothScroll.js) y se inicializa en [`src/pages/home.js`](../src/pages/home.js):

```javascript
this.cleanupAutoScroll = initAutoScroll({
    targetSelector: '#hero-container',  // Elemento objetivo
    scrollDuration: 1.2,                 // Duración en segundos
    scrollOffset: -100,                  // Offset en píxeles
    debounceDelay: 100,                  // Delay del debounce en ms
    lenis: window.lenis                  // Instancia de Lenis
})
```

### Parámetros configurables

| Parámetro | Default | Descripción |
|-----------|---------|-------------|
| `targetSelector` | `'#hero-container'` | Selector CSS del elemento al que hacer scroll |
| `scrollDuration` | `1.2` | Duración de la animación en segundos |
| `scrollOffset` | `-100` | Offset en píxeles (negativo = scroll hacia arriba) |
| `debounceDelay` | `100` | Milisegundos de espera después del último evento wheel |
| `lenis` | `window.lenis` | Instancia de Lenis (opcional, fallback a nativo) |

## Integración con Lenis

El auto-scroll detecta automáticamente si Lenis está disponible:

- ✅ **Con Lenis**: Usa `lenis.scrollTo()` con animaciones suaves
- ✅ **Sin Lenis**: Fallback a `scrollIntoView({ behavior: 'smooth' })`

## Limpieza de recursos

Para SPAs (Single Page Applications), se incluye un método de limpieza:

```javascript
// En home.js
destroy() {
    if (this.cleanupAutoScroll) {
        this.cleanupAutoScroll()
        this.cleanupAutoScroll = null
    }
}
```

Esto remueve todos los event listeners cuando la página se destruye.

## Flujo de ejecución

```
Usuario hace scroll
    ↓
[Primera vez?]
    ↓ Sí
[¿Es wheel event?]
    ↓ Sí → Debounce 100ms
    ↓ No → Ejecución inmediata
        ↓
hasTriggered = true
isAnimating = true
    ↓
Bloquear scroll manual
    ↓
[¿Existe Lenis?]
    ↓ Sí → lenis.scrollTo()
    ↓ No → scrollIntoView()
        ↓
Animación (1.2s)
    ↓
Desbloquear scroll manual
isAnimating = false
```

## Logs de consola

El sistema emite logs útiles para debugging:

```
🎯 Auto-scroll inicializado para: #hero-container
✨ Auto-scroll con Lenis hacia: #hero-container
⚠️ Auto-scroll: Target "#hero-container" no encontrado (si hay error)
```

## Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (modernos)
- ✅ Dispositivos móviles (iOS, Android)
- ✅ Teclado para accesibilidad
- ✅ Fallback para navegadores sin smooth scroll nativo

## Mejoras futuras posibles

1. **Cancelación de animación**: Permitir que múltiples scrolls durante la animación la cancelen
2. **Velocidad adaptativa**: Ajustar la duración según la distancia a recorrer
3. **Configuración por breakpoint**: Diferentes comportamientos en móvil vs desktop
4. **Analytics**: Tracking de cuántos usuarios usan el auto-scroll
