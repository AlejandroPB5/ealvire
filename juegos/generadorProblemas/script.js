// Ejemplo con imágenes libres (reemplaza URLs por las que prefieras)
const personajes = [
  { nombre: "Mickey Mouse", img: "https://i.scdn.co/image/ab676161000051747ac3385e1033229ea480dc9d" },
  { nombre: "Winnie the Pooh", img: "https://lumiere-a.akamaihd.net/v1/images/c94eed56a5e84479a2939c9172434567c0147d4f.jpeg?region=0,0,600,600" },
  { nombre: "Simba", img: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Simba%28TheLionKing%29.png/250px-Simba%28TheLionKing%29.png" },
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

let personajeSel = null, accionSel = null, objetoSel = null;
let num1Sel = null, num2Sel = null;
let ultimoProblema = null;

function numeroAleatorio(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sortearPersonaje(){
  const p = personajes[Math.floor(Math.random()*personajes.length)];
  personajeSel = p;
  document.getElementById("personajeImg").src = p.img;
  document.getElementById("personajeImg").alt = p.nombre;
  ocultarRevelaciones();
}
function sortearAccion(){
  accionSel = acciones[Math.floor(Math.random()*acciones.length)];
  document.getElementById("accion").textContent = accionSel;
  ocultarRevelaciones();
}
function sortearObjeto(){
  objetoSel = objetos[Math.floor(Math.random()*objetos.length)];
  document.getElementById("objeto").textContent = objetoSel;
  ocultarRevelaciones();
}
function sortearNumeros(){
  num1Sel = numeroAleatorio(100, 9999);
  num2Sel = numeroAleatorio(10, 99);
  document.getElementById("numeros").textContent = `${num1Sel} - ${num2Sel}`;
  ocultarRevelaciones();
}

function generarProblema(){
  const fraseEl = document.getElementById("frase");
  if(!personajeSel || !accionSel || !objetoSel || num1Sel==null || num2Sel==null){
    fraseEl.textContent = "⚠️ ¡Primero sortea todos los elementos!";
    return;
  }
  let frase = "";
  switch(accionSel){
    case "gana":
      frase = `${personajeSel.nombre} gana ${num1Sel} ${objetoSel}. ¿Cuántos tendrá si ya tenía ${num2Sel}?`;
      break;
    case "pierde":
      frase = `${personajeSel.nombre} tiene ${num1Sel} ${objetoSel}, pero pierde ${num2Sel}. ¿Cuántos le quedan?`;
      break;
    case "reparte":
      frase = `${personajeSel.nombre} reparte ${num1Sel} ${objetoSel} entre ${num2Sel} amigos. ¿Cuántos recibe cada uno?`;
      break;
    case "divide":
      frase = `${personajeSel.nombre} divide ${num1Sel} ${objetoSel} en grupos de ${num2Sel}. ¿Cuántos grupos consigue?`;
      break;
    case "compra":
      frase = `${personajeSel.nombre} compra ${num1Sel} ${objetoSel} y luego compra ${num2Sel} más. ¿Cuántos tiene ahora?`;
      break;
    case "vende":
      frase = `${personajeSel.nombre} tenía ${num1Sel} ${objetoSel} y vende ${num2Sel}. ¿Cuántos conserva?`;
      break;
    default:
      frase = `${personajeSel.nombre} ${accionSel} ${num1Sel} ${objetoSel}.`;
  }
  ultimoProblema = {accion:accionSel,num1:num1Sel,num2:num2Sel,frase};
  fraseEl.textContent = "📚 " + frase;
  ocultarRevelaciones();
}

/* Revelaciones */
function mostrarDatos(){
  if(!ultimoProblema){ mostrarAviso("datosProblema","⚠️ Primero genera el problema."); return; }
  const el = document.getElementById("datosProblema");
  el.textContent = `Números del problema: ${ultimoProblema.num1} y ${ultimoProblema.num2}`;
  mostrarElemento(el);
}
function mostrarOperacion(){
  if(!ultimoProblema){ mostrarAviso("operacionProblema","⚠️ Primero genera el problema."); return; }
  const {accion,num1,num2} = ultimoProblema;
  let op = "";
  switch(accion){
    case "gana": case "compra": op = `${num1} + ${num2}`; break;
    case "pierde": case "vende": op = `${num1} - ${num2}`; break;
    case "reparte": case "divide": op = `${num1} ÷ ${num2}`; break;
    default: op = `${num1} ? ${num2}`;
  }
  const el = document.getElementById("operacionProblema");
  el.textContent = op;
  mostrarElemento(el);
}
function mostrarSolucion(){
  if(!ultimoProblema){ mostrarAviso("solucionProblema","⚠️ Primero genera el problema."); return; }
  const {accion,num1,num2} = ultimoProblema;
  let sol = "";
  switch(accion){
    case "gana": case "compra": sol = `${num1 + num2}`; break;
    case "pierde": case "vende": sol = `${num1 - num2}`; break;
    case "reparte": {
      const c = Math.floor(num1/num2), r = num1%num2;
      sol = `${c} cada uno (sobra ${r})`; break;
    }
    case "divide": {
      const g = Math.floor(num1/num2), r = num1%num2;
      sol = `${g} grupos (sobra ${r})`; break;
    }
    default: sol = "No definida";
  }
  const el = document.getElementById("solucionProblema");
  el.textContent = `Solución: ${sol}`;
  mostrarElemento(el);
}

/* Utilidades */
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