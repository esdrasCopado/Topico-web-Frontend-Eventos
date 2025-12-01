/**
 * Theme Manager - Maneja el modo claro/oscuro de la aplicación
 */

const THEME_KEY = 'app-theme';
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

/**
 * Obtiene el tema actual del sistema
 * @returns {string} 'dark' o 'light'
 */
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEMES.DARK;
    }
    return THEMES.LIGHT;
}

/**
 * Obtiene el tema guardado en localStorage
 * @returns {string|null} 'dark', 'light' o null si no hay tema guardado
 */
function getSavedTheme() {
    return localStorage.getItem(THEME_KEY);
}

/**
 * Guarda el tema en localStorage
 * @param {string} theme - 'dark' o 'light'
 */
function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * Aplica el tema al documento
 * @param {string} theme - 'dark' o 'light'
 */
function applyTheme(theme) {
    // Aplicar el atributo data-theme al HTML
    document.documentElement.setAttribute('data-theme', theme);

    // También agregar clase para compatibilidad
    if (theme === THEMES.DARK) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }

    console.log(`✨ Tema aplicado: ${theme}`);
}

/**
 * Inicializa el sistema de temas
 * - Carga el tema guardado o usa el del sistema
 * - Escucha cambios en las preferencias del sistema
 */
export function initTheme() {
    // Obtener el tema a usar (guardado o del sistema)
    const savedTheme = getSavedTheme();
    const theme = savedTheme || getSystemTheme();

    // Aplicar el tema inicial
    applyTheme(theme);

    // Escuchar cambios en las preferencias del sistema
    // Solo si el usuario no ha seleccionado manualmente un tema
    if (!savedTheme) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
            applyTheme(newTheme);
            console.log(`🌓 Cambio automático de tema del sistema: ${newTheme}`);
        });
    }
}

/**
 * Cambia entre modo claro y oscuro
 * @returns {string} El nuevo tema aplicado
 */
export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

    applyTheme(newTheme);
    saveTheme(newTheme);

    return newTheme;
}

/**
 * Obtiene el tema actual
 * @returns {string} 'dark' o 'light'
 */
export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
}

/**
 * Establece un tema específico
 * @param {string} theme - 'dark' o 'light'
 */
export function setTheme(theme) {
    if (theme !== THEMES.DARK && theme !== THEMES.LIGHT) {
        console.warn(`Tema no válido: ${theme}. Usa 'dark' o 'light'`);
        return;
    }

    applyTheme(theme);
    saveTheme(theme);
}

/**
 * Resetea el tema a las preferencias del sistema
 */
export function resetToSystemTheme() {
    localStorage.removeItem(THEME_KEY);
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
    console.log(`🔄 Tema reseteado a preferencias del sistema: ${systemTheme}`);
}

// Exportar constantes
export { THEMES };