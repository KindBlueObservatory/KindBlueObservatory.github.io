<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kind Blue Observatory Presents: CABLE</title>
  <style>
    body {
      margin: 0;
      background: #111;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: monospace;
    }

    #tv-frame {
      background: url('https://upload.wikimedia.org/wikipedia/commons/f/fc/Wood_texture.jpg') center/cover;
      border: 16px solid #333;
      border-radius: 12px;
      width: 860px;
      height: 520px;
      position: relative;
      box-shadow: 0 0 40px rgba(0,0,0,0.5);
    }

    #screen {
      background: black;
      width: 640px;
      height: 360px;
      margin: 40px auto 20px;
      position: relative;
      box-shadow: 0 0 40px #0ff4;
    }

    #screen.flicker {
      animation: flicker 1s ease-in-out;
    }

    @keyframes flicker {
      0% { box-shadow: 0 0 0px black; }
      20% { box-shadow: 0 0 60px #0ff; }
      40% { box-shadow: 0 0 10px black; }
      60% { box-shadow: 0 0 50px #0ff; }
      80% { box-shadow: 0 0 15px black; }
      100% { box-shadow: 0 0 40px #0ff4; }
    }

    #player {
      width: 100%;
      height: 100%;
      display: none;
    }

    #off-screen {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: black;
      z-index: 2;
    }

    #power-button {
      font-size: 1.5rem;
      padding: 1rem 2rem;
      background: #eee;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 0 15px #fff3;
    }

    #controls {
      position: absolute;
      top: 40px;
      left: 40px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 3;
    }

    .channel-button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: radial-gradient(circle, #aaa, #444);
      border: 2px solid #222;
      font-weight: bold;
      font-size: 1.2rem;
      color: white;
      text-shadow: 0 0 3px black;
      cursor: pointer;
      transform: rotate(0deg);
      transition: transform 0.3s ease;
    }

    .channel-button:active {
      transform: rotate(20deg);
    }

    #nameplate {
      position: absolute;
      bottom: 12px;
      right: 30px;
      background: linear-gradient(to right, #aaa, #ccc);
      padding: 4px 12px;
      font-family: serif;
      font-weight: bold;
      font-size: 1.2rem;
      color: #222;
      border-radius: 3px;
      box-shadow: inset 1px 1px 2px #fff6, inset -1px -1px 2px #0004;
    }
  </style>
</head>
<body>
  <audio id="click-sound" src="https://freesound.org/data/previews/256/256113_3263906-lq.mp3"></audio>
  <div id="tv-frame">
    <div id="screen">
      <div id="off-screen">
        <button id="power-button">Turn On TV</button>
      </div>
      <div id="player"></div>
    </div>
    <div id="controls">
      <button class="channel-button" data-channel="1">1</button>
      <button class="channel-button" data-channel="2">2</button>
    </div>
    <div id="nameplate">KBO</div>
  </div>

  <script>
    const playlistMap = {
      1: "PLapU3SOlAXR0bD-UowudCiKf5kAeXPIEz",
      2: "PLapU3SOlAXR0piDalGXr5yGlzVz9pnYiA"
    };

    const powerButton = document.getElementById('power-button');
    const screen = document.getElementById('screen');
    const offScreen = document.getElementById('off-screen');
    const playerDiv = document.getElementById('player');
    const clickSound = document.getElementById('click-sound');

    let player;
    let currentChannel = 1;
    let tvOn = false;

    powerButton.addEventListener('click', () => {
      if (tvOn) return;

      tvOn = true;
      screen.classList.add('flicker');

      setTimeout(() => {
        screen.classList.remove('flicker');
        offScreen.style.display = 'none';
        playerDiv.style.display = 'block';
        initPlayer();
      }, 1000);
    });

    document.querySelectorAll('.channel-button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!tvOn) return;
        clickSound.currentTime = 0;
        clickSound.play();
        const newChannel = parseInt(btn.dataset.channel);
        if (newChannel !== currentChannel) {
          currentChannel = newChannel;
          syncAndPlayChannel(currentChannel);
        }
      });
    });

    function initPlayer() {
      syncAndPlayChannel(currentChannel);
    }

    async function syncAndPlayChannel(channel) {
      const playlistId = playlistMap[channel];
      const apiKey = AIzaSyDro8dYJKWIxEen07YeMgG7VSBXendxgd0; // 
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      const videoIds = data.items.map(item => item.snippet.resourceId.videoId);
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${apiKey}`;
      const videoRes = await fetch(videosUrl);
      const videoData = await videoRes.json();

      const durations = videoData.items.map(item =>
        ISO8601toSeconds(item.contentDetails.duration)
      );

      // Simulate current time
      const now = Math.floor(Date.now() / 1000);
      const totalDuration = durations.reduce((sum, dur) => sum + dur, 0);
      const timeInLoop = now % totalDuration;

      let timeTracker = 0;
      let selectedIndex = 0;
      let videoStartTime = 0;

      for (let i = 0; i < durations.length; i++) {
        if (timeTracker + durations[i] > timeInLoop) {
          selectedIndex = i;
          videoStartTime = timeInLoop - timeTracker;
          break;
        }
        timeTracker += durations[i];
      }

      const videoId = videoIds[selectedIndex];

      if (player) {
        player.loadVideoById({ videoId, startSeconds: videoStartTime });
      } else {
        player = new YT.Player("player", {
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            start: videoStartTime
          },
          events: {
            onReady: e => e.target.setVolume(100),
            onStateChange: event => {
              if (event.data === YT.PlayerState.ENDED) {
                const nextIndex = (selectedIndex + 1) % videoIds.length;
                player.loadVideoById({ videoId: videoIds[nextIndex], startSeconds: 0 });
              }
            }
          }
        });
      }
    }

    function ISO8601toSeconds(duration) {
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
  </script>

  <script src="https://www.youtube.com/iframe_api"></script>
</body>
</html>
