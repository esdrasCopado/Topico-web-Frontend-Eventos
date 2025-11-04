# Guía de Efectos de Difuminado para Video

## 🎨 Efectos de Difuminado Disponibles

Todos estos efectos se agregan simplemente con una clase en el `<div class="video-background">` en [home.js](../src/pages/home.js:49).

---

## 🔽 Difuminado Inferior (Más Común)

### 1. `fade-bottom` - Difuminado Normal

**Uso:**
```html
<div class="video-background fade-bottom">
```

**Características:**
- Cubre el 40% inferior del video
- Gradiente de transparente a negro (80%)
- **Ideal para:** Proteger legibilidad de contenido en la parte inferior

**Visual:**
```
┌─────────────────────┐
│                     │ ← Video claro
│     VIDEO           │
│                     │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ← Comienza difuminado
│████████████████████ │ ← Oscuro total (80%)
└─────────────────────┘
```

---

### 2. `fade-bottom-soft` - Difuminado Suave ⭐ RECOMENDADO

**Uso:**
```html
<div class="video-background fade-bottom-soft">
```

**Características:**
- Cubre el 50% inferior del video
- Gradiente muy suave (40% - 90%)
- **Ideal para:** Look profesional sin ser muy obvio

**Visual:**
```
┌─────────────────────┐
│     VIDEO           │ ← Video claro
│                     │
│░░░░░░░░░░░░░░░░░░░░░│ ← Difuminado muy suave
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ← Más oscuro gradualmente
│████████████████████ │ ← Oscuro total (90%)
└─────────────────────┘
```

---

### 3. `fade-bottom-strong` - Difuminado Fuerte

**Uso:**
```html
<div class="video-background fade-bottom-strong">
```

**Características:**
- Cubre el 60% inferior del video
- Gradiente agresivo (60% - 100% negro)
- **Ideal para:** Máximo contraste para texto claro

**Visual:**
```
┌─────────────────────┐
│     VIDEO           │ ← Video claro
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ← Comienza difuminado temprano
│████████████████████ │
│████████████████████ │ ← Oscuro total (100%)
│████████████████████ │
└─────────────────────┘
```

---

## 🔼 Difuminado Superior

### 4. `fade-top` - Difuminado Arriba

**Uso:**
```html
<div class="video-background fade-top">
```

**Características:**
- Cubre el 30% superior
- **Ideal para:** Proteger navbar o header

**Visual:**
```
┌─────────────────────┐
│████████████████████ │ ← Oscuro arriba
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│     VIDEO           │ ← Video claro
│                     │
└─────────────────────┘
```

---

## 🔼🔽 Difuminado Doble

### 5. `fade-top-bottom` - Arriba y Abajo

**Uso:**
```html
<div class="video-background fade-top-bottom">
```

**Características:**
- Oscuro arriba (60%) y abajo (90%)
- Centro claro
- **Ideal para:** Contenido centrado

**Visual:**
```
┌─────────────────────┐
│████████████████████ │ ← Oscuro arriba
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│                     │
│     VIDEO CLARO     │ ← Centro visible
│                     │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│████████████████████ │ ← Oscuro abajo
└─────────────────────┘
```

---

## ⭕ Vignette (Difuminado Circular)

### 6. `vignette` - Vignette Clásico

**Uso:**
```html
<div class="video-background vignette">
```

**Características:**
- Oscurece los bordes en todas direcciones
- Centro brillante
- **Ideal para:** Look cinematográfico, focus central

**Visual:**
```
███████████████████████
██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
██▒░░░░░░░░░░░░░░░░░▒██
██▒░  VIDEO CLARO  ░▒██ ← Centro claro
██▒░░░░░░░░░░░░░░░░░▒██
██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
███████████████████████
```

---

### 7. `vignette-bottom` - Vignette + Fade Inferior ⭐ MUY RECOMENDADO

**Uso:**
```html
<div class="video-background vignette-bottom">
```

**Características:**
- Combina vignette con fade inferior fuerte
- Efecto profesional muy usado en cine
- **Ideal para:** Máximo impacto visual

**Visual:**
```
███████████████████████
██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
██▒░░░░░░░░░░░░░░░░░▒██
██▒░  VIDEO CLARO  ░▒██
██▒░░░░░░░░░░░░░░░░░▒██
██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
███████████████████████ ← Muy oscuro abajo
```

---

## ↔️ Otros Efectos

### 8. `fade-sides` - Difuminado Lateral

**Uso:**
```html
<div class="video-background fade-sides">
```

**Visual:**
```
██▒░░░░░░░░░░░░░░░░▒██
██▒     VIDEO     ▒██
██▒               ▒██
```

---

### 9. `letterbox` - Barras Cinematográficas

