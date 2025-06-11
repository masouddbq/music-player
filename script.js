class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrack = 0;
        this.isPlaying = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.player = document.getElementById('musicPlayer');
        this.playPauseBtn = document.querySelector('.play-pause-btn');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTime = document.querySelector('.current');
        this.duration = document.querySelector('.duration');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.songTitle = document.querySelector('.song-title');
        this.artist = document.querySelector('.artist');
    }

    setupEventListeners() {
        // Play/Pause
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        
        // Previous/Next
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.playNext());
        
        // Drag and drop
        this.setupDragAndDrop();
        
        // Make player draggable
        this.setupDraggable();
    }

    setupDragAndDrop() {
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('dragover');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('dragover');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        this.dropZone.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    setupDraggable() {
        this.player.addEventListener('mousedown', (e) => {
            if (e.target.closest('.controls, .volume-container, .drop-zone')) return;
            
            this.isDragging = true;
            const rect = this.player.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            
            this.player.style.position = 'fixed';
            this.player.style.left = `${x}px`;
            this.player.style.top = `${y}px`;
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    handleFiles(files) {
        const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
        
        if (audioFiles.length === 0) return;
        
        this.playlist = audioFiles;
        this.currentTrack = 0;
        this.loadTrack(this.currentTrack);
        this.play();
    }

    loadTrack(index) {
        const file = this.playlist[index];
        const url = URL.createObjectURL(file);
        this.audio.src = url;
        this.songTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
        this.artist.textContent = 'Unknown Artist';
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.audio.play();
    }

    pause() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.audio.pause();
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.play();
    }

    playNext() {
        if (this.playlist.length === 0) return;
        
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.play();
    }

    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progress.style.width = `${progressPercent}%`;
        
        this.currentTime.textContent = this.formatTime(currentTime);
        this.duration.textContent = this.formatTime(duration);
    }

    setVolume(e) {
        const volume = e.target.value / 100;
        this.audio.volume = volume;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the music player
const player = new MusicPlayer(); 