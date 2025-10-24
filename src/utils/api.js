/**
 * Utilidad para peticiones HTTP
 */
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export async function get(endpoint) {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`)

        // Si el backend devuelve { success, data, message }
        // extraemos solo el array de 'data'
        const responseData = response.data.data || response.data

        return { data: responseData, error: null }
    } catch (error) {
        console.error('Error en la petición GET:', error)
        return { data: null, error: error.message }
    }
}

export async function post(endpoint, body) {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, body)

        return { data: response.data, error: null }
    } catch (error) {
        console.error('Error en la petición POST:', error)
        return { data: null, error: error.message }
    }
}
export async function put(endpoint, body) {
    try {
        const response = await axios.put(`${API_BASE_URL}${endpoint}`, body)

        return { data: response.data, error: null }
    } catch (error) {
        console.error('Error en la petición PUT:', error)
        return { data: null, error: error.message }
    }
}

export async function del(endpoint) {
    try {
        const response = await axios.delete(`${API_BASE_URL}${endpoint}`)

        return { data: response.data, error: null }
    } catch (error) {
        console.error('Error en la petición DELETE:', error)
        return { data: null, error: error.message }
    }
}