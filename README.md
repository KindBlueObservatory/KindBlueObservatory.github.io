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
      transition
