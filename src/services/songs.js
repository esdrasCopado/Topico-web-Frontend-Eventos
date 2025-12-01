import { postFormData } from '../utils/api.js';

/**
 * Crea una nueva canción enviando los datos y archivos al servidor.
 * @param {FormData} formData - Datos del formulario (incluyendo archivos)
 * @returns {Promise<{data: any, error: string|null}>}
 */
export async function createSong(formData) {
    return await postFormData('/songs', formData);
}
