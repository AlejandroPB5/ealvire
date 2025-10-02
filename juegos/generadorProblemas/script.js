const personajes = [
  { nombre: "Mickey Mouse", img: "https://i.scdn.co/image/ab676161000051747ac3385e1033229ea480dc9d" },
  { nombre: "Winnie the Pooh", img: "https://lumiere-a.akamaihd.net/v1/images/c94eed56a5e84479a2939c9172434567c0147d4f.jpeg?region=0,0,600,600" },
  { nombre: "Simba", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Simba%28TheLionKing%29.png" },
  { nombre: "Peppa Pig", img: "https://yt3.googleusercontent.com/UcqRp_waE3QO_pqqRLSB3GXDHtlC_U-YINOg29qg9I6TJGH43BVACH1aotJ_tVOKq0RPLfCW6cw=s900-c-k-c0x00ffffff-no-rj" },
  { nombre: "Bob Esponja", img: "https://upload.wikimedia.org/wikipedia/commons/7/7a/SpongeBob_SquarePants_character.png" },
  { nombre: "Elsa", img: "https://i.pinimg.com/736x/4f/75/75/4f75751faebebb0de3056d77ef81e11f.jpg" },
  { nombre: "Buzz Lightyear", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpY_c4WcaKIQwHpyUyJ8F1zlB2Lk1NjzMDdQ&s" }
];

const acciones = ["gana", "pierde", "reparte", "divide", "compra", "vende", "multiplica"];
const objetos = [
  "manzanas", "caramelos", "escarabajos", "lápices", "pelotas", "galletas",
  "estrellas", "flores", "monedas", "cubos", "diamantes", "zapatos"
];

// Variables seleccionadas
let personaje1 = null, personaje2 = null;
let accionSel = null;
let objeto1 = null, objeto2 = null;
let num1 = null, num2 = null, num3 = null, num4 = null;
let ultimoProblema = null;

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sorteos
function sortearPersonaje(idImg, isSecond = false) {
  const p = personajes[Math.floor(Math.random() * personajes.length)];
  if (isSecond) {
    personaje2 = p;
  } else {
    personaje1 = p;
  }
  document.getElementById(idImg).src = p.img;
  document.getElementById(idImg).alt = p.nombre;
  ocultarRevelaciones();
}
function sortearAccion() {
  accionSel = acciones[Math.floor(Math.random() * acciones.length)];
  document.getElementById("accion").textContent = accionSel;
  ocultarRevelaciones();
}
function sortearObjeto(idSpan, isSecond = false) {
  const o = objetos[Math.floor(Math.random() * objetos.length)];
  if (isSecond) {
    objeto2 = o;
  } else {
    objeto1 = o;
  }
  document.getElementById(idSpan).textContent = o;
  ocultarRevelaciones();
}
function sortearNumeros() {
  // Generamos 4 números; algunos casos usarán combinaciones para garantizar divisiones exactas
  num1 = numeroAleatorio(2, 20);
  num2 = numeroAleatorio(2, 12);
  num3 = numeroAleatorio(2, 20);
  num4 = numeroAleatorio(2, 12);
  document.getElementById("numeros").textContent = `${num1}, ${num2}, ${num3}, ${num4}`;
  ocultarRevelaciones();
}

// Generación del problema
function generarProblema() {
  const fraseEl = document.getElementById("frase");
  if (!personaje1 || !personaje2 || !accionSel || !objeto1 || !objeto2 || num1 == null) {
    fraseEl.textContent = "⚠️ ¡Primero sortea todos los elementos!";
    return;
  }

  let frase = "";
  let operaciones = [];

  switch (accionSel) {
    case "gana":
      frase = `${personaje1.nombre} gana ${num1} ${objeto1} y ${personaje2.nombre} gana ${num2} ${objeto2}. ¿Cuántos objetos tienen entre los dos?`;
      operaciones = [`${num1} + ${num2}`];
      break;

    case "pierde":
      frase = `${personaje1.nombre} tenía ${num1} ${objeto1} pero pierde ${num2}. Luego ${personaje2.nombre} tenía ${num3} ${objeto2} y pierde ${num4}. ¿Cuántos objetos les quedan en total?`;
      operaciones = [`${num1} - ${num2}`, `${num3} - ${num4}`];
      break;

    case "compra":
      frase = `${personaje1.nombre} compra ${num1} ${objeto1} y luego ${num2} más. ${personaje2.nombre} compra ${num3} ${objeto2} y luego ${num4} más. ¿Cuántos objetos tienen en total?`;
      operaciones = [`${num1} + ${num2}`, `${num3} + ${num4}`];
      break;

    case "vende":
      frase = `${personaje1.nombre} tenía ${num1} ${objeto1} y vende ${num2}. ${personaje2.nombre} tenía ${num3} ${objeto2} y vende ${num4}. ¿Cuántos objetos conservan en total?`;
      operaciones = [`${num1} - ${num2}`, `${num3} - ${num4}`];
      break;

    case "reparte":
      // Hacemos total divisible por num2 para que la división sea exacta: total = num1 * num2
      const totalReparte = num1 * num2;
      frase = `${personaje1.nombre} reparte ${totalReparte} ${objeto1} entre ${num2} amigos. ¿Cuántos recibe cada uno?`;
      operaciones = [`${totalReparte} ÷ ${num2}`];
      break;

    case "divide":
      // Aseguramos división exacta: total = num3 * num4
      const totalDivide = num3 * num4;
      frase = `${personaje2.nombre} divide ${totalDivide} ${objeto2} en grupos de ${num4}. ¿Cuántos grupos consigue?`;
      operaciones = [`${totalDivide} ÷ ${num4}`];
      break;

    case "multiplica":
      // Multiplicación: un personaje y el otro, ambos con cajas y objetos
      const cajas1 = num1;
      const objetosPorCaja1 = num2;
      const cajas2 = num3;
      const objetosPorCaja2 = num4;

      frase = `${personaje1.nombre} tiene ${cajas1} cajas con ${objetosPorCaja1} ${objeto1} en cada una. 
  ${personaje2.nombre} tiene ${cajas2} cajas con ${objetosPorCaja2} ${objeto2} en cada una. 
  ¿Cuántos objetos tiene cada uno?`;

      operaciones = [
        `${cajas1} x ${objetosPorCaja1}`,
        `${cajas2} x ${objetosPorCaja2}`
      ];
      break;


    default:
      frase = `${personaje1.nombre} ${accionSel} ${num1} ${objeto1}.`;
      operaciones = [`${num1} ? ${num2}`];
  }

  ultimoProblema = { accion: accionSel, frase, operaciones, datos: [num1, num2, num3, num4] };
  fraseEl.textContent = "📚 " + frase;
  ocultarRevelaciones();
}

// Revelaciones
function mostrarDatos() {
  if (!ultimoProblema) { mostrarAviso("datosProblema", "⚠️ Primero genera el problema."); return; }
  const el = document.getElementById("datosProblema");
  // mostramos solo los números relevantes
  el.textContent = `Números: ${ultimoProblema.datos.join(", ")}`;
  mostrarElemento(el);
}
function mostrarOperacion() {
  if (!ultimoProblema) { mostrarAviso("operacionProblema", "⚠️ Primero genera el problema."); return; }
  const el = document.getElementById("operacionProblema");
  el.textContent = `Operación/es: ${ultimoProblema.operaciones.join("  y  ")}`;
  mostrarElemento(el);
}
function mostrarSolucion() {
  if (!ultimoProblema) { mostrarAviso("solucionProblema", "⚠️ Primero genera el problema."); return; }

  let soluciones = ultimoProblema.operaciones.map(op => {
    try {
      // sustituir símbolos por expresiones JS
      const expr = op.replace(/÷/g, '/').replace(/x/g, '*');
      const val = eval(expr);
      // mostrar como entero si lo es, sino con 2 decimales
      return Number.isInteger(val) ? val : parseFloat(val.toFixed(2));
    } catch (e) {
      return "?";
    }
  });

  const el = document.getElementById("solucionProblema");
  el.textContent = `Solución: ${soluciones.join(" y ")}`;
  mostrarElemento(el);
}

// Utilidades
function mostrarElemento(el) {
  el.classList.remove("d-none");
  el.classList.add("d-block");
}
function ocultarRevelaciones() {
  ["datosProblema", "operacionProblema", "solucionProblema"].forEach(id => {
    const e = document.getElementById(id);
    e.classList.add("d-none");
    e.classList.remove("d-block");
    e.textContent = "";
  });
}
function mostrarAviso(id, msg) {
  const e = document.getElementById(id);
  e.textContent = msg;
  mostrarElemento(e);
}
