document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID del usuario de los parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  // Verificar si se proporciona el ID del usuario
  if (userId) {
    // Obtener los datos del usuario
    fetch(`/api/usuarios/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener los datos del usuario.");
        }
        return response.json();
      })
      .then((usuario) => {
        // Rellenar los elementos con los datos del usuario
        document.getElementById("usuario-documento").innerHTML =
        `<strong> Documento: </strong>${usuario.documento}`;
        document.getElementById("usuario-nombre").innerHTML =
        `<strong> Nombre: </strong>${usuario.nombre}`;
        document.getElementById("estado").textContent = usuario.estado;

        // Configurar el botón de cambio de estado
        const cambiarEstadoBtn = document.getElementById("cambiarEstadoBtn");

        // Establecer el color y texto del estado según el valor actual
        if (usuario.estado === "Activo") {
          document.getElementById("estado").style.color = "#6c9bcf";
          cambiarEstadoBtn.textContent = "Inactivar";
        } else {
          document.getElementById("estado").style.color = "#ff0060";
          cambiarEstadoBtn.textContent = "Activar";
        }

        // Manejar el clic en el botón para cambiar el estado
        cambiarEstadoBtn.addEventListener("click", function () {
          cambiarEstadoUsuario(userId);
        });
      })
      .catch((error) =>
        console.error("Error al cargar los datos del usuario:", error)
      );
  } else {
    console.error("No se proporcionó el ID del usuario en la URL.");
  }
});

// Función para cambiar el estado del usuario
function cambiarEstadoUsuario(id) {
  // Obtener los datos actuales del usuario para determinar el nuevo estado
  fetch(`/api/usuarios/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener el estado del usuario.");
      }
      return response.json();
    })
    .then((usuario) => {
      // Determinar el nuevo estado
      const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";

      // Enviar la solicitud para actualizar el estado
      return fetch(`/api/usuarios/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }), // Cambiar solo el estado
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cambiar el estado del usuario.");
      }
      return response.json();
    })
    .then((data) => {
      // Mostrar un SweetAlert2 de éxito
      Swal.fire({
        title: "Estado cambiado",
        text: `El estado del usuario fue cambiado a ${data.usuario.estado}`,
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Redirigir a la lista de usuarios después de la actualización
        window.location.href = "../../PAGES/viewsUsuarios/Usuarios.html";
      });
    })
    .catch((error) => {
      console.error("Error al cambiar estado del usuario:", error);
      // Mostrar un SweetAlert2 de error si algo falla
      Swal.fire({
        title: "Error",
        text: "No se pudo cambiar el estado del usuario.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    });
}
