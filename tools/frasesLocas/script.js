// === Generador de Frases Locas con animación suave ===

const sujetos = [
  "El dragón", "Mi abuela", "Un robot", "El gato azul", "Una ardilla gigante",
  "El profesor", "Un unicornio", "Mi vecino", "El mago", "Una rana parlante"
];

const verbos = [
  "baila", "canta", "corre", "vuela", "salta", "pinta", "come", "grita", "come", "habla","juega"
];

const complementos = [
  "en el desierto", "con una pizza gigante", "debajo del arcoíris",
  "mientras duerme", "sobre una nube", "en el castillo encantado",
  "junto al mar", "con una guitarra eléctrica", "en el espacio", "sobre una patata gigante"
];

const fraseEl = document.getElementById("frase");
const boton = document.getElementById("generarBtn");

function generarFrase() {
  const sujeto = sujetos[Math.floor(Math.random() * sujetos.length)];
  const verbo = verbos[Math.floor(Math.random() * verbos.length)];
  const complemento = complementos[Math.floor(Math.random() * complementos.length)];
  return `${sujeto} ${verbo} ${complemento}.`;
}

function mostrarFraseAnimada(frase) {
  fraseEl.innerHTML = "";
  const palabras = frase.split(" ");
  let index = 0;

  const intervalo = setInterval(() => {
    if (index < palabras.length) {
      const span = document.createElement("span");
      span.textContent = palabras[index];
      span.classList.add("fade-word");
      fraseEl.appendChild(span);
      fraseEl.appendChild(document.createTextNode(" "));
      index++;
    } else {
      clearInterval(intervalo);
    }
  }, 300);
}

boton.addEventListener("click", () => {
  const frase = generarFrase();
  mostrarFraseAnimada(frase);
});
