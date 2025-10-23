const figuresContainer = document.getElementById('figuresContainer');
const categories = document.querySelectorAll('.category');
const resetBtn = document.getElementById('resetBtn');
const newSetBtn = document.getElementById('newSetBtn');

let draggedFigure = null;
let touchClone = null;

// Banco de figuras
const figureBank = {
  triangulo: ['triangulo1.png', 'triangulo2.png', 'triangulo3.png', 'triangulo4.png'],
  cuadrado: ['cuadrado1.png', 'cuadrado2.png', 'cuadrado3.png', 'cuadrado4.png'],
  circulo: ['circulo1.png', 'circulo2.png', 'circulo3.png', 'circulo4.png'],
  rectangulo: ['rectangulo1.png', 'rectangulo2.png', 'rectangulo3.png', 'rectangulo4.png']
};

function getRandomFigures() {
  const figs = [];
  for (const [type, list] of Object.entries(figureBank)) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    figs.push({ src: shuffled[0], type });
    figs.push({ src: shuffled[1], type });
  }
  return figs;
}

function renderFigures() {
  figuresContainer.innerHTML = '';
  const selected = getRandomFigures();

  selected.forEach(f => {
    const el = document.createElement('div');
    el.classList.add('figure');
    el.dataset.type = f.type;

    const img = document.createElement('img');
    img.src = `../../assets/img/figuras/${f.src}`;
    img.alt = f.type;
    el.appendChild(img);

    // Ratón
    el.addEventListener('dragstart', () => {
      draggedFigure = el;
      setTimeout(() => el.style.opacity = '0.5', 0);
    });
    el.addEventListener('dragend', () => {
      draggedFigure = null;
      el.style.opacity = '1';
    });

    // Táctil
    el.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      draggedFigure = el;

      touchClone = el.cloneNode(true);
      touchClone.style.position = 'fixed';
      touchClone.style.pointerEvents = 'none';
      touchClone.style.opacity = '0.9';
      touchClone.style.zIndex = '9999';
      touchClone.style.width = '100px';
      document.body.appendChild(touchClone);
      moveClone(touch);
    });

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
        if (draggedFigure.dataset.type === category.dataset.type) {
          category.classList.add('correct');
          draggedFigure.setAttribute('draggable', 'false');
          category.appendChild(draggedFigure);
        } else {
          category.classList.add('incorrect');
          setTimeout(() => category.classList.remove('incorrect'), 1000);
        }
      }

      draggedFigure = null;
    });

    figuresContainer.appendChild(el);
  });
  activateDropZones();
}

function moveClone(touch) {
  if (!touchClone) return;
  const x = touch.clientX - touchClone.offsetWidth / 2;
  const y = touch.clientY - touchClone.offsetHeight / 2;
  touchClone.style.left = `${x}px`;
  touchClone.style.top = `${y}px`;
}

function activateDropZones() {
  categories.forEach(category => {
    category.addEventListener('dragover', e => e.preventDefault());
    category.addEventListener('drop', () => {
      if (draggedFigure && draggedFigure.dataset.type === category.dataset.type) {
        category.classList.add('correct');
        category.appendChild(draggedFigure);
      } else {
        category.classList.add('incorrect');
        setTimeout(() => category.classList.remove('incorrect'), 1000);
      }
    });
  });
}

resetBtn.addEventListener('click', renderFigures);
newSetBtn.addEventListener('click', renderFigures);

renderFigures();
