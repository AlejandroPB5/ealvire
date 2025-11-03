// script.js
document.addEventListener("DOMContentLoaded", () => {
  const imagenesDiv = document.getElementById("imagenes");
  const categoriasDiv = document.getElementById("categorias");
  const modoSelect = document.getElementById("modo");
  const mensaje = document.getElementById("mensaje");
  const reiniciarBtn = document.getElementById("reiniciar");

  // === MODO DE JUEGO ===
  // === MODO DE JUEGO ===
  const modos = {
    angulos: {
      categorias: ["Agudo", "Recto", "Obtuso", "Segmento", "Semirrecta", "Recta", "Paralelas", "Perpendiculares", "Secantes"],
      imagenes: [
        { src: "../../assets/img/figuras/agudo.png", categoria: "Agudo" },
        { src: "../../assets/img/figuras/recto.png", categoria: "Recto" },
        { src: "../../assets/img/figuras/obtuso.png", categoria: "Obtuso" },
        { src: "../../assets/img/figuras/segmen.png", categoria: "Segmento" },
        { src: "../../assets/img/figuras/semirrecta.png", categoria: "Semirrecta" },
        { src: "../../assets/img/figuras/recta.png", categoria: "Recta" },
        { src: "../../assets/img/figuras/paralelas.png", categoria: "Paralelas" },
        { src: "../../assets/img/figuras/perpendiculares.png", categoria: "Perpendiculares" },
        { src: "../../assets/img/figuras/secantes.png", categoria: "Secantes" }
      ]
    },

    triangulos: {
      subcategorias: {
        "Según sus lados": ["Equilátero", "Isósceles", "Escaleno"],
        "Según sus ángulos": ["Rectángulo", "Acutángulo", "Obtusángulo"]
      },
      imagenes: [
        { src: "../../assets/img/figuras/equilatero.png", categoria: "Equilátero" },
        { src: "../../assets/img/figuras/isosceles.png", categoria: "Isósceles" },
        { src: "../../assets/img/figuras/escaleno.png", categoria: "Escaleno" },
        { src: "../../assets/img/figuras/rectangulo.png", categoria: "Rectángulo" },
        { src: "../../assets/img/figuras/acutangulo.png", categoria: "Acutángulo" },
        { src: "../../assets/img/figuras/obtusangulo.png", categoria: "Obtusángulo" }
      ]
    },

    poligonos: {
      categorias: ["Círculo", "Cuadrado", "Triángulo", "Rectángulo", "Pentágono", "Hexágono", "Circunferencia", "Óvalo"],
      imagenes: [
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23ffd166' stroke='%23333' stroke-width='3'/></svg>", categoria: "Círculo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='10,10 90,10 90,90 10,90' fill='%23a8e6ff' stroke='%23333' stroke-width='3'/></svg>", categoria: "Cuadrado" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,12 90,86 10,86' fill='%23ffd6e0' stroke='%23333' stroke-width='3'/></svg>", categoria: "Triángulo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><polygon points='10,10 110,10 110,70 10,70' fill='%23c7f9d9' stroke='%23333' stroke-width='3'/></svg>", categoria: "Rectángulo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,8 85,30 70,78 30,78 15,30' fill='%23ffe1a8' stroke='%23333' stroke-width='3'/></svg>", categoria: "Pentágono" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,6 84,28 84,72 50,94 16,72 16,28' fill='%23d4f1ff' stroke='%23333' stroke-width='3'/></svg>", categoria: "Hexágono" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='%23333' stroke-width='4'/></svg>", categoria: "Circunferencia" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><ellipse cx='60' cy='40' rx='45' ry='25' fill='%23f0d6ff' stroke='%23333' stroke-width='3'/></svg>", categoria: "Óvalo" }
      ]
    },

    poliedros: {
      categorias: ["Cubo", "Prisma", "Pirámide", "Octaedro", "Dodecaedro", "Esfera", "Cilindro", "Cono"],
      imagenes: [
        { src: "../../assets/img/figuras/cubo.png", categoria: "Cubo" },
        { src: "../../assets/img/figuras/prisma.png", categoria: "Prisma" },
        { src: "../../assets/img/figuras/piramide.png", categoria: "Pirámide" },
        { src: "../../assets/img/figuras/octaedro.png", categoria: "Octaedro" },
        { src: "../../assets/img/figuras/dodecaedro.png", categoria: "Dodecaedro" },
        { src: "../../assets/img/figuras/esfera.png", categoria: "Esfera" },
        { src: "../../assets/img/figuras/cilindro.png", categoria: "Cilindro" },
        { src: "../../assets/img/figuras/cono.png", categoria: "Cono" }
      ]
    },

    circulares: {
      categorias: ["Círculo", "Semicírculo", "Sector circular", "Segmento circular", "Corona circular"],
      imagenes: [
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23ffd166' stroke='%23333' stroke-width='3'/></svg>", categoria: "Círculo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'><path d='M10,50 A40,40 0 0 1 90,50 L50,50 Z' fill='%23a8e6ff' stroke='%23333' stroke-width='2'/></svg>", categoria: "Semicírculo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 50 L90 50 A40 40 0 0 0 50 10 Z' fill='%23ffd6e0' stroke='%23333' stroke-width='2'/></svg>", categoria: "Sector circular" },
        { src: "../../assets/img/figuras/segmento.png", categoria: "Segmento circular" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23fff1c6' stroke='%23333' stroke-width='2'/><circle cx='50' cy='50' r='20' fill='%23f5f5f5' stroke='none'/></svg>", categoria: "Corona circular" }
      ]
    }
  };

  let modoActual = "angulos";

  // === CARGA DE MODO ===
  function cargarModo(modo) {
    modoActual = modo;
    imagenesDiv.innerHTML = "";
    categoriasDiv.innerHTML = "";
    mensaje.textContent = "";

    const data = modos[modo];
    if (!data) return;

    // ---- Si es modo TRIÁNGULOS con subcategorías ----
    if (modo === "triangulos") {
      for (const [titulo, cats] of Object.entries(data.subcategorias)) {
        const grupo = document.createElement("div");
        grupo.className = "grupo-categorias";
        const h3 = document.createElement("h3");
        h3.textContent = titulo;
        h3.className = "text-primary mb-2 mt-3";
        grupo.appendChild(h3);

        const contenedor = document.createElement("div");
        contenedor.className = "d-flex flex-wrap justify-content-center gap-3";

        cats.forEach(cat => {
          const div = document.createElement("div");
          div.className = "categoria";
          div.textContent = cat;
          div.dataset.categoria = cat;

          // eventos drag/drop
          div.addEventListener("dragover", e => e.preventDefault());
          div.addEventListener("drop", e => {
            e.preventDefault();
            const categoria = e.dataTransfer.getData("categoria");
            const src = e.dataTransfer.getData("src");
            procesarColocacion(div, categoria, src);
          });

          contenedor.appendChild(div);
        });

        grupo.appendChild(contenedor);
        categoriasDiv.appendChild(grupo);
      }
    } else {
      // otros modos normales
      data.categorias.forEach(cat => {
        const div = document.createElement("div");
        div.className = "categoria";
        div.textContent = cat;
        div.dataset.categoria = cat;

        div.addEventListener("dragover", e => e.preventDefault());
        div.addEventListener("drop", e => {
          e.preventDefault();
          const categoria = e.dataTransfer.getData("categoria");
          const src = e.dataTransfer.getData("src");
          procesarColocacion(div, categoria, src);
        });

        categoriasDiv.appendChild(div);
      });
    }

    // añadir imágenes
    const imgs = shuffleArray([...data.imagenes]);
    imgs.forEach(item => {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.categoria;
      img.draggable = true;
      img.className = "figura";
      img.dataset.categoria = item.categoria;

      img.addEventListener("dragstart", e => {
        e.dataTransfer.setData("categoria", item.categoria);
        e.dataTransfer.setData("src", item.src);
        try { e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2); } catch {}
      });

      // táctil
      img.addEventListener("touchstart", touchStart, { passive: false });
      img.addEventListener("touchmove", touchMove, { passive: false });
      img.addEventListener("touchend", touchEnd, { passive: false });

      imagenesDiv.appendChild(img);
    });
  }

  // === PROCESAR COLOCACIÓN ===
  function procesarColocacion(categoriaDiv, categoriaArrastrada, src) {
    if (categoriaArrastrada === categoriaDiv.dataset.categoria) {
      categoriaDiv.classList.add("correcto");
      mensaje.textContent = "✅ ¡Bien hecho!";

      const imgOriginal = Array.from(imagenesDiv.querySelectorAll("img"))
        .find(i => i.dataset.categoria === categoriaArrastrada);
      if (imgOriginal) imgOriginal.remove();

      const mini = document.createElement("img");
      mini.src = src;
      mini.alt = categoriaArrastrada;
      mini.className = "figura-colocada";

      const previa = categoriaDiv.querySelector(".figura-colocada");
      if (previa) previa.remove();
      categoriaDiv.appendChild(mini);

      if (imagenesDiv.querySelectorAll("img").length === 0)
        mensaje.textContent = "🎉 ¡Has clasificado todas las figuras!";

      setTimeout(() => categoriaDiv.classList.remove("correcto"), 900);
    } else {
      categoriaDiv.classList.add("incorrecto");
      mensaje.textContent = "❌ Prueba otra vez.";
      setTimeout(() => {
        categoriaDiv.classList.remove("incorrecto");
        mensaje.textContent = "";
      }, 900);
    }
  }

  // === SOPORTE TÁCTIL ===
  let toqueClone = null;
  let toqueOrigen = null;

  function touchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    toqueOrigen = this;

    toqueClone = this.cloneNode(true);
    toqueClone.style.position = "fixed";
    toqueClone.style.pointerEvents = "none";
    toqueClone.style.width = Math.max(60, this.clientWidth * 0.9) + "px";
    toqueClone.style.left = (touch.clientX - 40) + "px";
    toqueClone.style.top = (touch.clientY - 40) + "px";
    toqueClone.style.opacity = "0.95";
    document.body.appendChild(toqueClone);
  }

  function touchMove(e) {
    if (!toqueClone) return;
    e.preventDefault();
    const touch = e.touches[0];
    toqueClone.style.left = (touch.clientX - toqueClone.clientWidth / 2) + "px";
    toqueClone.style.top = (touch.clientY - toqueClone.clientHeight / 2) + "px";
  }

  function touchEnd(e) {
    if (!toqueClone) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    const target = document.elementFromPoint(x, y);
    let categoriaDiv = target?.closest(".categoria");
    const categoriaArrastrada = toqueOrigen.dataset.categoria;
    const src = toqueOrigen.src;
    if (categoriaDiv) procesarColocacion(categoriaDiv, categoriaArrastrada, src);
    toqueClone.remove();
    toqueClone = null;
  }

  // === UTILIDAD: MEZCLAR ===
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // === EVENTOS UI ===
  modoSelect.addEventListener("change", e => cargarModo(e.target.value));
  reiniciarBtn.addEventListener("click", () => cargarModo(modoActual));

  // Carga inicial
  cargarModo(modoActual);
});
