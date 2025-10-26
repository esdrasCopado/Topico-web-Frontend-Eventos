# Rutas Dinámicas y Navegación a Páginas de Detalle

## Objetivo

Implementar navegación clickeable desde una lista de eventos hacia páginas de detalle individuales usando **rutas dinámicas con parámetros**.

---

## Flujo Completo

```
1. Usuario ve lista de eventos en /
2. Hace clic en un evento
3. Navega a /evento/:id (ej: /evento/123)
4. Se carga la página de detalle del evento
5. Puede comprar boletos
6. Se redirige a /mis-reservas
```

---

## Implementación Paso a Paso

### **Paso 1: Hacer el EventCard clickeable**

**Archivo**: [src/components/EventCard.js](src/components/EventCard.js)

**Antes** (div estático):
```javascript
render() {
    return `
        <div class="event-card">
            <h3>${this.nombre}</h3>
            <p>${this.descripcion}</p>
        </div>
    `
}
```

**Después** (link dinámico):
```javascript
render() {
    return `
        <a href="/evento/${this.id}" data-link class="event-card">
            <h3 class="event-name">${this.nombre}</h3>
            <p class="event-description">${this.descripcion}</p>

            <div class="event-cta">
                Ver detalles
                <svg>→</svg>
            </div>
        </a>
    `
}
```

**Puntos clave:**
- Cambiar `<div>` por `<a>`
- Usar `href="/evento/${this.id}"` para rutas dinámicas
- Agregar `data-link` para navegación SPA (sin recargar página)
- Agregar CTA visual ("Ver detalles")

---

### **Paso 2: Configurar la ruta dinámica**

**Archivo**: [src/main.js](src/main.js)

```javascript
import { EventDetailPage } from './pages/eventDetail.js'

const routes = [
    {
        path: '/evento/:id',  // ← :id es el parámetro dinámico
        component: EventDetailPage
    }
]
```

**Cómo funciona:**
- `:id` es un **placeholder** que captura cualquier valor
- `/evento/123` → `params.id = "123"`
- `/evento/456` → `params.id = "456"`

---

### **Paso 3: Crear la página de detalle**

**Archivo**: [src/pages/eventDetail.js](src/pages/eventDetail.js)

**Estructura básica:**

```javascript
export class EventDetailPage {
    constructor(params) {
        this.eventId = params.id  // ← Obtenemos el ID de la URL
        this.state = {
            event: null,
            loading: true,
            error: null
        }
    }

    async afterRender() {
        await this.loadEvent()
    }

    async loadEvent() {
        // Llamada a la API
        const { data, error } = await get(`/eventos/${this.eventId}`)

        if (error) {
            this.updateState({ loading: false, error })
            return
        }

        this.updateState({ event: data, loading: false })
    }

    render() {
        if (this.state.loading) return this.renderLoading()
        if (this.state.error) return this.renderError()
        return this.renderEvent()
    }

    renderEvent() {
        const event = this.state.event

        return `
            <div class="event-detail">
                <h1>${event.nombre}</h1>
                <p>${event.descripcion}</p>
                <p>Fecha: ${event.fecha}</p>
                <p>Ubicación: ${event.ubicacion}</p>
                <p>Precio: $${event.precio}</p>

                <button id="purchase-btn">
                    Comprar Boleto
                </button>
            </div>
        `
    }
}
```

---

### **Paso 4: Implementar la compra de boletos**

```javascript
setupPurchaseButton() {
    const purchaseBtn = document.getElementById('purchase-btn')

    purchaseBtn.addEventListener('click', async () => {
        await this.purchaseTicket()
    })
}

async purchaseTicket() {
    const user = getUserInfo()

    const { data, error } = await post('/reservas', {
        evento_id: this.eventId,
        usuario_id: user.id,
        cantidad: 1
    })

    if (error) {
        alert('Error al comprar boleto')
        return
    }

    alert('¡Boleto comprado exitosamente!')

    // Redirigir a mis reservas
    window.location.href = '/mis-reservas'
}
```

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│           HOME PAGE (/)                         │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ EventCard   │  │ EventCard   │             │
│  │ ID: 123     │  │ ID: 456     │             │
│  │ [Ver más]   │  │ [Ver más]   │             │
│  └─────────────┘  └─────────────┘             │
│         │                 │                     │
└─────────┼─────────────────┼─────────────────────┘
          │                 │
          ▼                 ▼
  /evento/123       /evento/456
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────┐
│      EVENT DETAIL PAGE (/evento/:id)            │
│                                                 │
│  1. Constructor recibe params.id                │
│  2. afterRender() → loadEvent()                 │
│  3. GET /api/eventos/123                        │
│  4. Renderiza detalles completos                │
│  5. Usuario hace clic en "Comprar"              │
│  6. POST /api/reservas                          │
│  7. Redirige a /mis-reservas                    │
└─────────────────────────────────────────────────┘
```

---

## Ejemplo Completo de Uso

### **1. Lista de eventos en HomePage**

```javascript
// EventsList.js carga eventos del backend
async mount() {
    const { data } = await get('/eventos')

    this.events = data.map(event => new EventCard(event))
}

