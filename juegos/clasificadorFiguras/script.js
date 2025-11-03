// script.js
document.addEventListener("DOMContentLoaded", () => {
  const imagenesDiv = document.getElementById("imagenes");
  const categoriasDiv = document.getElementById("categorias");
  const modoSelect = document.getElementById("modo");
  const mensaje = document.getElementById("mensaje");
  const reiniciarBtn = document.getElementById("reiniciar");

  // ---- Aquí pones tu objeto `modos` (igual que lo tenías antes).
  // Si ya lo tienes en otro fichero, elimina la declaración siguiente.
  const modos = {
    angulos: {
      categorias: ["Agudo", "Recto", "Obtuso","Segmento" ,"Semirrecta","Recta","Paralelas","Perpendiculares", "Secantes"],
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
      categorias: ["Equilátero", "Isósceles", "Escaleno", "Rectángulo", "Acutángulo", "Obtusángulo"],
      imagenes: [
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,10 90,90 10,90' fill='%23a8e6ff' stroke='%23333' stroke-width='3'/></svg>", categoria: "Equilátero" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,20 80,90 20,90' fill='%23ffd6e0' stroke='%23333' stroke-width='3'/></svg>", categoria: "Isósceles" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='10,90 80,90 40,20' fill='%23c7f9d9' stroke='%23333' stroke-width='3'/></svg>", categoria: "Escaleno" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='10,90 10,20 90,90' fill='%23ffd166' stroke='%23333' stroke-width='3'/></svg>", categoria: "Rectángulo" },
        { src: "../../assets/img/figuras/tri_acutangulo.png", categoria: "Acutángulo" },
        { src: "../../assets/img/figuras/obtusangulo.png", categoria: "Obtusángulo" }
      ]
    },
    poligonos: {
      categorias: ["Círculo", "Cuadrado", "Triángulo", "Rectángulo", "Pentágono", "Hexágono", "Circunferencia", "Óvalo"],
      imagenes: [
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23ffd166' stroke='%23333' stroke-width='3'/></svg>", categoria: "Círculo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='15' y='15' width='70' height='70' fill='%23a8e6ff' stroke='%23333' stroke-width='3'/></svg>", categoria: "Cuadrado" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,12 90,86 10,86' fill='%23ffd6e0' stroke='%23333' stroke-width='3'/></svg>", categoria: "Triángulo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><rect x='10' y='10' width='100' height='60' fill='%23c7f9d9' stroke='%23333' stroke-width='3'/></svg>", categoria: "Rectángulo" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,8 85,30 70,78 30,78 15,30' fill='%23ffe1a8' stroke='%23333' stroke-width='3'/></svg>", categoria: "Pentágono" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,6 84,28 84,72 50,94 16,72 16,28' fill='%23d4f1ff' stroke='%23333' stroke-width='3'/></svg>", categoria: "Hexágono" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='%23333' stroke-width='4'/></svg>", categoria: "Circunferencia" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><ellipse cx='60' cy='40' rx='45' ry='25' fill='%23f0d6ff' stroke='%23333' stroke-width='3'/></svg>", categoria: "Óvalo" }
      ]
    },
    // POLIEDROS (efecto 3D simulado)
    poliedros: {
      categorias: ["Cubo", "Prisma", "Pirámide", "Octaedro", "Dodecaedro", "Esfera", "Cilindro", "Cono"],
      imagenes: [
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='30,30 80,30 80,80 30,80' fill='%23a8e6ff' stroke='%23333' stroke-width='2'/><polygon points='80,30 100,50 100,100 80,80' fill='%239fd3ff' stroke='%23333' stroke-width='2'/><polygon points='30,80 80,80 100,100 50,100' fill='%238ecfff' stroke='%23333' stroke-width='2'/></svg>", categoria: "Cubo" },
        { src: "../../assets/img/figuras/prisma.png", categoria: "Prisma" },
        { src: "../../assets/img/figuras/piramide.png", categoria: "Pirámide" },
        { src: "../../assets/img/figuras/octaedro.png", categoria: "Octaedro" },
        { src: "../../assets/img/figuras/dodecaedro.png", categoria: "Dodecaedro" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='45' fill='url(%23grad1)' stroke='%23333' stroke-width='2'/><defs><radialGradient id='grad1'><stop offset='0%' stop-color='%23fff'/><stop offset='100%' stop-color='%239ad'/></radialGradient></defs></svg>", categoria: "Esfera" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect x='40' y='20' width='40' height='80' fill='%23ffd166' stroke='%23333' stroke-width='2'/><ellipse cx='60' cy='20' rx='20' ry='8' fill='%23ffe79a' stroke='%23333' stroke-width='2'/><ellipse cx='60' cy='100' rx='20' ry='8' fill='%23f1c764' stroke='%23333' stroke-width='2'/></svg>", categoria: "Cilindro" },
        { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><polygon points='60,10 110,100 10,100' fill='%23ffd6e0' stroke='%23333' stroke-width='2'/><ellipse cx='60' cy='100' rx='50' ry='8' fill='%23f8b9c0' stroke='%23333' stroke-width='2'/></svg>", categoria: "Cono" }]
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

  // carga modo en pantalla (categorías + imágenes)
  function cargarModo(modo) {
    modoActual = modo;
    imagenesDiv.innerHTML = "";
    categoriasDiv.innerHTML = "";
    mensaje.textContent = "";

    const data = modos[modo];
    if (!data) return;

    // crear cajas de categoría
    data.categorias.forEach(cat => {
      const div = document.createElement("div");
      div.className = "categoria";
      div.textContent = cat;
      div.dataset.categoria = cat;

      // eventos drag/drop de ratón
      div.addEventListener("dragover", e => e.preventDefault());
      div.addEventListener("drop", e => {
        e.preventDefault();
        const categoria = e.dataTransfer.getData("categoria");
        const src = e.dataTransfer.getData("src");
        procesarColocacion(div, categoria, src);
      });

      categoriasDiv.appendChild(div);
    });

    // añadir imágenes (mezcladas)
    const imgs = shuffleArray([...data.imagenes]);
    imgs.forEach(item => {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.categoria;
      img.draggable = true;
      img.className = "figura";
      img.dataset.categoria = item.categoria;

      // drag nativo
      img.addEventListener("dragstart", e => {
        e.dataTransfer.setData("categoria", item.categoria);
        e.dataTransfer.setData("src", item.src);
        // pequeña mejora visual: transmitir tamaño
        try { e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2); } catch (e) {/* algunos navegadores no lo aceptan */ }
      });

      // soporte táctil: clonamos y seguimos el dedo
      img.addEventListener("touchstart", touchStart, { passive: false });
      img.addEventListener("touchmove", touchMove, { passive: false });
      img.addEventListener("touchend", touchEnd, { passive: false });

      // accesibilidad: permitir focus + keyboard "pick up" si se quiere (opcional)
      imagenesDiv.appendChild(img);
    });
  }

  // procesa colocación correcta/incorrecta: mantiene la funcionalidad previa
function procesarColocacion(categoriaDiv, categoriaArrastrada, src) {
  if (categoriaArrastrada === categoriaDiv.dataset.categoria) {
    categoriaDiv.classList.add("correcto");
    mensaje.textContent = "✅ ¡Bien hecho!";

    // ------ INICIO DE LA CORRECCIÓN ------
    
    // Ya no comparamos el 'src'.
    // Buscamos la imagen en 'imagenesDiv' que tenga la misma
    // categoría que la que acabamos de arrastrar.
    const imgOriginal = Array.from(imagenesDiv.querySelectorAll("img"))
                           .find(i => i.dataset.categoria === categoriaArrastrada);
    
    // ------ FIN DE LA CORRECCIÓN ------

    if (imgOriginal) imgOriginal.remove();


    // crear miniatura pequeña centrada BAJO el texto de la categoría
    const mini = document.createElement("img");
    mini.src = src;
    mini.alt = categoriaArrastrada;
    mini.className = "figura-colocada";
    // si ya había una miniatura, la reemplazamos
    const previa = categoriaDiv.querySelector(".figura-colocada");
    if (previa) previa.remove();
    categoriaDiv.appendChild(mini);

    // si no quedan imágenes en la zona superior, aviso final
    if (imagenesDiv.querySelectorAll("img").length === 0) {
      mensaje.textContent = "🎉 ¡Has clasificado todas las figuras!";
    }

    setTimeout(() => categoriaDiv.classList.remove("correcto"), 900);
  } else {
    categoriaDiv.classList.add("incorrecto");
    mensaje.textContent = "❌ Prueba otra vez.";
    setTimeout(() => {
      categoriaDiv.classList.remove("incorrecto");
      // limpiar mensaje breve
      mensaje.textContent = "";
    }, 900);
  }
}

  // ===== Soporte táctil: clon visual que sigue el dedo =====
  let toqueClone = null;
  let toqueOrigen = null; // referencia al img original durante el toque

  function touchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const src = this.src;
    toqueOrigen = this;

    // crear clon visual que seguirá el dedo
    toqueClone = this.cloneNode(true);
    toqueClone.style.position = "fixed";
    toqueClone.style.pointerEvents = "none";
    toqueClone.style.width = Math.max(60, this.clientWidth * 0.9) + "px";
    toqueClone.style.left = (touch.clientX - 40) + "px";
    toqueClone.style.top = (touch.clientY - 40) + "px";
    toqueClone.style.opacity = "0.95";
    toqueClone.classList.add("tocando-clon");
    document.body.appendChild(toqueClone);
  }

  function touchMove(e) {
    if (!toqueClone) return;
    e.preventDefault();
    const touch = e.touches[0];
    toqueClone.style.left = (touch.clientX - (toqueClone.clientWidth / 2)) + "px";
    toqueClone.style.top = (touch.clientY - (toqueClone.clientHeight / 2)) + "px";
  }

  function touchEnd(e) {
    if (!toqueClone) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // elemento bajo el dedo
    const target = document.elementFromPoint(x, y);
    let categoriaDiv = null;
    if (target) {
      if (target.classList.contains("categoria")) categoriaDiv = target;
      else categoriaDiv = target.closest(".categoria");
    }

    const categoriaArrastrada = toqueOrigen ? toqueOrigen.dataset.categoria : null;
    const src = toqueOrigen ? toqueOrigen.src : null;

    if (categoriaDiv && categoriaArrastrada && src) {
      procesarColocacion(categoriaDiv, categoriaArrastrada, src);
    }

    // eliminar clon y limpiar
    toqueClone.remove();
    toqueClone = null;
    // si queremos, podemos dejar la imagen original (no la eliminamos hasta procesar)
  }

  // utilidad barajar
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // eventos UI
  modoSelect.addEventListener("change", (e) => cargarModo(e.target.value));
  reiniciarBtn.addEventListener("click", () => cargarModo(modoActual));

  // carga inicial
  cargarModo(modoActual);
});
