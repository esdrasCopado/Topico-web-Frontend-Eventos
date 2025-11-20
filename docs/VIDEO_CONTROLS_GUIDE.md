# Guía de Controles de Video Personalizados

## Controles ya implementados en tu home.js

### Lo que tienes ahora:

Los controles personalizados ya están funcionando en tu página de inicio con:

- **Atrás** - Retrocede 10 segundos
- **Play/Pause** - Reproduce o pausa el video
- **Siguiente** - Avanza 10 segundos
- **Mute/Unmute** - Silenciar o activar sonido

---

## Personalizar los Controles

### Cambiar la Posición

En [home.js](../src/pages/home.js), línea 40, cambia la posición:

```javascript
this.videoControls = new VideoControls({
    videoPlayer: null,
    showPlayPause: true,
    showMute: true,
    showSkip: true,
    skipSeconds: 10,
    position: 'bottom-right'  // ← CAMBIA AQUÍ
})
```

**Opciones disponibles:**
- `'bottom-right'` - Abajo derecha (actual)
- `'bottom-left'` - Abajo izquierda
- `'bottom-center'` - Abajo centro
- `'top-right'` - Arriba derecha
- `'top-left'` - Arriba izquierda

### Cambiar los Segundos de Skip

```javascript
skipSeconds: 10,  // Cambia a 5, 15, 30, etc.
```

### Ocultar Botones Específicos

```javascript
showPlayPause: true,   // false = ocultar
showMute: true,        // false = ocultar
showSkip: true,        // false = ocultar
```

---

## Ejemplos de Configuración

### Solo Play/Pause y Mute (sin skip)
```javascript
this.videoControls = new VideoControls({
    videoPlayer: null,
    showPlayPause: true,
    showMute: true,
    showSkip: false,      // ← Ocultar botones de skip
    position: 'bottom-center'
})
```

### Solo Mute (minimalista)
```javascript
this.videoControls = new VideoControls({
    videoPlayer: null,
    showPlayPause: false,
    showMute: true,
    showSkip: false,
    position: 'top-right'
})
```

### Skip rápido (5 segundos)
```javascript
this.videoControls = new VideoControls({
    videoPlayer: null,
    showPlayPause: true,
    showMute: true,
    showSkip: true,
    skipSeconds: 5,       // ← Skip más corto
    position: 'bottom-center'
})
```

### Skip largo (30 segundos)
```javascript
this.videoControls = new VideoControls({
    videoPlayer: null,
    showPlayPause: true,
    showMute: true,
    showSkip: true,
    skipSeconds: 30,      // ← Skip más largo
    position: 'bottom-right'
})
```

---

## 🎨 Estilos Personalizados

### Cambiar el Estilo de los Controles

En [home.js](../src/pages/home.js), después de la línea 54 donde se renderiza:

```html
<!-- Estilo normal (actual) -->
${this.videoControls.render()}

<!-- Fondo sólido oscuro -->
<div id="video-controls-container" class="solid-bg">
    ${this.videoControls.render()}
</div>

<!-- Estilo minimalista -->
<div id="video-controls-container" class="minimal">
    ${this.videoControls.render()}
</div>

<!-- Con color de acento azul -->
<div id="video-controls-container" class="accent-primary">
    ${this.videoControls.render()}
</div>
```

O puedes agregar la clase directamente en [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css).

### Cambiar Colores

En [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css), busca línea 515:

```css
.video-controls {
    background: rgba(0, 0, 0, 0.7);  /* ← Cambia el fondo */
    /* ... */
}

.video-control-btn {
    border: 2px solid rgba(255, 255, 255, 0.3);  /* ← Cambia el borde */
    color: white;  /* ← Cambia el color de iconos */
}
```

**Ejemplos:**

```css
/* Fondo más oscuro */
background: rgba(0, 0, 0, 0.9);

/* Fondo con tinte azul */
background: rgba(26, 58, 96, 0.8);

/* Fondo con efecto blur más intenso */
background: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(20px);

/* Bordes más visibles */
border: 2px solid rgba(255, 255, 255, 0.6);

/* Iconos con color azul */
color: #4a9eff;
```

---

## 🖱️ Control Programático

Puedes controlar los botones desde JavaScript:

```javascript
// En afterRender() de home.js

// Ocultar controles
this.videoControls.toggle(false)

// Mostrar controles
this.videoControls.toggle(true)

// Cambiar posición dinámicamente
this.videoControls.setPosition('bottom-center')
```

---

## Responsive

Los controles se adaptan automáticamente:

- **Desktop**: Botones grandes (48px)
- **Tablet**: Botones medianos (40px)
- **Mobile**: Botones pequeños (36px)
- **Mobile pequeño**: Sin tiempo de skip visible

---

## Atajos de Teclado (Opcional)

