document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  //-----------------------------------------------------------------------------------------//

  // Verificar si se proporciona el ID del usuario
  if (userId) {
    fetch(`/api/usuarios/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener los datos del usuario.");
        }
        return response.json();
      })
      .then((usuario) => {
        document.getElementById("usuario-documento").innerHTML =
          `<strong> Documento: </strong>${usuario.documento}`;
        document.getElementById("usuario-nombre").innerHTML =
          `<strong> Nombre: </strong>${usuario.nombre}`;
        document.getElementById("estado").innerHTML =
          `<strong> Estado actual: ${usuario.estado}</strong>`;

        const cambiarEstadoBtn = document.getElementById("cambiarEstadoBtn");

        // Establecer el color y texto del estado según el valor actual
        if (usuario.estado === "Activo") {
          document.getElementById("estado").style.color = "#6c9bcf";
          cambiarEstadoBtn.textContent = "Inactivar";
        } else {
          document.getElementById("estado").style.color = "#ff0060";
          cambiarEstadoBtn.textContent = "Activar";
        }

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

//-----------------------------------------------------------------------------------------//

function cambiarEstadoUsuario(id) {
  fetch(`/api/usuarios/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener el estado del usuario.");
      }
      return response.json();
    })
    .then((usuario) => {
      const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";

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
      Swal.fire({
        title: "Estado cambiado",
        text: `El estado del usuario fue cambiado a ${data.usuario.estado}`,
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "../../PAGES/viewsUsuarios/Usuarios.html";
      });
    })
    .catch((error) => {
      console.error("Error al cambiar estado del usuario:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cambiar el estado del usuario.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    });
}
