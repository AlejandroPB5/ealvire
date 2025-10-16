document.addEventListener("DOMContentLoaded", () => {
  const filtroCiclo = document.getElementById("filtro-ciclo");
  const filtroMateria = document.getElementById("filtro-materia");
  const tarjetas = document.querySelectorAll(".recurso");

  function filtrarRecursos() {
    const cicloSeleccionado = filtroCiclo.value.toLowerCase().trim();
    const materiaSeleccionada = filtroMateria.value.toLowerCase().trim();

    tarjetas.forEach(card => {
      // Cada tarjeta puede tener varios ciclos o materias separados por comas
      const ciclos = card.dataset.ciclo.toLowerCase().split(",").map(c => c.trim());
      const materias = card.dataset.materia.toLowerCase().split(",").map(m => m.trim());

      const coincideCiclo =
        cicloSeleccionado === "" || ciclos.some(c => c.includes(cicloSeleccionado));

      const coincideMateria =
        materiaSeleccionada === "" || materias.some(m => m.includes(materiaSeleccionada));

      if (coincideCiclo && coincideMateria) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  filtroCiclo.addEventListener("change", filtrarRecursos);
  filtroMateria.addEventListener("change", filtrarRecursos);

  // Función para resetear los filtros
  window.resetFiltros = function() {
    filtroCiclo.value = "";
    filtroMateria.value = "";
    filtrarRecursos();
  };
});
