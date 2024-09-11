document.addEventListener("DOMContentLoaded", function () {
  let categorias = [];
  let categoriasFiltradas = [];

  fetch("/api/categorias")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener la lista de categorias");
      }
      return response.json();
    })
    .then((data) => {
      categorias = data;
      categoriasFiltradas = [...categorias];
      mostrarCategorias(categoriasFiltradas);
      initPagination(categoriasFiltradas);
    })
    .catch((error) => console.error("Error cargando categorias", error));

  function mostrarCategorias(categoriasParaMostrar) {
    const tbody = document.querySelector("#tablaCategorias tbody");
    tbody.innerHTML = "";

    categoriasParaMostrar.forEach((categoria) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
            <td hidden>${categoria._id}</td>
            <td>${categoria.Id}</td>
            <td>${categoria.nombre}</td>
            <td>${categoria.descripcion}</td>
            <td class="${categoria.estado === "Inactivo" ? "danger" : "primary"}">${categoria.estado}</td>
            <td>
                <button class="btnEditar dark-mode" onclick="editarCategoria('${categoria._id}')">
                    <a href="../../PAGES/viewsCategorias/editarCategoria.html?id=${categoria._id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </a>
                </button>
            </td>
            <td>
                <button class="btnEditar" onclick="cambiarEstadoCategoria('${categoria._id}')">
                    <a href="../../PAGES/viewsCategorias/cambiarEstado.html?id=${categoria._id}">
                        <i class="fa-solid fa-power-off"></i>
                    </a>
                </button>
            </td>
        `;
      tbody.appendChild(tr);
    });
  }

  function buscarCategorias() {
    const filtro = buscador.value.toLowerCase();
    categoriasFiltradas = categorias.filter((categoria) => {
      const Nombre = categoria.nombre
        ? categoria.nombre.toString().toLowerCase()
        : "";
      return Nombre.includes(filtro);
    });

    mostrarCategorias(categoriasFiltradas);
    initPagination(categoriasFiltradas);
  }

  const buscador = document.getElementById("buscador");
  buscador.addEventListener("input", buscarCategorias);

  buscador.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      buscarCategorias();
    }
  });

  function initPagination(categoriasParaMostrar) {
    const itemsPerPage = 3;
    const totalPages = Math.ceil(categoriasParaMostrar.length / itemsPerPage);
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
      mostrarCategorias(categoriasParaMostrar.slice(start, end));
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
