# Personalización del Video de Fondo

## Guía rápida para ajustar el video de fondo en home.js

---

## 📋 Opciones de Overlay (Oscurecer el video)

Puedes cambiar la opacidad del overlay oscuro agregando clases al `<div class="video-background">`:

### En tu [home.js](../src/pages/home.js):

```javascript
// Ubicación del div: línea 38
<div class="video-background">  // Overlay normal (50% oscuro)
<div class="video-background overlay-dark">  // Muy oscuro (70%)
<div class="video-background overlay-light">  // Claro (30%)
<div class="video-background overlay-gradient">  // Gradiente de arriba a abajo
<div class="video-background overlay-blue">  // Tinte azul
<div class="video-background no-overlay">  // Sin overlay
```

### Ejemplos visuales:

**Normal (default):**
```html
<div class="video-background">
```
- Overlay negro al 50%
- Bueno para la mayoría de casos

**Oscuro:**
```html
<div class="video-background overlay-dark">
```
- Overlay negro al 70%
- Mejor para videos muy brillantes

**Claro:**
```html
<div class="video-background overlay-light">
```
- Overlay negro al 30%
- Mejor para videos oscuros

**Gradiente:**
```html
<div class="video-background overlay-gradient">
```
- Degradado de 30% arriba a 60% abajo
- Efecto cinematográfico

**Sin overlay:**
```html
<div class="video-background no-overlay">
```
- Video sin oscurecer
- Solo si tu video ya es oscuro

---

## 🎨 Efectos Visuales Opcionales

### 1. Efecto Zoom Suave

El video hace zoom in/out lentamente (efecto "Ken Burns"):

```html
<div class="video-background zoom-effect">
```

### 2. Blur en los Bordes

Difumina los bordes del video:

```html
<div class="video-background blur-edges">
```

### 3. Filtro Escala de Grises

Video en blanco y negro al 50%:

```html
<div class="video-background filter-grayscale">
```

### 4. Filtro Sepia

Tono vintage/antiguo:

```html
<div class="video-background filter-sepia">
```

### 5. Reducir Brillo

Video más oscuro:

```html
<div class="video-background filter-brightness">
```

### 6. Aumentar Contraste

Más contraste en el video:

```html
<div class="video-background filter-contrast">
```

### 7. Efecto Cinematográfico

Combinación de filtros para look profesional:

```html
<div class="video-background filter-cinematic">
```

### 8. Efectos de Difuminado / Fade

Difuminado gradual en diferentes áreas del video:

#### Difuminado Inferior (Recomendado para tu caso)

```html
<!-- Difuminado normal en parte inferior -->
<div class="video-background fade-bottom">

<!-- Difuminado suave inferior (más sutil) -->
<div class="video-background fade-bottom-soft">

<!-- Difuminado fuerte inferior (más oscuro) -->
<div class="video-background fade-bottom-strong">
```

#### Otros Difuminados

```html
<!-- Difuminado superior -->
<div class="video-background fade-top">

<!-- Difuminado arriba y abajo -->
<div class="video-background fade-top-bottom">

<!-- Vignette (oscurece los bordes en círculo) -->
<div class="video-background vignette">

<!-- Vignette + fade inferior combinado -->
<div class="video-background vignette-bottom">

<!-- Difuminado lateral (izquierda y derecha) -->
<div class="video-background fade-sides">

<!-- Letterbox cinematográfico (barras arriba y abajo) -->
<div class="video-background letterbox">
```

### 9. Combinar Múltiples Efectos

Puedes combinar varios efectos:

```html
<!-- Ejemplo: Overlay oscuro + difuminado inferior + zoom -->
<div class="video-background overlay-dark fade-bottom zoom-effect">

<!-- Ejemplo: Overlay gradiente + vignette + cinematográfico -->
<div class="video-background overlay-gradient vignette filter-cinematic">

<!-- Ejemplo: Difuminado inferior fuerte + escala de grises -->
<div class="video-background fade-bottom-strong filter-grayscale">

<!-- Ejemplo: Vignette + fade inferior + blur bordes (máximo impacto) -->
<div class="video-background vignette-bottom blur-edges filter-cinematic">
```

---

## 🎬 Configuraciones Recomendadas por Tipo de Video