Si quieres agregar atajos de teclado, agrega esto en [home.js](../src/pages/home.js) afterRender():

```javascript
afterRender() {
    this.navbar.mount()
    this.heroVideo.mount()
    this.videoControls.videoPlayer = this.heroVideo
    this.videoControls.mount()
    this.eventsList.mount()

    // Agregar atajos de teclado
    document.addEventListener('keydown', (e) => {
        // Espacio = Play/Pause
        if (e.code === 'Space') {
            e.preventDefault()
            this.heroVideo.togglePlay()
        }
        // M = Mute/Unmute
        if (e.key === 'm' || e.key === 'M') {
            const videoElement = this.heroVideo.videoElement
            videoElement.muted = !videoElement.muted
        }
        // Flecha izquierda = Retroceder
        if (e.key === 'ArrowLeft') {
            const currentTime = this.heroVideo.getCurrentTime()
            this.heroVideo.setCurrentTime(currentTime - 10)
        }
        // Flecha derecha = Avanzar
        if (e.key === 'ArrowRight') {
            const currentTime = this.heroVideo.getCurrentTime()
            this.heroVideo.setCurrentTime(currentTime + 10)
        }
    })

    console.log('HomePage con controles y atajos de teclado')
}
```

**Atajos:**
- `Espacio` - Play/Pause
- `M` - Mute/Unmute
- `←` - Retroceder 10s
- `→` - Avanzar 10s

---

## Auto-Hide (Ocultar Automáticamente)

Para que los controles se oculten cuando no hay actividad:

### Opción 1: CSS (Opacidad reducida)

Agrega la clase `auto-hide` al contenedor de controles en home.js:

```javascript
render() {
    return `
        ${this.navbar.render()}

        <div class="video-background">
            ${this.heroVideo.render()}
        </div>

        <!-- Agregar clase auto-hide -->
        <div class="auto-hide">
            ${this.videoControls.render()}
        </div>

        <div class="page-container">
            ...
        </div>
    `
}
```

Esto hará que los controles tengan opacidad 0.7 por defecto y 1.0 al hacer hover.

### Opción 2: JavaScript (Ocultar completamente)

Agrega esto en afterRender():

```javascript
afterRender() {
    this.navbar.mount()
    this.heroVideo.mount()
    this.videoControls.videoPlayer = this.heroVideo
    this.videoControls.mount()
    this.eventsList.mount()

    // Auto-hide después de 3 segundos de inactividad
    let hideTimeout
    const showControls = () => {
        this.videoControls.toggle(true)
        clearTimeout(hideTimeout)
        hideTimeout = setTimeout(() => {
            this.videoControls.toggle(false)
        }, 3000)
    }

    // Mostrar al mover el mouse
    document.addEventListener('mousemove', showControls)

    // Ocultar al inicio
    hideTimeout = setTimeout(() => {
        this.videoControls.toggle(false)
    }, 3000)
}
```

---

## Solución de Problemas

### Los controles no aparecen
1. Verifica que el CSS esté importado en home.js
2. Revisa la consola del navegador (F12) para errores
3. Asegúrate de que `mount()` se llame después de `render()`

### Los botones no funcionan
1. Verifica que `videoPlayer` esté asignado antes de `mount()`
2. Revisa que el video esté cargado

### Los controles están detrás de otro elemento
Ajusta el `z-index` en [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css) línea 517:

```css
.video-controls {
    z-index: 1000;  /* ← Aumenta este número si es necesario */
}
```

---

## Resumen de Configuración Actual

Tu configuración actual en [home.js](../src/pages/home.js):

```javascript
Posición: bottom-right (abajo derecha)
Play/Pause: Activado
Mute/Unmute: Activado
Skip: Activado (10 segundos)
Estilo: Default (fondo translúcido con blur)
```

---

## Configuraciones Recomendadas

### Para video de fondo decorativo:
```javascript
showPlayPause: false,
showMute: true,
showSkip: false,
position: 'top-right'
```

### Para video interactivo:
```javascript
showPlayPause: true,
showMute: true,
showSkip: true,
skipSeconds: 10,
position: 'bottom-center'
```

### Para presentación:
```javascript
showPlayPause: true,
showMute: false,
showSkip: true,
skipSeconds: 5,
position: 'bottom-right'
```

---

**¡Listo!** Ahora tienes controles personalizados completamente funcionales para tu video de fondo.

Para más información:
- [VIDEO_QUICK_START.md](./VIDEO_QUICK_START.md) - Inicio rápido
- [VIDEO_BACKGROUND_CUSTOMIZATION.md](./VIDEO_BACKGROUND_CUSTOMIZATION.md) - Personalización del video
- [VIDEO_OPTIMIZATION_GUIDE.md](./VIDEO_OPTIMIZATION_GUIDE.md) - Guía completa
