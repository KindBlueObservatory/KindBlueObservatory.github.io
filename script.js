let player;
let currentChannel = 1;
let playlists = {
  1: "PLapU3SOlAXR0bD-UowudCiKf5kAeXPIEz",
  2: "PLapU3SOlAXR0piDalGXr5yGlzVz9pnYiA"
};

let videoCache = {}; // Cache playlist data for reuse

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      enablejsapi: 1,
      playsinline: 1,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        document.getElementById("power-button").addEventListener("click", () => {
          document.getElementById("off-screen").style.display = "none";
          document.getElementById("player").style.display = "block";
          loadChannel(currentChannel);
        });

        document.querySelectorAll(".channel-button").forEach(button => {
          button.addEventListener("click", () => {
            currentChannel = parseInt(button.getAttribute("data-channel"));
            loadChannel(currentChannel);
          });
        });
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          playNextVideo();
        }
      }
    }
  });
}

function loadChannel(channel) {
  const playlistId = playlists[channel];

  if (videoCache[playlistId]) {
    playSyncedVideo(videoCache[playlistId]);
    return;
  }

  fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=YOUR_API_KEY`)
    .then(res => res.json())
    .then(data => {
      const videoIds = data.items.map(item => item.contentDetails.videoId);

      fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=AIzaSyDro8dYJKWIxEen07YeMgG7VSBXendxgd0`)
        .then(res => res.json())
        .then(details => {
          const durations = details.items.map(item => parseISO8601Duration(item.contentDetails.duration));
          const videoData = videoIds.map((id, i) => ({ id, duration: durations[i] }));
          videoCache[playlistId] = videoData;
          playSyncedVideo(videoData);
        });
    });
}

function parseISO8601Duration(iso) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, h, m, s] = iso.match(regex).map(x => parseInt(x || 0));
  return h * 3600 + m * 60 + s;
}

function playSyncedVideo(videos) {
  const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);
  const now = Math.floor(Date.now() / 1000);
  const offset = now % totalDuration;

  let time = offset;
  for (let i = 0; i < videos.length; i++) {
    if (time < videos[i].duration) {
      player.loadVideoById({
        videoId: videos[i].id,
        startSeconds: time,
        suggestedQuality: "large"
      });
      player.currentIndex = i;
      player.playlist = videos;
      break;
    } else {
      time -= videos[i].duration;
    }
  }
}

function playNextVideo() {
  if (!player.playlist) return;

  let nextIndex = (player.currentIndex + 1) % player.playlist.length;
  player.loadVideoById({
    videoId: player.playlist[nextIndex].id,
    startSeconds: 0,
    suggestedQuality: "large"
  });
  player.currentIndex = nextIndex;
}
