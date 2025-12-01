import { NavBar } from '../../components/NavBar.js';
import { createSong } from '../../services/songs.js';
import { getAlbums } from '../../services/albums.js';

export class AdminSongsPage {
    constructor() {
        this.navBar = new NavBar();
        this.albums = [];
    }

    render() {
        return `
            ${this.navBar.render()}
            <div class="page-container">
                <div class="dashboard-header">
                    <h1>Admin Canciones</h1>
                    <p>Gestionar el catálogo de canciones</p>
                </div>

                <div class="dashboard-content">
                    <div class="admin-form-container" style="max-width: 800px; margin: 0 auto; background: var(--bg-card); padding: 2rem; border-radius: 1rem;">
                        <h2>Crear Nueva Canción</h2>
                        <form id="create-song-form" class="admin-form">
                            <div class="form-group">
                                <label for="titulo">Título de la canción *</label>
                                <input type="text" id="titulo" name="titulo" required class="form-input" placeholder="Ej: Bohemian Rhapsody">
                            </div>

                            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label for="duracion">Duración (segundos) *</label>
                                    <input type="number" id="duracion" name="duracion" required min="1" class="form-input" placeholder="Ej: 354">
                                </div>

                                <div class="form-group">
                                    <label for="albumId">Álbum *</label>
                                    <select id="albumId" name="albumId" required class="form-input">
                                        <option value="">Cargando álbumes...</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="audioFile">Archivo de Audio (MP3) *</label>
                                <input type="file" id="audioFile" name="audioFile" required accept="audio/mpeg" class="form-input">
                                <small style="color: var(--text-secondary);">Máx 20MB</small>
                            </div>

                            <div class="form-group">
                                <label for="fontImage">Imagen de Portada *</label>
                                <input type="file" id="fontImage" name="fontImage" required accept="image/jpeg,image/png,image/gif,image/webp" class="form-input">
                                <small style="color: var(--text-secondary);">JPEG, PNG, GIF, WEBP (Máx 20MB)</small>
                            </div>

                            <div class="form-group">
                                <label for="video">Video (Opcional)</label>
                                <input type="file" id="video" name="video" accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo" class="form-input">
                                <small style="color: var(--text-secondary);">MP4, MPEG, MOV, AVI (Máx 20MB)</small>
                            </div>

                            <div id="form-message" class="form-message" style="margin: 1rem 0; padding: 1rem; border-radius: 0.5rem; display: none;"></div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                                Crear Canción
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    async afterRender() {
        this.navBar.afterRender();

        // Load albums for dropdown
        await this.loadAlbums();

        const form = document.getElementById('create-song-form');
        const messageDiv = document.getElementById('form-message');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Reset message
                messageDiv.style.display = 'none';
                messageDiv.className = 'form-message';

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Creando...';

                try {
                    const formData = new FormData(form);

                    // Log form data for debugging
                    for (let [key, value] of formData.entries()) {
                        console.log(`${key}:`, value instanceof File ? value.name : value);
                    }

                    const { data, error } = await createSong(formData);

                    if (error) {
                        throw new Error(error);
                    }

                    // Success
                    messageDiv.textContent = ' Canción creada exitosamente';
                    messageDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    messageDiv.style.color = '#00ff00';
                    messageDiv.style.display = 'block';

                    form.reset();
                    // Reset select to default
                    const albumSelect = document.getElementById('albumId');
                    if (albumSelect) albumSelect.value = '';

                } catch (error) {
                    console.error('Error creating song:', error);
                    messageDiv.textContent = ` Error: ${error.message}`;
                    messageDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                    messageDiv.style.color = '#ff4444';
                    messageDiv.style.display = 'block';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
        }
    }

    async loadAlbums() {
        const albumSelect = document.getElementById('albumId');
        if (!albumSelect) return;

        try {
            const { data, error } = await getAlbums();

            if (error) {
                console.error('Error loading albums:', error);
                albumSelect.innerHTML = '<option value="">Error al cargar álbumes</option>';
                return;
            }

            this.albums = Array.isArray(data) ? data : [];

            if (this.albums.length === 0) {
                albumSelect.innerHTML = '<option value="">No hay álbumes disponibles</option>';
                return;
            }

            albumSelect.innerHTML = `
                <option value="">Selecciona un álbum</option>
                ${this.albums.map(album => `<option value="${album.id}">${album.titulo}</option>`).join('')}
            `;

        } catch (error) {
            console.error('Error fetching albums:', error);
            albumSelect.innerHTML = '<option value="">Error al cargar álbumes</option>';
        }
    }
}