let player;
let currentChannel = 1;
let playlists = {
  1: "PLapU3SOlAXR0bD-UowudCiKf5kAeXPIEz",
  2: "PLapU3SOlAXR0piDalGXr5yGlzVz9pnYiA"
};

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
      }
    }
  });
}

function loadChannel(channel) {
  const playlistId = playlists[channel];
  fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=AIzaSyDro8dYJKWIxEen07YeMgG7VSBXendxgd0`)
    .then(res => res.json())
    .then(data => {
      const items = data.items;
      const totalDuration = items.length * 300; // assume avg 5 min per video
      const now = Math.floor(Date.now() / 1000);
      const offset = now % totalDuration;
      const videoIndex = Math.floor(offset / 300);
      const startSeconds = offset % 300;
      const videoId = items[videoIndex].snippet.resourceId.videoId;

      player.loadVideoById({
        videoId,
        startSeconds,
        suggestedQuality: "large"
      });
    })
    .catch(err => {
      console.error("Failed to load playlist", err);
    });
}
