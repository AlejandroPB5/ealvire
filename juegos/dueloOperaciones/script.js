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

    // === Ajuste del canvas para pantallas HiDPI ===
    function resizeCanvasForDisplay(canvas, ctx) {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayWidth  = Math.round(rect.width);
      const displayHeight = Math.round(rect.height);

      if (canvas.width !== Math.round(displayWidth * dpr) || canvas.height !== Math.round(displayHeight * dpr)) {
        canvas.width  = Math.round(displayWidth * dpr);
        canvas.height = Math.round(displayHeight * dpr);
        canvas.style.width  = displayWidth + "px";
        canvas.style.height = displayHeight + "px";

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    }

    resizeCanvasForDisplay(canvas, ctx);
    window.addEventListener("resize", () => resizeCanvasForDisplay(canvas, ctx));

    // === Dibujo con ratón ===
    canvas.addEventListener("mousedown", e => {
      resizeCanvasForDisplay(canvas, ctx);
      dibujando = true;
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener("mousemove", e => {
      if (!dibujando) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = eq.color;
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    });

    canvas.addEventListener("mouseup", () => (dibujando = false));
    canvas.addEventListener("mouseleave", () => (dibujando = false));

    // === Dibujo táctil (multitouch) ===
    const activeTouches = new Map();

    canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      resizeCanvasForDisplay(canvas, ctx);
      const rect = canvas.getBoundingClientRect();
      for (const touch of e.changedTouches) {
        const id = touch.identifier;
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        activeTouches.set(id, { x, y });
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }, { passive: false });

    canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      for (const touch of e.changedTouches) {
        const id = touch.identifier;
        const prev = activeTouches.get(id);
        if (!prev) continue;
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(x, y);
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = eq.color;
        ctx.stroke();
        activeTouches.set(id, { x, y });
      }
    }, { passive: false });

    canvas.addEventListener("touchend", e => {
      for (const touch of e.changedTouches) activeTouches.delete(touch.identifier);
    });

    canvas.addEventListener("touchcancel", e => {
      for (const touch of e.changedTouches) activeTouches.delete(touch.identifier);
    });

    // === Nueva cuenta ===
    nuevaBtn.addEventListener("click", () => {
      const a = Math.floor(Math.random() * 90000) + 1000;
      const b = Math.floor(Math.random() * (a - 1000)) + 1000; // evita negativos
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

    // === Ver resultado ===
    verBtn.addEventListener("click", () => {
      if (resultadoActual !== null) {
        mensaje.textContent = `Resultado: ${resultadoActual}`;
      } else {
        mensaje.textContent = "Primero genera una cuenta.";
      }
    });

    // === Borrar ===
    borrarBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // === Sumar punto ===
    sumarBtn.addEventListener("click", () => {
      puntos++;
      puntosSpan.textContent = puntos;
    });
  });
});