**Uso:**
```html
<div class="video-background letterbox">
```

**Características:**
- Barras negras arriba y abajo (como en películas)
- **Ideal para:** Efecto cine

**Visual:**
```
┌─────────────────────┐
│████████████████████ │ ← Barra superior
│                     │
│      VIDEO          │ ← Video visible
│                     │
│████████████████████ │ ← Barra inferior
└─────────────────────┘
```

---

## 🎯 Comparación Rápida

| Efecto | Área Afectada | Intensidad | Uso Recomendado |
|--------|---------------|------------|-----------------|
| `fade-bottom` | Inferior 40% | Media (80%) | General |
| `fade-bottom-soft` ⭐ | Inferior 50% | Suave (40-90%) | **Profesional** |
| `fade-bottom-strong` | Inferior 60% | Fuerte (100%) | Alto contraste |
| `fade-top` | Superior 30% | Media (70%) | Proteger header |
| `fade-top-bottom` | Ambos extremos | Variable | Contenido central |
| `vignette` | Bordes circulares | Media (60%) | Cinematográfico |
| `vignette-bottom` ⭐ | Bordes + inferior | Fuerte | **Premium** |
| `fade-sides` | Laterales | Media (70%) | Formato vertical |
| `letterbox` | Arriba + abajo | Total (100%) | Cine clásico |

---

## 💡 Cómo Implementar

### En tu [home.js](../src/pages/home.js), línea 49:

**Antes:**
```html
<div class="video-background">
    ${this.heroVideo.render()}
</div>
```

**Después (agrega la clase):**
```html
<div class="video-background fade-bottom-soft">
    ${this.heroVideo.render()}
</div>
```

---

## 🎨 Combinaciones Recomendadas

### Para Video de Coldplay (Brillante/Colorido):

#### Opción 1: Profesional Suave
```html
<div class="video-background fade-bottom-soft overlay-dark filter-cinematic">
```
- Difuminado inferior suave
- Overlay oscuro general
- Filtro cinematográfico

#### Opción 2: Máximo Impacto
```html
<div class="video-background vignette-bottom filter-cinematic zoom-effect">
```
- Vignette + fade inferior
- Filtro cinematográfico
- Efecto zoom suave

#### Opción 3: Minimalista Elegante
```html
<div class="video-background fade-bottom overlay-light">
```
- Solo difuminado inferior
- Overlay claro
- Simple y efectivo

#### Opción 4: Dramático
```html
<div class="video-background fade-bottom-strong vignette filter-grayscale">
```
- Difuminado inferior fuerte
- Vignette circular
- Blanco y negro

---

## 🔧 Personalización Avanzada

Si quieres ajustar los valores, edita [VideoPlayer.css](../src/assets/css/components/VideoPlayer.css):

### Cambiar altura del difuminado inferior:

```css
/* Línea 155 */
.video-background.fade-bottom::before {
    height: 40%;  /* ← Cambia a 30%, 50%, 60%, etc. */
}
```

### Cambiar intensidad del oscurecimiento:

```css
/* Línea 156-160 */
background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.8) 100%  /* ← Cambia 0.8 a 0.5 (más claro) o 1.0 (más oscuro) */
);
```

### Cambiar color del difuminado:

```css
/* Negro (default) */
rgba(0, 0, 0, 0.8)

/* Azul oscuro */
rgba(10, 25, 47, 0.8)

/* Morado oscuro */
rgba(25, 0, 50, 0.8)

/* Verde oscuro */
rgba(0, 25, 10, 0.8)
```

---

## 🚀 Prueba Rápida en el Navegador

Sin editar código, prueba en la consola del navegador (F12):

```javascript
// Difuminado suave inferior (recomendado)
document.querySelector('.video-background').className = 'video-background fade-bottom-soft'

// Vignette + inferior
document.querySelector('.video-background').className = 'video-background vignette-bottom'

// Combinado: overlay + difuminado + filtro
document.querySelector('.video-background').className = 'video-background overlay-dark fade-bottom filter-cinematic'

// Volver al normal
document.querySelector('.video-background').className = 'video-background'
```

---

## ✅ Recomendación Final

Para tu video de Coldplay, te recomiendo empezar con:

```html
<div class="video-background fade-bottom-soft overlay-dark filter-cinematic">
```

Esto da un look **profesional, moderno y elegante** con:
- ✅ Difuminado suave en la parte inferior
- ✅ Overlay oscuro general para contraste
- ✅ Filtro cinematográfico para colores premium
- ✅ Legibilidad perfecta del texto

---

**¿Listo para probarlo?** Simplemente agrega `fade-bottom-soft` a tu `video-background` en [home.js](../src/pages/home.js:49)!
