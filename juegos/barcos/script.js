/* ----------------- CONFIG ----------------- */
const BOARD_SIZE = 10;
const CELL = 32;
const SHIPS = [
  { size: 4, name: "Portaaviones" },
  { size: 3, name: "Acorazado" },
  { size: 3, name: "Submarino" },
  { size: 2, name: "Destructor" },
  { size: 2, name: "Fragata" },
  { size: 2, name: "Canoa" },
  { size: 1, name: "Lancha" },
  { size: 1, name: "Bote" }
];
const LETTERS = "ABCDEFGHIJ";

/* ----------------- ELEMENTOS DOM ----------------- */
const playerBoard = document.getElementById("player-board");
const enemyBoard = document.getElementById("enemy-board");
const shipPool = document.getElementById("ship-pool") || null;
const rotateButton = document.getElementById("rotate-btn");
const confirmButton = document.getElementById("confirm-btn");

/* ----------------- ESTADO ----------------- */
let playerGrid = createEmptyGrid();
let shipElements = [];
let shipCounter = 0;
let selectedShipId = null;
let draggingEl = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let originalParent = null;
let draggingPlacedShip = null;
let dragStartX = 0;
let dragStartY = 0;
let positionsConfirmed = false; // nuevo flag para bloquear barcos

/* ----------------- CREAR GRILLAS ----------------- */
function createEmptyGrid() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function createBoardHTML(boardEl, clickHandler) {
  boardEl.innerHTML = "";
  boardEl.style.position = "relative";
  boardEl.style.width = `${BOARD_SIZE * CELL + CELL}px`;
  boardEl.style.height = `${BOARD_SIZE * CELL + CELL}px`;

  // Números arriba
  for (let c = 0; c < BOARD_SIZE; c++) {
    const num = document.createElement("div");
    num.textContent = c + 1;
    num.style.position = "absolute";
    num.style.left = `${c * CELL + CELL}px`;
    num.style.top = `0px`;
    num.style.width = `${CELL}px`;
    num.style.height = `${CELL}px`;
    num.style.display = "flex";
    num.style.justifyContent = "center";
    num.style.alignItems = "center";
    num.style.fontWeight = "bold";
    boardEl.appendChild(num);
  }

  // Letras izquierda
  for (let r = 0; r < BOARD_SIZE; r++) {
    const letter = document.createElement("div");
    letter.textContent = LETTERS[r];
    letter.style.position = "absolute";
    letter.style.left = `0px`;
    letter.style.top = `${r * CELL + CELL}px`;
    letter.style.width = `${CELL}px`;
    letter.style.height = `${CELL}px`;
    letter.style.display = "flex";
    letter.style.justifyContent = "center";
    letter.style.alignItems = "center";
    letter.style.fontWeight = "bold";
    boardEl.appendChild(letter);
  }

  // Celdas
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.style.width = `${CELL}px`;
      cell.style.height = `${CELL}px`;
      cell.style.position = "absolute";
      cell.style.left = `${c * CELL + CELL}px`;
      cell.style.top = `${r * CELL + CELL}px`;
      cell.style.border = "1px solid rgba(0,0,0,0.06)";
      cell.style.background = "rgba(255,255,255,0.02)";
      if (clickHandler) cell.addEventListener("click", clickHandler);
      boardEl.appendChild(cell);
    }
  }
}

createBoardHTML(playerBoard);
createBoardHTML(enemyBoard, onEnemyClick);

/* ----------------- CREAR POOL DE BARCOS ----------------- */
function createPlayerShipsInPool() {
  if (shipPool) shipPool.innerHTML = "";
  SHIPS.forEach(ship => {
    const div = document.createElement("div");
    div.className = "ship-pool-item";
    div.dataset.size = ship.size;
    div.dataset.name = ship.name;
    div.dataset.vertical = "0";
    div.dataset.id = `ship-${shipCounter++}`;
    div.style.width = `${ship.size * CELL}px`;
    div.style.height = `${CELL}px`;
    div.style.margin = "8px";
    div.style.cursor = "grab";
    div.style.borderRadius = "6px";
    div.style.background = "#0a284dff";
    div.style.userSelect = "none";
    div.innerHTML = `<i class="fa-solid fa-ship"></i>`; // sin nombre visible
    div.title = ship.name;

    div.addEventListener("mousedown", onShipMouseDown);
    div.addEventListener("dblclick", rotateShipByElement);
    div.addEventListener("touchstart", onShipTouchStart, { passive: false });

    shipElements.push(div);
    if (shipPool) shipPool.appendChild(div);
    else document.body.appendChild(div);
  });
}
createPlayerShipsInPool();

/* ----------------- DRAG & DROP DEL POOL ----------------- */
function bringToTop(el) { el.style.zIndex = 9999; }
function resetZ(el) { el.style.zIndex = ""; }

