function generateNumber(length) {
  let min = Math.pow(10, length - 1);
  let max = Math.pow(10, length) - 1;
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  let numberDiv = document.getElementById("number");
  numberDiv.textContent = randomNum;

  // 🔢 Reinicia animación del número
  numberDiv.classList.remove("animate__animated", "animate__fadeInRight");
  void numberDiv.offsetWidth; 
  numberDiv.classList.add("animate__animated", "animate__fadeInRight");

  // 🔮 Animación del mago
  let wizard = document.querySelector(".wizard");

  wizard.src = "../../assets/img/mago.gif"; // GIF animado
  setTimeout(() => {
    wizard.src = "../../assets/img/mago_static.png"; // Volver al estático
  }, 2000); // 2s de animación
}
