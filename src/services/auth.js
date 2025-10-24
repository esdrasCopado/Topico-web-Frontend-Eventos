/**
 * Servicio de Autenticación y Autorización
 * Maneja roles, permisos y sesiones de usuario
 */

// Roles disponibles en la aplicación
export const ROLES = {
    ADMIN: 'ADMIN',
    ORGANIZADOR: 'ORGANIZADOR',
    USER: 'USER'
}

// Jerarquía de roles (de mayor a menor permiso)
const ROLE_HIERARCHY = {
    [ROLES.ADMIN]: 3,
    [ROLES.ORGANIZADOR]: 2,
    [ROLES.USER]: 1
}

/**
 * Obtiene el usuario actual desde localStorage
 * @returns {Object|null} Usuario o null si no está autenticado
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null

    try {
        return JSON.parse(userStr)
    } catch (error) {
        console.error('Error al parsear usuario:', error)
        return null
    }
}

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token o null
 */
export function getAuthToken() {
    return localStorage.getItem('authToken')
}

/**
 * Obtiene el refresh token
 * @returns {string|null} Refresh token o null
 */
export function getRefreshToken() {
    return localStorage.getItem('refreshToken')
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
    return !!getAuthToken() && !!getCurrentUser()
}

/**
 * Obtiene el rol del usuario actual
 * @returns {string|null} Rol del usuario o null
 */
export function getUserRole() {
    const user = getCurrentUser()
    return user?.rol || null
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} role - Rol a verificar
 * @returns {boolean}
 */
export function hasRole(role) {
    const userRole = getUserRole()
    return userRole === role
}

/**
 * Verifica si el usuario tiene al menos uno de los roles especificados
 * @param {string[]} roles - Array de roles permitidos
 * @returns {boolean}
 */
export function hasAnyRole(roles) {
    const userRole = getUserRole()
    return roles.includes(userRole)
}

/**
 * Verifica si el usuario tiene un rol con nivel igual o superior
 * @param {string} minRole - Rol mínimo requerido
 * @returns {boolean}
 */
export function hasMinimumRole(minRole) {
    const userRole = getUserRole()
    if (!userRole || !minRole) return false

    const userLevel = ROLE_HIERARCHY[userRole] || 0
    const minLevel = ROLE_HIERARCHY[minRole] || 0

    return userLevel >= minLevel
}

/**
 * Verifica si el usuario es administrador
 * @returns {boolean}
 */
export function isAdmin() {
    return hasRole(ROLES.ADMIN)
}

/**
 * Verifica si el usuario es organizador
 * @returns {boolean}
 */
export function isOrganizador() {
    return hasRole(ROLES.ORGANIZADOR)
}

/**
 * Verifica si el usuario es un usuario normal
 * @returns {boolean}
 */
export function isUser() {
    return hasRole(ROLES.USER)
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('loginTimestamp')

    console.log('🔓 Sesión cerrada')

    // Redirigir al login
    window.location.href = '/login'
}

/**
 * Verifica si el token ha expirado (opcional)
 * @returns {boolean}
 */
export function isTokenExpired() {
    const token = getAuthToken()
    if (!token) return true

    try {
        // Decodificar el JWT (solo la parte del payload)
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp * 1000 // Convertir a milisegundos

        return Date.now() > exp
    } catch (error) {
        console.error('Error al verificar expiración del token:', error)
        return true
    }
}

/**
 * Obtiene información del usuario para mostrar en la UI
 * @returns {Object}
 */
export function getUserInfo() {
    const user = getCurrentUser()
    if (!user) return null

    return {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        nombreCompleto: `${user.nombre} ${user.apellidos}`,
        iniciales: `${user.nombre?.[0] || ''}${user.apellidos?.[0] || ''}`.toUpperCase()
    }
}

/**
 * Guard de autenticación para rutas
 * @param {Object} options - Opciones de autorización
 * @param {string[]} options.allowedRoles - Roles permitidos
 * @param {string} options.redirectTo - Ruta de redirección si no autorizado
 * @returns {boolean} true si está autorizado
 */
export function authGuard({ allowedRoles = [], redirectTo = '/login' } = {}) {
    // Verificar si está autenticado
    if (!isAuthenticated()) {
        console.warn('⚠️ Usuario no autenticado. Redirigiendo a:', redirectTo)
        window.location.href = redirectTo
        return false
    }

    // Si hay roles específicos, verificar autorización
    if (allowedRoles.length > 0) {
        if (!hasAnyRole(allowedRoles)) {
            const userRole = getUserRole()
            console.warn(`⚠️ Acceso denegado. Rol actual: ${userRole}, Roles permitidos:`, allowedRoles)
            window.location.href = '/unauthorized' // Puedes crear esta página
            return false
        }
    }

    return true
}

/**
 * Guard inverso: redirige si ya está autenticado
 * Útil para páginas de login/signup
 */
export function guestGuard(redirectTo = '/') {
    if (isAuthenticated()) {
        console.log('✅ Usuario ya autenticado. Redirigiendo a:', redirectTo)
        window.location.href = redirectTo
        return false
    }
    return true
}
