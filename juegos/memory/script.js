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
        { word: "rápido", tipo: "Adjetivo", acento: "Esdrújula" },
        { word: "cantar", tipo: "Verbo", acento: "Aguda" },
        { word: "árbol", tipo: "Sustantivo", acento: "Llana" },
        { word: "música", tipo: "Sustantivo", acento: "Esdrújula" },
        { word: "lógica", tipo: "Adjetivo", acento: "Esdrújula" },
        { word: "fácil", tipo: "Adjetivo", acento: "Llana" },  // ✅ corregido
        { word: "corre", tipo: "Verbo", acento: "Llana" },
        { word: "árabe", tipo: "Adjetivo", acento: "Esdrújula" },
        { word: "camión", tipo: "Sustantivo", acento: "Aguda" },
        { word: "árbitro", tipo: "Sustantivo", acento: "Esdrújula" },
        { word: "perro", tipo: "Sustantivo", acento: "Llana" },
        { word: "dulce", tipo: "Adjetivo", acento: "Llana" },
        { word: "comió", tipo: "Verbo", acento: "Aguda" },
        { word: "estudiante", tipo: "Sustantivo", acento: "Llana" },
        { word: "árido", tipo: "Adjetivo", acento: "Esdrújula" },
        { word: "escándalo", tipo: "Sustantivo", acento: "Esdrújula" },

        // Determinantes corregidos
        { word: "este", tipo: "Determinante", acento: "Llana" },
        { word: "aquel", tipo: "Determinante", acento: "Aguda" }, // ✅ sin tilde
        { word: "mi", tipo: "Determinante", acento: "Aguda" },
        { word: "nuestra", tipo: "Determinante", acento: "Llana" },
        { word: "sexto", tipo: "Determinante", acento: "Llana" },
        { word: "cuatro", tipo: "Determinante", acento: "Llana" }
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
            const min = 1, max = 399;
            const set = new Set();
            while (set.size < pares) {
                const n = Math.floor(Math.random() * (max - min + 1)) + min;
                set.add(n);
            }
            const arr = [...set];
            const pairs = [];
            arr.forEach((n, i) => {
                pairs.push({ id: `r-${i}`, type: "arabigo", label: String(n), meta: n });
                pairs.push({ id: `r-${i}`, type: "romano", label: toRoman(n), meta: n });
            });
            return shuffle(pairs);
        }

        /** -------------------------
            NUEVO: modo acentuación
            ------------------------- */
        if (modo === "acentuacion") {
            const bank = [...wordBank];
            shuffle(bank);
            const selected = bank.slice(0, pares);
            const pairs = [];

            selected.forEach((obj, idx) => {
                const id = `a-${idx}`;
                pairs.push({ id, type: "word", label: obj.word, meta: obj.acento });
                pairs.push({ id, type: "label", label: obj.acento, meta: obj.acento });
            });

            return shuffle(pairs);
        }

        /** -------------------------
            NUEVO: modo tipo de palabra
            ------------------------- */
        if (modo === "tipo") {
            const bank = [...wordBank];
            shuffle(bank);
            const selected = bank.slice(0, pares);
            const pairs = [];

            selected.forEach((obj, idx) => {
                const id = `t-${idx}`;
                pairs.push({ id, type: "word", label: obj.word, meta: obj.tipo });
                pairs.push({ id, type: "label", label: obj.tipo, meta: obj.tipo });
            });

            return shuffle(pairs);
        }

        // por si algo cae aquí (seguridad)
        return [];
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
        const total = pairsCount * 2;

        if (total <= 12) return 6;   // 2 filas
        if (total <= 16) return 8;   // 2 filas
        if (total <= 20) return 10;  // 2 filas
        if (total <= 24) return 8;   // 3 filas
        return 10;                   // 3 filas
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
            // ✅ Romanos: sigue igual
            esPareja = (id1 === id2);
        }

        else if (modo === "acentuacion") {
            const carta1 = cards[firstCard.dataset.index];
            const carta2 = cards[secondCard.dataset.index];

            const ac1 = (carta1.meta + "").toLowerCase().trim();
            const ac2 = (carta2.meta + "").toLowerCase().trim();

            const tipo1 = carta1.type;
            const tipo2 = carta2.type;

            // ✅ Pareja = mismo acento + una palabra y una etiqueta
            if (ac1 === ac2 && tipo1 !== tipo2) {
                esPareja = true;
            }
        }

        else if (modo === "tipo") {
            const carta1 = cards[firstCard.dataset.index];
            const carta2 = cards[secondCard.dataset.index];

            const t1 = (carta1.meta + "").toLowerCase().trim();
            const t2 = (carta2.meta + "").toLowerCase().trim();

            const tipo1 = carta1.type;
            const tipo2 = carta2.type;

            // ✅ Pareja = mismo tipo de palabra + una palabra y una etiqueta
            if (t1 === t2 && tipo1 !== tipo2) {
                esPareja = true;
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
