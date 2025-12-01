/**
 * Simple Pub/Sub Store for Audio Player State
 */

class AudioStore {
    constructor() {
        this.state = {
            currentSong: null,
            playlist: [],
            currentIndex: -1,
            isPlaying: false,
            volume: 1.0,
            currentTime: 0,
            duration: 0
        };
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    getState() {
        return this.state;
    }

    // Actions
    setPlaylist(songs) {
        this.state.playlist = songs;
        this.notify();
    }

    playSong(song, index) {
        this.state.currentSong = song;
        this.state.currentIndex = index !== undefined ? index : this.state.playlist.findIndex(s => s.id === song.id);
        this.state.isPlaying = true;
        this.notify();
    }

    togglePlay() {
        if (this.state.currentSong) {
            this.state.isPlaying = !this.state.isPlaying;
            this.notify();
        }
    }

    next() {
        if (this.state.playlist.length > 0) {
            let nextIndex = this.state.currentIndex + 1;
            if (nextIndex >= this.state.playlist.length) {
                nextIndex = 0; // Loop back to start
            }
            this.playSong(this.state.playlist[nextIndex], nextIndex);
        }
    }

    prev() {
        if (this.state.playlist.length > 0) {
            let prevIndex = this.state.currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = this.state.playlist.length - 1; // Loop to end
            }
            this.playSong(this.state.playlist[prevIndex], prevIndex);
        }
    }

    setVolume(volume) {
        this.state.volume = volume;
        this.notify();
    }

    updateTime(currentTime, duration) {
        this.state.currentTime = currentTime;
        this.state.duration = duration;
        this.notify();
    }
}

export const audioStore = new AudioStore();
