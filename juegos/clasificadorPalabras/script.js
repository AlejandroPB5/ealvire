const wordsContainer = document.getElementById('wordsContainer');
const categories = document.querySelectorAll('.category');
const resetBtn = document.getElementById('resetBtn');
const changeBtn = document.getElementById('changeBtn');

let draggedWord = null;

// Banco de palabras
const wordBank = {
  sustantivo: ['niño', 'casa', 'flor', 'perro', 'libro', 'montaña'],
  adjetivo: ['bonito', 'rápido', 'feliz', 'alto', 'frío', 'dulce'],
  verbo: ['correr', 'saltar', 'leer', 'comer', 'dormir', 'escribir'],
  determinante: ['el', 'la', 'los', 'las', 'un', 'una','este','aquellos','tu','vuestro','muchas','algunos','siete','quinto','ocho','sexto']
};

// Función para generar 2 palabras al azar por tipo
function getRandomWords() {
  const words = [];
  for (const [type, list] of Object.entries(wordBank)) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    words.push({ text: shuffled[0], type });
    words.push({ text: shuffled[1], type });
  }
  return words;
}

// Renderizar palabras en pantalla
function renderWords() {
  wordsContainer.innerHTML = '';
  const selectedWords = getRandomWords();
  selectedWords.forEach(w => {
    const el = document.createElement('div');
    el.classList.add('word');
    el.textContent = w.text;
    el.dataset.type = w.type;
    el.draggable = true;

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

    wordsContainer.appendChild(el);
  });
  activateDropZones();
}

// Activar áreas de drop
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

// Mostrar GIF según el resultado
function showFeedbackGif(category, result) {
  const gif = document.createElement('img');
  gif.classList.add('feedback-gif');
  gif.src = result === 'correct'
    ? '../../assets/img/yes.gif'   // ✅ correcto
    : '../../assets/img/nop.gif';  // ❌ incorrecto

  // Si ya hay un GIF previo, elimínalo
  const existingGif = category.querySelector('.feedback-gif');
  if (existingGif) existingGif.remove();

  category.appendChild(gif);
  category.classList.add('show-gif');

  // Duración de la animación (3 segundos)
  setTimeout(() => {
    gif.remove();
    category.classList.remove('show-gif');
  }, 3000);
}



// Quitar cualquier gif previo
function removeFeedbackGif(category) {
  const oldGif = category.querySelector('.feedback-gif');
  if (oldGif) oldGif.remove();
}

// Botón Reiniciar
resetBtn.addEventListener('click', () => {
    const words = document.querySelectorAll('.word');
    categories.forEach(c => c.classList.remove('correct', 'incorrect'));
    words.forEach(w => {
        w.classList.remove('placed');
        w.setAttribute('draggable', 'true');
        wordsContainer.appendChild(w);
    });
});

// Botón Cambiar palabras
changeBtn.addEventListener('click', () => {
    categories.forEach(c => c.classList.remove('correct', 'incorrect'));
    const words = document.querySelectorAll('.word');
    categories.forEach(c => c.classList.remove('correct', 'incorrect'));

    words.forEach(w => {
        w.classList.remove('placed');
        w.setAttribute('draggable', 'true');
        wordsContainer.appendChild(w);
    });
    renderWords();
});

// Cargar juego inicial
renderWords();
