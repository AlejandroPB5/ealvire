
document.addEventListener("DOMContentLoaded", () => {
  const filtroCiclo = document.getElementById("filtro-ciclo");
  const filtroMateria = document.getElementById("filtro-materia");
  const tarjetas = document.querySelectorAll(".recurso");

  function filtrarRecursos() {
    const cicloSeleccionado = filtroCiclo.value.toLowerCase();
    const materiaSeleccionada = filtroMateria.value.toLowerCase();

    tarjetas.forEach(card => {
      const ciclo = card.dataset.ciclo.toLowerCase();
      const materia = card.dataset.materia.toLowerCase();

      const coincideCiclo = ciclo.includes(cicloSeleccionado) || cicloSeleccionado === "";
      const coincideMateria = materia.includes(materiaSeleccionada) || materiaSeleccionada === "";

      if (coincideCiclo && coincideMateria) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  filtroCiclo.addEventListener("change", filtrarRecursos);
  filtroMateria.addEventListener("change", filtrarRecursos);
});

