// ADMINISTRATIVE PLAYLIST BACKEND (Add your song IDs here!)
const playlist = [
    { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley" },
    { id: "kJQP7kiw5Fk", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
    { id: "9bZkp7q19f0", title: "GANGNAM STYLE", artist: "PSY" },
    { id: "V1Pl8CzNzCw", title: "Billie Jean", artist: "Michael Jackson" }
];

let currentTrackIndex = 0;
let isShuffleOn = false;
let playerReady = false;
let playerEngine = null;

var tag = document.createElement('script');
tag.src = "https://youtube.com";
var firstScriptTag = document.getElementsByTagName('script');
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
    playerEngine = new YT.Player('hidden-youtube-player', {
        height: '130',
        width: '100%',
        videoId: playlist[0].id,
        playerVars: { 'playsinline': 1, 'controls': 1 },
        events: {
            'onReady': (e) => { playerReady = true; },
            'onStateChange': onEngineStateChange
        }
    });
}

function onEngineStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        document.getElementById('play-btn').style.display = 'none';
        document.getElementById('pause-btn').style.display = 'flex';
    } else {
        document.getElementById('play-btn').style.display = 'flex';
        document.getElementById('pause-btn').style.display = 'none';
    }
}

function buildLibraryUI() {
    const grid = document.getElementById('playlist-grid');
    grid.innerHTML = "";
    playlist.forEach((track, index) => {
        const card = document.createElement('div');
        card.id = `track-card-${index}`;
        card.className = "music-card";
        card.innerHTML = `
            <div class="card-art"><img src="https://youtube.com{track.id}/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;"></div>
            <h4>${track.title}</h4>
            <p>${track.artist}</p>
        `;
        card.onclick = () => loadAndPlayTrackIndex(index);
        grid.appendChild(card);
    });
}

function loadAndPlayTrackIndex(index) {
    currentTrackIndex = index;
    const currentTrack = playlist[currentTrackIndex];
    document.querySelectorAll('.music-card').forEach(c => c.classList.remove('playing-active'));
    const activeCard = document.getElementById(`track-card-${index}`);
    if(activeCard) activeCard.classList.add('playing-active');

    document.getElementById('bar-title').innerText = currentTrack.title;
    document.getElementById('bar-artist').innerText = currentTrack.artist;
    document.getElementById('bar-art').innerHTML = `<img src="https://youtube.com{currentTrack.id}/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover;">`;

    if(playerReady && playerEngine) { playerEngine.loadVideoById(currentTrack.id); }
}

function masterPlay() { if(playerReady && playerEngine) playerEngine.playVideo(); }
function masterPause() { if(playerReady && playerEngine) playerEngine.pauseVideo(); }

function playNext() {
    if (isShuffleOn) {
        let randomIndex = Math.floor(Math.random() * playlist.length);
        loadAndPlayTrackIndex(randomIndex);
    } else {
        let nextIndex = (currentTrackIndex + 1) % playlist.length;
        loadAndPlayTrackIndex(nextIndex);
    }
}

function playPrevious() {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = playlist.length - 1;
    loadAndPlayTrackIndex(prevIndex);
}

function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    const btn = document.getElementById('shuffle-btn');
    if(isShuffleOn) btn.classList.add('shuffle-active');
    else btn.classList.remove('shuffle-active');
}

document.getElementById('volume-slider').addEventListener('input', (e) => {
    if(playerReady && playerEngine) { playerEngine.setVolume(e.target.value); }
});

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    event.target.classList.add('active');
}

window.submitSuggestion = function() {
    alert("Suggestion sent!");
    document.getElementById('suggest-link').value = "";
    document.getElementById('suggest-note').value = "";
}

buildLibraryUI();
