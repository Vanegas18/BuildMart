document.addEventListener('DOMContentLoaded', function(){
  // MODO OSCURO
  const sideMenu = document.querySelector("aside");
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const darkMode = document.querySelector(".dark-mode");
  
  // Mostrar el menú lateral al hacer clic en el botón de menú
  menuBtn.addEventListener("click", () => {
    sideMenu.style.display = "block";
  });
  
  // Ocultar el menú lateral al hacer clic en el botón de cerrar
  closeBtn.addEventListener("click", () => {
    sideMenu.style.display = "none";
  });
  
  // Alternar el modo oscuro al hacer clic en el interruptor de modo oscuro
  darkMode.addEventListener("click", () => {
    // Cambia la clase del cuerpo del documento para activar/desactivar el modo oscuro
    document.body.classList.toggle("dark-mode-variables");
  
    // Alterna la clase activa en los elementos del interruptor de modo oscuro
    darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
    darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
  });
  
  // PAGINADO
  function initPagination() {
    const rowsPerPage = 3; // Número de filas por página
    const table = document.querySelector("#tablaUsuarios tbody");
    const rows = table.querySelectorAll("tr");
    const paginationNumbers = document.querySelector(".page-numbers");
  
    let currentPage = 1;
    const totalPages = Math.ceil(rows.length / rowsPerPage); // Calcula el número total de páginas
  
    // Muestra las filas correspondientes a la página actual
    function displayRows(page) {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      rows.forEach((row, index) => {
        row.style.display = index >= start && index < end ? "" : "none";
      });
  
      updatePaginationNumbers(); // Actualiza los números de paginación
    }
  
    // Actualiza los números de página en la interfaz
    function updatePaginationNumbers() {
      paginationNumbers.innerHTML = ""; // Limpia los números de página existentes
  
      for (let i = 1; i <= totalPages; i++) {
        const pageNum = document.createElement("span");
        pageNum.textContent = i;
        if (i === currentPage) {
          pageNum.classList.add("active");
        }
        // Cambia la página al hacer clic en un número de página
        pageNum.addEventListener("click", () => {
          currentPage = i;
          displayRows(currentPage);
        });
        paginationNumbers.appendChild(pageNum);
      }
    }
  
    // Navegar a la página anterior
    document.querySelector(".prev").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayRows(currentPage);
      }
    });
  
    // Navegar a la página siguiente
    document.querySelector(".next").addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayRows(currentPage);
      }
    });
  
    displayRows(currentPage); // Muestra las filas de la primera página al iniciar
  }

})

