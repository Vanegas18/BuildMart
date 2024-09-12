document.addEventListener("DOMContentLoaded", function () {
  //-----------------------------------------------------------------------------------------//
  // Obtener el ID del usuario de los parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("id");

  //-----------------------------------------------------------------------------------------//
  if (categoryId) {
    fetch(`/api/categorias/${categoryId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la categoria");
        }
        return response.json();
      })
      .then((categoria) => {
        document.getElementById("categoriaId").innerHTML =
          `<strong> Categoria: </strong>${categoria.id}`;
        document.getElementById("categoriaNombre").innerHTML =
          `<strong> Nombre: </strong>${categoria.nombre}`;
        document.getElementById("categoriaDescripcion").innerHTML =
          `<strong> Descripcion: </strong>${categoria.descripcion}`;
        document.getElementById("estado-actual").innerHTML =
          `<strong style="font-weight: bold; color: gray;"> Estado: </strong><strong>${categoria.estado}</strong>`;
        const cambiarEstadoBtn = document.getElementById("cambiarEstadoBtn");

        //-----------------------------------------------------------------------------------------//
        if (categoria.estado === "Activo") {
          document.getElementById("estado-actual").style.color = "#6c9bcf";
          cambiarEstadoBtn.textContent = "Inactivar";
        } else {
          document.getElementById("estado-actual").style.color = "#ff0060";
          cambiarEstadoBtn.textContent = "Activar";
        }

        cambiarEstadoBtn.addEventListener("click", function () {
          cambiarEstadoCategoria(categoryId);
        });
      })
      .catch((error) => {
        console.error("Error al cargar los datos de la categoria:", error);
      });
  } else {
    console.error("No se proporcionó el ID del producto en la URL.");
  }
});

//-----------------------------------------------------------------------------------------//
function cambiarEstadoCategoria(id) {
  fetch(`/api/categorias/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener el estado de la categoria.");
      }
      return response.json();
    })
    .then((categoria) => {
      // Determinar el nuevo estado
      const nuevoEstado = categoria.estado === "Activo" ? "Inactivo" : "Activo";

      // Enviar la solicitud para actualizar el estado
      return fetch(`/api/categorias/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }), // Cambiar solo el estado
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cambiar el estado de la categoria.");
      }
      return response.json();
    })
    .then((data) => {
      // Mostrar un SweetAlert2 de éxito
      Swal.fire({
        title: "Estado cambiado",
        text: `El estado de la categoria fue cambiado a ${data.categoria.estado}`,
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Redirigir a la lista de usuarios después de la actualización
        window.location.href = "../../PAGES/viewsCategorias/Categorias.html";
      });
    })
    .catch((error) => {
      console.error("Error al cambiar estado de la categoria:", error);
      // Mostrar un SweetAlert2 de error si algo falla
      Swal.fire({
        title: "Error",
        text: "No se pudo cambiar el estado de la categoria.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    });
}
