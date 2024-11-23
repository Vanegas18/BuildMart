document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID del usuario de los parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // Verificar si se proporciona el ID del usuario
  if (productId) {
    fetch(`/api/productos/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se puedo obtener los datos del producto");
        }
        return response.json();
      })
      .then((data) => {
        const producto = data.producto;
        // Rellenar los elementos con los datos del usuario
        document.getElementById("producto-nombre").innerHTML =
          `<strong> Nombre: </strong>${producto.nombre}`;
        document.getElementById("producto-categoria").innerHTML =
          `<strong> Categoría: </strong>${producto.categoria}`;
        document.getElementById("producto-precio").innerHTML =
          `<strong> Precio: </strong>${producto.precio}`;
        document.getElementById("estado-actual").innerHTML =
          `<strong style="font-weight: bold; color: gray;"> Estado: </strong><strong>${producto.estado}</strong>`;
        // Configurar el botón de cambio de estado
        const cambiarEstadoBtn = document.getElementById("cambiarEstadoBtn");

        // Establecer el color y texto del estado según el valor actual
        if (producto.estado === "Activo") {
          document.getElementById("estado-actual").style.color = "#6c9bcf";
          cambiarEstadoBtn.textContent = "Inactivar";
        } else {
          document.getElementById("estado-actual").style.color = "#ff0060";
          cambiarEstadoBtn.textContent = "Activar";
        }

        // Manejar el clic en el botón para cambiar el estado
        cambiarEstadoBtn.addEventListener("click", function () {
          cambiarEstadoUsuario(productId);
        });
      })
      .catch((error) => {
        console.error("Error al cargar los datos del producto:", error);
      });
  } else {
    console.error("No se proporcionó el ID del producto en la URL.");
  }
});

// Función para cambiar el estado del usuario
function cambiarEstadoUsuario(id) {
  // Obtener los datos actuales del usuario para determinar el nuevo estado
  fetch(`/api/productos/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener el estado del producto.");
      }
      return response.json();
    })
    .then((data) => {
      const producto = data.producto;
      // Determinar el nuevo estado
      const nuevoEstado = producto.estado === "Activo" ? "Inactivo" : "Activo";

      // Enviar la solicitud para actualizar el estado
      return fetch(`/api/productos/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }), // Cambiar solo el estado
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cambiar el estado del producto.");
      }
      return response.json();
    })
    .then((data) => {
      // Mostrar un SweetAlert2 de éxito
      Swal.fire({
        title: "Estado cambiado",
        text: `El estado del producto fue cambiado a ${data.producto.estado}`,
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Redirigir a la lista de usuarios después de la actualización
        window.location.href = "../../PAGES/viewsProductos/Productos.html";
      });
    })
    .catch((error) => {
      console.error("Error al cambiar estado del producto:", error);
      // Mostrar un SweetAlert2 de error si algo falla
      Swal.fire({
        title: "Error",
        text: "No se pudo cambiar el estado del producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    });
}
