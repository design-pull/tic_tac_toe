const boardEl = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let scores = { X: 0, O: 0, Draw: 0 };
let confettiActive = false;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      cells[a].classList.add('winner');
      cells[b].classList.add('winner');
      cells[c].classList.add('winner');
      return board[a];
    }
  }
  if (board.every(cell => cell)) return 'Draw';
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!board[index]) {
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    const winner = checkWinner();
    if (winner) {
      if (winner === 'Draw') {
        scores.Draw++;
        scoreDrawEl.textContent = scores.Draw;
        statusEl.textContent = "引き分けです！";
      } else {
        scores[winner]++;
        scoreXEl.textContent = scores.X;
        scoreOEl.textContent = scores.O;
        statusEl.textContent = `${winner} の勝ちです！`;
        launchConfetti();
      }
      boardEl.style.pointerEvents = 'none';
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusEl.textContent = `プレイヤー ${currentPlayer} の番です`;
    }
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));

document.getElementById('newRound').addEventListener('click', () => {
  board = Array(9).fill(null);
  cells.forEach(c => {
    c.textContent = '';
    c.classList.remove('winner');
  });
  boardEl.style.pointerEvents = 'auto';
  currentPlayer = 'X';
  statusEl.textContent = `プレイヤー ${currentPlayer} の番です`;
  stopConfetti();
});

document.getElementById('resetScores').addEventListener('click', () => {
  scores = { X: 0, O: 0, Draw: 0 };
  scoreXEl.textContent = 0;
  scoreOEl.textContent = 0;
  scoreDrawEl.textContent = 0;
});

// コンフェッティ演出
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 3 + 2,
      color: Math.random() > 0.5 ? varAccent() : varAccent2(),
    });
  }
  confettiActive = true;
  requestAnimationFrame(updateConfetti);
}

function stopConfetti() {
  confettiActive = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = [];
}

function varAccent() { return '#8A2BE2'; }
function varAccent2() { return '#8A2BE2'; }

function updateConfetti() {
  if (!confettiActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.y += p.speed;
    if (p.y > canvas.height) p.y = -10;
  }
  if (particles.length > 0) requestAnimationFrame(updateConfetti);
}
