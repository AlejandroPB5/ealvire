const wordsContainer = document.getElementById('wordsContainer');
const categories = document.querySelectorAll('.category');
const resetBtn = document.getElementById('resetBtn');
const changeBtn = document.getElementById('changeBtn');

let draggedWord = null;
let touchClone = null;

// Banco de palabras
const wordBank = {
  sustantivo: [
    'niño', 'casa', 'flor', 'perro', 'libro', 'montaña',
    'ciudad', 'escuela', 'río', 'árbol', 'ordenador', 'mar',
    'sol', 'mesa', 'pelota', 'ratón', 'amigo', 'camino'
  ],
  adjetivo: [
    'bonito', 'rápido', 'feliz', 'alto', 'frío', 'dulce',
    'valiente', 'pequeño', 'inteligente', 'amable', 'nuevo', 'viejo',
    'tranquilo', 'ruidoso', 'simpático', 'divertido', 'brillante', 'fuerte'
  ],
  verbo: [
    'correr', 'saltar', 'leer', 'comer', 'dormir', 'escribir',
    'pintar', 'nadar', 'hablar', 'caminar', 'bailar', 'viajar',
    'escuchar', 'reír', 'jugar', 'enseñar', 'aprender', 'dibujar'
  ],
  determinante: [
    'el', 'la', 'los', 'las', 'un', 'una',
    'este', 'aquellos', 'tu', 'vuestro',
    'muchas', 'algunos', 'siete', 'quinto', 'ocho', 'sexto'
  ]
};

// --- Función para generar 2 palabras aleatorias por tipo ---
function getRandomWords() {
  const words = [];
  for (const [type, list] of Object.entries(wordBank)) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    words.push({ text: shuffled[0], type });
    words.push({ text: shuffled[1], type });
  }
  return words;
}

// --- Renderizar palabras ---
function renderWords() {
  wordsContainer.innerHTML = '';
  const selectedWords = getRandomWords();

  selectedWords.forEach(w => {
    const el = document.createElement('div');
    el.classList.add('word');
    el.textContent = w.text;
    el.dataset.type = w.type;
    el.draggable = true;

    // RATÓN
    el.addEventListener('dragstart', () => {
      draggedWord = el;
      setTimeout(() => el.style.display = 'none', 0);
    });
    el.addEventListener('dragend', () => {
      setTimeout(() => {
        el.style.display = 'inline-block';
        draggedWord = null;
      }, 0);
    });

    // TÁCTIL
    el.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      draggedWord = el;

      // Crear clon flotante
      touchClone = el.cloneNode(true);
      touchClone.style.position = 'fixed';
      touchClone.style.pointerEvents = 'none';
      touchClone.style.opacity = '0.9';
      touchClone.style.background = '#fff';
      touchClone.style.border = '2px solid #000';
      touchClone.style.borderRadius = '10px';
      touchClone.style.padding = '5px 10px';
      touchClone.style.fontSize = '1.2em';
      touchClone.style.zIndex = '9999';
      document.body.appendChild(touchClone);

      moveClone(touch);
    }, { passive: true });

    el.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.touches[0];
      moveClone(touch);
    }, { passive: false });

    el.addEventListener('touchend', e => {
      if (touchClone) {
        touchClone.remove();
        touchClone = null;
      }

      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const category = dropTarget?.closest('.category');

      if (category) {
        removeFeedbackGif(category);
        if (draggedWord.dataset.type === category.dataset.type) {
          category.classList.add('correct');
          draggedWord.setAttribute('draggable', 'false');
          draggedWord.classList.add('placed');
          category.appendChild(draggedWord);
          showFeedbackGif(category, 'correct');
        } else {
          category.classList.add('incorrect');
          showFeedbackGif(category, 'incorrect');
          setTimeout(() => category.classList.remove('incorrect'), 800);
        }
      }

      draggedWord = null;
    });

    wordsContainer.appendChild(el);
  });

  activateDropZones();
}

// --- Mueve el clon táctil ---
function moveClone(touch) {
  if (!touchClone) return;
  const x = touch.clientX - touchClone.offsetWidth / 2;
  const y = touch.clientY - touchClone.offsetHeight / 2;
  touchClone.style.left = `${x}px`;
  touchClone.style.top = `${y}px`;
}

// --- Drop zones (ratón) ---
function activateDropZones() {
  categories.forEach(category => {
    category.addEventListener('dragover', e => e.preventDefault());
    category.addEventListener('dragenter', e => {
      e.preventDefault();
      category.classList.add('hovered');
    });
    category.addEventListener('dragleave', () => {
      category.classList.remove('hovered');
    });
    category.addEventListener('drop', () => {
      category.classList.remove('hovered');
      removeFeedbackGif(category);

      if (draggedWord && draggedWord.dataset.type === category.dataset.type) {
        category.classList.add('correct');
        draggedWord.setAttribute('draggable', 'false');
        draggedWord.classList.add('placed');
        category.appendChild(draggedWord);
        showFeedbackGif(category, 'correct');
      } else {
        category.classList.add('incorrect');
        showFeedbackGif(category, 'incorrect');
        setTimeout(() => category.classList.remove('incorrect'), 800);
      }
    });
  });
}

// --- Mostrar feedback (GIF) ---
function showFeedbackGif(category, result) {
  const gif = document.createElement('img');
  gif.classList.add('feedback-gif');
  gif.src = result === 'correct'
    ? '../../assets/img/yes.gif'
    : '../../assets/img/nop.gif';

  const existingGif = category.querySelector('.feedback-gif');
  if (existingGif) existingGif.remove();

  category.appendChild(gif);
  category.classList.add('show-gif');

  setTimeout(() => {
    gif.remove();
    category.classList.remove('show-gif');
  }, 3000);
}

// --- Quitar GIF previo ---
function removeFeedbackGif(category) {
  const oldGif = category.querySelector('.feedback-gif');
  if (oldGif) oldGif.remove();
}

// --- Botones ---
resetBtn.addEventListener('click', () => {
  const words = document.querySelectorAll('.word');
  categories.forEach(c => c.classList.remove('correct', 'incorrect'));
  words.forEach(w => {
    w.classList.remove('placed');
    w.setAttribute('draggable', 'true');
    wordsContainer.appendChild(w);
  });
});

changeBtn.addEventListener('click', () => {
  categories.forEach(c => c.classList.remove('correct', 'incorrect'));
  renderWords();
});

// --- Inicializar ---
renderWords();