function onShipMouseDown(e) {
  if (positionsConfirmed) return; // bloqueado tras confirmar
  e.preventDefault();
  startDrag(e.currentTarget, e.clientX, e.clientY);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}
function onMouseMove(e) { if (draggingEl) moveDrag(e.clientX, e.clientY); }
function onMouseUp(e) { if (draggingEl) { endDrag(e.clientX, e.clientY); document.removeEventListener("mousemove", onMouseMove); document.removeEventListener("mouseup", onMouseUp); } }

function onShipTouchStart(e) {
  if (positionsConfirmed) return; // bloqueado tras confirmar
  e.preventDefault();
  const touch = e.changedTouches[0];
  startDrag(e.currentTarget, touch.clientX, touch.clientY);
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd);
}
function onTouchMove(e) { e.preventDefault(); if (draggingEl) { const touch = e.changedTouches[0]; moveDrag(touch.clientX, touch.clientY); } }
function onTouchEnd(e) { if (draggingEl) { const touch = e.changedTouches[0]; endDrag(touch.clientX, touch.clientY); document.removeEventListener("touchmove", onTouchMove); document.removeEventListener("touchend", onTouchEnd); } }

function startDrag(el, clientX, clientY) {
  draggingEl = el;
  originalParent = el.parentElement;
  bringToTop(el);
  el.classList.add("dragging");
  const rect = el.getBoundingClientRect();
  dragOffsetX = clientX - rect.left;
  dragOffsetY = clientY - rect.top;
  el.style.position = "fixed";
  el.style.left = `${rect.left}px`;
  el.style.top = `${rect.top}px`;
  document.body.appendChild(el);
}
function moveDrag(clientX, clientY) {
  draggingEl.style.left = `${clientX - dragOffsetX}px`;
  draggingEl.style.top = `${clientY - dragOffsetY}px`;
}
function endDrag(clientX, clientY) {
  tryPlaceOnBoard(draggingEl, clientX, clientY);
  resetAfterDrag();
}
function resetAfterDrag() {
  if (!draggingEl) return;
  draggingEl.classList.remove("dragging");
  resetZ(draggingEl);
  draggingEl.style.transform = "";
  draggingEl = null;
}

/* ----------------- ROTACIÓN ----------------- */
function rotateShipByElement(e) {
  const el = e.target.closest ? e.target.closest(".ship-pool-item") || e.target : e.target;
  if (!el || !el.dataset) return;
  const vertical = el.dataset.vertical === "1";
  el.dataset.vertical = vertical ? "0" : "1";
  if (el.dataset.vertical === "1") {
    el.style.width = `${CELL}px`;
    el.style.height = `${parseInt(el.dataset.size, 10) * CELL}px`;
  } else {
    el.style.width = `${parseInt(el.dataset.size, 10) * CELL}px`;
    el.style.height = `${CELL}px`;
  }
}

/* ----------------- COLOCAR BARCOS ----------------- */
function tryPlaceOnBoard(el, clientX, clientY) {
  const rect = playerBoard.getBoundingClientRect();
  const x = clientX - rect.left - CELL;
  const y = clientY - rect.top - CELL;
  const col = Math.floor(x / CELL);
  const row = Math.floor(y / CELL);
  const size = parseInt(el.dataset.size, 10);
  const vertical = el.dataset.vertical === "1";

  if (row < 0 || col < 0 || row >= BOARD_SIZE || col >= BOARD_SIZE || !canPlace(playerGrid, row, col, size, vertical)) {
    restoreToPool(el);
    return;
  }

  const shipId = el.dataset.id;
  for (let i = 0; i < size; i++) {
    const r = vertical ? row + i : row;
    const c = vertical ? col : col + i;
    playerGrid[r][c] = { name: el.dataset.name, id: shipId, vertical };
    const cell = playerBoard.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
    cell.classList.add("ship");
    cell.dataset.shipId = shipId;
    cell.style.background = "#0a284dff";
  }
  if (el.parentElement) el.remove();
}

function canPlace(grid, row, col, size, vertical) {
  if (row < 0 || col < 0) return false;
  if (vertical) {
    if (row + size > BOARD_SIZE) return false;
    for (let i = 0; i < size; i++) if (grid[row + i][col] !== null) return false;
  } else {
    if (col + size > BOARD_SIZE) return false;
    for (let i = 0; i < size; i++) if (grid[row][col + i] !== null) return false;
  }
  return true;
}

function restoreToPool(el) {
  resetZ(el);
  el.classList.remove("dragging");
  if (shipPool) { shipPool.appendChild(el); el.style.position = ""; el.style.left = ""; el.style.top = ""; }
  else { document.body.appendChild(el); el.style.position = ""; el.style.left = ""; el.style.top = ""; }
}

