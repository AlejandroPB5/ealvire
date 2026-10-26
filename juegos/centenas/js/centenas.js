(() => {
  const $ = (id) => document.getElementById(id);
  let target = 347,
    picked = null,
    score = 0,
    attempts = 0;
  const grid = $("numberGrid");

  function makeGrid() {
    const frag = document.createDocumentFragment();
    for (let n = 0; n <= 999; n++) {
      const b = document.createElement("button");
      b.className = "num-cell";
      b.textContent = n;
      b.type = "button";
      b.setAttribute("aria-label", `Número ${n}`);
      b.addEventListener("click", () => selectNumber(n));
      b.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(n));
      });
      b.draggable = true;
      frag.appendChild(b);
    }
    grid.appendChild(frag);
  }

  function selectNumber(n) {
    const celda = grid.querySelectorAll(".num-cell")[n];

    if (!celda || celda.classList.contains("selected")) return;

    const seleccionados = grid.querySelectorAll(".num-cell.selected");

    // Máximo de 7 números
    if (seleccionados.length >= 7) {
      $("feedback").textContent = "Puedes marcar hasta 7 números.";
      return;
    }

    // El primer número será verde; los siguientes, naranjas
    celda.classList.add("selected");

    if (seleccionados.length === 0) {
      celda.classList.add("first-selected");
    } else {
      celda.classList.add("other-selected");
    }

    picked = n;
    $("pickedNumber").textContent = n;
  }

  function borrarSeleccion() {
    grid.querySelectorAll(".num-cell").forEach((el) => {
      el.classList.remove(
        "selected",
        "first-selected",
        "other-selected",
        "target",
      );
    });

    picked = null;
    $("pickedNumber").textContent = "Ninguno";
  }

  function actualizarColoresSeleccion() {
    const seleccionados = grid.querySelectorAll(".num-cell.selected");

    seleccionados.forEach((el, i) => {
      el.classList.remove("first-selected", "other-selected");
      el.classList.add(i === 0 ? "first-selected" : "other-selected");
    });
  }

  grid.addEventListener("dragover", (e) => e.preventDefault());
  grid.addEventListener("drop", (e) => {
    e.preventDefault();
    const n = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isInteger(n) && n >= 0 && n <= 999) selectNumber(n);
  });

  function makeTicks() {
    const ticks = $("ticks");
    ticks.innerHTML = "";
    for (let i = 0; i < 21; i++) {
      const t = document.createElement("span");
      t.className = "tick";
      if (i === 0 || i === 10 || i === 20) t.classList.add("major");
      if (i === 10) {
        t.classList.add("center");
        const label = document.createElement("b");
        label.className = "tick-label";
        label.textContent = target;
        t.appendChild(label);
      }
      ticks.appendChild(t);
    }
  }

  function makeBlocks() {
    // Mostrar siempre 9 bloques de cada tipo
    const grupos = [
      ["hundredBlocks", "hundred"],
      ["tenBlocks", "ten"],
      ["unitBlocks", "unit"],
    ];

    grupos.forEach(([id, tipo]) => {
      const contenedor = $(id);
      contenedor.innerHTML = "";

      for (let i = 0; i < 9; i++) {
        const bloque = document.createElement("button");

        bloque.type = "button";
        bloque.className = `block ${tipo}`;
        bloque.setAttribute("aria-label", `Bloque ${tipo} ${i + 1}`);
        bloque.title = "Toca para rodear el bloque";
        bloque.setAttribute("aria-pressed", "false");

        bloque.addEventListener("click", () => {
          bloque.classList.toggle("chosen");

          bloque.setAttribute(
            "aria-pressed",
            bloque.classList.contains("chosen") ? "true" : "false",
          );
        });

        contenedor.appendChild(bloque);
      }
    });
  }

  function newTarget() {
    target = Math.floor(Math.random() * 1000);
    $("targetNumber").textContent = target;
    $("instruction").textContent = `TOCA O ARRASTRA HASTA EL ${target}.`;
    $("pickedNumber").textContent = "—";
    picked = null;
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("worksheetFeedback").textContent = "";
    $("worksheetFeedback").className = "feedback";
    grid
      .querySelectorAll(".num-cell")
      .forEach((el, i) => el.classList.toggle("target", i === target));
    [
      "minus100",
      "minus10",
      "minus1",
      "plus1",
      "plus10",
      "plus100",
      "hundreds",
      "tens",
      "units",
      "decompHundreds",
      "decompTens",
      "decompUnits",
      "decompTotal",
    ].forEach((id) => ($(id).value = ""));
    makeTicks();
    makeBlocks();
  }

  $("randomBtn").addEventListener("click", newTarget);

  $("clearBtn").addEventListener("click", () => {
    picked = null;
    $("pickedNumber").textContent = "—";

    grid.querySelectorAll(".num-cell").forEach((el) => {
      el.classList.remove(
        "selected",
        "first-selected",
        "other-selected",
        "target",
      );
    });

    $("feedback").textContent = "Selección borrada.";
    $("feedback").className = "feedback";
  });



