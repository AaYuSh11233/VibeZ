class PremiumMusicPlayer {
    constructor() {
        this.songs = [];
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
        this.volume = 0.5;
        this.audio = document.getElementById('audioPlayer');
        this.likedSongs = new Set();
        
        this.initializeElements();
        this.bindEvents();
        this.loadSongs();
        this.updateGreeting();
    }

    initializeElements() {
        // Player controls
        this.playPauseBtn = $('#playPauseBtn');
        this.prevBtn = $('#prevBtn');
        this.nextBtn = $('#nextBtn');
        this.shuffleBtn = $('#shuffleBtn');
        this.repeatBtn = $('#repeatBtn');
        this.likeBtn = $('#likeBtn');
        
        // Progress and volume
        this.progressBar = $('#progressBar');
        this.progressFill = $('#progressFill');
        this.progressHandle = $('#progressHandle');
        this.currentTime = $('#currentTime');
        this.totalTime = $('#totalTime');
        this.volumeSlider = $('#volumeSlider');
        this.volumeBtn = $('#volumeBtn');
        
        // Now playing
        this.playerCover = $('#playerCover');
        this.playerTitle = $('#playerTitle');
        this.playerArtist = $('#playerArtist');
        
        // Content areas
        this.recentlyPlayed = $('#recentlyPlayed');
        this.madeForYou = $('#madeForYou');
        this.recentAlbums = $('#recentAlbums');
        this.popularArtists = $('#popularArtists');
        
        // Search
        this.globalSearch = $('#globalSearch');
    }

    bindEvents() {
        // Player controls
        this.playPauseBtn.on('click', () => this.togglePlayPause());
        this.prevBtn.on('click', () => this.previousSong());
        this.nextBtn.on('click', () => this.nextSong());
        this.shuffleBtn.on('click', () => this.toggleShuffle());
        this.repeatBtn.on('click', () => this.toggleRepeat());
        this.likeBtn.on('click', () => this.toggleLike());
        
        // Volume controls
        this.volumeSlider.on('input', (e) => this.setVolume(e.target.value));
        this.volumeBtn.on('click', () => this.toggleMute());
        
        // Progress bar
        this.progressBar.on('click', (e) => this.setProgress(e));
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        
        // Search
        this.globalSearch.on('input', (e) => this.handleSearch(e.target.value));
        
        // Navigation
        $('.nav-item').on('click', (e) => {
            e.preventDefault();
            $('.nav-item').removeClass('active');
            $(e.currentTarget).addClass('active');
        });
    }

    async loadSongs() {
        try {
            this.songs = [
                {
                    id: 1,
                    title: "See You Again",
                    artist: "Wiz Khalifa ft. Charlie Puth",
                    album: "Furious 7 Soundtrack",
                    duration: "3:57",
                    file: "songs/See you again.mp3",
                    cover: "covers/S.jpg",
                    genre: "Hip Hop"
                },
                {
                    id: 2,
                    title: "I Wanna Be Yours",
                    artist: "Arctic Monkeys",
                    album: "AM",
                    duration: "3:03",
                    file: "songs/I wanna be yours.mp3",
                    cover: "covers/I.jpg",
                    genre: "Indie Rock"
                },
                {
                    id: 3,
                    title: "Let Her Go",
                    artist: "Passenger",
                    album: "All the Little Lights",
                    duration: "4:14",
                    file: "songs/Ler her go.mp3",
                    cover: "covers/L.jpg",
                    genre: "Folk"
                },
                {
                    id: 4,
                    title: "Memories",
                    artist: "Maroon 5",
                    album: "Jordi",
                    duration: "3:09",
                    file: "songs/Memories.mp3",
                    cover: "covers/M.jpg",
                    genre: "Pop"
                },
                {
                    id: 5,
                    title: "Until I Found You",
                    artist: "Stephen Sanchez",
                    album: "What Was, Not Now",
                    duration: "2:57",
                    file: "songs/Until I found you.mp3",
                    cover: "covers/U.jpg",
                    genre: "Pop"
                },
                {
                    id: 6,
                    title: "Dandelions",
                    artist: "Ruth B.",
                    album: "Safe Haven",
                    duration: "3:49",
                    file: "songs/Dandelions.mp3",
                    cover: "covers/D.jpg",
                    genre: "Pop"
                },
                {
                    id: 7,
                    title: "CO2",
                    artist: "Prateek Kuhad",
                    album: "The Way That Lovers Do",
                    duration: "3:22",
                    file: "songs/CO2.mp3",
                    cover: "covers/C.jpg",
                    genre: "Indie"
                },
                {
                    id: 8,
                    title: "Night Changes",
                    artist: "One Direction",
                    album: "Four",
                    duration: "3:46",
                    file: "songs/Night changes.mp3",
                    cover: "covers/N.jpg",
                    genre: "Pop"
                },
                {
                    id: 9,
                    title: "Play Date",
                    artist: "Melanie Martinez",
                    album: "Cry Baby",
                    duration: "3:06",
                    file: "songs/Play date.mp3",
                    cover: "covers/P.jpg",
                    genre: "Alternative"
                },
                {
                    id: 10,
                    title: "Photograph",
                    artist: "Ed Sheeran",
                    album: "x (Multiply)",
                    duration: "4:18",
                    file: "songs/Photograph.mp3",
                    cover: "covers/Ph.jpg",
                    genre: "Pop"
                }
            ];
            
            this.renderContent();
            if (this.songs.length > 0) {
                this.loadSong(0);
            }
        } catch (error) {
            console.error('Error loading songs:', error);
        }
    }

    renderContent() {
        this.renderRecentlyPlayed();
        this.renderMadeForYou();
        this.renderRecentAlbums();
        this.renderPopularArtists();
    }

    renderRecentlyPlayed() {
        const recentSongs = this.songs.slice(0, 6);
        const html = recentSongs.map(song => `
            <div class="recent-item" data-song-id="${song.id}">
                <img src="${song.cover}" alt="${song.title}" class="recent-cover" onerror="this.src='covers/default.jpg'">
                <div class="recent-info">
                    <div class="recent-title">${song.title}</div>
                    <div class="recent-artist">${song.artist}</div>
                </div>
            </div>
        `).join('');
        
        this.recentlyPlayed.html(html);
        
        $('.recent-item').on('click', (e) => {
            const songId = parseInt($(e.currentTarget).data('song-id'));
            const songIndex = this.songs.findIndex(song => song.id === songId);
            this.loadSong(songIndex);
            this.play();
        });
    }

    renderMadeForYou() {
        const playlists = [
            { title: "Chill Mix", subtitle: "Made for you", cover: "covers/S.jpg" },
            { title: "Discover Weekly", subtitle: "Your weekly mixtape", cover: "covers/I.jpg" },
            { title: "Daily Mix 1", subtitle: "Arctic Monkeys, Ed Sheeran and more", cover: "covers/L.jpg" },
            { title: "Release Radar", subtitle: "Catch all the latest music", cover: "covers/M.jpg" },
            { title: "Liked Songs", subtitle: "Your favorite tracks", cover: "covers/U.jpg" }
        ];
        
        const html = playlists.map(playlist => `
            <div class="card">
                <img src="${playlist.cover}" alt="${playlist.title}" class="card-cover" onerror="this.src='covers/default.jpg'">
                <div class="card-title">${playlist.title}</div>
                <div class="card-subtitle">${playlist.subtitle}</div>
                <button class="play-button">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
        
        this.madeForYou.html(html);
    }

    renderRecentAlbums() {
        const albums = this.songs.map(song => ({
            title: song.album,
            artist: song.artist,
            cover: song.cover,
            songId: song.id
        }));
        
        const html = albums.map(album => `
            <div class="card" data-song-id="${album.songId}">
                <img src="${album.cover}" alt="${album.title}" class="card-cover" onerror="this.src='covers/default.jpg'">
                <div class="card-title">${album.title}</div>
                <div class="card-subtitle">${album.artist}</div>
                <button class="play-button">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
        
        this.recentAlbums.html(html);
        
        this.recentAlbums.find('.card').on('click', (e) => {
            const songId = parseInt($(e.currentTarget).data('song-id'));
            const songIndex = this.songs.findIndex(song => song.id === songId);
            this.loadSong(songIndex);
            this.play();
        });
    }

    renderPopularArtists() {
        const artists = [...new Set(this.songs.map(song => song.artist))].map(artist => {
            const song = this.songs.find(s => s.artist === artist);
            return {
                name: artist,
                cover: song.cover,
                songId: song.id
            };
        });
        
        const html = artists.map(artist => `
            <div class="card" data-song-id="${artist.songId}">
                <img src="${artist.cover}" alt="${artist.name}" class="card-cover" onerror="this.src='covers/default.jpg'">
                <div class="card-title">${artist.name}</div>
                <div class="card-subtitle">Artist</div>
                <button class="play-button">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
        
        this.popularArtists.html(html);
        
        this.popularArtists.find('.card').on('click', (e) => {
            const songId = parseInt($(e.currentTarget).data('song-id'));
            const songIndex = this.songs.findIndex(song => song.id === songId);
            this.loadSong(songIndex);
            this.play();
        });
    }

    loadSong(index) {
        if (index < 0 || index >= this.songs.length) return;
        
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        this.audio.src = song.file;
        this.playerCover.attr('src', song.cover);
        this.playerTitle.text(song.title);
        this.playerArtist.text(song.artist);
        
        this.updateLikeButton();
        
        // Handle image load errors
        this.playerCover.on('error', function() {
            $(this).attr('src', 'covers/default.jpg');
        });
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    previousSong() {
        let newIndex = this.currentSongIndex - 1;
        if (newIndex < 0) {
            newIndex = this.songs.length - 1;
        }
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    nextSong() {
        let newIndex = this.currentSongIndex + 1;
        if (newIndex >= this.songs.length) {
            newIndex = 0;
        }
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.toggleClass('active', this.isShuffled);
    }

    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        this.repeatBtn.removeClass('active');
        
        if (this.repeatMode === 1) {
            this.repeatBtn.addClass('active');
            this.repeatBtn.find('i').removeClass('fa-redo-alt').addClass('fa-redo');
        } else if (this.repeatMode === 2) {
            this.repeatBtn.addClass('active');
            this.repeatBtn.find('i').removeClass('fa-redo').addClass('fa-redo-alt');
        }
    }

    toggleLike() {
        const currentSong = this.songs[this.currentSongIndex];
        if (this.likedSongs.has(currentSong.id)) {
            this.likedSongs.delete(currentSong.id);
        } else {
            this.likedSongs.add(currentSong.id);
        }
        this.updateLikeButton();
    }

    updateLikeButton() {
        const currentSong = this.songs[this.currentSongIndex];
        const isLiked = this.likedSongs.has(currentSong.id);
        
        this.likeBtn.toggleClass('liked', isLiked);
        this.likeBtn.find('i').toggleClass('far', !isLiked).toggleClass('fas', isLiked);
    }

    setVolume(value) {
        this.volume = value / 100;
        this.audio.volume = this.volume;
        this.updateVolumeIcon();
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.volume = 0;
            this.volumeSlider.val(0);
        } else {
            this.audio.volume = this.volume;
            this.volumeSlider.val(this.volume * 100);
        }
        this.updateVolumeIcon();
    }

    updateVolumeIcon() {
        const volume = this.audio.volume;
        let icon = 'fa-volume-up';
        
        if (volume === 0) {
            icon = 'fa-volume-mute';
        } else if (volume < 0.5) {
            icon = 'fa-volume-down';
        }
        
        this.volumeBtn.find('i').removeClass('fa-volume-up fa-volume-down fa-volume-mute').addClass(icon);
    }

    setProgress(e) {
        const progressBar = $(e.currentTarget);
        const clickX = e.offsetX;
        const width = progressBar.width();
        const duration = this.audio.duration;
        
        if (duration) {
            const newTime = (clickX / width) * duration;
            this.audio.currentTime = newTime;
        }
    }

    updateDuration() {
        const duration = this.audio.duration;
        if (duration) {
            this.totalTime.text(this.formatTime(duration));
        }
    }

    updateProgress() {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            this.progressFill.css('width', progressPercent + '%');
            this.progressHandle.css('left', progressPercent + '%');
            this.currentTime.text(this.formatTime(currentTime));
        }
    }

    handleSongEnd() {
        if (this.repeatMode === 2) {
            this.audio.currentTime = 0;
            this.play();
        } else if (this.repeatMode === 1 || this.currentSongIndex < this.songs.length - 1) {
            this.nextSong();
        } else {
            this.pause();
            this.audio.currentTime = 0;
        }
    }

    updatePlayButton() {
        const icon = this.isPlaying ? 'fa-pause' : 'fa-play';
        this.playPauseBtn.find('i').removeClass('fa-play fa-pause').addClass(icon);
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.renderContent();
            return;
        }

        const filteredSongs = this.songs.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase()) ||
            song.album.toLowerCase().includes(query.toLowerCase())
        );

        // Update all sections with filtered results
        this.renderFilteredResults(filteredSongs);
    }

    renderFilteredResults(filteredSongs) {
        // Render filtered recently played
        const recentHtml = filteredSongs.slice(0, 6).map(song => `
            <div class="recent-item" data-song-id="${song.id}">
                <img src="${song.cover}" alt="${song.title}" class="recent-cover" onerror="this.src='covers/default.jpg'">
                <div class="recent-info">
                    <div class="recent-title">${song.title}</div>
                    <div class="recent-artist">${song.artist}</div>
                </div>
            </div>
        `).join('');
        
        this.recentlyPlayed.html(recentHtml || '<div class="no-results">No songs found</div>');
        
        // Bind click events
        $('.recent-item').on('click', (e) => {
            const songId = parseInt($(e.currentTarget).data('song-id'));
            const songIndex = this.songs.findIndex(song => song.id === songId);
            this.loadSong(songIndex);
            this.play();
        });
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Good evening';
        
        if (hour < 12) {
            greeting = 'Good morning';
        } else if (hour < 18) {
            greeting = 'Good afternoon';
        }
        
        $('.section-title').first().text(greeting);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the music player when the document is ready
$(document).ready(function() {
    const player = new PremiumMusicPlayer();
    
    // Add smooth scrolling
    $('.content-area').css('scroll-behavior', 'smooth');
    
    // Add loading states for images
    $('img').on('load', function() {
        $(this).addClass('fade-in');
    });
});