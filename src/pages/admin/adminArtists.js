import { get, del, post } from '../../utils/api.js';
import { NavBar } from '../../components/NavBar.js';
import { Icons } from '../../utils/icons.js';

export class AdminArtistsPage {
    constructor() {
        console.log('🚀 Iniciando AdminArtistsPage');

        // Namespace único para este componente (BEM Block)
        this.ns = 'aarp'; // admin-artists-page

        this.artists = [];
        this.loading = false;
        this.error = null;
        this.navbar = new NavBar();
        this.showCreateForm = false;
    }

    /**
     * Genera un ID único relacionado con el componente
     * @param {string} element - Nombre del elemento
     * @returns {string} ID en formato: aarp-element
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

    async fetchArtists() {
        const { data, error } = await get('/artistas');
        if (error) {
            console.error('Error al obtener artistas:', error);
            this.error = error.message || 'Error al cargar artistas';
            return [];
        }
        return Array.isArray(data) ? data : [];
    }

    async fetchDeleteArtist(artistId) {
        const { data, error } = await del(`/artistas/${artistId}`);
        if (error) {
            console.error('Error al eliminar artista:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    async fetchCreateArtist(artistData) {
        const { data, error } = await post('/artistas', artistData);
        if (error) {
            console.error('Error al crear artista:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="${this.cls('container')}">
                <div class="${this.cls('header')}">
                    <h1 class="${this.cls('title')}">Administración de Artistas</h1>
                    <div class="${this.cls('header-actions')}">
                        <button id="${this.id('refresh-btn')}" class="btn-secondary">
                            ${Icons.refresh}
                            Actualizar
                        </button>
                        <button id="${this.id('create-btn')}" class="btn-primary">
                            ${Icons.add || '+'}
                            Crear Artista
                        </button>
                    </div>
                </div>

                <div id="${this.id('content')}" class="${this.cls('content')}">
                    ${this.loading ? this.renderLoading() : ''}
                    ${this.error ? this.renderError() : ''}
                    ${!this.loading && !this.error && !this.showCreateForm ? this.renderArtistsList(this.artists) : ''}
                    ${!this.loading && !this.error && this.showCreateForm ? this.renderCreateForm() : ''}
                </div>
            </div>
        `;
    }

    renderLoading() {
        return `
            <div class="${this.cls('loading')}">
                <div class="${this.cls('spinner')}"></div>
                <p class="${this.cls('loading-text')}">Cargando artistas...</p>
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

    renderArtistsList(artists) {
        if (!artists || artists.length === 0) {
            return `
                <div class="${this.cls('empty')}">
                    <p class="${this.cls('empty-text')}">No hay artistas registrados</p>
                    <button id="${this.id('create-first-btn')}" class="btn-primary">
                        Crear primer artista
                    </button>
                </div>
            `;
        }

        return `
            <div class="${this.cls('grid')}">
                ${artists.map(artist => this.renderArtistCard(artist)).join('')}
            </div>
        `;
    }

    renderArtistCard(artist) {
        const debutDate = artist.fechaDebut ? new Date(artist.fechaDebut).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'N/A';

        return `
            <div class="${this.cls('card')}" data-artist-id="${artist.id}">
                <div class="${this.cls('card-content')}">
                    <h3 class="${this.cls('card-title')}">${artist.nombre}</h3>
                    <p class="${this.cls('card-info')}">
                        <strong>Género:</strong> ${artist.genero || 'N/A'}
                    </p>
                    <p class="${this.cls('card-info')}">
                        <strong>País:</strong> ${artist.paisOrigen || 'N/A'}
                    </p>
                    <p class="${this.cls('card-info')}">
                        <strong>Debut:</strong> ${debutDate}
                    </p>
                    <p class="${this.cls('card-info')}">
                        <strong>Disquera:</strong> ${artist.disquera || 'N/A'}
                    </p>
                    <p class="${this.cls('card-info')}">
                        <strong>Contacto:</strong> ${artist.contacto || 'N/A'}
                    </p>
                </div>
                <div class="${this.cls('card-actions')}">
                    <button
                        class="${this.cls('btn', 'edit')} btn-edit"
                        data-artist-id="${artist.id}"
                        title="Editar artista">
                        ${Icons.edit}
                    </button>
                    <button
                        class="${this.cls('btn', 'delete')} btn-delete"
                        data-artist-id="${artist.id}"
                        title="Eliminar artista">
                        ${Icons.delete}
                    </button>
                </div>
            </div>
        `;
    }

    renderCreateForm() {
        return `
            <div class="${this.cls('modal-overlay')}">
                <div class="${this.cls('form-container')}">
                    <div class="${this.cls('form-header')}">
                        <h2 class="${this.cls('form-title')}">Crear Nuevo Artista</h2>
                        <button id="${this.id('cancel-form-btn')}" class="${this.cls('form-close')}">
                            ${Icons.close || '✕'}
                        </button>
                    </div>

                    <form id="${this.id('artist-form')}" class="${this.cls('form')}">
                        <div class="${this.cls('form-left')}">
                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('nombre')}" class="${this.cls('label')}">
                                    Nombre del Artista *
                                </label>
                                <input
                                    type="text"
                                    id="${this.id('nombre')}"
                                    name="nombre"
                                    class="${this.cls('input')}"
                                    placeholder="Ej: Taylor Swift"
                                    required
                                />
                            </div>

                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('genero')}" class="${this.cls('label')}">
                                    Género Musical *
                                </label>
                                <input
                                    type="text"
                                    id="${this.id('genero')}"
                                    name="genero"
                                    class="${this.cls('input')}"
                                    placeholder="Ej: Pop, Rock, Country"
                                    required
                                />
                            </div>

                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('paisOrigen')}" class="${this.cls('label')}">
                                    País de Origen *
                                </label>
                                <input
                                    type="text"
                                    id="${this.id('paisOrigen')}"
                                    name="paisOrigen"
                                    class="${this.cls('input')}"
                                    placeholder="Ej: US, MX, ES"
                                    required
                                />
                            </div>

                            <div class="${this.cls('form-actions')}">
                                <button type="submit" class="btn-primary">
                                    Crear Artista
                                </button>
                                <button type="button" id="${this.id('cancel-btn')}" class="btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </div>

                        <div class="${this.cls('form-right')}">
                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('fechaDebut')}" class="${this.cls('label')}">
                                    Fecha de Debut *
                                </label>
                                <input
                                    type="date"
                                    id="${this.id('fechaDebut')}"
                                    name="fechaDebut"
                                    class="${this.cls('input')}"
                                    required
                                />
                            </div>

                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('disquera')}" class="${this.cls('label')}">
                                    Disquera *
                                </label>
                                <input
                                    type="text"
                                    id="${this.id('disquera')}"
                                    name="disquera"
                                    class="${this.cls('input')}"
                                    placeholder="Ej: Republic Records"
                                    required
                                />
                            </div>

                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('contacto')}" class="${this.cls('label')}">
                                    Contacto *
                                </label>
                                <input
                                    type="email"
                                    id="${this.id('contacto')}"
                                    name="contacto"
                                    class="${this.cls('input')}"
                                    placeholder="Ej: contacto@disquera.com"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async afterRender() {
        this.navbar.mount();
        await this.loadData();
        this.attachEventListeners();
    }

    async loadData() {
        this.loading = true;
        this.error = null;
        this.updateView();

        this.artists = await this.fetchArtists();

        this.loading = false;
        this.updateView();
    }

    updateView() {
        const content = document.getElementById(this.id('content'));
        if (content) {
            content.innerHTML = this.loading ? this.renderLoading() :
                               this.error ? this.renderError() :
                               this.showCreateForm ? this.renderCreateForm() :
                               this.renderArtistsList(this.artists);

            if (!this.loading && !this.error) {
                if (this.showCreateForm) {
                    this.attachFormListeners();
                } else {
                    this.attachCardListeners();
                }
            }
        }
    }

    attachEventListeners() {
        const refreshBtn = document.getElementById(this.id('refresh-btn'));
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData());
        }

        const createBtn = document.getElementById(this.id('create-btn'));
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showForm());
        }

        const createFirstBtn = document.getElementById(this.id('create-first-btn'));
        if (createFirstBtn) {
            createFirstBtn.addEventListener('click', () => this.showForm());
        }

        const retryBtn = document.getElementById(this.id('retry-btn'));
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadData());
        }
    }

    attachCardListeners() {
        const deleteButtons = document.querySelectorAll(`.${this.cls('btn', 'delete')}`);
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const artistId = e.currentTarget.dataset.artistId;
                await this.handleDelete(artistId);
            });
        });

        const editButtons = document.querySelectorAll(`.${this.cls('btn', 'edit')}`);
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const artistId = e.currentTarget.dataset.artistId;
                this.handleEdit(artistId);
            });
        });
    }

    attachFormListeners() {
        const form = document.getElementById(this.id('artist-form'));
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        const cancelBtn = document.getElementById(this.id('cancel-btn'));
        const cancelFormBtn = document.getElementById(this.id('cancel-form-btn'));

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideForm());
        }
        if (cancelFormBtn) {
            cancelFormBtn.addEventListener('click', () => this.hideForm());
        }
    }

    showForm() {
        this.showCreateForm = true;
        this.updateView();
    }

    hideForm() {
        this.showCreateForm = false;
        this.updateView();
    }

    async handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const artistData = {
            nombre: form.nombre.value.trim(),
            genero: form.genero.value.trim(),
            paisOrigen: form.paisOrigen.value.trim(),
            fechaDebut: new Date(form.fechaDebut.value).toISOString(),
            disquera: form.disquera.value.trim(),
            contacto: form.contacto.value.trim()
        };

        const result = await this.fetchCreateArtist(artistData);

        if (result.success) {
            alert('Artista creado exitosamente');
            this.hideForm();
            await this.loadData();
        } else {
            alert(`Error al crear artista: ${result.error}`);
        }
    }

    async handleDelete(artistId) {
        if (!confirm(`¿Estás seguro de eliminar este artista? Esta acción no se puede deshacer.`)) {
            return;
        }

        const result = await this.fetchDeleteArtist(artistId);
        if (result.success) {
            alert('Artista eliminado exitosamente');
            await this.loadData();
        } else {
            alert('Error al eliminar artista');
        }
    }

    handleEdit(artistId) {
        console.log('Editar artista:', artistId);
        alert(`Funcionalidad de edición para artista ${artistId} - Por implementar`);
    }

    destroy() {
        this.artists = [];
        this.loading = false;
        this.error = null;
        this.showCreateForm = false;
    }
}