$("checkBtn").addEventListener("click", () => {
  const seleccionados = [
    ...grid.querySelectorAll(".num-cell.selected")
  ].map((el) => Number(el.textContent.trim()));

  if (seleccionados.length === 0) {
    $("feedback").textContent = "Primero marca los números del panel.";
    $("feedback").className = "feedback bad";
    return;
  }

  const respuestasCorrectas = [
    target,
    target - 1,
    target + 1,
    target - 10,
    target + 10,
    target - 100,
    target + 100
  ];

  const correctos = seleccionados.filter(
    (n) => respuestasCorrectas.includes(n)
  );

  const incorrectos = seleccionados.filter(
    (n) => !respuestasCorrectas.includes(n)
  );

  const faltantes = respuestasCorrectas.filter(
    (n) => !seleccionados.includes(n)
  );

  const objetivoEncontrado = seleccionados.includes(target);

  if (objetivoEncontrado) {
    score++;
    $("score").textContent = score;
  }

  if (incorrectos.length === 0 && faltantes.length === 0) {
    $("feedback").textContent =
      "¡Perfecto! Has encontrado el objetivo y sus seis vecinos. 🎉";
    $("feedback").className = "feedback good";
  } else {
    $("feedback").textContent =
      `Correctos: ${correctos.length}/7. ` +
      `Incorrectos: ${incorrectos.length ? incorrectos.join(", ") : "ninguno"}. ` +
      `Te faltan: ${faltantes.length ? faltantes.join(", ") : "ninguno"}.`;

    $("feedback").className = "feedback bad";
  }
});



  $("solutionBtn").addEventListener("click", () => {
    selectNumber(target);
    
    $("feedback").textContent =
      `Solución: ${target}. ` +
      `Unidad anterior: ${target - 1}, ` +
      `unidad posterior: ${target + 1}, ` +
      `decena anterior: ${target - 10}, ` +
      `decena posterior: ${target + 10}, ` +
      `centena anterior: ${target - 100}, ` +
      `centena posterior: ${target + 100}.`;

    $("feedback").className = "feedback good";
  });

  function checkInputs() {
    attempts++;
    $("attempts").textContent = attempts;
    const expected = {
      minus100: Math.max(0, target - 100),
      minus10: Math.max(0, target - 10),
      minus1: Math.max(0, target - 1),
      plus1: Math.min(999, target + 1),
      plus10: Math.min(999, target + 10),
      plus100: Math.min(999, target + 100),
      hundreds: Math.floor(target / 100),
      tens: Math.floor((target % 100) / 10),
      units: target % 10,
      decompHundreds: Math.floor(target / 100) * 100,
      decompTens: Math.floor((target % 100) / 10) * 10,
      decompUnits: target % 10,
      decompTotal: target,
    };
    const ids = Object.keys(expected);
    const missing = ids.filter((id) => $(id).value.trim() === "");
    const wrong = ids.filter(
      (id) => $(id).value.trim() !== "" && Number($(id).value) !== expected[id],
    );
    if (missing.length) {
      $("worksheetFeedback").textContent =
        "Completa todos los recuadros para comprobar la ficha.";
      $("worksheetFeedback").className = "feedback bad";
    } else if (!wrong.length) {
      score++;
      $("score").textContent = score;
      $("worksheetFeedback").textContent =
        "¡Ficha perfecta! Has acertado todo. 🌟";
      $("worksheetFeedback").className = "feedback good";
    } else {
      $("worksheetFeedback").textContent =
        `Revisa ${wrong.length} respuesta(s). ¡Tú puedes!`;
      $("worksheetFeedback").className = "feedback bad";
    }
  }
  $("checkWorksheet").addEventListener("click", checkInputs);
  $("showWorksheetSolution").addEventListener("click", () => {
    const values = {
      minus100: Math.max(0, target - 100),
      minus10: Math.max(0, target - 10),
      minus1: Math.max(0, target - 1),
      plus1: Math.min(999, target + 1),
      plus10: Math.min(999, target + 10),
      plus100: Math.min(999, target + 100),
      hundreds: Math.floor(target / 100),
      tens: Math.floor((target % 100) / 10),
      units: target % 10,
      decompHundreds: Math.floor(target / 100) * 100,
      decompTens: Math.floor((target % 100) / 10) * 10,
      decompUnits: target % 10,
      decompTotal: target,
    };
    Object.entries(values).forEach(([id, value]) => ($(id).value = value));
    $("worksheetFeedback").textContent =
      "Aquí tienes la solución. Pulsa «Generar número aleatorio» para practicar otro.";
    $("worksheetFeedback").className = "feedback good";
  });

  makeGrid();
  newTarget();
})();
