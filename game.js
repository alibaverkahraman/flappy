const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let frames = 0;
const gravity = 0.25;
const jump = 4.6;
let score = 0;

const bird = {
  x: 50,
  y: 150,
  w: 20,
  h: 20,
  vel: 0,
  update() {
    this.vel += gravity;
    this.y += this.vel;
  },
  draw() {
    ctx.fillStyle = '#ff0';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  flap() {
    this.vel = -jump;
  },
  reset() {
    this.y = 150;
    this.vel = 0;
    score = 0;
    pipes.length = 0;
  }
};

const pipes = [];
function spawnPipe() {
  const gap = 100;
  const top = Math.random() * (canvas.height - gap - 40) + 20;
  pipes.push({
    x: canvas.width,
    top,
    bottom: top + gap,
    w: 50
  });
}

function updatePipes() {
  if (frames % 90 === 0) spawnPipe();
  for (let i = 0; i < pipes.length; i++) {
    const p = pipes[i];
    p.x -= 2;
    if (p.x + p.w < 0) {
      pipes.splice(i, 1);
      score++;
      i--;
      continue;
    }
    if (bird.x < p.x + p.w && bird.x + bird.w > p.x && (bird.y < p.top || bird.y + bird.h > p.bottom)) {
      state = 'gameover';
    }
  }
}

function drawPipes() {
  ctx.fillStyle = '#0f0';
  for (const p of pipes) {
    ctx.fillRect(p.x, 0, p.w, p.top);
    ctx.fillRect(p.x, p.bottom, p.w, canvas.height - p.bottom);
  }
}

let state = 'ready';

function update() {
  frames++;
  if (state === 'play') {
    bird.update();
    updatePipes();
    if (bird.y + bird.h >= canvas.height || bird.y <= 0) {
      state = 'gameover';
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  bird.draw();
  ctx.fillStyle = '#000';
  ctx.font = '20px sans-serif';
  ctx.fillText(score, 10, 25);
  if (state === 'ready') {
    ctx.fillText('Press Space to Start', 40, canvas.height / 2);
  }
  if (state === 'gameover') {
    ctx.fillText('Game Over - Space to Restart', 10, canvas.height / 2);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    if (state === 'ready') {
      state = 'play';
      bird.flap();
    } else if (state === 'play') {
      bird.flap();
    } else if (state === 'gameover') {
      bird.reset();
      state = 'ready';
    }
  }
});

loop();

