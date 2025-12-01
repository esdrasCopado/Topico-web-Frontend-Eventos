import { audioStore } from '../store.js';
import { Icons } from '../utils/icons.js';
import { getApiBaseUrl } from '../utils/api.js';
import '../assets/css/components/audioPlayer.css'

export class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.unsubscribe = null;
        this.isDragging = false;
        this.syncVideoTime = true; // Opción para sincronizar tiempo del video con el audio
        this.videoSyncInterval = null; // Intervalo para mantener sincronizado el video

        // Bind methods
        this.handleStateChange = this.handleStateChange.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleEnded = this.handleEnded.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.toggleVideo = this.toggleVideo.bind(this);
        this.closeVideo = this.closeVideo.bind(this);
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.toggleSyncMode = this.toggleSyncMode.bind(this);
        this.isExpanded = false;

        // Setup audio events
        this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
        this.audio.addEventListener('ended', this.handleEnded);
        this.audio.addEventListener('loadedmetadata', () => {
            audioStore.updateTime(this.audio.currentTime, this.audio.duration);
        });
    }

    mount(container) {
        this.container = container;
        this.render();
        this.unsubscribe = audioStore.subscribe(this.handleStateChange);

        // Initial state check
        const state = audioStore.getState();
        if (state.currentSong) {
            this.updatePlayerUI(state);
        } else {
            this.container.style.display = 'none';
        }
    }

    unmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.audio.pause();
        this.audio.src = '';
    }

    handleStateChange(state) {
        if (!state.currentSong) {
            this.container.style.display = 'none';
            this._resumeAllVideos();
            return;
        }

        this.container.style.display = 'flex';

        // Pausar todos los videos cuando el audio player está activo
        this._pauseAllVideos();

        // Check if song changed
        const currentSrc = this.audio.src;

        // Intenta encontrar la URL del audio en diferentes propiedades comunes
        const songUrl = state.currentSong.audioFileUrl ||
            state.currentSong.audioUrl ||
            state.currentSong.archivoUrl ||
            state.currentSong.url ||
            state.currentSong.audio ||
            state.currentSong.file;

        if (!songUrl) {
            console.error('No se encontró URL de audio en el objeto de la canción:', state.currentSong);
        } else {
            const fullUrl = songUrl.startsWith('http') ? songUrl : `${getApiBaseUrl()}${songUrl}`;

            if (currentSrc !== fullUrl) {
                this.audio.src = fullUrl;
                this.audio.load();
                if (state.isPlaying) {
                    this.audio.play().catch(e => console.error("Error playing:", e));
                }
            } else {
                // Same song, just toggle play state
                if (state.isPlaying && this.audio.paused) {
                    this.audio.play().catch(e => console.error("Error playing:", e));
                } else if (!state.isPlaying && !this.audio.paused) {
                    this.audio.pause();
                }
            }
        }

        this.updatePlayerUI(state);
    }

    togglePlay() {
        audioStore.togglePlay();
    }

    next() {
        audioStore.next();
    }

    prev() {
        audioStore.prev();
    }

    handleTimeUpdate() {
        if (!this.isDragging) {
            audioStore.updateTime(this.audio.currentTime, this.audio.duration);
        }
    }

    handleEnded() {
        audioStore.next();
    }

    handleSeek(e) {
        const time = parseFloat(e.target.value);
        this.audio.currentTime = time;
        audioStore.updateTime(time, this.audio.duration);
    }

    handleVolumeChange(e) {
        const volume = parseFloat(e.target.value);
        this.audio.volume = volume;
        audioStore.setVolume(volume);
    }

    toggleVideo() {
        const state = audioStore.getState();
        const videoUrl = state.currentSong?.videoUrl;

        if (!videoUrl) return;

        const overlay = document.getElementById('video-overlay');
        const videoPlayer = document.getElementById('video-player');

        if (overlay && videoPlayer) {
            // Pause audio
            if (state.isPlaying) {
                audioStore.togglePlay();
            }

            // Show overlay
            overlay.style.display = 'flex';

            // Set video src and play
            const fullVideoUrl = videoUrl.startsWith('http') ? videoUrl : `${getApiBaseUrl()}${videoUrl}`;
            videoPlayer.src = fullVideoUrl;
            videoPlayer.play().catch(e => console.error("Error playing video:", e));
        }
    }

    closeVideo() {
        const overlay = document.getElementById('video-overlay');
        const videoPlayer = document.getElementById('video-player');

        if (overlay && videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = '';
            overlay.style.display = 'none';
        }
    }

    _pauseAllVideos() {
        // Pausar todos los videos en la página
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            if (!video.classList.contains('audio-player__expanded-video') &&
                video.id !== 'video-player') {
                video.pause();
            }
        });

        // Ocultar controles de video
        const videoControls = document.querySelectorAll('[id^="video-controls-"]');
        videoControls.forEach(control => {
            control.style.display = 'none';
        });

        // Asegurarse de que los videos muestren su poster
        const videoPlayerContainers = document.querySelectorAll('.video-player-container');
        videoPlayerContainers.forEach(container => {
            const video = container.querySelector('video');
            if (video && !video.paused) {
                video.pause();
                video.currentTime = 0; // Reiniciar al inicio para mostrar el poster
            }
        });
    }

    _resumeAllVideos() {
        // Mostrar controles de video nuevamente
        const videoControls = document.querySelectorAll('[id^="video-controls-"]');
        videoControls.forEach(control => {
            control.style.display = '';
        });
    }

    toggleExpanded() {
        const state = audioStore.getState();
        const videoUrl = state.currentSong?.videoUrl;

        // Si no hay video, no hacer nada
        if (!videoUrl) {
            console.log('No hay video disponible para esta canción');
            return;
        }

        this.isExpanded = !this.isExpanded;
        const player = this.container.querySelector('.audio-player');
        const videoPlayer = this.container.querySelector('.audio-player__expanded-video');

        // Get hero video elements to hide/show
        const videoPlayerContainer = document.querySelector('.video-player-container');
        const heroBackgroundVideo = document.querySelector('.hero-background-video');
        const videoControls = document.querySelector('[id^="video-controls-"]');

        if (this.isExpanded) {
            player.classList.add('audio-player--expanded');

            // Pause and hide hero video elements
            if (videoPlayerContainer) videoPlayerContainer.style.display = 'none';
            if (heroBackgroundVideo) heroBackgroundVideo.style.display = 'none';
            if (videoControls) videoControls.style.display = 'none';

            // Set video src and play without sound
            const fullVideoUrl = videoUrl.startsWith('http') ? videoUrl : `${getApiBaseUrl()}${videoUrl}`;
            videoPlayer.src = fullVideoUrl;
            videoPlayer.muted = true;
            videoPlayer.loop = true;

            // Sincronizar tiempo del video con el audio si está habilitado
            if (this.syncVideoTime) {
                videoPlayer.addEventListener('loadedmetadata', () => {
                    const currentAudioTime = this.audio.currentTime;
                    videoPlayer.currentTime = currentAudioTime;
                    videoPlayer.play().catch(e => console.error("Error playing video:", e));
                }, { once: true });

                // Iniciar sincronización continua
                this._startVideoSync();
            } else {
                videoPlayer.play().catch(e => console.error("Error playing video:", e));
            }
        } else {
            player.classList.remove('audio-player--expanded');
            videoPlayer.pause();
            videoPlayer.src = '';

            // Detener sincronización
            this._stopVideoSync();

            // Show hero video elements again
            if (videoPlayerContainer) videoPlayerContainer.style.display = '';
            if (heroBackgroundVideo) heroBackgroundVideo.style.display = '';
            if (videoControls) videoControls.style.display = '';
        }
    }

    toggleSyncMode() {
        this.syncVideoTime = !this.syncVideoTime;
        console.log(`Sincronización de video: ${this.syncVideoTime ? 'Activada' : 'Desactivada'}`);

        // Actualizar UI del botón
        const syncBtn = this.container.querySelector('.audio-player__btn--sync');
        if (syncBtn) {
            syncBtn.classList.toggle('active', this.syncVideoTime);
            syncBtn.title = this.syncVideoTime
                ? 'Sincronización activada (click para desactivar)'
                : 'Sincronización desactivada (click para activar)';
        }

        // Si está expandido, reiniciar sincronización
        if (this.isExpanded) {
            if (this.syncVideoTime) {
                this._startVideoSync();
            } else {
                this._stopVideoSync();
            }
        }
    }

    _startVideoSync() {
        // Detener sincronización previa si existe
        this._stopVideoSync();

        // Sincronizar cada 100ms
        this.videoSyncInterval = setInterval(() => {
            const videoPlayer = this.container.querySelector('.audio-player__expanded-video');
            if (videoPlayer && !videoPlayer.paused) {
                const timeDiff = Math.abs(videoPlayer.currentTime - this.audio.currentTime);

                // Si la diferencia es mayor a 0.5 segundos, resincronizar
                if (timeDiff > 0.5) {
                    videoPlayer.currentTime = this.audio.currentTime;
                }
            }
        }, 100);
    }

    _stopVideoSync() {
        if (this.videoSyncInterval) {
            clearInterval(this.videoSyncInterval);
            this.videoSyncInterval = null;
        }
    }

    formatTime(seconds) {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updatePlayerUI(state) {
        const playBtn = this.container.querySelector('.audio-player__btn--play');
        const title = this.container.querySelector('.audio-player__song-title');
        const artist = this.container.querySelector('.audio-player__song-artist');
        const cover = this.container.querySelector('.audio-player__song-cover');
        const progressBar = this.container.querySelector('.audio-player__progress-bar');
        const currentTimeEl = this.container.querySelector('.audio-player__time--current');
        const durationEl = this.container.querySelector('.audio-player__time--duration');
        const videoBtn = this.container.querySelector('.audio-player__btn--video');

        if (playBtn) playBtn.innerHTML = state.isPlaying ? Icons.pause || '⏸' : Icons.play || '▶';
        if (title) title.textContent = state.currentSong.titulo;
        if (artist) artist.textContent = state.currentSong.artista || 'Desconocido';

        if (cover) {
            const imgUrl = state.currentSong.fontImage || state.currentSong.imagenUrl || state.currentSong.fontImageUrl;
            cover.src = imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${getApiBaseUrl()}${imgUrl}`) : '/placeholder-music.png';

            // Mostrar u ocultar el indicador de expansión según si hay video
            if (state.currentSong.videoUrl) {
                cover.classList.add('has-video');
                cover.title = 'Click para expandir y ver video';
            } else {
                cover.classList.remove('has-video');
                cover.title = 'Portada del álbum';
            }
        }

        if (progressBar && !this.isDragging) {
            progressBar.max = state.duration || 0;
            progressBar.value = state.currentTime || 0;

            // Update CSS variable for progress fill
            const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
            progressBar.style.setProperty('--progress', `${progress}%`);
        }

        if (currentTimeEl) currentTimeEl.textContent = this.formatTime(state.currentTime);
        if (durationEl) durationEl.textContent = this.formatTime(state.duration);

        // Show/Hide video button
        if (videoBtn) {
            if (state.currentSong.videoUrl) {
                videoBtn.style.display = 'flex';
            } else {
                videoBtn.style.display = 'none';
            }
        }

        // Sincronizar video expandido con la canción actual
        this._syncExpandedVideo(state);
    }

    _syncExpandedVideo(state) {
        // Solo actualizar si el reproductor está expandido
        if (!this.isExpanded) return;

        const videoPlayer = this.container.querySelector('.audio-player__expanded-video');
        const videoUrl = state.currentSong?.videoUrl;

        if (!videoPlayer) return;

        // Si la canción tiene video y es diferente al actual
        if (videoUrl) {
            const fullVideoUrl = videoUrl.startsWith('http') ? videoUrl : `${getApiBaseUrl()}${videoUrl}`;

            // Solo actualizar si el video es diferente
            if (videoPlayer.src !== fullVideoUrl) {
                videoPlayer.src = fullVideoUrl;
                videoPlayer.muted = true;
                videoPlayer.loop = true;

                // Sincronizar tiempo si está habilitado
                if (this.syncVideoTime) {
                    videoPlayer.addEventListener('loadedmetadata', () => {
                        const currentAudioTime = this.audio.currentTime;
                        videoPlayer.currentTime = currentAudioTime;
                        videoPlayer.play().catch(e => console.error("Error playing video:", e));
                    }, { once: true });

                    // Reiniciar sincronización continua
                    this._startVideoSync();
                } else {
                    videoPlayer.play().catch(e => console.error("Error playing video:", e));
                }
            }
        } else {
            // Si no hay video, limpiar el reproductor
            videoPlayer.pause();
            videoPlayer.src = '';
            this._stopVideoSync();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="audio-player">
                <!-- Expanded Video View -->
                <div class="audio-player__expanded-view">
                    <video class="audio-player__expanded-video" loop muted></video>
                </div>

                <!-- Main Player Content -->
                <div class="audio-player__main-content">
                    <div class="audio-player__song-info">
                        <img class="audio-player__song-cover" src="" alt="Cover" title="Click para expandir">
                        <div class="audio-player__song-details">
                            <div class="audio-player__song-title"></div>
                            <div class="audio-player__song-artist"></div>
                        </div>
                    </div>

                    <div class="audio-player__controls">
                        <div class="audio-player__buttons">
                            <button class="audio-player__btn audio-player__btn--prev" title="Anterior">
                                ${Icons.skipBack || '⏮'}
                            </button>
                            <button class="audio-player__btn audio-player__btn--play" title="Reproducir/Pausar">
                                ${Icons.play || '▶'}
                            </button>
                            <button class="audio-player__btn audio-player__btn--next" title="Siguiente">
                                ${Icons.skipForward || '⏭'}
                            </button>
                        </div>
                        <div class="audio-player__progress-container">
                            <span class="audio-player__time audio-player__time--current">0:00</span>
                            <input type="range" class="audio-player__progress-bar" min="0" max="100" value="0" aria-label="Barra de progreso">
                            <span class="audio-player__time audio-player__time--duration">0:00</span>
                        </div>
                    </div>

                    <div class="audio-player__volume-controls">
                        <button class="audio-player__btn audio-player__btn--sync active" title="Sincronización activada (click para desactivar)">
                            🔗
                        </button>
                        <span class="audio-player__volume-icon">${Icons.volume || '🔊'}</span>
                        <input type="range" class="audio-player__volume-bar" min="0" max="1" step="0.1" value="1" aria-label="Control de volumen">
                    </div>
                </div>
            </div>

            <!-- Video Overlay -->
            <div class="video-overlay" id="video-overlay">
                <button class="video-overlay__close-btn" id="close-video-btn" aria-label="Cerrar video">&times;</button>
                <video class="video-overlay__video-player" id="video-player" controls></video>
            </div>
        `;

        // Attach DOM event listeners
        this.container.querySelector('.audio-player__btn--play').addEventListener('click', this.togglePlay);
        this.container.querySelector('.audio-player__btn--next').addEventListener('click', this.next);
        this.container.querySelector('.audio-player__btn--prev').addEventListener('click', this.prev);
        this.container.querySelector('.audio-player__song-cover').addEventListener('click', this.toggleExpanded);
        this.container.querySelector('.audio-player__btn--sync').addEventListener('click', this.toggleSyncMode);

        const progressBar = this.container.querySelector('.audio-player__progress-bar');
        progressBar.addEventListener('input', (e) => {
            this.isDragging = true;
            // Optional: update time display while dragging
        });
        progressBar.addEventListener('change', (e) => {
            this.isDragging = false;
            this.handleSeek(e);
        });

        this.container.querySelector('.audio-player__volume-bar').addEventListener('input', this.handleVolumeChange);

        // Video overlay listeners
        document.getElementById('close-video-btn').addEventListener('click', this.closeVideo);
        document.getElementById('video-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'video-overlay') {
                this.closeVideo();
            }
        });
    }
}
