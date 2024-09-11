document.addEventListener("DOMContentLoaded", function () {
  let productos = [];
  let productosFiltrados = [];
  const categoriasMap = new Map();

  // Obtener las categorías
  fetch("/api/categorias")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener las categorias.");
      }
      return response.json();
    })
    .then((categorias) => {
      // Iterar sobre las categorías y almacenarlas en un mapa
      categorias.forEach((categoria) => {
        categoriasMap.set(categoria._id, categoria.nombre);
      });

      // Obtener los productos
      return fetch("/api/productos");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener la lista de productos.");
      }
      return response.json();
    })
    .then((data) => {
      productos = data;
      // Iterar sobre las categorías y almacenarlas en un mapa
      productosFiltrados = [...productos];
      mostrarProductos(productosFiltrados);
      initPagination(productosFiltrados);
    })
    .catch((error) => console.error("Error cargando productos:", error));

  function mostrarProductos(productosParaMostrar) {
    const tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = "";

    productosParaMostrar.forEach((producto) => {
      const tr = document.createElement("tr");
      const stockClass = producto.stock <= 10 ? "danger" : "primary";
      // Obtener el nombre de la categoría usando el ID de la categoría del producto
      const categoriaNombre = categoriasMap.get(producto.categoria);

      tr.innerHTML = `
        <td hidden>${producto._id}</td>
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>${categoriaNombre}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.precio}</td>
        <td class="${stockClass}">${producto.stock}</td>
        <td class="${producto.estado === "Inactivo" ? "danger" : "primary"}">${producto.estado}</td>
        <td>
          <button class="btnEditar dark-mode" onclick="editarProducto('${producto._id}')">
            <a href="../../PAGES/viewsProductos/editarProducto.html?id=${producto._id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </a>  
          </button>
        </td>
        <td>
          <button class="btnEditar" onclick="cambiarEstadoProducto('${producto._id}')">
            <a href="../../PAGES/viewsProductos/cambiarEstado.html?id=${producto._id}">
              <i class="fa-solid fa-power-off"></i>
            </a>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function buscarProductos() {
    const filtro = buscador.value.toLowerCase();
    productosFiltrados = productos.filter((producto) => {
      const id = producto.id ? producto.id.toString().toLowerCase() : "";
      const nombre = producto.nombre
        ? producto.nombre.toString().toLowerCase()
        : "";

      return id.includes(filtro) || nombre.includes(filtro);
    });

    mostrarProductos(productosFiltrados);
    initPagination(productosFiltrados);
  }

  const buscador = document.getElementById("buscador");
  buscador.addEventListener("input", buscarProductos);

  buscador.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      buscarProductos();
    }
  });

  function initPagination(productosParaMostrar) {
    const itemsPerPage = 3;
    const totalPages = Math.ceil(productosParaMostrar.length / itemsPerPage);
    let currentPage = 1;

    const pageNumbersContainer = document.querySelector(".page-numbers");
    pageNumbersContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("button");
      pageNumber.classList.add("page-number");
      pageNumber.textContent = i;
      pageNumber.addEventListener("click", () => {
        currentPage = i;
        mostrarPagina(currentPage);

        document.querySelectorAll(".page-number").forEach((button) => {
          button.classList.remove("active");
        });
        pageNumber.classList.add("active");
      });
      pageNumbersContainer.appendChild(pageNumber);
    }

    function mostrarPagina(page) {
      const start = (page - 1) * itemsPerPage;
      const end = page * itemsPerPage;
      mostrarProductos(productosParaMostrar.slice(start, end));
    }
    mostrarPagina(currentPage);

    document.querySelector(".prev").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        mostrarPagina(currentPage);
        document.querySelectorAll(".page-number").forEach((button) => {
          button.classList.remove("active");
        });
        pageNumbersContainer.children[currentPage - 1].classList.add("active");
      }
    });

    document.querySelector(".next").addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        mostrarPagina(currentPage);
        document.querySelectorAll(".page-number").forEach((button) => {
          button.classList.remove("active");
        });
        pageNumbersContainer.children[currentPage - 1].classList.add("active");
      }
    });

    if (pageNumbersContainer.children.length > 0) {
      pageNumbersContainer.children[0].classList.add("active");
    }
  }
});
