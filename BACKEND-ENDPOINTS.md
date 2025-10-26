# Mapeo de Endpoints del Backend

## Resumen de Uso por Componente/Página

Este documento mapea los endpoints del backend con los componentes del frontend.

---

## **📋 Eventos**

### **EventsList / HomePage**
Listar eventos en la página principal

```javascript
// Opción 1: Todos los eventos
GET /api/eventos

// Opción 2: Solo eventos próximos (recomendado)
GET /api/eventos/proximos

// Respuesta esperada:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Concierto de Rock",
      "descripcion": "...",
      "fecha": "2025-11-15T20:00:00Z",
      "ubicacion": "Auditorio Nacional",
      "precio": 500,
      "organizador_id": 5
    }
  ]
}
```

**Uso en código:**
```javascript
// EventsList.js
async mount() {
    const { data } = await get('/eventos/proximos')
    this.events = data.map(event => new EventCard(event))
}
```

---

### **EventDetailPage**
Obtener detalles de un evento específico

```javascript
// 1. Obtener evento
GET /api/eventos/{id}

// 2. Obtener boletos disponibles
GET /api/boletos/evento/{eventoId}/disponibles

// 3. Obtener estadísticas de boletos
GET /api/boletos/evento/{eventoId}/estadisticas

// Respuesta de evento:
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Concierto de Rock",
    "descripcion": "Un evento increíble...",
    "fecha": "2025-11-15T20:00:00Z",
    "ubicacion": "Auditorio Nacional",
    "precio": 500,
    "categoria": "Música",
    "organizador_id": 5
  }
}

// Respuesta de boletos disponibles:
{
  "success": true,
  "data": {
    "boletos": [
      {
        "id": 123,
        "evento_id": 1,
        "tipo_boleto": "general",
        "precio": 500,
        "estado": "disponible"
      }
    ]
  }
}

// Respuesta de estadísticas:
{
  "success": true,
  "data": {
    "total_boletos": 100,
    "boletos_vendidos": 45,
    "boletos_disponibles": 55,
    "ingresos_totales": 22500
  }
}
```

**Uso en código:**
```javascript
// eventDetail.js
async loadEvent() {
    // 1. Cargar evento
    const { data } = await get(`/eventos/${this.eventId}`)
    const evento = data.evento || data

    // 2. Cargar boletos disponibles
    const { data: boletosData } = await get(`/boletos/evento/${this.eventId}/disponibles`)
    const boletosDisponibles = boletosData?.boletos || []

    // 3. Cargar estadísticas
    const { data: statsData } = await get(`/boletos/evento/${this.eventId}/estadisticas`)

    this.setState({
        event: evento,
        boletosDisponibles,
        estadisticasBoletos: statsData
    })
}
```

---

## **🎫 Compra de Boletos (Órdenes)**

### **EventDetailPage - Compra**
Proceso completo de compra de boletos

```javascript
// 1. Crear orden
POST /api/ordenes
Body: {
  "usuario_id": 594,
  "boletos_ids": [123],
  "cantidad_boletos": 1,
  "total": 500,
  "metodo_pago": "tarjeta"
}

// Respuesta:
{
  "success": true,
  "data": {
    "orden": {
      "id": 456,
      "usuario_id": 594,
      "total": 500,
      "estado": "pendiente",
      "fecha_creacion": "2025-10-24T10:00:00Z"
    }
  }
}

// 2. Pagar orden
POST /api/ordenes/{id}/pagar
Body: {
  "metodo_pago": "tarjeta",
  "datos_pago": {
    "numero_tarjeta": "****1234",
    "titular": "Juan Pérez"
  }
}

// Respuesta:
{
  "success": true,
  "message": "Pago procesado exitosamente",
  "data": {
    "orden_id": 456,
    "estado": "pagada",
    "fecha_pago": "2025-10-24T10:05:00Z"
  }
}
```

**Uso en código:**
```javascript
// eventDetail.js
async purchaseTicket() {
    const user = getUserInfo()
    const boleto = this.state.boletosDisponibles[0]

    // 1. Crear orden
    const { data, error } = await post('/ordenes', {
        usuario_id: user.id,
        boletos_ids: [boleto.id],
        cantidad_boletos: 1,
        total: this.state.event.precio,
        metodo_pago: 'tarjeta'
    })

    if (error) {
        // Manejar error
        return
    }

    const orden = data.orden || data

    // 2. Pagar orden
    const { data: pagoData } = await post(`/ordenes/${orden.id}/pagar`, {
        metodo_pago: 'tarjeta',
        datos_pago: {}
    })

    // 3. Mostrar confirmación
    alert(`¡Orden #${orden.id} pagada exitosamente!`)
}
```

---

## **👤 Usuarios**

### **LoginPage**
Autenticación de usuario

```javascript
POST /api/usuarios/login
Body: {
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123!"
}

// Respuesta:
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 594,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan",
      "apellidos": "Pérez García",
      "rol": "ORGANIZADOR"
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
}
```

**Uso en código:**
```javascript
// login.js
async fetchUserAuth(email, password) {
    const { data, error } = await post('/usuarios/login', { email, password })

    if (!error && data.tokens) {
        localStorage.setItem('authToken', data.tokens.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
    }
}
```

---

### **SignUpPage**
Registro de nuevo usuario

```javascript
POST /api/usuarios
Body: {
  "email": "nuevo@ejemplo.com",
  "password": "Password123!",
  "nombre": "María",
  "apellidos": "González",
  "telefono": "5551234567",
  "rol": "USER"
}

// Respuesta:
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "usuario_id": 595,
    "email": "nuevo@ejemplo.com"
  }
}
```

---

### **ProfilePage**
Ver y actualizar perfil

```javascript
// Obtener perfil
GET /api/usuarios/{id}