### Video Brillante/Colorido (como conciertos)
```html
<div class="video-background overlay-dark">
```
o
```html
<div class="video-background overlay-gradient filter-cinematic">
```

### Video Oscuro/Nocturno
```html
<div class="video-background overlay-light">
```
o
```html
<div class="video-background no-overlay filter-contrast">
```

### Video Corporativo/Profesional
```html
<div class="video-background overlay-gradient filter-cinematic">
```

### Video Artístico
```html
<div class="video-background filter-sepia blur-edges">
```
o
```html
<div class="video-background filter-grayscale overlay-light zoom-effect">
```

---

## 🎨 Personalización Avanzada del Overlay

Si ninguna opción te funciona, puedes crear tu propio overlay personalizado:

### Opción 1: Modificar directamente en [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css)

Busca la línea 64-74:

```css
/* Overlay oscuro sobre el video (ajusta la opacidad según necesites) */
.video-background::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);  /* ← CAMBIA ESTE VALOR */
    pointer-events: none;
    z-index: 1;
}
```

**Valores que puedes cambiar:**

```css
/* Más oscuro */
background: rgba(0, 0, 0, 0.7);

/* Más claro */
background: rgba(0, 0, 0, 0.3);

/* Tinte azul oscuro */
background: rgba(10, 25, 47, 0.6);

/* Tinte morado */
background: rgba(75, 0, 130, 0.5);

/* Tinte verde */
background: rgba(0, 100, 0, 0.4);

/* Gradiente personalizado */
background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(75, 0, 130, 0.6) 100%
);
```

### Opción 2: Agregar tu propia clase custom

Agrega esto al final de [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css):

```css
/* Mi overlay personalizado */
.video-background.overlay-custom::after {
    background: rgba(0, 0, 0, 0.6);  /* Ajusta a tu gusto */
}
```

Luego úsala en home.js:
```html
<div class="video-background overlay-custom">
```

---

## 📱 Comportamiento en Móvil

Por defecto, el video se mantiene en móvil. Si quieres ocultarlo para mejor rendimiento:

### En [home.js](../src/pages/home.js), agrega la clase `hide-on-mobile`:

```html
<div class="video-background hide-on-mobile">
```

Luego **descomenta** las líneas 190-197 en [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css):

```css
/* Opción 2: Ocultar video en móvil y usar poster como fondo */
.video-background.hide-on-mobile {
    display: none;
}
.video-background.hide-on-mobile + .page-container {
    background: url('/images/Coldplay.jpg') center/cover no-repeat fixed;
}
```

Esto mostrará la imagen poster en móvil en lugar del video.

---

## 🎯 Ajustar el Texto sobre el Video

Si el texto no se lee bien, puedes modificar el text-shadow en [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css), líneas 115-118:

```css
/* Asegurar que el texto sea legible sobre el video */
.hero h1,
.hero p {
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);  /* ← AJUSTA AQUÍ */
}
```

**Opciones:**

```css
/* Sombra más fuerte */
text-shadow: 3px 3px 12px rgba(0, 0, 0, 1);

/* Sombra doble para más legibilidad */
text-shadow:
    2px 2px 8px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(0, 0, 0, 0.7);

/* Sombra con borde */
text-shadow:
    0 0 10px rgba(0, 0, 0, 0.9),
    0 0 20px rgba(0, 0, 0, 0.7),
    0 0 30px rgba(0, 0, 0, 0.5);

/* Sin sombra */
text-shadow: none;
```

O agregar un fondo semitransparente al texto:

En [home.js](../src/pages/home.js), línea 45:

```html
<!-- Antes -->
<div style="position: relative; z-index: 1; color: white;">
    <h1>Bienvenido a tu Aplicación Web</h1>
    <p>Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>
</div>

<!-- Con fondo semitransparente -->
<div style="position: relative; z-index: 1; color: white; background: rgba(0,0,0,0.6); padding: 40px; border-radius: 12px; max-width: 800px; margin: 0 auto;">
    <h1>Bienvenido a tu Aplicación Web</h1>
    <p>Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>
</div>
```

---

## 🔧 Configuración Actual vs Recomendada

### Tu Configuración Actual:

```html
<div class="video-background">
    ${this.heroVideo.render()}
</div>
```

