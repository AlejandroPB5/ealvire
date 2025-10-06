// ========= script.js actualizado =========

// Héroes (personajes buenos)
const heroes = [
  { nombre: "Mickey", img: "https://i.scdn.co/image/ab676161000051747ac3385e1033229ea480dc9d" },
  { nombre: "Mike Wazowski", img: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTMAWkzBGXKdD4-A-GtnwStQ1gEUmEO43IFbVUEUyvWMFeYWrXzzJZRTtbIWoY1CQNN8eL_4sYBvIZ8H7SyD5md97pLih_43_f8pSnLdg" },
  { nombre: "Simba", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Simba%28TheLionKing%29.png" },
  { nombre: "Elsa", img: "https://artinsights.com/wp-content/uploads/2013/12/Frozen_Queen_Elsa.png" },
  { nombre: "Shrek", img: "https://www.nbcstore.com/cdn/shop/products/SHREK-SS-63-MF1_grande.jpg?v=1693905182" },
  { nombre: "Sonic", img: "https://pbs.twimg.com/profile_images/1915110623915954176/hkzPvPN2_400x400.jpg" },
  { nombre: "Stitch", img: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Stitch_%28Lilo_%26_Stitch%29.svg/868px-Stitch_%28Lilo_%26_Stitch%29.svg.png" },
  { nombre: "Buzz-Lightyear", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpY_c4WcaKIQwHpyUyJ8F1zlB2Lk1NjzMDdQ&s" }
];

// Villanos (antagonistas)
const villanos = [
  { nombre: "Úrsula", img: "https://upload.wikimedia.org/wikipedia/en/e/e3/Ursula%28TheLittleMermaid%29character.png" },
  { nombre: "Scar", img: "https://i.redd.it/odwld6wowzy71.png" },
  { nombre: "Wario", img: "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Wario.png/250px-Wario.png" },
  { nombre: "Hades", img: "https://gamerpeak.com/wp-content/uploads/2024/07/hades-token.png" },
  { nombre: "Eggman", img: "https://fbi.cults3d.com/uploaders/39919480/illustration-file/f9e044ca-2135-48ea-a917-71cc5ecc2c41/WhatsApp-Image-2025-08-02-at-11.01.43-PM.jpeg" },
  { nombre: "Maléfica", img: "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2019/10/malefica-maestra-mal_3.jpg?tf=1200x1200" },
  { nombre: "El Impostor", img: "https://www.citypng.com/public/uploads/preview/hd-orange-character-imposter-in-vent-among-us-png-733961695044797zyn8orilkv.png?v=2025061205" }
];

// Objetos y acciones narrativas
const objetos = ["manzanas", "caramelos", "lápices", "pelotas", "galletas", "estrellas", "flores", "monedas", "cubos", "diamantes", "zapatos"];
const acciones = ["Reparte", "Regala", "Pierde", "Recibe", "Vende", "Junta", "Agrupa", "Distribuye", "Comparte", "Reparte en grupos de", "Cada uno tiene"];

// Variables globales
let personaje1 = null, personaje2 = null;
let accionSel = null;
let objeto1 = null, objeto2 = null;
let num1 = null, num2 = null, num3 = null, num4 = null;
let ultimoProblema = null;

// ========== utilidades numéricas ==========

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function numeroGrande() {
  return numeroAleatorio(100, 9999);
}
function parParaResta() {
  let a = numeroGrande(), b = numeroGrande();
  if (b > a) [a, b] = [b, a];
  return [a, b];
}
function parParaDivisionExacta() {
  const divisor = numeroAleatorio(2, 9);
  const cociente = numeroAleatorio(100, 999);
  const dividendo = divisor * cociente;
  return [dividendo, divisor];
}
function parParaMultiplicacion() {
  const cajas = numeroAleatorio(2, 9);
  const objetosPorCaja = numeroAleatorio(100, 999);
  return [cajas, objetosPorCaja];
}

// ========== funciones de sorteo ==========

function sortearPersonaje(idImg, isVillano = false) {
  const lista = isVillano ? villanos : heroes;
  const p = lista[Math.floor(Math.random() * lista.length)];
  if (isVillano) personaje2 = p; else personaje1 = p;
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
  if (isSecond) objeto2 = o; else objeto1 = o;
  document.getElementById(idSpan).textContent = o;
  ocultarRevelaciones();
}
function sortearNumeros() {
  if (!accionSel) {
    num1 = numeroGrande(); num2 = numeroGrande(); num3 = numeroGrande(); num4 = numeroGrande();
    document.getElementById("numeros").textContent = `${num1}, ${num2}, ${num3}, ${num4}`;
    return;
  }
  switch (accionSel.toLowerCase()) {
    case "junta":
    case "recibe":
    case "regala":
      num1 = numeroGrande(); num2 = numeroGrande();
      break;
    case "pierde":
    case "vende":
      [num1, num2] = parParaResta();
      [num3, num4] = parParaResta();
      break;
    case "reparte":
    case "distribuye":
    case "comparte":
    case "reparte en grupos de":
      [num1, num2] = parParaDivisionExacta();
      break;
    case "agrupa":
    case "cada uno tiene":
      [num1, num2] = parParaMultiplicacion();
      [num3, num4] = parParaMultiplicacion();
      break;
    default:
      num1 = numeroGrande(); num2 = numeroGrande(); num3 = numeroGrande(); num4 = numeroGrande();
  }
  document.getElementById("numeros").textContent = [num1, num2, num3, num4].filter(Boolean).join(", ");
  ocultarRevelaciones();
}

// ========== generar problema ==========

function generarProblema() {
  const fraseEl = document.getElementById("frase");
  if (!personaje1 || !personaje2 || !accionSel || !objeto1 || !objeto2) {
    fraseEl.textContent = "⚠️ ¡Primero sortea personaje, acción y objetos!";
    return;
  }
  if (num1 == null) {
    fraseEl.textContent = "⚠️ ¡Primero sortea los números!";
    return;
  }

  let frase = "", operaciones = [];
  switch (accionSel.toLowerCase()) {
    case "junta":
    case "recibe":
    case "regala":
      frase = `${personaje1.nombre} tiene ${num1} ${objeto1} y ${personaje2.nombre} tiene ${num2} ${objeto2}. ¿Cuántos hay en total?`;
      operaciones = [`${num1} + ${num2}`];
      break;
    case "pierde":
    case "vende":
      frase = `${personaje1.nombre} tiene ${num1} ${objeto1} pero ${accionSel.toLowerCase()} ${num2}. ${personaje2.nombre} tiene ${num3} ${objeto2} pero ${accionSel.toLowerCase()} ${num4}. ¿Cuántos quedan en total?`;
      operaciones = [`${num1} - ${num2}`, `${num3} - ${num4}`];
      break;
    case "reparte":
    case "distribuye":
    case "comparte":
    case "reparte en grupos de":
      frase = `${personaje1.nombre} ${accionSel.toLowerCase()} ${num1} ${objeto1} entre ${num2} amigos. ¿Cuántos recibe cada uno?`;
      operaciones = [`${num1} ÷ ${num2}`];
      break;
    case "agrupa":
    case "cada uno tiene":
      frase = `${personaje1.nombre} tiene ${num1} cajas con ${num2} ${objeto1} cada una. ${personaje2.nombre} tiene ${num3} cajas con ${num4} ${objeto2} cada una. ¿Cuántos objetos tiene cada uno?`;
      operaciones = [`${num1} × ${num2}`, `${num3} × ${num4}`];
      break;
    default:
      frase = `${personaje1.nombre} ${accionSel.toLowerCase()} ${num1} ${objeto1}.`;
      operaciones = [`${num1}`];
  }
  frase = frase.charAt(0).toUpperCase() + frase.slice(1);
  ultimoProblema = { accion: accionSel, frase, operaciones };
  fraseEl.textContent = "📚 " + frase;
  ocultarRevelaciones();
}

// ========== revelaciones ==========

function mostrarDatos() {
  if (!ultimoProblema) return mostrarAviso("datosProblema", "⚠️ Primero genera el problema.");
  document.getElementById("datosProblema").textContent = document.getElementById("numeros").textContent;
  mostrarElemento("datosProblema");
}
function mostrarOperacion() {
  if (!ultimoProblema) return mostrarAviso("operacionProblema", "⚠️ Primero genera el problema.");
  document.getElementById("operacionProblema").textContent = ultimoProblema.operaciones.join(" y ");
  mostrarElemento("operacionProblema");
}
function mostrarSolucion() {
  if (!ultimoProblema) return mostrarAviso("solucionProblema", "⚠️ Primero genera el problema.");
  let soluciones = [];
  switch (accionSel.toLowerCase()) {
    case "junta":
    case "recibe":
    case "regala":
      soluciones.push(`${num1 + num2} ${objeto1} y ${objeto2}`);
      break;
    case "pierde":
    case "vende":
      soluciones.push(`${num1 - num2} ${objeto1}`, `${num3 - num4} ${objeto2}`);
      break;
    case "reparte":
    case "distribuye":
    case "comparte":
    case "reparte en grupos de":
      soluciones.push(`${num1 / num2} ${objeto1} para cada uno`);
      break;
    case "agrupa":
    case "cada uno tiene":
      soluciones.push(`${num1 * num2} ${objeto1}`, `${num3 * num4} ${objeto2}`);
      break;
  }
  document.getElementById("solucionProblema").textContent = "Solución: " + soluciones.join(" y ");
  mostrarElemento("solucionProblema");
}

// ========== utilidades DOM ==========

function mostrarElemento(id) {
  const e = document.getElementById(id);
  e.classList.remove("d-none");
  e.classList.add("d-block");
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
  mostrarElemento(id);
}
