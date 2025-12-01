import { get, del, put } from '../../utils/api.js';
import { NavBar } from '../../components/NavBar.js';
import { Icons } from '../../utils/icons.js';

export class UserAdminPage {
    constructor() {
        console.log('🚀 Iniciando UserAdminPage');

        // Namespace único para este componente (BEM Block)
        this.ns = 'uap'; // user-admin-page

        this.users = [];
        this.loading = false;
        this.error = null;
        this.navbar = new NavBar();
    }

    /**
     * Genera un ID único relacionado con el componente
     * @param {string} element - Nombre del elemento
     * @returns {string} ID en formato: uap-element
     */
    id(element) {
        return `${this.ns}-${element}`;
    }

    /**
     * Genera una clase CSS relacionada con el componente (patrón BEM)
     * @param {string} element - Nombre del elemento (opcional)
     * @param {string} modifier - Modificador (opcional)
     * @returns {string} Clase en formato BEM
     */
    cls(element = null, modifier = null) {
        if (!element) return this.ns;
        const base = `${this.ns}__${element}`;
        return modifier ? `${base}--${modifier}` : base;
    }

    async fetchListOfUsers() {
        const response = await get('/usuarios');

        const { data, error } = response;

        if (error) {
            console.error('Error al obtener la lista de usuarios:', error);
            this.error = error.message || 'Error al cargar usuarios';
            return [];
        }

        // Si data es un objeto con una propiedad que contiene el array
        if (data && typeof data === 'object') {
            // Algunas APIs devuelven { usuarios: [...] }
            if (data.usuarios && Array.isArray(data.usuarios)) {
                return data.usuarios;
            }
            // Algunas APIs devuelven { data: [...] }
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            }
            // Si data es directamente un array
            if (Array.isArray(data)) {
                return data;
            }
        }

