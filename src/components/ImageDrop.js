/**
 * ImageDrop Component
 * Componente reutilizable para subir imágenes con drag & drop
 *
 * Uso:
 * const imageDrop = new ImageDrop({
 *     maxSize: 5, // MB
 *     acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
 *     onFileSelect: (file) => console.log('Archivo seleccionado:', file),
 *     onError: (error) => console.error('Error:', error)
 * })
 *
 * const dropzone = imageDrop.render()
 * container.appendChild(dropzone)
 */

export class ImageDrop {
    constructor(options = {}) {
        this.options = {
            maxSize: options.maxSize || 5, // MB
            acceptedFormats: options.acceptedFormats || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            onFileSelect: options.onFileSelect || (() => {}),
            onError: options.onError || ((error) => console.error(error)),
            placeholder: options.placeholder || 'Arrastra una imagen aquí o haz clic para seleccionar',
            previewImage: options.previewImage || null // URL de imagen existente
        }

        this.selectedFile = null
        this.previewURL = this.options.previewImage
        this.dropzoneElement = null
    }

    /**
     * Renderiza el componente de drag & drop
     * @returns {HTMLElement}
     */
    render() {
        const wrapper = document.createElement('div')
        wrapper.className = 'image-drop-wrapper'

        // Crear dropzone
        const dropzone = document.createElement('div')
        dropzone.className = 'image-drop-zone'
        dropzone.id = `dropzone-${Math.random().toString(36).substring(2, 11)}`

        // Input oculto para seleccionar archivos
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = this.options.acceptedFormats.join(',')
        input.style.display = 'none'
        input.id = `file-input-${Math.random().toString(36).substring(2, 11)}`

        // Contenido del dropzone
        const content = document.createElement('div')
        content.className = 'drop-content'

        // Si hay imagen previa, mostrarla
        if (this.previewURL) {
            this._renderPreview(content)
        } else {
            this._renderPlaceholder(content)
        }

        dropzone.appendChild(content)
        wrapper.appendChild(input)
        wrapper.appendChild(dropzone)

        // Event listeners
        this._attachEventListeners(dropzone, input)

        this.dropzoneElement = dropzone
        this.inputElement = input

        return wrapper
    }

    /**
     * Renderiza el placeholder cuando no hay imagen
     */
    _renderPlaceholder(container) {
        container.innerHTML = `
            <svg class="drop-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p class="drop-text">${this.options.placeholder}</p>
            <p class="drop-hint">PNG, JPG, WEBP o GIF (máx. ${this.options.maxSize}MB)</p>
            <button type="button" class="btn-select-file btn btn-primary">Seleccionar archivo</button>
        `
    }

    /**
     * Renderiza la vista previa de la imagen
     */
    _renderPreview(container) {
        container.innerHTML = `
            <div class="image-preview">
                <img src="${this.previewURL}" alt="Vista previa" class="preview-image">
                <div class="preview-overlay">
                    <button type="button" class="btn-change-image btn btn-secondary">Cambiar imagen</button>
                    <button type="button" class="btn-remove-image btn btn-danger">Eliminar</button>
                </div>
            </div>
        `
    }

    /**
     * Adjunta todos los event listeners necesarios
     */
    _attachEventListeners(dropzone, input) {
        // Click en dropzone o botón para abrir selector de archivos
        dropzone.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-select-file') ||
                e.target.classList.contains('btn-change-image') ||
                (!e.target.classList.contains('btn-remove-image') && !this.previewURL)) {
                input.click()
            }
        })

        // Botón de eliminar
        dropzone.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-image')) {
                this._removeImage()
            }
        })

        // Cuando se selecciona un archivo
        input.addEventListener('change', (e) => {
            const file = e.target.files[0]
            if (file) {
                this._handleFile(file)
            }
        })

        // Drag & Drop events
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault()
            dropzone.classList.add('drag-over')
        })

        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault()
            dropzone.classList.remove('drag-over')
        })

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault()
            dropzone.classList.remove('drag-over')

            const files = e.dataTransfer.files
            if (files.length > 0) {
                this._handleFile(files[0])
            }
        })
    }

    /**
     * Maneja el archivo seleccionado o dropeado
     */
    _handleFile(file) {
        // Validar formato
        if (!this.options.acceptedFormats.includes(file.type)) {
            this.options.onError({
                type: 'invalid_format',
                message: `Formato no válido. Solo se aceptan: ${this.options.acceptedFormats.join(', ')}`
            })
            return
        }

        // Validar tamaño
        const maxSizeBytes = this.options.maxSize * 1024 * 1024
        if (file.size > maxSizeBytes) {
            this.options.onError({
                type: 'file_too_large',
                message: `El archivo es demasiado grande. Máximo ${this.options.maxSize}MB`
            })
            return
        }

        // Guardar archivo y crear preview
        this.selectedFile = file
        this._createPreview(file)

        // Callback
        this.options.onFileSelect(file)
    }

    /**
     * Crea la vista previa de la imagen
     */
    _createPreview(file) {
        const reader = new FileReader()

        reader.onload = (e) => {
            this.previewURL = e.target.result
            const content = this.dropzoneElement.querySelector('.drop-content')
            this._renderPreview(content)
        }

        reader.readAsDataURL(file)
    }

    /**
     * Elimina la imagen seleccionada
     */
    _removeImage() {
        this.selectedFile = null
        this.previewURL = null
        this.inputElement.value = ''

        const content = this.dropzoneElement.querySelector('.drop-content')
        this._renderPlaceholder(content)

        // Callback con null para indicar que se eliminó
        this.options.onFileSelect(null)
    }

    /**
     * Obtiene el archivo seleccionado
     * @returns {File|null}
     */
    getFile() {
        return this.selectedFile
    }

    /**
     * Establece una imagen desde una URL (para editar)
     * @param {string} url
     */
    setImage(url) {
        if (url) {
            this.previewURL = url
            const content = this.dropzoneElement?.querySelector('.drop-content')
            if (content) {
                this._renderPreview(content)
            }
        }
    }

    /**
     * Resetea el componente
     */
    reset() {
        this._removeImage()
    }
}
