document.addEventListener("DOMContentLoaded", () => {
  // elementos
  const fr1El = document.getElementById("fr1");
  const fr2El = document.getElementById("fr2");
  const btnRojo = document.getElementById("btnRojo");
  const btnAzul = document.getElementById("btnAzul");
  const nuevaRondaBtn = document.getElementById("nuevaRonda");
  const mensaje = document.getElementById("mensaje");
  const corredorRojo = document.getElementById("rojo");
  const corredorAzul = document.getElementById("azul");

  // estado
  let fraccion1 = null, fraccion2 = null;
  let posicionRojo = 0, posicionAzul = 0;
  const meta = 80; // porcentaje para ganar
  let equipoActiva = null;

  // genera fracciones aleatorias
  function generarFracciones() {
    const num1 = Math.floor(Math.random() * 8) + 1;
    const den1 = Math.floor(Math.random() * 8) + 1;
    const num2 = Math.floor(Math.random() * 8) + 1;
    const den2 = Math.floor(Math.random() * 8) + 1;

    fraccion1 = { n: num1, d: den1 };
    fraccion2 = { n: num2, d: den2 };

    fr1El.textContent = `${num1}/${den1}`;
    fr2El.textContent = `${num2}/${den2}`;

    btnRojo.disabled = false;
    btnAzul.disabled = false;
    equipoActiva = null;
    mensaje.textContent = "Pulsa tu equipo y luego toca la fracción que creas mayor";
    clearSelectionVisual();
  }

  function comparar(f1, f2) {
    const v1 = f1.n / f1.d;
    const v2 = f2.n / f2.d;
    if (Math.abs(v1 - v2) < 1e-9) return 0;
    return v1 > v2 ? 1 : 2;
  }

  // mover corredor con transición suave
  function moverCorredor(equipo) {
    const velocidad = 0.8; // segundos (más alto = más lento)
    if (equipo === "rojo") {
      posicionRojo += 10;
      corredorRojo.style.transition = `left ${velocidad}s linear`;
      corredorRojo.style.left = posicionRojo + "%";
      if (posicionRojo >= meta) finJuego("🔴 Equipo Rojo");
    } else {
      posicionAzul += 10;
      corredorAzul.style.transition = `left ${velocidad}s linear`;
      corredorAzul.style.left = posicionAzul + "%";
      if (posicionAzul >= meta) finJuego("🔵 Equipo Azul");
    }
  }

  function finJuego(equipo) {
    mensaje.textContent = `${equipo} ha ganado la carrera 🏆`;
    btnRojo.disabled = true;
    btnAzul.disabled = true;
    equipoActiva = null;
  }

  // botones de equipo
  btnRojo.addEventListener("click", () => {
    if (btnRojo.disabled) return;
    equipoActiva = "rojo";
    mensaje.textContent = "🔴 Elige la fracción que crees mayor (toca izquierda o derecha)";
    btnRojo.disabled = true;
    btnAzul.disabled = true;
    markActiveTeamVisual("rojo");
  });

  btnAzul.addEventListener("click", () => {
    if (btnAzul.disabled) return;
    equipoActiva = "azul";
    mensaje.textContent = "🔵 Elige la fracción que crees mayor (toca izquierda o derecha)";
    btnRojo.disabled = true;
    btnAzul.disabled = true;
    markActiveTeamVisual("azul");
  });

  // selección de fracción
  function handleSeleccion(indice) {
    if (!equipoActiva) {
      mensaje.textContent = "Pulsa primero el botón de tu equipo para responder.";
      return;
    }

    const mayor = comparar(fraccion1, fraccion2);
    let acierto = false;

    if (mayor === 0) acierto = true;
    else acierto = (mayor === indice);

    if (acierto) {
      mensaje.textContent = `✅ ¡Correcto! (${equipoActiva}). Avanza tu corredor.`;
      moverCorredor(equipoActiva);
    } else {
      mensaje.textContent = `❌ Incorrecto (${equipoActiva}). No avanzas.`;
    }

    equipoActiva = null;
    markSelectionResultVisual(indice, acierto);
  }

  // eventos de toque y clic
  fr1El.addEventListener("click", () => handleSeleccion(1));
  fr2El.addEventListener("click", () => handleSeleccion(2));
  fr1El.addEventListener("touchstart", (e) => { e.preventDefault(); handleSeleccion(1); }, { passive: false });
  fr2El.addEventListener("touchstart", (e) => { e.preventDefault(); handleSeleccion(2); }, { passive: false });

  nuevaRondaBtn.addEventListener("click", generarFracciones);

  // estilos visuales
  function clearSelectionVisual() {
    fr1El.classList.remove("correct", "incorrect", "active-left");
    fr2El.classList.remove("correct", "incorrect", "active-right");
  }

  function markActiveTeamVisual(equipo) {
    clearSelectionVisual();
    fr1El.classList.add("active-left");
    fr2El.classList.add("active-right");
  }

  function markSelectionResultVisual(index, correcto) {
    clearSelectionVisual();
    const el = index === 1 ? fr1El : fr2El;
    if (correcto) el.classList.add("correct");
    else el.classList.add("incorrect");
    setTimeout(() => clearSelectionVisual(), 1600);
  }

  generarFracciones();
});
