/**
 * EJEMPLO DE USO DEL COMPONENTE ImageDrop
 * ==========================================
 */

import { ImageDrop } from './ImageDrop.js'

// ========================================
// EJEMPLO 1: Uso Básico
// ========================================

function ejemploBasico() {
    // Crear instancia del componente
    const imageDrop = new ImageDrop({
        maxSize: 5, // Máximo 5MB
        onFileSelect: (file) => {
            if (file) {
                console.log('Archivo seleccionado:', file)
                console.log('Nombre:', file.name)
                console.log('Tamaño:', (file.size / 1024 / 1024).toFixed(2), 'MB')
                console.log('Tipo:', file.type)
            } else {
                console.log('Imagen eliminada')
            }
        },
        onError: (error) => {
            alert(error.message)
        }
    })

    // Renderizar el componente
    const dropzone = imageDrop.render()

    // Agregar al DOM
    document.querySelector('#container').appendChild(dropzone)

    // Obtener el archivo cuando se necesite
    const selectedFile = imageDrop.getFile()
}


// ========================================
// EJEMPLO 2: Uso en Formulario de Crear Evento
// ========================================

function ejemploFormularioEvento() {
    let selectedImageFile = null

    // Crear el dropzone
    const eventImageDrop = new ImageDrop({
        maxSize: 5,
        acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
        placeholder: 'Arrastra la imagen del evento aquí',
        onFileSelect: (file) => {
            selectedImageFile = file
            if (file) {
                console.log('✅ Imagen del evento cargada')
            }
        },
        onError: (error) => {
            // Mostrar error en el formulario
            const errorDiv = document.createElement('div')
            errorDiv.className = 'alert alert-error'
            errorDiv.textContent = error.message
            document.querySelector('#form-errors').appendChild(errorDiv)
        }
    })

    // Agregar al formulario
    const imageContainer = document.querySelector('#event-image-container')
    imageContainer.appendChild(eventImageDrop.render())

    // Cuando se envía el formulario
    document.querySelector('#form-crear-evento').addEventListener('submit', async (e) => {
        e.preventDefault()

        // Crear FormData para enviar al backend
        const formData = new FormData()
        formData.append('nombre', document.querySelector('#nombre').value)
        formData.append('descripcion', document.querySelector('#descripcion').value)

        // Agregar la imagen si existe
        const imageFile = eventImageDrop.getFile()
        if (imageFile) {
            formData.append('imagen', imageFile)
        }

        // Enviar al backend
        try {
            const response = await fetch('/api/eventos', {
                method: 'POST',
                body: formData
            })
            const data = await response.json()
            console.log('Evento creado:', data)
        } catch (error) {
            console.error('Error:', error)
        }
    })
}


// ========================================
// EJEMPLO 3: Editar Evento (con imagen existente)
// ========================================

function ejemploEditarEvento() {
    // Datos del evento existente
    const eventoExistente = {
        id: 123,
        nombre: 'Corona Capital 2025',
        imagen_url: 'http://localhost:3000/uploads/eventos/corona-capital.jpg'
    }

    // Crear dropzone con imagen previa
    const editImageDrop = new ImageDrop({
        maxSize: 5,
        previewImage: eventoExistente.imagen_url, // Mostrar imagen existente
        onFileSelect: (file) => {
            if (file) {
                console.log('Nueva imagen seleccionada:', file.name)
            } else {
                console.log('Imagen eliminada')
            }
        }
    })

    const dropzone = editImageDrop.render()
    document.querySelector('#edit-image-container').appendChild(dropzone)

    // Al guardar cambios
    document.querySelector('#form-editar').addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('nombre', document.querySelector('#nombre').value)

        // Solo enviar nueva imagen si se seleccionó una
        const newImage = editImageDrop.getFile()
        if (newImage) {
            formData.append('imagen', newImage)
        }

        // Actualizar en el backend
        await fetch(`/api/eventos/${eventoExistente.id}`, {
            method: 'PUT',
            body: formData
        })
    })
}


// ========================================
// EJEMPLO 4: Múltiples ImageDrops en la misma página
// ========================================

function ejemploMultiplesImagenes() {
    // Imagen del evento
    const eventoDrop = new ImageDrop({
        placeholder: 'Imagen del evento',
        onFileSelect: (file) => console.log('Evento:', file?.name)
    })

    // Imagen del banner
    const bannerDrop = new ImageDrop({
        placeholder: 'Banner promocional',
        onFileSelect: (file) => console.log('Banner:', file?.name)
    })

    // Imagen del organizador
    const orgDrop = new ImageDrop({
        placeholder: 'Logo del organizador',
        maxSize: 2, // Más pequeño para logos
        onFileSelect: (file) => console.log('Logo:', file?.name)
    })

    // Renderizar cada uno
    document.querySelector('#evento-img').appendChild(eventoDrop.render())
    document.querySelector('#banner-img').appendChild(bannerDrop.render())
    document.querySelector('#org-img').appendChild(orgDrop.render())
}


// ========================================
// EJEMPLO 5: Validación personalizada
// ========================================

function ejemploValidacionCustom() {
    const imageDrop = new ImageDrop({
        maxSize: 5,
        onFileSelect: (file) => {
            if (!file) return

            // Validación adicional: dimensiones mínimas
            const img = new Image()
            const url = URL.createObjectURL(file)

            img.onload = () => {
                const minWidth = 800
                const minHeight = 600

                if (img.width < minWidth || img.height < minHeight) {
                    alert(`La imagen debe ser mínimo ${minWidth}x${minHeight}px`)
                    imageDrop.reset() // Limpiar la imagen
                } else {
                    console.log(`✅ Imagen válida: ${img.width}x${img.height}px`)
                }

                URL.revokeObjectURL(url)
            }

            img.src = url
        },
        onError: (error) => {
            console.error('Error:', error)
        }
    })

    document.querySelector('#container').appendChild(imageDrop.render())
}


// ========================================
// EJEMPLO 6: Con mensaje de estado
// ========================================

function ejemploConEstado() {
    const statusDiv = document.createElement('div')
    statusDiv.className = 'upload-status'

    const imageDrop = new ImageDrop({
        onFileSelect: async (file) => {
            if (!file) {
                statusDiv.innerHTML = ''
                return
            }

            // Mostrar progreso
            statusDiv.innerHTML = '<p class="text-info">⏳ Subiendo imagen...</p>'

            try {
                const formData = new FormData()
                formData.append('imagen', file)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })

                if (response.ok) {
                    const data = await response.json()
                    statusDiv.innerHTML = `<p class="text-success">✅ Imagen subida: ${data.url}</p>`
                } else {
                    throw new Error('Error al subir')
                }
            } catch (error) {
                statusDiv.innerHTML = '<p class="text-danger">❌ Error al subir la imagen</p>'
            }
        }
    })

    const container = document.querySelector('#container')
    container.appendChild(imageDrop.render())
    container.appendChild(statusDiv)
}


// ========================================
// EXPORTAR EJEMPLOS
// ========================================

export {
    ejemploBasico,
    ejemploFormularioEvento,
    ejemploEditarEvento,
    ejemploMultiplesImagenes,
    ejemploValidacionCustom,
    ejemploConEstado
}