        console.warn('Formato de respuesta inesperado:', data);
        return [];
    }

    async fetchDeleteUser(userId) {
        const { data, error } = await del(`/usuarios/${userId}`);
        if (error) {
            console.error('Error al eliminar usuario:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    async fetchUpdateUser(userId, userData) {
        const { data, error } = await put(`/usuarios/${userId}`, userData);
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    async fetchChangeUserRole(userId, newRole) {
        const { data, error } = await put(`/usuarios/${userId}/role`, { role: newRole });
        if (error) {
            console.error('Error al cambiar rol:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    render() {
        return `
            ${new NavBar().render()}
            <div class="${this.cls('container')}">
                <div class="${this.cls('header')}">
                    <h1 class="${this.cls('title')}">Administración de Usuarios</h1>
                    <button id="${this.id('refresh-btn')}" class="btn-primary">
                    ${Icons.refresh}
                        Actualizar Lista
                    </button>
                </div>

                <div id="${this.id('content')}" class="${this.cls('content')}">
                    ${this.loading ? this.renderLoading() : ''}
                    ${this.error ? this.renderError() : ''}
                    ${!this.loading && !this.error ? this.renderUserList(this.users) : ''}
                </div>
            </div>
        `;
    }

    renderLoading() {
        return `
            <div class="${this.cls('loading')}">
                <div class="${this.cls('spinner')}"></div>
                <p class="${this.cls('loading-text')}">Cargando usuarios...</p>
            </div>
        `;
    }

    renderError() {
        return `
            <div class="${this.cls('error')}">
                <p class="${this.cls('error-message')}">Error: ${this.error}</p>
                <button id="${this.id('retry-btn')}" class="btn-secondary">
                    Reintentar
                </button>
            </div>
        `;
    }

    renderUserList(users) {
        if (!users || users.length === 0) {
            return `
                <div class="${this.cls('empty')}">
                    <p class="${this.cls('empty-text')}">No hay usuarios registrados</p>
                </div>
            `;
        }

        return `
            <div class="${this.cls('table-container')}">
                <table class="${this.cls('table')}">
                    <thead class="${this.cls('table-head')}">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha Registro</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="${this.cls('table-body')}">
                        ${users.map(user => this.renderUserRow(user)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderUserRow(user) {
        // Normalizar el campo activo (por defecto true si no existe)
        const isActive = user.activo !== undefined ? user.activo : true;
        const statusModifier = isActive ? 'active' : 'inactive';

        // Normalizar el rol (manejar tanto mayúsculas como minúsculas)
        const userRole = user.rol ? user.rol.toUpperCase() : 'USER';

        // Obtener nombre completo
        const fullName = user.apellidos
            ? `${user.nombre || ''} ${user.apellidos}`.trim()
            : (user.nombre || 'N/A');

        return `
            <tr class="${this.cls('table-row')}" data-user-id="${user.id}">
                <td class="${this.cls('cell')}">${user.id}</td>
                <td class="${this.cls('cell')}">${fullName}</td>
                <td class="${this.cls('cell')}">${user.email}</td>
                <td class="${this.cls('cell')}">
                    <select
                        class="${this.cls('role-select')}"
                        data-user-id="${user.id}"
                        id="${this.id(`role-${user.id}`)}">
                        <option value="USER" ${userRole === 'USER' ? 'selected' : ''}>Usuario</option>
                        <option value="ORGANIZADOR" ${userRole === 'ORGANIZADOR' ? 'selected' : ''}>Organizador</option>
                        <option value="ADMIN" ${userRole === 'ADMIN' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td class="${this.cls('cell')}">
                    ${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }) : 'N/A'}
                </td>
                <td class="${this.cls('cell')}">
                    <span class="${this.cls('status', statusModifier)}">
                        ${isActive ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="${this.cls('cell', 'actions')}">
                    <button
                        class="${this.cls('btn', 'edit')} btn-edit"
                        data-user-id="${user.id}"
                        id="${this.id(`edit-${user.id}`)}">
                        ${Icons.edit}
                    </button>
                    
                    <button
                        class="${this.cls('btn', 'delete')} btn-delete"
                        data-user-id="${user.id}"
                        id="${this.id(`delete-${user.id}`)}">
                        ${Icons.delete}
                    </button>
                </td>
            </tr>
        `;
    }

    async afterRender() {
        this.navbar.mount();
        await this.loadUsers();
        this.attachEventListeners();
    }

    async loadUsers() {
        this.loading = true;
        this.error = null;
        this.updateView();

        this.users = await this.fetchListOfUsers();

        // Debug: ver qué devuelve la API
        console.log('Usuarios obtenidos:', this.users);
        console.log('Tipo de datos:', typeof this.users);
        console.log('Es array:', Array.isArray(this.users));

        this.loading = false;
        this.updateView();
    }

    updateView() {
        const container = document.querySelector(`.${this.cls('container')}`);
        if (container) {
            const content = document.getElementById(this.id('content'));
            if (content) {
                content.innerHTML = this.loading ? this.renderLoading() :
                                   this.error ? this.renderError() :
                                   this.renderUserList(this.users);

                if (!this.loading && !this.error) {
                    this.attachTableEventListeners();
                }
            }
        }
    }

    attachEventListeners() {
        const refreshBtn = document.getElementById(this.id('refresh-btn'));
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadUsers());
        }

        const retryBtn = document.getElementById(this.id('retry-btn'));
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadUsers());
        }

        this.attachTableEventListeners();
    }

    attachTableEventListeners() {
        // Role change listeners - usando clase específica del componente
        const roleSelects = document.querySelectorAll(`.${this.cls('role-select')}`);
        roleSelects.forEach(select => {
            select.addEventListener('change', async (e) => {
                const userId = e.currentTarget.dataset.userId;
                const newRole = e.currentTarget.value;
                await this.handleRoleChange(userId, newRole);
            });
        });

        // Delete button listeners - usando clase específica del componente
        const deleteButtons = document.querySelectorAll(`.${this.cls('btn', 'delete')}`);
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Usar currentTarget para obtener el botón, no el SVG hijo
                const userId = e.currentTarget.dataset.userId;
                await this.handleDelete(userId);
            });
        });

        // Edit button listeners - usando clase específica del componente
        const editButtons = document.querySelectorAll(`.${this.cls('btn', 'edit')}`);
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Usar currentTarget para obtener el botón, no el SVG hijo
                const userId = e.currentTarget.dataset.userId;
                this.handleEdit(userId);
            });
        });
    }

    async handleRoleChange(userId, newRole) {
        if (!confirm(`¿Cambiar el rol de este usuario a ${newRole}?`)) {
            this.loadUsers(); // Reload to reset select
            return;
        }

        const result = await this.fetchChangeUserRole(userId, newRole);
        if (result.success) {
            alert('Rol actualizado exitosamente');
            await this.loadUsers();
        } else {
            alert('Error al cambiar el rol');
            await this.loadUsers();
        }
    }

    async handleDelete(userId) {
        if (!confirm(`¿Estás seguro de eliminar este usuario? id ${userId} Esta acción no se puede deshacer.`)) {
            return;
        }

        const result = await this.fetchDeleteUser(userId);
        if (result.success) {
            alert('Usuario eliminado exitosamente');
            await this.loadUsers();
        } else {
            alert('Error al eliminar usuario');
        }
    }

    handleEdit(userId) {
        // Aquí puedes abrir un modal o navegar a una página de edición
        console.log('Editar usuario:', userId);
        alert(`Funcionalidad de edición para usuario ${userId} - Por implementar`);
    }

    destroy() {
        // Limpiar event listeners si es necesario
        this.users = [];
        this.loading = false;
        this.error = null;
    }
}