document.addEventListener("DOMContentLoaded", () => {
  let productos = [];
  let categorias = [];
  let img = "../../images/image landing/casa1.webp";

  // Obtener categorías
  fetch("/api/categorias")
    .then((response) => response.json())
    .then((data) => {
      categorias = data;
      // Crear un mapa de categorías por _id
      const categoriasMap = new Map();
      categorias.forEach((categoria) => {
        categoriasMap.set(categoria._id, categoria.nombre);
      });

      // Obtener productos
      fetch("/api/productos")
        .then((response) => response.json())
        .then((data) => {
          productos = data;
          crearProductos(productos, categoriasMap);
        })
        .catch((error) => console.error("Error cargando productos:", error));
    })
    .catch((error) => console.error("Error cargando categorias:", error));

  function escapeSelector(selector) {
    return selector.replace(/([ #;&,.+*~\':"!^$[\]()=>|/@])/g, "\\$1");
  }

  function crearProductos(productos, categoriasMap) {
    productos.forEach((product) => {
      const categoryName = categoriasMap.get(product.categoria);
      if (categoryName) {
        const escapedCategory = escapeSelector(categoryName);
        const productosContainer = document.querySelector(
          `#${escapedCategory} ~ .nft-shop .nft-list`
        );

        const div = document.createElement("div");
        div.classList.add("item");

        div.innerHTML = `
          <img src="${img}" alt="${product.nombre}" />
          <div class="info">
            <div>
              <h5>${product.nombre}</h5>
              <div class="btc">
                  <i class="bx bxs-dollar-circle"></i>
                  <p>${product.precio}</p>
              </div>
            </div>
          </div>
          <div class="bid">
              <p class="bid-description">${product.descripcion}</p>
              <a href="https://web.whatsapp.com/" target="_blank">¡La quiero!</a>
          </div>
        `;

        productosContainer.appendChild(div);
      } else {
        console.error(`Categoría con ID ${product.categoria} no encontrada.`);
      }
    });
  }
});
