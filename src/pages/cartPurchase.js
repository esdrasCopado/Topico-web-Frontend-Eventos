import { NavBar } from '../components/NavBar.js'
import { Icons } from '../utils/icons.js'
import { getUserInfo } from '../services/auth.js'
import { get } from '../utils/api.js'

export class CartPurchasePage {
    constructor() {
        this.navbar = new NavBar()
        this.userInfo = getUserInfo()
        this.ordenes = []
        this.boletosDetails = new Map() // Mapa de boletoId -> detalles del boleto
        this.loading = true
    }

    async loadOrdenesYBoletos() {
        try {
            this.loading = true

            // 1. Obtener las órdenes del usuario
            const { data: ordenesData, error: ordenesError } = await get(`/ordenes/usuario/${this.userInfo.id}`)

            if (ordenesError) {
                console.error('Error al cargar órdenes:', ordenesError)
                this.ordenes = []
                return
            }

            this.ordenes = ordenesData || []
            console.log('Órdenes cargadas:', this.ordenes)

            // 2. Cargar detalles de todos los boletos en las órdenes
            const boletosPromises = []

            this.ordenes.forEach(orden => {
                if (orden.boletos && Array.isArray(orden.boletos)) {
                    orden.boletos.forEach(boletoId => {
                        boletosPromises.push(
                            get(`/boletos/${boletoId}`)
                                .then(({ data }) => {
                                    if (data) {
                                        this.boletosDetails.set(boletoId, data)
                                    }
                                })
                                .catch(err => console.error(`Error cargando boleto ${boletoId}:`, err))
                        )
                    })
                }
            })

            await Promise.all(boletosPromises)
            console.log('Boletos cargados:', this.boletosDetails)

        } catch (error) {
            console.error('Error en loadOrdenesYBoletos:', error)
        } finally {
            this.loading = false
        }
    }

    renderOrdenCard(orden) {
        const boletos = orden.boletos || []
        const fechaCompra = new Date(orden.fechaCompra).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        const boletosHTML = boletos.map(boletoId => {
            const boleto = this.boletosDetails.get(boletoId)

            if (!boleto) {
                return `
                    <div class="cart-ticket-item">
                        <p>Cargando boleto #${boletoId}...</p>
                    </div>
                `
            }

            return `
                <div class="cart-ticket-item">
                    <div class="ticket-info">
                        <span class="ticket-type">${boleto.tipo}</span>
                        <span class="ticket-id">#${boleto.id}</span>
                    </div>
                    <div class="ticket-price">$${boleto.precio.toFixed(2)}</div>
                </div>
            `
        }).join('')

        const estadoClass = orden.estado === 'PENDIENTE' ? 'status-pending'
            : orden.estado === 'COMPLETADA' ? 'status-completed'
                : 'status-cancelled'

        return `
            <div class="cart-orden-card">
                <div class="orden-header">
                    <div>
                        <h3>Orden #${orden.id}</h3>
                        <p class="orden-date">${fechaCompra}</p>
                    </div>
                    <span class="orden-status ${estadoClass}">${orden.estado}</span>
                </div>

                <div class="orden-tickets">
                    <h4>Boletos (${boletos.length})</h4>
                    ${boletosHTML}
                </div>

                <div class="orden-footer">
                    <div class="orden-total">
                        <span>Total:</span>
                        <span class="total-amount">$${orden.total.toFixed(2)}</span>
                    </div>
                    ${orden.estado === 'PENDIENTE' ? `
                        <button class="btn btn-primary" onclick="window.completarPago(${orden.id})">
                            Completar Pago
                        </button>
                    ` : ''}
                </div>
            </div>
        `
    }

    async completarPago(ordenId) {
        // Aquí puedes implementar la lógica para completar el pago
        // Por ejemplo, llamar a un endpoint PUT /api/ordenes/{ordenId}
        console.log('Completar pago de orden:', ordenId)
        alert('Funcionalidad de pago en desarrollo')
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="cart-container">
                <div class="cart-header">
                    <h1>Mi Carrito de Compras</h1>
                    <p>Revisa tus órdenes y completa tu compra</p>
                </div>

                <div id="cart-content" class="cart-content">
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Cargando tu carrito...</p>
                    </div>
                </div>
            </div>
        `
    }

    afterRender() {
        // Montar el navbar
        this.navbar.mount()

        // Cargar órdenes y actualizar la vista
        this.loadOrdenesYBoletos().then(() => {
            this.updateCartContent()
        })

        // Exponer método para completar pago
        window.completarPago = this.completarPago.bind(this)
    }

    updateCartContent() {
        const cartContent = document.getElementById('cart-content')

        if (!cartContent) return

        if (this.ordenes.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <${Icons.shoppingCart} />
                    <h2>Tu carrito está vacío</h2>
                    <p>Explora eventos y agrega boletos a tu carrito</p>
                    <a href="/" class="btn btn-primary">Ver Eventos</a>
                </div>
            `
            return
        }

        // Renderizar órdenes
        const ordenesHTML = this.ordenes.map(orden => this.renderOrdenCard(orden)).join('')

        const totalGeneral = this.ordenes
            .filter(o => o.estado === 'PENDIENTE')
            .reduce((sum, orden) => sum + orden.total, 0)

        const ordenesPendientes = this.ordenes.filter(o => o.estado === 'PENDIENTE')

        cartContent.innerHTML = `
            <div class="cart-ordenes-list">
                ${ordenesHTML}
            </div>

            ${ordenesPendientes.length > 0 ? `
                <div class="cart-summary">
                    <h3>Resumen de Compra</h3>
                    <div class="summary-row">
                        <span>Órdenes pendientes:</span>
                        <span>${ordenesPendientes.length}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total a pagar:</span>
                        <span>$${totalGeneral.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary btn-block" onclick="alert('Pagar todo - En desarrollo')">
                        Pagar Todo ($${totalGeneral.toFixed(2)})
                    </button>
                </div>
            ` : ''}
        `
    }
}