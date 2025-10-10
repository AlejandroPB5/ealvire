const numbers = [
    "XXI", "XL", "LI", "DL", "DXXXIV",
    "XIV", "CXIII", "M", "CCI", "CCXXVII",
    "IX", "XLIX", "XC", "D", "VI", "LX", "LXX",
    "CDXXXV","MMDCCII","CCIV","MDCCCLXI","MMMLXXIV",
    "XXXIV","XVIII","XLIX"
];

const card = document.getElementById('bingo-card');
const drawBtn = document.getElementById('draw-btn');
const calledDisplay = document.getElementById('called-number');
const ball = document.getElementById('ball');
let remaining = [...numbers];

// Al inicio la cuadrícula está vacía
// Cada número nuevo se agregará dinámicamente

drawBtn.addEventListener('click', () => {
  if (remaining.length === 0) {
    calledDisplay.textContent = "¡Todos los números han salido!";
    ball.textContent = "✔";
    ball.classList.add("show");
    return;
  }

  const randomIndex = Math.floor(Math.random() * remaining.length);
  const chosen = remaining.splice(randomIndex, 1)[0];

  calledDisplay.textContent = "Número llamado: " + chosen;

  // Crear una nueva celda para este número
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.textContent = chosen;
  card.appendChild(cell);

  // Forzar reflujo para que la animación funcione
  void cell.offsetWidth;
  cell.classList.add('show');

  // Animar la bola
  ball.classList.remove("show");
  setTimeout(() => {
    ball.textContent = chosen;
    ball.classList.add("show");
  }, 100);
});

  const bingoBtn = document.getElementById('bingo-btn');
  const bingoOverlay = document.getElementById('bingo-overlay');

  bingoBtn.addEventListener('click', () => {
    bingoOverlay.style.display = 'flex';
  });

  // Cerrar overlay al hacer clic en él
  bingoOverlay.addEventListener('click', () => {
    bingoOverlay.style.display = 'none';
  });
