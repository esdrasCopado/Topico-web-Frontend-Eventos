/**
 * Componente Button - Ejemplo de componente simple reutilizable
 * Similar a un componente funcional de React
 */

export class Button {
    /**
     * @param {Object} props - Propiedades del componente
     * @param {string} props.text - Texto del botón
     * @param {string} props.type - Tipo de botón (primary, secondary, danger)
     * @param {Function} props.onClick - Función a ejecutar al hacer click
     * @param {string} props.id - ID único del botón
     */
    constructor(props = {}) {
        this.text = props.text || 'Click me'
        this.type = props.type || 'primary'
        this.onClick = props.onClick
        this.id = props.id || `btn-${Math.random().toString(36).substr(2, 9)}`
        this.disabled = props.disabled || false
    }

    /**
     * Renderiza el HTML del componente
     * Similar al return de un componente React
     */
    render() {
        const disabledAttr = this.disabled ? 'disabled' : ''
        const disabledClass = this.disabled ? 'btn-disabled' : ''

        return `
            <button
                id="${this.id}"
                class="btn btn-${this.type} ${disabledClass}"
                ${disabledAttr}
            >
                ${this.text}
            </button>
        `
    }

    /**
     * Attach event listeners después de que el componente se renderice
     * Similar a useEffect en React
     */
    mount() {
        const button = document.getElementById(this.id)

        if (button && this.onClick && !this.disabled) {
            button.addEventListener('click', this.onClick)
        }
    }

    /**
     * Cleanup - similar a return en useEffect
     */
    unmount() {
        const button = document.getElementById(this.id)
        if (button && this.onClick) {
            button.removeEventListener('click', this.onClick)
        }
    }
}

/**
 * Helper function para crear un botón rápidamente
 * Similar a usar el componente directamente: <Button text="Click" />
 */
export function createButton(props) {
    const button = new Button(props)
    return button
}