render() {
    return this.events.map(event => event.render()).join('')
}
```

**Resultado HTML:**
```html
<a href="/evento/1" data-link class="event-card">
    <h3>Concierto de Rock</h3>
    <p>Un evento increíble...</p>
    <div class="event-cta">Ver detalles →</div>
</a>

<a href="/evento/2" data-link class="event-card">
    <h3>Festival de Jazz</h3>
    <p>Música en vivo...</p>
    <div class="event-cta">Ver detalles →</div>
</a>
```

### **2. Usuario hace clic**

```
Click en "Concierto de Rock"
   ↓
URL cambia a: /evento/1
   ↓
Router ejecuta matchRoute()
   ↓
Encuentra: { path: '/evento/:id', component: EventDetailPage }
   ↓
Extrae params: { id: "1" }
   ↓
Renderiza: new EventDetailPage({ id: "1" })
```

### **3. Carga de datos**

```javascript
// EventDetailPage
async loadEvent() {
    console.log('📥 Cargando evento ID:', this.eventId) // "1"

    const { data, error } = await get('/eventos/1')
    // GET http://localhost:3000/api/eventos/1

    if (!error) {
        this.state.event = data
        // Re-renderizar con los datos
    }
}
```

### **4. Compra de boleto**

```javascript
async purchaseTicket() {
    const { data, error } = await post('/reservas', {
        evento_id: 1,
        usuario_id: 594,
        cantidad: 1
    })
    // POST http://localhost:3000/api/reservas

    if (!error) {
        alert('✅ Boleto comprado')
        window.location.href = '/mis-reservas'
    }
}
```

---

## Rutas Dinámicas Avanzadas

### **Múltiples parámetros**

```javascript
// Ruta con 2 parámetros
{
    path: '/evento/:id/reserva/:reservaId',
    component: ReservaDetailPage
}

// URL: /evento/123/reserva/456
// params = { id: "123", reservaId: "456" }
```

### **Rutas anidadas**

```javascript
{
    path: '/admin/eventos/:id/editar',
    component: EditEventPage,
    guard: () => authGuard({ allowedRoles: [ROLES.ADMIN] })
}
```

### **Query parameters (opcional)**

```javascript
// URL: /eventos?categoria=musica&precio=gratis
const urlParams = new URLSearchParams(window.location.search)
const categoria = urlParams.get('categoria') // "musica"
const precio = urlParams.get('precio') // "gratis"
```

---

## CSS para Event Cards Clickeables

**Archivo**: [src/assets/css/components.css](src/assets/css/components.css)

```css
.event-card {
    display: block;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 20px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.event-card:hover {
    border-color: #0969da;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
}

.event-cta {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0969da;
    font-weight: 600;
}

.event-card:hover .event-cta svg {
    transform: translateX(4px);
}
```

---

## Testing

### **Checklist de pruebas:**

- [ ] Al hacer clic en un evento, navega a `/evento/:id`
- [ ] La URL cambia sin recargar la página (SPA)
- [ ] La página de detalle carga correctamente
- [ ] Se muestra un loader mientras cargan los datos
- [ ] Se muestra un error si el evento no existe (404)
- [ ] El botón de compra funciona
- [ ] Redirige correctamente después de comprar
- [ ] El botón está deshabilitado si no hay cupo
- [ ] Si no está autenticado, muestra botón de login

---

## Errores Comunes

### **1. Error: "Cannot read property 'id' of undefined"**

**Causa**: No estás pasando los parámetros correctamente

**Solución**:
```javascript
// En router.js, asegúrate de:
const page = new PageComponent(params) // ← params debe tener 'id'
```

### **2. Error: "Event not found (404)"**

**Causa**: El ID no existe en el backend

**Solución**: Maneja el error gracefully
```javascript
if (!data || data.length === 0) {
    return this.renderNotFound()
}
```

### **3. La navegación recarga la página**

**Causa**: Falta el atributo `data-link`

**Solución**:
```html
<a href="/evento/123" data-link>Ver evento</a>
                      ^^^^^^^^^
                      IMPORTANTE
```

### **4. Los estilos no se aplican**

**Causa**: No importaste el CSS

**Solución**:
```javascript
// En main.js
import './assets/css/pages/eventDetail.css'
```

---

## Próximos Pasos

- [ ] Agregar breadcrumbs para navegación
- [ ] Implementar botón "Volver" a la lista
- [ ] Agregar galería de imágenes del evento
- [ ] Implementar selector de cantidad de boletos
- [ ] Agregar mapa de ubicación (Google Maps)
- [ ] Implementar sistema de reviews/comentarios
- [ ] Agregar botón de "Compartir" en redes sociales

---

**Última actualización:** 2025-10-24
