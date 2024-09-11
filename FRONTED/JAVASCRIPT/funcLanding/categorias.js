document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/categorias")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener las categorias.");
      }
      return response.json();
    })
    .then((data) => {
      const selectorCategoria = document.getElementById("category-select");
      data.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.nombre;
        option.textContent = categoria.nombre;
        selectorCategoria.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al obtener las categorias:", error));
});

function scrollToCategory() {
  const select = document.getElementById("category-select");
  const selectedCategory = select.value;
  const categoryElement = document.getElementById(selectedCategory);

  if (categoryElement) {
    categoryElement.scrollIntoView({ behavior: "smooth" });
  } else {
    console.error(`Elemento con ID '${selectedCategory}' no encontrado.`);
  }
}
