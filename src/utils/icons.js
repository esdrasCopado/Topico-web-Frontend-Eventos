/**
 * Repositorio centralizado de iconos SVG
 * Facilita el mantenimiento y reutilización de iconos en toda la aplicación
 */

export const Icons = {
    // Iconos de tickets/boletos
    tickets: {
        vip: `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `,
        general: `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 12v10H4V12"/>
                <path d="M22 7H2v5h20V7z"/>
                <path d="M12 22V7"/>
                <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
            </svg>
        `,
        platino: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 1L2 7l10 5 10-5-10-6z" />
    
    <path d="M2 7l10 5 10-5" />
    
    <path d="M12 12v10" />
    <path d="M5 9l7 13l7-13" />
    
    </svg>
        `,
        oro: `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="6"/>
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
        `
    },

    // Iconos de calendario/fecha
    calendar: `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2.5zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z"/>
        </svg>
    `,

    // Iconos de ubicación
    location: `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"/>
        </svg>
    `,

    // Iconos de disponibilidad
    availability: `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75z"/>
        </svg>
    `,

    // Iconos de precio/dinero
    price: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v12"/>
            <path d="M15 9H9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 010 5H9"/>
        </svg>
    `,

    // Iconos de usuario
    user: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    `,

    // Iconos de check/success
    check: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    `,

    // Iconos de error/warning
    warning: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    `,

    // Iconos de información
    info: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
    `,

    // Iconos de carrito de compras
    cart: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        </svg>
    `,

    // Iconos de categorías
    music: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
        </svg>
    `,

    sports: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/>
            <path d="M2 12h20"/>
        </svg>
    `,

    theater: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="6"/>
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
        </svg>
    `
}

/**
 * Obtiene un icono por su ruta (ej: 'tickets.vip', 'calendar', etc.)
 * @param {string} path - Ruta del icono separada por puntos
 * @returns {string} SVG del icono o string vacío si no existe
 */
export function getIcon(path) {
    const keys = path.split('.')
    let icon = Icons

    for (const key of keys) {
        icon = icon[key]
        if (!icon) return ''
    }

    return typeof icon === 'string' ? icon : ''
}