// Actualizar perfil
PUT /api/usuarios/{id}
Body: {
  "nombre": "Juan Carlos",
  "apellidos": "Pérez García",
  "telefono": "5559876543"
}
```

---

## **📦 Mis Órdenes / Reservas**

### **UserDashboardPage / MisReservasPage**
Ver órdenes del usuario

```javascript
// Opción 1: Mis órdenes (requiere autenticación)
GET /api/ordenes/mis-ordenes

// Opción 2: Órdenes por usuario (si eres admin)
GET /api/ordenes/usuario/{usuarioId}

// Respuesta:
{
  "success": true,
  "data": [
    {
      "id": 456,
      "usuario_id": 594,
      "evento_nombre": "Concierto de Rock",
      "cantidad_boletos": 1,
      "total": 500,
      "estado": "pagada",
      "fecha_creacion": "2025-10-24T10:00:00Z"
    }
  ]
}
```

**Uso en código:**
```javascript
// misReservas.js
async loadOrdenes() {
    const { data } = await get('/ordenes/mis-ordenes')
    this.ordenes = data
    this.render()
}
```

---

## **👨‍💼 Panel de Organizador**

### **OrganizadorDashboardPage**
Eventos del organizador

```javascript
// Obtener eventos de un organizador
GET /api/eventos/organizador/{organizadorId}

// Respuesta:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Concierto de Rock",
      "fecha": "2025-11-15T20:00:00Z",
      "boletos_vendidos": 45,
      "ingresos": 22500
    }
  ]
}
```

---

### **Crear Evento**
Crear nuevo evento (solo organizadores/admins)

```javascript
POST /api/eventos
Body: {
  "nombre": "Festival de Jazz 2025",
  "descripcion": "Un evento increíble...",
  "fecha": "2025-12-01T19:00:00Z",
  "ubicacion": "Teatro Principal",
  "precio": 750,
  "categoria": "Música",
  "organizador_id": 5
}

// Respuesta:
{
  "success": true,
  "message": "Evento creado exitosamente",
  "data": {
    "evento_id": 10,
    "nombre": "Festival de Jazz 2025"
  }
}
```

---

### **Crear Boletos para Evento**
Generar boletos en lote

```javascript
POST /api/boletos/lote
Body: {
  "evento_id": 10,
  "cantidad": 100,
  "tipo_boleto": "general",
  "precio": 750
}

// Respuesta:
{
  "success": true,
  "message": "100 boletos creados exitosamente",
  "data": {
    "evento_id": 10,
    "boletos_creados": 100
  }
}
```

---

## **🔐 Panel de Admin**

### **AdminDashboardPage**
Estadísticas generales

```javascript
// Conteo de usuarios
GET /api/usuarios/stats/count

// Estadísticas generales de usuarios
GET /api/usuarios/stats/general

// Conteo de eventos
GET /api/eventos/count

// Estadísticas de eventos
GET /api/eventos/estadisticas

// Estadísticas de órdenes
GET /api/ordenes/estadisticas
```

---

### **Gestión de Usuarios**
Administrar usuarios

```javascript
// Listar todos los usuarios
GET /api/usuarios

// Cambiar rol de usuario
PUT /api/usuarios/{id}/rol
Body: {
  "rol": "ORGANIZADOR"
}

// Eliminar usuario
DELETE /api/usuarios/{id}
```

---

## **📊 Resumen por Rol**

### **USER (Usuario Normal)**
```javascript
✅ GET  /api/eventos
✅ GET  /api/eventos/proximos
✅ GET  /api/eventos/{id}
✅ GET  /api/boletos/evento/{eventoId}/disponibles
✅ POST /api/ordenes
✅ POST /api/ordenes/{id}/pagar
✅ GET  /api/ordenes/mis-ordenes
✅ PUT  /api/usuarios/{id} (solo su propio perfil)
```

### **ORGANIZADOR**
```javascript
✅ Todo lo de USER +
✅ POST   /api/eventos
✅ PUT    /api/eventos/{id} (solo sus eventos)
✅ DELETE /api/eventos/{id} (solo sus eventos)
✅ GET    /api/eventos/organizador/{organizadorId}
✅ POST   /api/boletos/lote
✅ GET    /api/ordenes/usuario/{usuarioId}
```

### **ADMIN**
```javascript
✅ Todos los endpoints
✅ GET    /api/usuarios
✅ PUT    /api/usuarios/{id}/rol
✅ DELETE /api/usuarios/{id}
✅ DELETE /api/eventos/{id} (cualquier evento)
✅ GET    /api/ordenes
✅ PUT    /api/ordenes/{id}/estado
```

---

## **🚀 Próximos Pasos**

1. Crear página de **Mis Órdenes** (`/ordenes` o `/mis-reservas`)
2. Crear página de **Crear Evento** para organizadores (`/organizador/crear-evento`)
3. Crear página de **Gestión de Usuarios** para admin (`/admin/usuarios`)
4. Implementar filtros de búsqueda de eventos por categoría/fecha
5. Agregar sistema de cancelación de órdenes
6. Implementar reembolsos

---

**Última actualización:** 2025-10-24
