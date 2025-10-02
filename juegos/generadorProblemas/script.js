const personajes = [
  { nombre: "Mickey Mouse", img: "https://i.scdn.co/image/ab676161000051747ac3385e1033229ea480dc9d" },
  { nombre: "Winnie the Pooh", img: "https://lumiere-a.akamaihd.net/v1/images/c94eed56a5e84479a2939c9172434567c0147d4f.jpeg?region=0,0,600,600" },
  { nombre: "Simba", img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Simba%28TheLionKing%29.png" },
  { nombre: "Peppa Pig", img: "https://yt3.googleusercontent.com/UcqRp_waE3QO_pqqRLSB3GXDHtlC_U-YINOg29qg9I6TJGH43BVACH1aotJ_tVOKq0RPLfCW6cw=s900-c-k-c0x00ffffff-no-rj" },
  { nombre: "Bob Esponja", img: "https://upload.wikimedia.org/wikipedia/commons/7/7a/SpongeBob_SquarePants_character.png" },
  { nombre: "Elsa", img: "https://i.pinimg.com/736x/4f/75/75/4f75751faebebb0de3056d77ef81e11f.jpg" },
  { nombre: "Buzz Lightyear", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpY_c4WcaKIQwHpyUyJ8F1zlB2Lk1NjzMDdQ&s" }
];

const acciones = ["gana","pierde","reparte","divide","compra","vende"];
const objetos = [
  "manzanas","caramelos","escarabajos","lápices","pelotas","galletas",
  "estrellas","flores","monedas","cubos","diamantes","zapatos"
];

// Variables seleccionadas
let personaje1 = null, personaje2 = null;
let accionSel = null;
let objeto1 = null, objeto2 = null;
let num1 = null, num2 = null, num3 = null, num4 = null;
let ultimoProblema = null;

function numeroAleatorio(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sorteos
function sortearPersonaje(idImg, isSecond = false){
  const p = personajes[Math.floor(Math.random()*personajes.length)];
  if(isSecond) {
    personaje2 = p;
  } else {
    personaje1 = p;
  }
  document.getElementById(idImg).src = p.img;
  document.getElementById(idImg).alt = p.nombre;
  ocultarRevelaciones();
}
function sortearAccion(){
  accionSel = acciones[Math.floor(Math.random()*acciones.length)];
  document.getElementById("accion").textContent = accionSel;
  ocultarRevelaciones();
}
function sortearObjeto(idSpan, isSecond = false){
  const o = objetos[Math.floor(Math.random()*objetos.length)];
  if(isSecond) {
    objeto2 = o;
  } else {
    objeto1 = o;
  }
  document.getElementById(idSpan).textContent = o;
  ocultarRevelaciones();
}
function sortearNumeros(){
  num1 = numeroAleatorio(10, 99);
  num2 = numeroAleatorio(10, 99);
  num3 = numeroAleatorio(10, 99);
  num4 = numeroAleatorio(10, 99);
  document.getElementById("numeros").textContent = `${num1}, ${num2}, ${num3}, ${num4}`;
  ocultarRevelaciones();
}

// Generación del problema
function generarProblema(){
  const fraseEl = document.getElementById("frase");
  if(!personaje1 || !personaje2 || !accionSel || !objeto1 || !objeto2 || num1==null){
    fraseEl.textContent = "⚠️ ¡Primero sortea todos los elementos!";
    return;
  }

  let frase = "";
  let operaciones = [];

  switch(accionSel){
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
      frase = `${personaje1.nombre} reparte ${num1} ${objeto1} entre ${num2} amigos. ¿Cuántos recibe cada uno?`;
      operaciones = [`${num1} ÷ ${num2}`];
      break;
    case "divide":
      frase = `${personaje2.nombre} divide ${num3} ${objeto2} en grupos de ${num4}. ¿Cuántos grupos consigue?`;
      operaciones = [`${num3} ÷ ${num4}`];
      break;
    default:
      frase = `${personaje1.nombre} ${accionSel} ${num1} ${objeto1}.`;
      operaciones = [`${num1} ? ${num2}`];
  }

  ultimoProblema = {accion:accionSel, frase, operaciones};
  fraseEl.textContent = "📚 " + frase;
  ocultarRevelaciones();
}

// Revelaciones
function mostrarDatos(){
  if(!ultimoProblema){ mostrarAviso("datosProblema","⚠️ Primero genera el problema."); return; }
  const el = document.getElementById("datosProblema");
  el.textContent = `Operaciones a realizar: ${ultimoProblema.operaciones.join(" y ")}`;
  mostrarElemento(el);
}
function mostrarOperacion(){
  if(!ultimoProblema){ mostrarAviso("operacionProblema","⚠️ Primero genera el problema."); return; }
  const el = document.getElementById("operacionProblema");
  el.textContent = ultimoProblema.operaciones.join(" | ");
  mostrarElemento(el);
}
function mostrarSolucion(){
  if(!ultimoProblema){ mostrarAviso("solucionProblema","⚠️ Primero genera el problema."); return; }
  let soluciones = ultimoProblema.operaciones.map(op=>{
    try{
      return eval(op.replace("÷","/"));
    }catch{ return "?"; }
  });
  const el = document.getElementById("solucionProblema");
  el.textContent = `Solución: ${soluciones.join(" y ")}`;
  mostrarElemento(el);
}

// Utilidades
function mostrarElemento(el){
  el.classList.remove("d-none");
  el.classList.add("d-block");
}
function ocultarRevelaciones(){
  ["datosProblema","operacionProblema","solucionProblema"].forEach(id=>{
    const e=document.getElementById(id);
    e.classList.add("d-none");
    e.classList.remove("d-block");
    e.textContent="";
  });
}
function mostrarAviso(id,msg){
  const e=document.getElementById(id);
  e.textContent=msg;
  mostrarElemento(e);
}
