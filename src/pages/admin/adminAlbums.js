import { get, del, postFormData } from '../../utils/api.js';
import { NavBar } from '../../components/NavBar.js';
import { Icons } from '../../utils/icons.js';

export class adminAlbumsPage {
    constructor() {
        console.log(' Iniciando adminAlbumsPage');

        // Namespace único para este componente (BEM Block)
        this.ns = 'aap'; // admin-albums-page

        this.albums = [];
        this.artists = [];
        this.loading = false;
        this.error = null;
        this.navbar = new NavBar();
        this.showCreateForm = false;
    }

    /**
     * Genera un ID único relacionado con el componente
     * @param {string} element - Nombre del elemento
     * @returns {string} ID en formato: aap-element
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

    async fetchAlbums() {
        const { data, error } = await get('/albums');
        if (error) {
            console.error('Error al obtener álbumes:', error);
            this.error = error.message || 'Error al cargar álbumes';
            return [];
        }
        return Array.isArray(data) ? data : [];
    }

    async fetchArtists() {
        const { data, error } = await get('/artistas');
        if (error) {
            console.error('Error al obtener artistas:', error);
            return [];
        }
        return Array.isArray(data) ? data : [];
    }

    async fetchDeleteAlbum(albumId) {
        const { data, error } = await del(`/albums/${albumId}`);
        if (error) {
            console.error('Error al eliminar álbum:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    async fetchCreateAlbum(formData) {
        const { data, error } = await postFormData('/albums', formData);
        if (error) {
            console.error('Error al crear álbum:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="${this.cls('container')}">
                <div class="${this.cls('header')}">
                    <h1 class="${this.cls('title')}">Administración de Álbumes</h1>
                    <div class="${this.cls('header-actions')}">
                        <button id="${this.id('refresh-btn')}" class="btn-secondary">
                            ${Icons.refresh}
                            Actualizar
                        </button>
                        <button id="${this.id('create-btn')}" class="btn-primary">
                            ${Icons.add || '+'}
                            Crear Álbum
                        </button>
                    </div>
                </div>

                <div id="${this.id('content')}" class="${this.cls('content')}">
                    ${this.loading ? this.renderLoading() : ''}
                    ${this.error ? this.renderError() : ''}
                    ${!this.loading && !this.error && !this.showCreateForm ? this.renderAlbumsList(this.albums) : ''}
                    ${!this.loading && !this.error && this.showCreateForm ? this.renderCreateForm() : ''}
                </div>
            </div>
        `;
    }

    renderLoading() {
        return `
            <div class="${this.cls('loading')}">
                <div class="${this.cls('spinner')}"></div>
                <p class="${this.cls('loading-text')}">Cargando álbumes...</p>
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

    renderAlbumsList(albums) {
        if (!albums || albums.length === 0) {
            return `
                <div class="${this.cls('empty')}">
                    <p class="${this.cls('empty-text')}">No hay álbumes registrados</p>
                    <button id="${this.id('create-first-btn')}" class="btn-primary">
                        Crear primer álbum
                    </button>
                </div>
            `;
        }

        return `
            <div class="${this.cls('grid')}">
                ${albums.map(album => this.renderAlbumCard(album)).join('')}
            </div>
        `;
    }

    renderAlbumCard(album) {
        const imageUrl = album.fontImageUrl ? `http://localhost:3000${album.fontImageUrl}` : '/placeholder-album.jpg';
        const releaseDate = album.lanzamiento ? new Date(album.lanzamiento).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'N/A';

        return `
            <div class="${this.cls('card')}" data-album-id="${album.id}">
                <div class="${this.cls('card-image-container')}">
                    <img
                        src="${imageUrl}"
                        alt="${album.titulo}"
                        class="${this.cls('card-image')}"
                        onerror="this.src='/placeholder-album.jpg'"
                    />
                </div>
                <div class="${this.cls('card-content')}">
                    <h3 class="${this.cls('card-title')}">${album.titulo}</h3>
                    <p class="${this.cls('card-info')}">
                        <strong>Género:</strong> ${album.genero || 'N/A'}
                    </p>
                    <p class="${this.cls('card-info')}">
                        <strong>Lanzamiento:</strong> ${releaseDate}
                    </p>
                    <p class="${this.cls('card-info')}">
                        <strong>Artista ID:</strong> ${album.artistaId || 'N/A'}
                    </p>
                </div>
                <div class="${this.cls('card-actions')}">
                    <button
                        class="${this.cls('btn', 'edit')} btn-edit"
                        data-album-id="${album.id}"
                        title="Editar álbum">
                        ${Icons.edit}
                    </button>
                    <button
                        class="${this.cls('btn', 'delete')} btn-delete"
                        data-album-id="${album.id}"
                        title="Eliminar álbum">
                        ${Icons.delete}
                    </button>
                </div>
            </div>
        `;
    }

    renderCreateForm() {
        const artistOptions = this.artists.map(artist =>
            `<option value="${artist.id}">${artist.nombre}</option>`
        ).join('');

        return `
            <div class="${this.cls('modal-overlay')}">
                <div class="${this.cls('form-container')}">
                    <div class="${this.cls('form-header')}">
                        <h2 class="${this.cls('form-title')}">Crear Nuevo Álbum</h2>
                        <button id="${this.id('cancel-form-btn')}" class="${this.cls('form-close')}">
                            ${Icons.close || '✕'}
                        </button>
                    </div>

                    <form id="${this.id('album-form')}" class="${this.cls('form')}">
                        <div class="${this.cls('form-left')}">
                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('titulo')}" class="${this.cls('label')}">
                                    Título del Álbum *
                                </label>
                                <input
                                    type="text"
                                    id="${this.id('titulo')}"
                                    name="titulo"
                                    class="${this.cls('input')}"
                                    placeholder="Ej: The Life of a Showgirl"
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
                                    placeholder="Ej: Pop, Rock, Cumbia"
                                    required
                                />
                            </div>

                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('lanzamiento')}" class="${this.cls('label')}">
                                    Fecha de Lanzamiento *
                                </label>
                                <input
                                    type="date"
                                    id="${this.id('lanzamiento')}"
                                    name="lanzamiento"
                                    class="${this.cls('input')}"
                                    required
                                />
                            </div>

                            <div class="${this.cls('form-group')}">
                                <label for="${this.id('artistaId')}" class="${this.cls('label')}">
                                    Artista *
                                </label>
                                <select
                                    id="${this.id('artistaId')}"
                                    name="artistaId"
                                    class="${this.cls('select')}"
                                    required>
                                    <option value="">Selecciona un artista</option>
                                    ${artistOptions}
                                </select>
                            </div>

                            <div class="${this.cls('form-actions')}">
                                <button type="submit" class="btn-primary">
                                    Crear Álbum
                                </button>
                                <button type="button" id="${this.id('cancel-btn')}" class="btn-secondary">
                                    Cancelar
                                </button>
                            </div>
                        </div>

                        <div class="${this.cls('form-right')}">
                            <div class="${this.cls('form-group', 'file')}">
                                <label for="${this.id('fontImage')}" class="${this.cls('label')}">
                                    Imagen de Portada *
                                </label>
                                <input
                                    type="file"
                                    id="${this.id('fontImage')}"
                                    name="fontImage"
                                    class="${this.cls('input-file')}"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    required
                                />
                                <small class="${this.cls('help-text')}">
                                    Formatos: JPEG, PNG, GIF, WEBP (máx 10MB)
                                </small>
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

        // Cargar álbumes y artistas en paralelo
        [this.albums, this.artists] = await Promise.all([
            this.fetchAlbums(),
            this.fetchArtists()
        ]);

        this.loading = false;
        this.updateView();
    }

    updateView() {
        const content = document.getElementById(this.id('content'));
        if (content) {
            content.innerHTML = this.loading ? this.renderLoading() :
                               this.error ? this.renderError() :
                               this.showCreateForm ? this.renderCreateForm() :
                               this.renderAlbumsList(this.albums);

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
                const albumId = e.currentTarget.dataset.albumId;
                await this.handleDelete(albumId);
            });
        });

        const editButtons = document.querySelectorAll(`.${this.cls('btn', 'edit')}`);
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const albumId = e.currentTarget.dataset.albumId;
                this.handleEdit(albumId);
            });
        });
    }

    attachFormListeners() {
        const form = document.getElementById(this.id('album-form'));
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
        const formData = new FormData();

        // Agregar campos al FormData
        formData.append('titulo', form.titulo.value.trim());
        formData.append('genero', form.genero.value.trim());
        formData.append('lanzamiento', new Date(form.lanzamiento.value).toISOString());
        formData.append('artistaId', parseInt(form.artistaId.value));

        // Agregar imagen
        const fileInput = document.getElementById(this.id('fontImage'));
        if (fileInput && fileInput.files[0]) {
            formData.append('fontImage', fileInput.files[0]);
        }

        // Enviar datos
        const result = await this.fetchCreateAlbum(formData);

        if (result.success) {
            alert('Álbum creado exitosamente');
            this.hideForm();
            await this.loadData();
        } else {
            alert(`Error al crear álbum: ${result.error}`);
        }
    }

    async handleDelete(albumId) {
        if (!confirm(`¿Estás seguro de eliminar este álbum? Esta acción no se puede deshacer.`)) {
            return;
        }

        const result = await this.fetchDeleteAlbum(albumId);
        if (result.success) {
            alert('Álbum eliminado exitosamente');
            await this.loadData();
        } else {
            alert('Error al eliminar álbum');
        }
    }

    handleEdit(albumId) {
        console.log('Editar álbum:', albumId);
        alert(`Funcionalidad de edición para álbum ${albumId} - Por implementar`);
    }

    destroy() {
        this.albums = [];
        this.artists = [];
        this.loading = false;
        this.error = null;
        this.showCreateForm = false;
    }
}