/* ----------------- SELECCIÓN, ROTACIÓN Y DRAG & DROP DE BARCOS COLOCADOS ----------------- */
playerBoard.addEventListener("click", e => {
  if (positionsConfirmed) return; // bloqueamos selección tras confirmar
  if (!e.target.classList.contains("cell") || !e.target.dataset.shipId) return;
  selectedShipId = e.target.dataset.shipId;
  Array.from(playerBoard.querySelectorAll(".cell")).forEach(c => c.style.outline = "");
  Array.from(playerBoard.querySelectorAll(`.cell[data-ship-id='${selectedShipId}']`)).forEach(c => c.style.outline = "2px solid orange");
});

function rotateShipById(shipId) {
  if (positionsConfirmed) return; // bloqueamos rotación tras confirmar
  const cells = Array.from(playerBoard.querySelectorAll(`.cell[data-ship-id='${shipId}']`));
  if (!cells.length) return;
  const firstCell = cells[0];
  const r = parseInt(firstCell.dataset.row, 10);
  const c = parseInt(firstCell.dataset.col, 10);
  const shipData = playerGrid[r][c];
  const size = SHIPS.find(s => s.name === shipData.name).size;
  const newVertical = !shipData.vertical;

  // limpiar
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    playerGrid[row][col] = null;
    cell.classList.remove("ship");
    cell.dataset.shipId = "";
    cell.style.background = "";
    cell.style.outline = "";
  });

  if (!canPlace(playerGrid, r, c, size, newVertical)) {
    cells.forEach(cell => {
      const row = parseInt(cell.dataset.row, 10);
      const col = parseInt(cell.dataset.col, 10);
      playerGrid[row][col] = { name: shipData.name, id: shipId, vertical: shipData.vertical };
      cell.classList.add("ship");
      cell.dataset.shipId = shipId;
      cell.style.background = "#0a284dff";
    });
    return;
  }

  for (let i = 0; i < size; i++) {
    const row = newVertical ? r + i : r;
    const col = newVertical ? c : c + i;
    playerGrid[row][col] = { name: shipData.name, id: shipId, vertical: newVertical };
    const cell = playerBoard.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add("ship");
    cell.dataset.shipId = shipId;
    cell.style.background = "#0a284dff";
  }
}

/* ----------------- BOTONES ----------------- */
rotateButton?.addEventListener("click", () => { if (selectedShipId) rotateShipById(selectedShipId); });

confirmButton?.addEventListener("click", () => {
  shipElements.forEach(el => {
    el.removeEventListener("mousedown", onShipMouseDown);
    el.removeEventListener("dblclick", rotateShipByElement);
  });
  positionsConfirmed = true; // bloqueamos todos los movimientos
  alert("Posiciones confirmadas. ¡A jugar!");
});

/* ----------------- TABLERO ENEMIGO ----------------- */
function onEnemyClick(e) {
  const cell = e.target;
  if (!cell.classList.contains("cell")) return;
  if (!cell.dataset.state || cell.dataset.state === "none") {
    cell.dataset.state = "water";
    cell.style.background = "#87cefa";
  } else if (cell.dataset.state === "water") {
    cell.dataset.state = "hit";
    cell.style.background = "#ff4c4c";
  } else if (cell.dataset.state === "hit") {
    cell.dataset.state = "none";
    cell.style.background = "";
  }
}

/* ----------------- CLICK AGUA/TOCADO TABLERO JUGADOR ----------------- */
playerBoard.addEventListener("click", e => {
  if (!positionsConfirmed) return; // solo tras confirmar
  const cell = e.target;
  if (!cell.classList.contains("cell")) return;

  if (!cell.dataset.state || cell.dataset.state === "none") {
    cell.dataset.state = "water";
    cell.style.background = "#87cefa";
  } else if (cell.dataset.state === "water") {
    cell.dataset.state = "hit";
    cell.style.background = "#ff4c4c";
  } else if (cell.dataset.state === "hit") {
    cell.dataset.state = "none";
    const shipId = cell.dataset.shipId;
    if (shipId) {
      cell.style.background = "#b3e5ff";
    } else {
      cell.style.background = "";
    }
  }
});

/* ----------------- DRAG & DROP DE BARCOS COLOCADOS ----------------- */
playerBoard.addEventListener("mousedown", e => {
  if (positionsConfirmed) return; // bloqueamos drag
  const cell = e.target;
  if (!cell.classList.contains("cell") || !cell.dataset.shipId) return;
  selectedShipId = cell.dataset.shipId;
  startDragPlacedShip(selectedShipId, e.clientX, e.clientY);
  document.addEventListener("mousemove", onMouseMovePlaced);
  document.addEventListener("mouseup", onMouseUpPlaced);
});
playerBoard.addEventListener("touchstart", e => {
  if (positionsConfirmed) return; // bloqueamos drag
  const touch = e.changedTouches[0];
  const cell = e.target;
  if (!cell.classList.contains("cell") || !cell.dataset.shipId) return;
  selectedShipId = cell.dataset.shipId;
  startDragPlacedShip(selectedShipId, touch.clientX, touch.clientY);
  document.addEventListener("touchmove", onTouchMovePlaced, { passive: false });
  document.addEventListener("touchend", onTouchEndPlaced);
});

