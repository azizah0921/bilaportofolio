// =============================
// FRUIT NINJA – GAME
// =============================
const app = document.getElementById("app");

let score = 0;
let fruits = [];
let slashLines = [];
let gameRunning = true;

function startFruitNinja() {
  app.innerHTML = `
    <h2>🍉 Fruit Ninja 🍌</h2>
    <p>Score: <b id="score">${score}</b></p>

    <canvas id="gameCanvas" width="400" height="500"
      style="background:white; border-radius:15px; box-shadow:0 0 15px rgba(0,0,0,0.2);">
    </canvas>

    <button onclick="restart()" class="restartBtn">Restart 🔁</button>
  `;

  setup();
}

function setup() {
  const cvs = document.getElementById("gameCanvas");
  const ctx = cvs.getContext("2d");

  cvs.onmousemove = (e) => {
    slashLines.push({ x: e.offsetX, y: e.offsetY, time: Date.now() });
  };

  spawnFruits();
  setInterval(spawnFruits, 1200);

  loop();

  function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    drawSlashes(ctx);
    updateFruits(ctx);

    requestAnimationFrame(loop);
  }
}

function spawnFruits() {
  if (!gameRunning) return;

  const isBomb = Math.random() < 0.15;

  fruits.push({
    x: Math.random() * 350 + 25,
    y: 520,
    size: 65,
    type: isBomb ? "bomb" : "fruit",
    symbol: isBomb ? "💣" : randomFruit(),
    speedY: Math.random() * -7 - 6,
    gravity: 0.25,
  });
}

function randomFruit() {
  const arr = ["🍉", "🍎", "🍌", "🍓", "🍊"];
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawSlashes(ctx) {
  slashLines = slashLines.filter((l) => Date.now() - l.time < 200);

  ctx.strokeStyle = "rgba(255,0,0,0.7)";
  ctx.lineWidth = 7;
  ctx.beginPath();

  slashLines.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });

  ctx.stroke();
}

function updateFruits(ctx) {
  fruits.forEach((fruit, index) => {
    ctx.font = fruit.size + "px serif";
    ctx.fillText(fruit.symbol, fruit.x, fruit.y);

    fruit.y += fruit.speedY;
    fruit.speedY += fruit.gravity;

    // check swipe hit
    slashLines.forEach((line) => {
      if (
        line.x > fruit.x - 45 &&
        line.x < fruit.x + 45 &&
        line.y > fruit.y - 45 &&
        line.y < fruit.y + 45
      ) {
        if (fruit.type === "bomb") {
          gameOver();
        } else {
          score += 10;
          document.getElementById("score").innerText = score;
        }
        fruits.splice(index, 1);
      }
    });

    // jika jatuh hilang
    if (fruit.y > 600) fruits.splice(index, 1);
  });
}

function gameOver() {
  gameRunning = false;
  app.innerHTML += `
      <h2 style="color:red; margin-top:10px;">💥 KABOOOM!! 💥</h2>
      <h3>GAME OVER 😭</h3>
  `;
}

function restart() {
  score = 0;
  fruits = [];
  slashLines = [];
  gameRunning = true;
  startFruitNinja();
}

startFruitNinja();
