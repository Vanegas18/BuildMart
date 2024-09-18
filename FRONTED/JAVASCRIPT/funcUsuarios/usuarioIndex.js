// Espera a que todo el contenido del DOM se haya cargado completamente antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
  let usuarios = []; // Variable para almacenar todos los usuarios que se obtendrán de la API
  let usuariosFiltrados = []; // Variable para almacenar los usuarios que coinciden con el filtro de búsqueda

  //-----------------------------------------------------------------------------------------//
  fetch("/api/usuarios")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener la lista de usuarios.");
      }
      return response.json(); // Convierte la respuesta a JSON
    })
    .then((data) => {
      usuarios = data;
      usuariosFiltrados = [...usuarios];
      mostrarUsuarios(usuariosFiltrados);
      initPagination(usuariosFiltrados);
    })
    .catch((error) => console.error("Error cargando usuarios:", error));

  //-----------------------------------------------------------------------------------------//

  function mostrarUsuarios(usuariosParaMostrar) {
    const tbody = document.querySelector("#tablaUsuarios tbody");
    tbody.innerHTML = "";

    usuariosParaMostrar.forEach((usuario) => {
      const tr = document.createElement("tr");

      // Define el contenido HTML de la fila con los datos del usuario
      tr.innerHTML = `
        <td hidden>${usuario._id}</td> 
        <td class="datos">${usuario.documento}</td>
        <td class="datos">${usuario.nombre}</td>
        <td class="datos">${usuario.email}</td>
        <td class="datos">${usuario.numero}</td>
        <td class="datos">${usuario.rol}</td>
        <td class="${usuario.estado === "Inactivo" ? "danger" : "primary"}">${
          usuario.estado
        }</td>
        <td>
          <button class="btnEditar dark-mode" on
          click="editarUsuario('${usuario._id}')">
            <a href="./editarUsuario.html?id=${usuario._id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </a>
          </button>
        </td>
        <td>
          <button class="btnEditar" onclick="cambiarEstadoUsuario('${
            usuario._id
          }')">
            <a href="./cambiarEstado.html?id=${usuario._id}">
              <i class="fa-solid fa-power-off"></i>
            </a>
          </button>
        </td>
      `;
      tbody.appendChild(tr); // Añade la fila al cuerpo de la tabla
    });
  }

  //-----------------------------------------------------------------------------------------//

  const buscador = document.getElementById("buscador");
  buscador.addEventListener("input", buscarUsuarios);

  buscador.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      buscarUsuarios();
    }
  });

  function buscarUsuarios() {
    const filtro = buscador.value.toLowerCase();
    usuariosFiltrados = usuarios.filter((usuario) => {
      const documento = usuario.documento
        ? usuario.documento.toString().toLowerCase()
        : "";
      const nombre = usuario.nombre ? usuario.nombre.toLowerCase() : "";
      const estado = usuario.estado ? usuario.estado.toLowerCase() : "";

      return (
        nombre.includes(filtro) ||
        documento.includes(filtro) ||
        estado.includes(filtro)
      );
    });

    mostrarUsuarios(usuariosFiltrados); // Muestra los usuarios filtrados en la tabla
    initPagination(usuariosFiltrados); // Reinicia la paginación con la lista de usuarios filtrados
  }

  //-----------------------------------------------------------------------------------------//

  // Función de inicialización de paginación
  function initPagination(usuariosParaPaginar) {
    const itemsPerPage = 3; // Define cuántos usuarios se mostrarán por página
    const totalPages = Math.ceil(usuariosParaPaginar.length / itemsPerPage); // Calcula el número total de páginas
    let currentPage = 1; // Inicializa la página actual en 1

    const pageNumbersContainer = document.querySelector(".page-numbers"); // Selecciona el contenedor para los números de página
    pageNumbersContainer.innerHTML = ""; // Limpia los números de página anteriores

    // Crea un botón por cada página y lo añade al contenedor
    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement("button");
      pageNumber.textContent = i;
      pageNumber.classList.add("page-number"); // Añade una clase para estilos específicos
      pageNumber.addEventListener("click", () => {
        currentPage = i;
        mostrarPagina(currentPage); // Muestra la página seleccionada

        // Resalta el botón de la página actual y desmarca los demás
        document.querySelectorAll(".page-number").forEach((button) => {
          button.classList.remove("active");
        });
        pageNumber.classList.add("active");
      });
      pageNumbersContainer.appendChild(pageNumber); // Añade el botón al contenedor
    }

    // Función para mostrar la página correspondiente de usuarios
    function mostrarPagina(page) {
      const start = (page - 1) * itemsPerPage;
      const end = page * itemsPerPage;
      mostrarUsuarios(usuariosParaPaginar.slice(start, end)); // Muestra solo los usuarios de la página actual
    }

    mostrarPagina(currentPage); // Muestra la primera página al iniciar la paginación

    // Configura el botón "Anterior" para cambiar a la página previa
    document.querySelector(".prev").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        mostrarPagina(currentPage);

        // Resalta el botón de la página actual
        document.querySelectorAll(".page-number").forEach((button) => {
          button.classList.remove("active");
        });
        pageNumbersContainer.children[currentPage - 1].classList.add("active");
      }
    });

    // Configura el botón "Siguiente" para cambiar a la siguiente página
    document.querySelector(".next").addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        mostrarPagina(currentPage);

        // Resalta el botón de la página actual
        document.querySelectorAll(".page-number").forEach((button) => {
          button.classList.remove("active");
        });
        pageNumbersContainer.children[currentPage - 1].classList.add("active");
      }
    });

    // Resalta el primer botón de la paginación cuando se carga por primera vez
    if (pageNumbersContainer.children.length > 0) {
      pageNumbersContainer.children[0].classList.add("active");
    }
  }
});
