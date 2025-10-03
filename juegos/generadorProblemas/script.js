// ========= script.js corregido y robusto =========

// Héroes (personajes buenos)
const heroes = [
  { nombre: "Mickey Mouse", img: "https://i.scdn.co/image/ab676161000051747ac3385e1033229ea480dc9d" },
  { nombre: "Mike Wazowski", img: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTMAWkzBGXKdD4-A-GtnwStQ1gEUmEO43IFbVUEUyvWMFeYWrXzzJZRTtbIWoY1CQNN8eL_4sYBvIZ8H7SyD5md97pLih_43_f8pSnLdg" },
  { nombre: "Simba", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Simba%28TheLionKing%29.png" },
  { nombre: "Elsa", img: "https://i.pinimg.com/736x/4f/75/75/4f75751faebebb0de3056d77ef81e11f.jpg" },
  { nombre: "Shrek", img: "https://static.voices.com/wp-content/uploads/2025/01/shrek-scaled.jpg" },
  { nombre: "Sonic", img: "https://pbs.twimg.com/profile_images/1915110623915954176/hkzPvPN2_400x400.jpg" },
  { nombre: "Stitch", img: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Stitch_%28Lilo_%26_Stitch%29.svg/868px-Stitch_%28Lilo_%26_Stitch%29.svg.png" },
  { nombre: "Buzz Lightyear", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpY_c4WcaKIQwHpyUyJ8F1zlB2Lk1NjzMDdQ&s" }
];

// Villanos (antagonistas)
const villanos = [
  { nombre: "Úrsula", img: "https://upload.wikimedia.org/wikipedia/en/e/e3/Ursula%28TheLittleMermaid%29character.png" },
  { nombre: "Scar", img: "https://i.redd.it/odwld6wowzy71.png" },
  { nombre: "Wario", img: "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Wario.png/250px-Wario.png" },
  { nombre: "El Impostor", img: "https://www.citypng.com/public/uploads/preview/hd-orange-character-imposter-in-vent-among-us-png-733961695044797zyn8orilkv.png?v=2025061205" },
  { nombre: "Eggman", img: "https://fbi.cults3d.com/uploaders/39919480/illustration-file/f9e044ca-2135-48ea-a917-71cc5ecc2c41/WhatsApp-Image-2025-08-02-at-11.01.43-PM.jpeg" },
  { nombre: "Hades", img: "https://gamerpeak.com/wp-content/uploads/2024/07/hades-token.png" },
  { nombre: "Maléfica", img: "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2019/10/malefica-maestra-mal_3.jpg?tf=1200x1200" }
];

// Objetos y acciones narrativas
const objetos = [
  "manzanas","caramelos","lápices","pelotas","galletas",
  "estrellas","flores","monedas","cubos","diamantes","zapatos"
];

const acciones = [
  "reparte","regala","pierde","recibe","vende","junta",
  "agrupa","distribuye","comparte","reparte en grupos de","cada uno tiene"
];

// Variables globales (se rellenan / usan en los botones)
let personaje1 = null, personaje2 = null;
let accionSel = null;
let objeto1 = null, objeto2 = null;
// numX son los valores que se mostrarán y con los que se construye el problema
let num1 = null, num2 = null, num3 = null, num4 = null;
let ultimoProblema = null;

// ========== utilidades numéricas ==========

function numeroAleatorio(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// número grande 3-4 cifras
function numeroGrande(){
  return numeroAleatorio(100, 9999);
}

// generar par para resta (a >= b) con 3-4 cifras
function parParaResta(){
  let a = numeroGrande();
  let b = numeroGrande();
  if(b > a) [a,b] = [b,a];
  return [a,b];
}

// generar división exacta con dividendo 3-4 cifras y divisor pequeño (2..9)
// elegimos cociente de 3 cifras y divisor 1 cifra para que el dividendo quede 3-4 cifras
function parParaDivisionExacta(){
  const divisor = numeroAleatorio(2,9);
  const cociente = numeroAleatorio(100,999); // 3 cifras
  const dividendo = divisor * cociente; // exacto, 3-4 cifras (hasta 8991)
  return [dividendo, divisor];
}

// generar multiplicación moderada con resultado 3-4 cifras
// hacemos pocas cajas (2..9) y muchos objetos por caja (100..999) => producto 3-4 cifras
function parParaMultiplicacion(){
  const cajas = numeroAleatorio(2,9);        // 1 cifra
  const objetosPorCaja = numeroAleatorio(100,999); // 3 cifras
  return [cajas, objetosPorCaja];
}

// ========== funciones que llaman los botones (mantener el HTML) ==========

// sortear personaje: idImg = id del <img> en el HTML; isVillano = true si queremos villano
function sortearPersonaje(idImg, isVillano = false){
  const lista = isVillano ? villanos : heroes;
  const p = lista[Math.floor(Math.random()*lista.length)];
  if(isVillano) personaje2 = p; else personaje1 = p;
  const img = document.getElementById(idImg);
  if(img){
    img.src = p.img;
    img.alt = p.nombre;
  }
  ocultarRevelaciones();
}

// sortear acción (verbo narrativo)
function sortearAccion(){
  accionSel = acciones[Math.floor(Math.random()*acciones.length)];
  document.getElementById("accion").textContent = accionSel;
  ocultarRevelaciones();
}

// sortear objeto 1 o 2
function sortearObjeto(idSpan, isSecond = false){
  const o = objetos[Math.floor(Math.random()*objetos.length)];
  if(isSecond) objeto2 = o; else objeto1 = o;
  document.getElementById(idSpan).textContent = o;
  ocultarRevelaciones();
}

// sortear números: GENERA LOS NÚMEROS ADECUADOS SEGÚN LA ACCIÓN SELECCIONADA
function sortearNumeros(){
  if(!accionSel){
    // Si no hay acción, generamos 4 números grandes y los mostramos
    num1 = numeroGrande();
    num2 = numeroGrande();
    num3 = numeroGrande();
    num4 = numeroGrande();
    document.getElementById("numeros").textContent = `${num1}, ${num2}, ${num3}, ${num4}`;
    ocultarRevelaciones();
    return;
  }

  // según la acción, generamos los números que harán sentido y cumplen tus condiciones
  switch(accionSel){
    // suma entre dos personajes: usamos dos números grandes
    case "junta":
    case "recibe":
    case "regala":
      num1 = numeroGrande();
      num2 = numeroGrande();
      document.getElementById("numeros").textContent = `${num1}, ${num2}`;
      break;

    // restas: dos restas separadas, aseguramos no negativos
    case "pierde":
    case "vende":
      [num1, num2] = parParaResta();
      [num3, num4] = parParaResta();
      document.getElementById("numeros").textContent = `${num1}, ${num2}, ${num3}, ${num4}`;
      break;

    // reparto / división exacta
    case "reparte":
    case "distribuye":
    case "comparte":
    case "reparte en grupos de":
      // dividendo y divisor exactos
      [num1, num2] = parParaDivisionExacta(); // num1 = dividendo, num2 = divisor
      document.getElementById("numeros").textContent = `${num1}, ${num2}`;
      break;

    // multiplicación tipo cajas con objetos (cada uno)
    case "agrupa":
    case "cada uno tiene":
      // generamos dos pares (cajas, objetosPorCaja) para personaje1 y personaje2
      const p1 = parParaMultiplicacion();
      const p2 = parParaMultiplicacion();
      num1 = p1[0]; // cajas1
      num2 = p1[1]; // objetosPorCaja1
      num3 = p2[0]; // cajas2
      num4 = p2[1]; // objetosPorCaja2
      document.getElementById("numeros").textContent = `${num1}, ${num2}, ${num3}, ${num4}`;
      break;

    // caso por defecto: generamos cuatro números grandes
    default:
      num1 = numeroGrande();
      num2 = numeroGrande();
      num3 = numeroGrande();
      num4 = numeroGrande();
      document.getElementById("numeros").textContent = `${num1}, ${num2}, ${num3}, ${num4}`;
  }

  ocultarRevelaciones();
}

// ========== generar el problema usando EXACTAMENTE los num1..num4 que hemos sorteado ==========
function generarProblema(){
  const fraseEl = document.getElementById("frase");
  if(!personaje1 || !personaje2 || !accionSel || !objeto1 || !objeto2){
    fraseEl.textContent = "⚠️ ¡Primero sortea personaje, acción y objetos!";
    return;
  }
  // también pedimos que el maestro haya pulsado 'sortear números' para que num1..num4 existan
  if(num1 == null){
    fraseEl.textContent = "⚠️ ¡Primero sortea los números!";
    return;
  }

  let frase = "";
  let operaciones = [];

  switch(accionSel){
    // SUMAS / juntar
    case "junta":
    case "recibe":
    case "regala":
      // usamos num1 y num2 (ya son 3-4 cifras)
      frase = `${personaje1.nombre} tiene ${num1} ${objeto1} y ${personaje2.nombre} tiene ${num2} ${objeto2}. ¿Cuántos objetos hay en total?`;
      operaciones = [`${num1} + ${num2}`];
      break;

    // RESTAS (dos restas separadas) -> no negativas, usamos los pares ya preparados
    case "pierde":
       // aquí num1>=num2 y num3>=num4 por construcción en sortearNumeros()
      frase = `${personaje1.nombre} tiene ${num1} ${objeto1} pero pierde ${num2}. ${personaje2.nombre} tiene ${num3} ${objeto2} pero pierde ${num4}. ¿Cuántos objetos quedan en total?`;
      operaciones = [`${num1} - ${num2}`, `${num3} - ${num4}`];
      break;
    case "vende":
      // aquí num1>=num2 y num3>=num4 por construcción en sortearNumeros()
      frase = `${personaje1.nombre} tiene ${num1} ${objeto1} pero vende ${num2}. ${personaje2.nombre} tiene ${num3} ${objeto2} pero vende ${num4}. ¿Cuántos objetos le quedan en total?`;
      operaciones = [`${num1} - ${num2}`, `${num3} - ${num4}`];
      break;

    // DIVISIÓN (repartir en grupos) -> usamos num1 (dividendo) y num2 (divisor)
    case "reparte":
    case "distribuye":
    case "comparte":
    case "reparte en grupos de":
      // num1 (dividendo) y num2 (divisor) garantizan división exacta
      frase = `${personaje1.nombre} reparte ${num1} ${objeto1} entre ${num2} amigos. ¿Cuántos recibe cada uno?`;
      operaciones = [`${num1} ÷ ${num2}`];
      break;

    // MULTIPLICACIÓN narrada (cajas con objetos): dos multiplicaciones, una por personaje
    case "agrupa":
    case "cada uno tiene":
      // num1 = cajas1, num2 = objetosPorCaja1, num3 = cajas2, num4 = objetosPorCaja2
      frase = `${personaje1.nombre} tiene ${num1} cajas con ${num2} ${objeto1} en cada una. ${personaje2.nombre} tiene ${num3} cajas con ${num4} ${objeto2} en cada una. ¿Cuántos objetos tiene cada uno?`;
      operaciones = [`${num1} x ${num2}`, `${num3} x ${num4}`];
      break;

    // caso genérico (por seguridad)
    default:
      frase = `${personaje1.nombre} ${accionSel} ${num1} ${objeto1}.`;
      operaciones = [`${num1}`];
  }

  // guardamos también los números mostrados como "datos"
  const datosMostrados = document.getElementById("numeros").textContent || "";
  ultimoProblema = { accion: accionSel, frase, operaciones, datos: datosMostrados };

  fraseEl.textContent = "📚 " + frase;
  ocultarRevelaciones();
}

// ========== funciones de revelación (botones) ==========

function mostrarDatos(){
  if(!ultimoProblema){ mostrarAviso("datosProblema","⚠️ Primero genera el problema."); return; }
  const el = document.getElementById("datosProblema");
  // mostramos SOLO los números (tal y como están en la casilla 'numeros')
  el.textContent = ultimoProblema.datos || "";
  mostrarElemento(el);
}

function mostrarOperacion(){
  if(!ultimoProblema){ mostrarAviso("operacionProblema","⚠️ Primero genera el problema."); return; }
  const el = document.getElementById("operacionProblema");
  // mostramos la/s operaciones en formato legible (x y ÷ se mantienen)
  el.textContent = ultimoProblema.operaciones.join("  y  ");
  mostrarElemento(el);
}

function mostrarSolucion(){
  if(!ultimoProblema){ 
    mostrarAviso("solucionProblema","⚠️ Primero genera el problema."); 
    return; 
  }

  let soluciones = [];

  switch(accionSel){
    // SUMAS
    case "junta":
    case "recibe":
    case "regala":
    case "da":
      let suma = num1 + num2;
      soluciones.push(`${suma} ${objeto1} y ${objeto2}`);
      break;

    // RESTAS (dos operaciones)
    case "pierde":
    case "vende":
      let resta1 = num1 - num2;
      let resta2 = num3 - num4;
      soluciones.push(`${resta1} ${objeto1}`, `${resta2} ${objeto2}`);
      break;

    // DIVISIÓN
    case "reparte":
    case "distribuye":
    case "comparte":
    case "reparte en grupos de":
      let division = num1 / num2;
      soluciones.push(`${division} ${objeto1} para cada uno`);
      break;

    // MULTIPLICACIÓN (dos personajes)
    case "agrupa":
    case "cada uno tiene":
      let mult1 = num1 * num2;
      let mult2 = num3 * num4;
      soluciones.push(`${mult1} ${objeto1}`, `${mult2} ${objeto2}`);
      break;

    // fallback
    default:
      soluciones.push("?");
  }

  const el = document.getElementById("solucionProblema");
  el.textContent = `Solución: ${soluciones.join(" y ")}`;
  mostrarElemento(el);
}


// ========== utilidades de DOM ==========

function mostrarElemento(el){
  el.classList.remove("d-none");
  el.classList.add("d-block");
}
function ocultarRevelaciones(){
  ["datosProblema","operacionProblema","solucionProblema"].forEach(id=>{
    const e=document.getElementById(id);
    if(e){
      e.classList.add("d-none");
      e.classList.remove("d-block");
      e.textContent = "";
    }
  });
}
function mostrarAviso(id,msg){
  const e=document.getElementById(id);
  if(e){
    e.textContent = msg;
    mostrarElemento(e);
  }
}
