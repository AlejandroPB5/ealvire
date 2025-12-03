const words = [
    "Casa", "Perro", "Gato", "Árbol", "Flor",
    "Sol", "Luna", "Mar", "Río", "Montaña",
    "Libro", "Lápiz", "Silla", "Mesa", "Coche",
    "Tren", "Avión", "Barco", "Reloj", "Pelota"
];

// Duplicate words for both boards or use same set? Usually same set but shuffled or same order?
// In "Who is Who", both players have the same characters.
// Let's use the same set of words for both boards.

function initGame() {
    const redBoard = document.getElementById('redBoard');
    const blueBoard = document.getElementById('blueBoard');

    renderBoard(redBoard, words, 'red');
    renderBoard(blueBoard, words, 'blue');

    document.getElementById('resetBtn').addEventListener('click', resetGame);
}

function renderBoard(boardElement, wordsList, color) {
    boardElement.innerHTML = '';
    wordsList.forEach(word => {
        const card = document.createElement('div');
        card.className = 'card';

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = word;

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        // Handle both click and touch events
        const handleInteraction = (e) => {
            // Prevent default behavior for touch events to avoid double-firing (ghost clicks)
            // and to ensure immediate response on digital whiteboards
            if (e.type === 'touchstart') {
                e.preventDefault();
            }
            card.classList.toggle('flipped');
        };

        card.addEventListener('click', handleInteraction);
        card.addEventListener('touchstart', handleInteraction, { passive: false });

        boardElement.appendChild(card);
    });
}

function resetGame() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped');
    });
}

document.addEventListener('DOMContentLoaded', initGame);
