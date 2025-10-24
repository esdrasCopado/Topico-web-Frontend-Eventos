/**
 * Componente Card - Ejemplo de componente con children (contenido)
 * Similar a un componente React que recibe children
 */

export class Card {
    /**
     * @param {Object} props
     * @param {string} props.title - Título de la card
     * @param {string} props.subtitle - Subtítulo opcional
     * @param {string} props.content - Contenido HTML de la card
     * @param {string} props.footer - Footer opcional
     * @param {string} props.className - Clases CSS adicionales
     * @param {string} props.icon - Emoji o icono opcional
     */
    constructor(props = {}) {
        this.title = props.title || ''
        this.subtitle = props.subtitle || ''
        this.content = props.content || ''
        this.footer = props.footer || ''
        this.className = props.className || ''
        this.icon = props.icon || ''
    }

    render() {
        return `
            <div class="card ${this.className}">
                ${this.icon ? `<div class="card-icon">${this.icon}</div>` : ''}

                ${this.title ? `
                    <div class="card-header">
                        <h3 class="card-title">${this.title}</h3>
                        ${this.subtitle ? `<p class="card-subtitle">${this.subtitle}</p>` : ''}
                    </div>
                ` : ''}

                ${this.content ? `
                    <div class="card-body">
                        ${this.content}
                    </div>
                ` : ''}

                ${this.footer ? `
                    <div class="card-footer">
                        ${this.footer}
                    </div>
                ` : ''}
            </div>
        `
    }
}

/**
 * Helper function
 */
export function createCard(props) {
    const card = new Card(props)
    return card.render()
}