### Configuraciones Recomendadas:

#### Para video de Coldplay (brillante/colorido):
```html
<div class="video-background overlay-dark filter-cinematic">
    ${this.heroVideo.render()}
</div>
```

#### Para máximo impacto visual:
```html
<div class="video-background overlay-gradient zoom-effect blur-edges">
    ${this.heroVideo.render()}
</div>
```

#### Para look profesional:
```html
<div class="video-background overlay-gradient filter-cinematic">
    ${this.heroVideo.render()}
</div>
```

#### Para efecto dramático:
```html
<div class="video-background filter-grayscale overlay-dark">
    ${this.heroVideo.render()}
</div>
```

---

## 🎨 Ejemplos Completos

### Ejemplo 1: Efecto Cinematográfico Completo

**En home.js:**
```javascript
render() {
    return `
        ${this.navbar.render()}

        <div class="video-background overlay-gradient zoom-effect filter-cinematic">
            ${this.heroVideo.render()}
        </div>

        <div class="page-container">
            <div class="hero">
                <div style="position: relative; z-index: 1; color: white; text-align: center; padding: 100px 20px;">
                    <h1 style="font-size: 56px; margin-bottom: 20px;">Bienvenido a Eventos App</h1>
                    <p style="font-size: 24px; margin-bottom: 30px;">Tu plataforma de eventos premium</p>
                    <button style="padding: 15px 40px; font-size: 18px; background: #ff0066; color: white; border: none; border-radius: 50px; cursor: pointer;">
                        Explorar Eventos
                    </button>
                </div>
                ${this.eventsList.render()}
            </div>
        </div>
    `
}
```

### Ejemplo 2: Minimalista con Overlay Claro

```javascript
render() {
    return `
        ${this.navbar.render()}

        <div class="video-background overlay-light">
            ${this.heroVideo.render()}
        </div>

        <div class="page-container">
            <div class="hero">
                <div style="position: relative; z-index: 1; color: white;">
                    <h1>Bienvenido a tu Aplicación Web</h1>
                    <p>Sistema de rutas tipo React con Vanilla JavaScript y Vite</p>
                </div>
                ${this.eventsList.render()}
            </div>
        </div>
    `
}
```

---

## 🚀 Prueba Rápida

Para probar diferentes opciones sin editar código:

1. Abre tu navegador en `http://localhost:5173`
2. Abre DevTools (F12)
3. En la consola, ejecuta:

```javascript
// Cambiar a overlay oscuro
document.querySelector('.video-background').className = 'video-background overlay-dark'

// Cambiar a gradiente con zoom
document.querySelector('.video-background').className = 'video-background overlay-gradient zoom-effect'

// Combinar múltiples efectos
document.querySelector('.video-background').className = 'video-background overlay-dark filter-cinematic blur-edges'

// Volver al normal
document.querySelector('.video-background').className = 'video-background'
```

---

## 📊 Comparación de Efectos

| Efecto | Cuándo Usar | Impacto en Rendimiento |
|--------|-------------|------------------------|
| `overlay-dark` | Video muy brillante | Ninguno |
| `overlay-light` | Video oscuro | Ninguno |
| `overlay-gradient` | Look profesional | Ninguno |
| `zoom-effect` | Añadir movimiento | Bajo |
| `blur-edges` | Efecto cinematográfico | Bajo |
| `filter-grayscale` | Look artístico | Bajo |
| `filter-cinematic` | Look profesional | Bajo |
| Combinar 3+ efectos | Máximo impacto | Medio |

---

## ✅ Checklist de Personalización

- [ ] Elegir overlay adecuado para tu video
- [ ] Probar con y sin zoom effect
- [ ] Verificar legibilidad del texto
- [ ] Probar en móvil
- [ ] Verificar rendimiento (FPS)
- [ ] Ajustar text-shadow si es necesario
- [ ] Considerar ocultar video en móvil si es pesado

---

¿Necesitas más ayuda? Consulta:
- [VIDEO_QUICK_START.md](./VIDEO_QUICK_START.md) - Inicio rápido
- [VIDEO_OPTIMIZATION_GUIDE.md](./VIDEO_OPTIMIZATION_GUIDE.md) - Guía completa
