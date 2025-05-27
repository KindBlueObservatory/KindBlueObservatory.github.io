# Warm Wonder Wander
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kind Blue Observatory Presents: CABLE</title>
  <link rel="stylesheet" href="style.css" />
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
      background: #333;
      border: 8px solid #222;
      width: 800px;
      height: 480px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
    }

    #screen {
      background: black;
      width: 100%;
      height: 100%;
      position: relative;
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
      background: #ddd;
      border: none;
      cursor: pointer;
      box-shadow: 0 0 10px #fff3;
    }

    #controls {
      position: absolute;
      bottom: 10px;
      left: 10px;
      display: flex;
      gap: 10px;
      z-index: 3;
    }

    .channel-button {
      background: silver;
      border: 2px solid #444;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
    }

    #nameplate {
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: #aaa;
      font-weight: bold;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>
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

  <script src="https://www.youtube.com/iframe_api"></script>
  <script src="script.js"></script>
</body>
</html>
