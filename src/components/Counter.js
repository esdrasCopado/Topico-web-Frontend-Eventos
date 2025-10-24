/**
 * Componente Counter - Ejemplo de componente CON ESTADO
 * Similar a useState en React
 */

export class Counter {
    /**
     * @param {Object} props
     * @param {number} props.initialValue - Valor inicial del contador
     * @param {number} props.step - Incremento/decremento
     */
    constructor(props = {}) {
        // Estado del componente (similar a useState)
        this.state = {
            count: props.initialValue || 0
        }

        this.step = props.step || 1
        this.id = `counter-${Math.random().toString(36).substr(2, 9)}`
        this.components = [] // Para rastrear sub-componentes
    }

    /**
     * Actualiza el estado y re-renderiza (similar a setState en React)
     */
    setState(newState) {
        this.state = { ...this.state, ...newState }
        this.reRender()
    }

    /**
     * Incrementar contador
     */
    increment() {
        this.setState({ count: this.state.count + this.step })
    }

    /**
     * Decrementar contador
     */
    decrement() {
        this.setState({ count: this.state.count - this.step })
    }

    /**
     * Resetear contador
     */
    reset() {
        this.setState({ count: 0 })
    }

    /**
     * Renderiza el componente
     */
    render() {
        return `
            <div id="${this.id}" class="counter-component">
                <div class="counter-display">
                    <h3>Contador: <span class="counter-value">${this.state.count}</span></h3>
                </div>
                <div class="counter-controls">
                    <button id="${this.id}-dec" class="btn btn-secondary">- ${this.step}</button>
                    <button id="${this.id}-reset" class="btn btn-secondary">Reset</button>
                    <button id="${this.id}-inc" class="btn btn-primary">+ ${this.step}</button>
                </div>
            </div>
        `
    }

    /**
     * Monta los event listeners (similar a useEffect)
     */
    mount() {
        const incrementBtn = document.getElementById(`${this.id}-inc`)
        const decrementBtn = document.getElementById(`${this.id}-dec`)
        const resetBtn = document.getElementById(`${this.id}-reset`)

        // Usamos arrow functions para mantener el contexto 'this'
        if (incrementBtn) {
            incrementBtn.addEventListener('click', () => this.increment())
        }

        if (decrementBtn) {
            decrementBtn.addEventListener('click', () => this.decrement())
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset())
        }
    }

    /**
     * Re-renderiza SOLO este componente (no toda la página)
     */
    reRender() {
        const container = document.getElementById(this.id)
        if (container) {
            // Guardar referencias a los event listeners
            const temp = document.createElement('div')
            temp.innerHTML = this.render()

            // Reemplazar solo el contenido
            container.innerHTML = temp.firstElementChild.innerHTML

            // Re-montar event listeners
            this.mount()
        }
    }

    /**
     * Cleanup
     */
    unmount() {
        const incrementBtn = document.getElementById(`${this.id}-inc`)
        const decrementBtn = document.getElementById(`${this.id}-dec`)
        const resetBtn = document.getElementById(`${this.id}-reset`)

        // Remover event listeners
        if (incrementBtn) incrementBtn.removeEventListener('click', () => this.increment())
        if (decrementBtn) decrementBtn.removeEventListener('click', () => this.decrement())
        if (resetBtn) resetBtn.removeEventListener('click', () => this.reset())
    }
}
