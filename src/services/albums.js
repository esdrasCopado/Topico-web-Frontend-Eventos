import { get } from '../utils/api.js';

/**
 * Obtiene todos los álbumes.
 * @returns {Promise<{data: any[], error: string|null}>}
 */
export async function getAlbums() {
    return await get('/albums');
}
