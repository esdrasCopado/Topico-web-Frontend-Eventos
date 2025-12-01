import { NavBar } from '../../components/NavBar.js';
import { get, getApiBaseUrl } from '../../utils/api.js';
import { audioStore } from '../../store.js';
import { Icons } from '../../utils/icons.js';

export class songsListPage {
    constructor(params) {
        this.params = params;
        this.navbar = new NavBar();
        this.album = null;
        this.songs = [];
    }

    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <div id="album-header" style="margin-bottom: 2rem;">
                    <div class="loading">Cargando álbum...</div>
                </div>
                
                <div class="songs-list-container">
                    <h2>Canciones</h2>
                    <div id="songs-list" class="songs-list">
                        <div class="loading">Cargando canciones...</div>
                    </div>
                </div>
            </div>
        `;
    }

    async afterRender() {
        this.navbar.afterRender();
        await this.fetchAlbumDetails();
        await this.fetchSongs();
    }

    async fetchAlbumDetails() {
        try {
            const { data, error } = await get(`/albums`);

            if (error) {
                console.error('Error fetching albums:', error);
                return;
            }

            if (Array.isArray(data)) {
                this.album = data.find(a => a.id == this.params.id);
            }

            this.renderHeader();
        } catch (e) {
            console.error("Error fetching album details", e);
        }
    }

    async fetchSongs() {
        // Obtener el ID del álbum de la URL
        const albumId = this.params.id;

        const { data, error } = await get(`/songs/album/${albumId}`);

        if (error) {
            console.error('Error fetching songs:', error);
            document.getElementById('songs-list').innerHTML = `<p class="error">Error al cargar canciones: ${error}</p>`;
            return;
        }

        console.log('Songs from album:', data);
        this.songs = Array.isArray(data) ? data : [];

        this.renderSongs();
    }

    renderHeader() {
        const header = document.getElementById('album-header');
        if (!header) return;

        if (!this.album) {
            header.innerHTML = '<h1>Álbum no encontrado</h1>';
            return;
        }

        const imageUrl = this.album.fontImageUrl ? `${getApiBaseUrl()}${this.album.fontImageUrl}` : '/placeholder-album.jpg';

        header.innerHTML = `
            <div style="display: flex; gap: 2rem; align-items: flex-end;">
                <img src="${imageUrl}" alt="${this.album.titulo}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                <div>
                    <span style="text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Álbum</span>
                    <h1 style="font-size: 3rem; margin: 0.5rem 0;">${this.album.titulo}</h1>
                    <p style="color: var(--text-secondary); margin: 0;">
                        ${this.album.genero || 'Género desconocido'} • ${new Date(this.album.lanzamiento).getFullYear()}
                    </p>
                </div>
            </div>
        `;
    }

    renderSongs() {
        const container = document.getElementById('songs-list');
        if (!container) return;

        if (this.songs.length === 0) {
            container.innerHTML = '<p>No hay canciones en este álbum.</p>';
            return;
        }

        container.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); text-align: left; color: var(--text-secondary);">
                        <th style="padding: 0.5rem; width: 50px;">#</th>
                        <th style="padding: 0.5rem;">Título</th>
                        <th style="padding: 0.5rem; text-align: right;">Duración</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.songs.map((song, index) => `
                        <tr class="song-row" data-index="${index}" style="cursor: pointer; transition: background 0.2s;">
                            <td style="padding: 0.75rem 0.5rem; color: var(--text-secondary);">${index + 1}</td>
                            <td style="padding: 0.75rem 0.5rem;">
                                <div style="font-weight: 500;">${song.titulo}</div>
                                <div style="font-size: 0.85rem; color: var(--text-secondary);">${song.artista || this.album?.artista || ''}</div>
                            </td>
                            <td style="padding: 0.75rem 0.5rem; text-align: right; color: var(--text-secondary);">
                                ${this.formatDuration(song.duracion)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Add click listeners
        const rows = container.querySelectorAll('.song-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const index = parseInt(row.dataset.index);
                this.playAlbum(index);
            });

            // Hover effect
            row.addEventListener('mouseenter', () => row.style.backgroundColor = 'rgba(255,255,255,0.05)');
            row.addEventListener('mouseleave', () => row.style.backgroundColor = 'transparent');
        });
    }

    formatDuration(seconds) {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    playAlbum(startIndex) {
        // Set playlist to current album songs
        // Ensure songs have necessary metadata (cover image from album if missing)
        const playlist = this.songs.map(song => ({
            ...song,
            fontImage: song.fontImage || this.album?.fontImageUrl,
            artista: song.artista || this.album?.artista || 'Desconocido'
        }));

        audioStore.setPlaylist(playlist);
        audioStore.playSong(playlist[startIndex], startIndex);
    }
}
