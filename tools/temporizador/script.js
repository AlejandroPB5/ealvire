let totalTime = 0;
let timeLeft = 0;
let timerInterval = null;
let confettiInterval = null; // <-- Para controlar el confeti

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const circleProgress = document.querySelector('.circle-progress');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60).toString().padStart(2,'0');
    let seconds = (timeLeft % 60).toString().padStart(2,'0');
    timerDisplay.textContent = `${minutes}:${seconds}`;

    // Calcular progreso: de 0 a totalTime
    const progress = ((totalTime - timeLeft) / totalTime) * 565.48;
    circleProgress.style.strokeDashoffset = 565.48 - progress;

    // Cambiar color según tiempo restante
    // Inicialmente verde y solo cambiar después de ciertos umbrales
    if (timeLeft <= totalTime * 0.25) {
        circleProgress.style.stroke = "#ff4d4d"; // rojo
    } else if (timeLeft <= totalTime * 0.5) {
        circleProgress.style.stroke = "#ffd166"; // amarillo
    } else {
        circleProgress.style.stroke = "#06d6a0"; // verde
    }
}


function startTimer() {
    // Limpiar confeti anterior
    clearInterval(confettiInterval);
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    if (timerInterval === null) {
        let minutes = parseInt(minutesInput.value) || 0;
        let seconds = parseInt(secondsInput.value) || 0;

        if (minutes < 0 || seconds < 0 || seconds > 59) {
            alert("Ingresa un tiempo válido.");
            return;
        }

        totalTime = minutes * 60 + seconds;
        if (totalTime <= 0) {
            alert("El tiempo debe ser mayor a 0.");
            return;
        }
        timeLeft = totalTime;
    }

    if (timerInterval) return;

    timerDisplay.classList.add('ticking');

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerDisplay.classList.remove('ticking');
            launchConfetti();
        }
    }, 1000);

    updateTimerDisplay();
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    totalTime = 0;
    timeLeft = 0;
    updateTimerDisplay();
    timerDisplay.classList.remove('ticking');
    minutesInput.value = '';
    secondsInput.value = '';

    // Limpiar confeti también al reiniciar
    clearInterval(confettiInterval);
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// ---------- CONFETTI ----------
function launchConfetti() {
    let confettis = [];
    for (let i = 0; i < 100; i++) {
        confettis.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 40 + 10,
            color: `hsl(${Math.random()*360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10
        });
    }

    confettiInterval = setInterval(() => {
        ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
        for (let i = 0; i < confettis.length; i++) {
            let c = confettis[i];
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.moveTo(c.x + c.tilt, c.y);
            ctx.lineTo(c.x + c.tilt + c.r/2, c.y + c.r);
            ctx.lineTo(c.x + c.tilt - c.r/2, c.y + c.r);
            ctx.closePath();
            ctx.fill();
            c.y += 2;
            if (c.y > confettiCanvas.height) {
                c.y = -c.r;
            }
        }
    }, 20);

    setTimeout(() => clearInterval(confettiInterval), 5000);
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
updateTimerDisplay();
