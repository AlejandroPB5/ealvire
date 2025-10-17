document.addEventListener("DOMContentLoaded", () => {

  const equipos = [
    { nombre: "rojo", color: "#dc3545" },
    { nombre: "azul", color: "#007bff" }
  ];

  equipos.forEach(eq => {
    const canvas = document.getElementById(`pizarra-${eq.nombre}`);
    const ctx = canvas.getContext("2d");
    let dibujando = false;

    const nuevaBtn = document.getElementById(`nuevaCuenta${eq.nombre.charAt(0).toUpperCase() + eq.nombre.slice(1)}`);
    const verBtn = document.getElementById(`verResultado${eq.nombre.charAt(0).toUpperCase() + eq.nombre.slice(1)}`);
    const borrarBtn = document.getElementById(`borrar${eq.nombre.charAt(0).toUpperCase() + eq.nombre.slice(1)}`);
    const sumarBtn = document.getElementById(`sumar${eq.nombre.charAt(0).toUpperCase() + eq.nombre.slice(1)}`);
    const mensaje = document.getElementById(`mensaje-${eq.nombre}`);
    const puntosSpan = document.getElementById(`puntos-${eq.nombre}`);
    const opDiv = document.getElementById(`operacion-${eq.nombre}`);

    let puntos = 0;
    let resultadoActual = null;

    // Dibujo libre (ratón + táctil)
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

canvas.addEventListener("touchstart", startDrawTouch, { passive: false });
canvas.addEventListener("touchmove", drawTouch, { passive: false });
canvas.addEventListener("touchend", stopDraw);
canvas.addEventListener("touchcancel", stopDraw);

function startDraw(e) {
  dibujando = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!dibujando) return;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = eq.color;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function stopDraw() {
  dibujando = false;
}

// Funciones táctiles
function getTouchPos(touchEvent) {
  const rect = canvas.getBoundingClientRect();
  const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

function startDrawTouch(e) {
  e.preventDefault(); // Evita scroll al dibujar
  dibujando = true;
  const pos = getTouchPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function drawTouch(e) {
  e.preventDefault();
  if (!dibujando) return;
  const pos = getTouchPos(e);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = eq.color;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}


    canvas.addEventListener("mouseup", () => (dibujando = false));
    canvas.addEventListener("mouseleave", () => (dibujando = false));

    // Nueva cuenta
    nuevaBtn.addEventListener("click", () => {
      const a = Math.floor(Math.random() * 90000) + 1000;
      const b = Math.floor(Math.random() * a);
      const operaciones = ["+", "-", "x"];
      const oper = operaciones[Math.floor(Math.random() * operaciones.length)];

      resultadoActual =
        oper === "+" ? a + b :
        oper === "-" ? a - b :
        a * b;

      opDiv.innerHTML = `<h3>${a} ${oper} ${b} = ?</h3>`;
      mensaje.textContent = "";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Ver resultado
    verBtn.addEventListener("click", () => {
      if (resultadoActual !== null) {
        mensaje.textContent = `Resultado: ${resultadoActual}`;
      } else {
        mensaje.textContent = "Primero genera una cuenta.";
      }
    });

    // Borrar
    borrarBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Sumar punto
    sumarBtn.addEventListener("click", () => {
      puntos++;
      puntosSpan.textContent = puntos;
    });
  });
});
