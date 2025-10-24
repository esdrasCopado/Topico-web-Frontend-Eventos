import { Link } from '../router.js'
import { Button } from '../components/Button.js'
import { Card, createCard } from '../components/Card.js'
import { Counter } from '../components/Counter.js'

/**
 * Página de demostración de componentes
 * Muestra cómo usar diferentes tipos de componentes
 */
export class ComponentsDemoPage {
    constructor(params) {
        this.params = params
        this.components = [] // Array para rastrear componentes con estado
    }

    render() {
        // ========== EJEMPLO 1: Usando Button component ==========
        const primaryButton = new Button({
            text: 'Botón Primary',
            type: 'primary',
            onClick: () => alert('¡Click en Primary!'),
            id: 'demo-btn-1'
        })

        const secondaryButton = new Button({
            text: 'Botón Secondary',
            type: 'secondary',
            onClick: () => console.log('Secondary clicked'),
            id: 'demo-btn-2'
        })

        const disabledButton = new Button({
            text: 'Botón Deshabilitado',
            type: 'primary',
            disabled: true,
            id: 'demo-btn-3'
        })

        // Guardar referencias para montar después
        this.components.push(primaryButton, secondaryButton, disabledButton)


        // ========== EJEMPLO 2: Usando Card component ==========
        const card1 = createCard({
            title: 'Card Simple',
            icon: '📦',
            content: '<p>Esta es una card con título e ícono</p>',
            className: 'demo-card'
        })

        const card2 = createCard({
            title: 'Card Completa',
            subtitle: 'Con subtítulo',
            icon: '🎨',
            content: `
                <p>Esta card tiene todos los elementos:</p>
                <ul>
                    <li>Título</li>
                    <li>Subtítulo</li>
                    <li>Contenido</li>
                    <li>Footer</li>
                </ul>
            `,
            footer: '<small>Footer de la card</small>',
            className: 'demo-card'
        })


        // ========== EJEMPLO 3: Usando Counter component (con estado) ==========
        const counter1 = new Counter({
            initialValue: 0,
            step: 1
        })

        const counter2 = new Counter({
            initialValue: 10,
            step: 5
        })

        // Guardar referencias para montar después
        this.components.push(counter1, counter2)


        // ========== RENDERIZAR TODO ==========
        return `
            <div class="page-container">
                <nav class="navbar">
                    <div class="navbar-brand">
                        <h2>Demo de Componentes</h2>
                    </div>
                    <div class="navbar-links">
                        ${Link('/', 'Volver al inicio', 'nav-link')}
                    </div>
                </nav>

                <div class="demo-content">
                    <h1>Ejemplos de Componentes Reutilizables</h1>
                    <p class="demo-intro">
                        Esta página demuestra cómo crear y usar componentes en Vanilla JavaScript,
                        similar a como funcionan en React.
                    </p>

                    <!-- Sección de Botones -->
                    <section class="demo-section">
                        <h2>1. Componente Button (Sin Estado)</h2>
                        <p>Componentes simples que reciben props y renderizan HTML</p>

                        <div class="demo-buttons">
                            ${primaryButton.render()}
                            ${secondaryButton.render()}
                            ${disabledButton.render()}
                        </div>

                        <details class="code-example">
                            <summary>Ver código</summary>
                            <pre><code>// Crear un botón
const button = new Button({
    text: 'Mi Botón',
    type: 'primary',
    onClick: () => alert('Click!'),
    id: 'my-btn'
})

// En render()
\${button.render()}

// En afterRender()
button.mount()  // Monta event listeners
</code></pre>
                        </details>
                    </section>

                    <!-- Sección de Cards -->
                    <section class="demo-section">
                        <h2>2. Componente Card (Con Children)</h2>
                        <p>Componentes que aceptan contenido HTML como prop</p>

                        <div class="demo-cards">
                            ${card1}
                            ${card2}
                        </div>

                        <details class="code-example">
                            <summary>Ver código</summary>
                            <pre><code>// Crear una card
const card = createCard({
    title: 'Mi Card',
    icon: '🎨',
    content: '&lt;p&gt;Contenido HTML&lt;/p&gt;',
    footer: 'Footer'
})

// En render()
\${card}  // Ya retorna HTML
</code></pre>
                        </details>
                    </section>

                    <!-- Sección de Counter -->
                    <section class="demo-section">
                        <h2>3. Componente Counter (Con Estado)</h2>
                        <p>Componentes con estado interno que pueden re-renderizarse</p>

                        <div class="demo-counters">
                            <div class="counter-wrapper">
                                <h4>Contador básico (step: 1)</h4>
                                ${counter1.render()}
                            </div>

                            <div class="counter-wrapper">
                                <h4>Contador rápido (step: 5)</h4>
                                ${counter2.render()}
                            </div>
                        </div>

                        <details class="code-example">
                            <summary>Ver código</summary>
                            <pre><code>// Crear un counter con estado
const counter = new Counter({
    initialValue: 0,
    step: 1
})

// En render()
\${counter.render()}

// En afterRender()
counter.mount()  // Monta event listeners

// El componente se re-renderiza solo cuando cambia su estado
</code></pre>
                        </details>
                    </section>

                    <!-- Explicación -->
                    <section class="demo-section">
                        <h2>📚 Cómo usar componentes en tus páginas</h2>

                        <div class="instructions-grid">
                            ${createCard({
                                title: '1. Importar',
                                icon: '📥',
                                content: `
                                    <pre><code>import { Button } from '../components/Button.js'
import { Card } from '../components/Card.js'</code></pre>
                                `
                            })}

                            ${createCard({
                                title: '2. Crear instancia',
                                icon: '🏗️',
                                content: `
                                    <pre><code>// En el constructor o render()
const btn = new Button({
    text: 'Click me',
    onClick: () => {...}
})</code></pre>
                                `
                            })}

                            ${createCard({
                                title: '3. Renderizar',
                                icon: '🎨',
                                content: `
                                    <pre><code>// En el método render()
return \`
    &lt;div&gt;
        \${btn.render()}
    &lt;/div&gt;
\`</code></pre>
                                `
                            })}

                            ${createCard({
                                title: '4. Montar (opcional)',
                                icon: '⚡',
                                content: `
                                    <pre><code>// En afterRender()
afterRender() {
    btn.mount()
}</code></pre>
                                `
                            })}
                        </div>
                    </section>
                </div>
            </div>
        `
    }

    /**
     * Después de renderizar, montar todos los componentes
     */
    afterRender() {
        // Montar todos los componentes que tienen método mount()
        this.components.forEach(component => {
            if (typeof component.mount === 'function') {
                component.mount()
            }
        })

        console.log('Componentes montados:', this.components.length)
    }
}
