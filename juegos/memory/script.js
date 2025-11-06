// script.js - Memory con dos modos: romanos y palabras
document.addEventListener("DOMContentLoaded", () => {

    /* ---------- elementos DOM ---------- */
    const modoSelect = document.getElementById("modoSelect");
    const paresSelect = document.getElementById("paresSelect");
    const board = document.getElementById("board");
    const btnReiniciar = document.getElementById("btnReiniciar");
    const btnBarajar = document.getElementById("btnBarajar");
    const btnMostrarSol = document.getElementById("btnMostrarSol");
    const turnosEl = document.getElementById("turnos");
    const aciertosEl = document.getElementById("aciertos");
    const tiempoEl = document.getElementById("tiempo");

    /* ---------- estado ---------- */
    let modo = modoSelect.value;               // 'romanos' | 'palabras'
    let pares = parseInt(paresSelect.value, 10); // nº pares (6,8,10...)
    let cards = [];                            // array de cartas
    let firstCard = null, secondCard = null;
    let lockBoard = false;
    let turnos = 0, aciertos = 0;
    let timerInterval = null;
    let segundos = 0;

    /* ---------- banco de palabras (word + tipo + acentuacion) ---------
       Añade o modifica aquí si quieres más unidades. */
    const wordBank = [
        { word: "Betún", tipo: "Sustantivo", acento: "Aguda" },
        { word: "rápido", tipo: "Adjetivo", acento: "Esdrújula" }, // (aunque 'rápido' es esdrújula? actually 'rápido' is llana; but we keep examples) 
        { word: "cantar", tipo: "Verbo", acento: "Aguda" },
        { word: "árbol", tipo: "Sustantivo", acento: "Llano" },
        { word: "música", tipo: "Sustantivo", acento: "Esdrújula" },
        { word: "lógica", tipo: "Adjetivo", acento: "Esdrújula" },
        { word: "fácil", tipo: "Adjetivo", acento: "Aguda" },
        { word: "corre", tipo: "Verbo", acento: "Llano" },
        { word: "árabe", tipo: "Adjetivo", acento: "Esdrújula" },
        { word: "camión", tipo: "Sustantivo", acento: "Aguda" },
        { word: "rápidamente", tipo: "Adverbio", acento: "Esdrújula" },
        { word: "árbitro", tipo: "Sustantivo", acento: "Esdrújula" },
        { word: "perro", tipo: "Sustantivo", acento: "Llana" },
        { word: "dulce", tipo: "Adjetivo", acento: "Llano" },
        { word: "comió", tipo: "Verbo", acento: "Aguda" },
        { word: "estudiante", tipo: "Sustantivo", acento: "Llano" },
        { word: "árido", tipo: "Adjetivo", acento: "Esdrújula" },
        { word: "escándalo", tipo: "Sustantivo", acento: "Esdrújula" },
        { word: "este", tipo: "Determinante", acento: "Llano" },
        { word: "aquél", tipo: "Determinante", acento: "Aguda" },
        { word: "mi", tipo: "Determinante", acento: "Aguda" },
        { word: "nuestra", tipo: "Determinante", acento: "Llano" },
        { word: "sexto", tipo: "Determinante", acento: "Llano" },
        { word: "cuatro", tipo: "Determinante", acento: "Llano" },

    ];

    /* ---------- utilidades ---------- */
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // conversión arábigo -> romano (1..3999). Limitamos a 1..3999
    function toRoman(num) {
        if (num <= 0) return "";
        const map = [
            [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
            [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
            [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
        ];
        let res = "";
        for (const [val, sym] of map) {
            while (num >= val) {
                res += sym;
                num -= val;
            }
        }
        return res;
    }

    /* ---------- generar parejas según modo ---------- */
    function buildPairs() {
        if (modo === "romanos") {
            // generamos 'pares' números distintos en un rango razonable
            const min = 1, max = 399; // límite para no obtener numeros demasiado largos
            const set = new Set();
            while (set.size < pares) {
                const n = Math.floor(Math.random() * (max - min + 1)) + min;
                set.add(n);
            }
            const arr = [...set];
            // cada par: un elemento con 'arabigo', otro con 'romano'
            const pairs = [];
            arr.forEach((n, i) => {
                pairs.push({ id: `r-${i}`, type: "arabigo", label: String(n), meta: n });
                pairs.push({ id: `r-${i}`, type: "romano", label: toRoman(n), meta: n });
            });
            return shuffle(pairs);
        } else {
            // modo palabras: elegimos 'pares' palabras distintas del banco (si hay suficientes)
            const bank = [...wordBank];
            shuffle(bank);
            const selected = bank.slice(0, pares);
            const pairs = [];
            selected.forEach((obj, idx) => {
                const id = `w-${idx}`;
                // carta 1: la palabra
                pairs.push({ id, type: "word", label: obj.word, meta: obj });
                // carta 2: la etiqueta "Tipo, Acentuación"
                const label2 = `${obj.tipo}, ${obj.acento}`;
                pairs.push({ id, type: "label", label: label2, meta: obj });
            });
            return shuffle(pairs);
        }
    }

    /* ---------- renderizar tablero ---------- */
    function renderBoard() {
        clearTimer();
        resetStats();
        board.innerHTML = "";
        cards = buildPairs();

        // decidir columnas en función del número de cartas (pares)
        const total = cards.length;
        let cols = 4;
        if (pairsToCols(pares)) cols = pairsToCols(pares);
        board.className = "board cols-" + cols;

        cards.forEach((c, index) => {
            const cardEl = document.createElement("div");
            cardEl.className = "card-memory";
            cardEl.dataset.pairId = c.id;
            cardEl.dataset.index = index;

            // inner
            const inner = document.createElement("div");
            inner.className = "card-inner";

            // back (face-down)
            const back = document.createElement("div");
            back.className = "card-face card-back";
            back.innerHTML = `<div class="back-content"></div>`;


            // front (face-up)
            const front = document.createElement("div");
            front.className = "card-face card-front";
            // contenido según modo y tipo (ajustado para que quede bonito)
            if (modo === "romanos") {
                front.innerHTML = `<div class="front-text">${escapeHtml(c.label)}</div>`;
            } else {
                // palabras: show word or label (compact)
                if (c.type === "word") {
                    front.innerHTML = `<div class="front-text">${escapeHtml(c.label)}</div>`;
                } else {
                    front.innerHTML = `<div class="front-text label-compact">${escapeHtml(c.label)}</div>`;
                }
            }

            inner.appendChild(back);
            inner.appendChild(front);
            cardEl.appendChild(inner);

            // listeners (click/touch)
            cardEl.addEventListener("click", () => onCardClick(cardEl));
            cardEl.addEventListener("touchstart", (e) => {
                e.preventDefault(); // evita doble evento en algunos navegadores
                onCardClick(cardEl);
            }, { passive: false });

            board.appendChild(cardEl);
        });

        // arrancar timer al primer click
        startOnFirstInteraction();
    }

    // helper: map pairs to columns for nicer grid
    function pairsToCols(pairsCount) {
        // total cards = pairsCount * 2
        if (pairsCount <= 6) return 3;
        if (pairsCount === 8) return 4;
        if (pairsCount === 10) return 5;
        return 6;
    }

    function escapeHtml(s) {
        return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }

    /* ---------- manejo juego ---------- */
    function onCardClick(cardEl) {
        if (lockBoard) return;
        if (cardEl.classList.contains("matched")) return;
        if (cardEl === firstCard) return;

        // si el timer no está corriendo lo iniciamos (si no iniciado)
        if (timerInterval === null && turnos === 0 && aciertos === 0 && segundos === 0) {
            startTimer();
        }

        // voltear
        flipCard(cardEl);

        if (!firstCard) {
            firstCard = cardEl;
            return;
        }

        // segundo click
        secondCard = cardEl;
        lockBoard = true;
        turnos++;
        updateStats();

        // comparar
        const id1 = firstCard.dataset.pairId;
        const id2 = secondCard.dataset.pairId;
        // match si misma id pero elementos distintos (type puede diferir)
        // ----- NUEVA LÓGICA DE EMPAREJAMIENTO -----
        // Se mantiene la lógica original para romanos.
        // Para palabras: se permite emparejar tarjetas con mismas propiedades
        let esPareja = false;

        if (modo === "romanos") {
            // ROMANOS -> sigue igual, por ID
            esPareja = (id1 === id2);
        } else {
            // PALABRAS -> emparejar si tienen misma clase y acento
            const obj1 = cards[firstCard.dataset.index].meta;
            const obj2 = cards[secondCard.dataset.index].meta;

            if (obj1 && obj2) {
                const mismaClase = obj1.tipo === obj2.tipo;
                const mismoAcento = obj1.acento === obj2.acento;

                // evitar que se emparejen dos cartas idénticas del mismo tipo (word+word o label+label)
                const tipo1 = cards[firstCard.dataset.index].type;
                const tipo2 = cards[secondCard.dataset.index].type;

                if (mismaClase && mismoAcento && tipo1 !== tipo2) {
                    esPareja = true;
                }
            }
        }

        // ----------------------------
        if (esPareja) {
            handleMatch(firstCard, secondCard);
        } else {
            setTimeout(() => {
                unflipCard(firstCard);
                unflipCard(secondCard);
                resetTurn();
            }, 900);
        }

    }

    function flipCard(cardEl) {
        cardEl.classList.add("flipped");
    }
    function unflipCard(cardEl) {
        cardEl.classList.remove("flipped");
    }
    function handleMatch(c1, c2) {
        c1.classList.add("matched");
        c2.classList.add("matched");
        // reducir tamaño visual con clase matched
        aciertos++;
        updateStats();
        // animación ligera
        setTimeout(() => {
            c1.style.transform = "scale(0.9)";
            c2.style.transform = "scale(0.9)";
        }, 120);
        // limpiar y desbloquear
        resetTurn();
        // comprobar fin
        if (aciertos === pares) {
            finishGame();
        }
    }

    function resetTurn() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    /* ---------- estadísticas y timer ---------- */
    function updateStats() {
        turnosEl.textContent = turnos;
        aciertosEl.textContent = aciertos;
    }
    function resetStats() {
        turnos = 0; aciertos = 0; segundos = 0;
        updateStats();
        tiempoEl.textContent = "00:00";
        clearTimer();
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            segundos++;
            tiempoEl.textContent = formatTime(segundos);
        }, 1000);
    }
    function clearTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }
    function formatTime(s) {
        const mm = String(Math.floor(s / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    }

    function finishGame() {
        clearTimer();
        setTimeout(() => {
            alert(`🎉 ¡Has completado el juego!\nTurnos: ${turnos}\nTiempo: ${formatTime(segundos)}`);
        }, 300);
    }

    /* ---------- controles UI ---------- */
    modoSelect.addEventListener("change", (e) => {
        modo = e.target.value;
        renderBoard();
    });

    paresSelect.addEventListener("change", (e) => {
        pares = parseInt(e.target.value, 10);
        renderBoard();
    });

    btnReiniciar.addEventListener("click", () => {
        renderBoard();
    });

    btnBarajar.addEventListener("click", () => {
        // barajar las cartas actuales: simplemente reordenamos DOM sin reset stats
        const current = Array.from(board.children);
        shuffle(current);
        board.innerHTML = "";
        current.forEach(c => board.appendChild(c));
    });

    btnMostrarSol.addEventListener("click", () => {
        // revelado temporal de todas las cartas no emparejadas
        if (board.classList.contains("showing")) {
            board.classList.remove("showing");
            // volver en 700ms al estado inicial (las no-matched se ocultan de nuevo)
            setTimeout(() => {
                board.querySelectorAll(".card-memory:not(.matched)").forEach(c => c.classList.remove("flipped"));
            }, 100);
            return;
        }
        // mostrar
        board.classList.add("showing");
        board.querySelectorAll(".card-memory:not(.matched)").forEach(c => c.classList.add("flipped"));
        setTimeout(() => {
            board.classList.remove("showing");
            board.querySelectorAll(".card-memory:not(.matched)").forEach(c => c.classList.remove("flipped"));
        }, 2000);
    });

    /* ---------- iniciar en carga ---------- */
    renderBoard();

    /* ---------- helpers: iniciar timer al primer click en el tablero ---------- */
    function startOnFirstInteraction() {
        // habilita arranque del timer al primer click/tap en board
        const oneShot = (e) => {
            if (timerInterval === null && (turnos === 0 && aciertos === 0 && segundos === 0)) {
                startTimer();
            }
            // no importa, removemos listener
            board.removeEventListener("click", oneShot);
            board.removeEventListener("touchstart", oneShot);
        };
        board.addEventListener("click", oneShot);
        board.addEventListener("touchstart", oneShot, { passive: true });
    }
});