function startDragPlacedShip(shipId, clientX, clientY) {
  draggingPlacedShip = shipId;
  dragStartX = clientX;
  dragStartY = clientY;
  Array.from(playerBoard.querySelectorAll(".cell")).forEach(c => c.style.outline = "");
  Array.from(playerBoard.querySelectorAll(`.cell[data-ship-id='${shipId}']`)).forEach(c => c.style.outline = "2px dashed orange");
}
function movePlacedShip(clientX, clientY) {
  if (!draggingPlacedShip) return;
  const dx = clientX - dragStartX;
  const dy = clientY - dragStartY;
  Array.from(playerBoard.querySelectorAll(`.cell[data-ship-id='${draggingPlacedShip}']`)).forEach(c => c.style.transform = `translate(${dx}px, ${dy}px)`);
}
function endPlacedShipDrag(clientX, clientY) {
  if (!draggingPlacedShip) return;
  const dxCells = Math.round((clientX - dragStartX) / CELL);
  const dyCells = Math.round((clientY - dragStartY) / CELL);
  const cells = Array.from(playerBoard.querySelectorAll(`.cell[data-ship-id='${draggingPlacedShip}']`));
  if (!cells.length) { draggingPlacedShip = null; return; }
  const firstCell = cells[0];
  const r0 = parseInt(firstCell.dataset.row, 10);
  const c0 = parseInt(firstCell.dataset.col, 10);
  const shipData = playerGrid[r0][c0];
  const size = SHIPS.find(s => s.name === shipData.name).size;
  const vertical = shipData.vertical;

  // limpiar original
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    playerGrid[row][col] = null;
    cell.classList.remove("ship");
    cell.dataset.shipId = "";
    cell.style.background = "";
    cell.style.transform = "";
    cell.style.outline = "";
  });

  const newR = r0 + dyCells;
  const newC = c0 + dxCells;

  if (!canPlace(playerGrid, newR, newC, size, vertical)) {
    // restaurar original
    for (let i = 0; i < size; i++) {
      const row = vertical ? r0 + i : r0;
      const col = vertical ? c0 : c0 + i;
      playerGrid[row][col] = { name: shipData.name, id: draggingPlacedShip, vertical };
      const cell = playerBoard.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.classList.add("ship");
      cell.dataset.shipId = draggingPlacedShip;
      cell.style.background = "#0a284dff";
    }
  } else {
    // colocar en nueva posición
    for (let i = 0; i < size; i++) {
      const row = vertical ? newR + i : newR;
      const col = vertical ? newC : newC + i;
      playerGrid[row][col] = { name: shipData.name, id: draggingPlacedShip, vertical };
      const cell = playerBoard.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.classList.add("ship");
      cell.dataset.shipId = draggingPlacedShip;
      cell.style.background = "#0a284dff";
    }
  }

  draggingPlacedShip = null;
  document.removeEventListener("mousemove", onMouseMovePlaced);
  document.removeEventListener("mouseup", onMouseUpPlaced);
  document.removeEventListener("touchmove", onTouchMovePlaced);
  document.removeEventListener("touchend", onTouchEndPlaced);
}
function onMouseMovePlaced(e) { movePlacedShip(e.clientX, e.clientY); }
function onTouchMovePlaced(e) { e.preventDefault(); const touch = e.changedTouches[0]; movePlacedShip(touch.clientX, touch.clientY); }
function onMouseUpPlaced(e) { endPlacedShipDrag(e.clientX, e.clientY); }
function onTouchEndPlaced(e) { const touch = e.changedTouches[0]; endPlacedShipDrag(touch.clientX, touch.clientY); }

/* ----------------- BOTÓN NUEVA PARTIDA ----------------- */
const newGameButton = document.createElement("button");
newGameButton.textContent = "Nueva Partida";
newGameButton.className = "btn btn-primary mt-3";
newGameButton.style.display = "block";
newGameButton.style.margin = "20px auto";
document.querySelector("main.container").appendChild(newGameButton);

newGameButton.addEventListener("click", () => {
  // Reiniciar estado
  playerGrid = createEmptyGrid();
  shipElements = [];
  shipCounter = 0;
  selectedShipId = null;
  draggingEl = null;
  draggingPlacedShip = null;
  positionsConfirmed = false;

  // Limpiar tableros
  createBoardHTML(playerBoard);
  createBoardHTML(enemyBoard, onEnemyClick);

  // Restaurar pool de barcos
  createPlayerShipsInPool();
});
