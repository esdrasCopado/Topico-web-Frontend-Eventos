import { NavBar } from '../../components/NavBar.js';
import { get, getApiBaseUrl } from '../../utils/api.js'
import { Link } from '../../router.js';

export class albumListPage {
    constructor(params) {
        this.params = params
        this.navbar = new NavBar()
        this.albums = []
    }
    render() {
        return `
            ${this.navbar.render()}
            <div class="page-container">
                <h1>Biblioteca de Música</h1>
                <p>Explora tus álbumes favoritos</p>
                
                <div id="albums-grid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                ">
                    <div class="loading">Cargando álbumes...</div>
                </div>
            </div>
        `
    }

    async afterRender() {
        this.navbar.afterRender()
        await this.fetchAlbums()
    }

    async fetchAlbums() {
        const { data, error } = await get('/albums')

        if (error) {
            console.error('Error al obtener álbumes:', error)
            document.getElementById('albums-grid').innerHTML = `<p class="error">Error al cargar álbumes: ${error}</p>`
            return
        }

        this.albums = Array.isArray(data) ? data : []
        this.renderAlbums()
    }

    renderAlbums() {
        const grid = document.getElementById('albums-grid')
        if (!grid) return

        if (this.albums.length === 0) {
            grid.innerHTML = '<p>No hay álbumes disponibles.</p>'
            return
        }

        grid.innerHTML = this.albums.map(album => {
            const imageUrl = album.fontImageUrl ? album.fontImageUrl : '/placeholder-album.jpg';
            return `
                <a href="/album/${album.id}" data-link class="album-card" style="
                    text-decoration: none;
                    color: inherit;
                    background: var(--bg-card);
                    border-radius: 8px;
                    overflow: hidden;
                    transition: transform 0.2s;
                    cursor: pointer;
                    display: block;
                ">
                    <div style="aspect-ratio: 1; overflow: hidden;">
                        <img src="${getApiBaseUrl() + imageUrl}" alt="${album.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 1rem;">
                        <h3 style="margin: 0; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${album.titulo}</h3>
                        <p style="margin: 0.5rem 0 0; color: var(--text-secondary); font-size: 0.9rem;">${album.genero || 'Desconocido'}</p>
                    </div>
                </a>
            `
        }).join('')
    }
}