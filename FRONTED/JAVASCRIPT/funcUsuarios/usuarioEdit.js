document.addEventListener("DOMContentLoaded", () => {
  const formEdit = document.getElementById("formEdit");
  const editBtn = document.querySelector(".btn");

  //-----------------------------------------------------------------------------------------//

  // Obtener el ID del usuario de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Verificar si el ID está presente en la URL
  if (!id) {
    console.error("No se proporcionó el ID del usuario en la URL.");
    return;
  }

  //-----------------------------------------------------------------------------------------//

  fetch(`/api/usuarios/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener los datos del usuario.");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        document.getElementById("documento_editar").value = data.documento;
        document.getElementById("nombre_editar").value = data.nombre;
        document.getElementById("email_editar").value = data.email;
        document.getElementById("numero_editar").value = data.numero;
        document.getElementById("rol_editar").value = data.rol;
      } else {
        console.error("No se encontraron datos del usuario.");
      }
    })
    .catch((error) =>
      console.error("Error al obtener datos del usuario:", error)
    );

  //-----------------------------------------------------------------------------------------//

  const expresiones = {
    namee: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    documentoo: /^\d{8,12}$/, // Solo dígitos, 8 a 12 dígitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Correo electrónico
    telefono: /^\d{7,14}$/, // 7 a 14 números.
  };

  if (formEdit && editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar el envío del formulario por defecto

      const nombre = document.getElementById("nombre_editar").value;
      const documento = document
        .getElementById("documento_editar")
        .value.trim();
      const email = document.getElementById("email_editar").value;
      const numero = document.getElementById("numero_editar").value.trim();
      const rol = document.getElementById("rol_editar").value;

      let valid = true;

      // Validar el campo email
      if (!expresiones.correo.test(email)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en el email no son correctos.",
        });
        valid = false;
      }

      // Validar el campo número
      if (!expresiones.telefono.test(numero)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en el número de teléfono no son correctos solo se permiten de 7 a 14 numeros",
        });
        valid = false;
      }

      // Validar el campo documento
      if (!expresiones.documentoo.test(documento)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en el documento no son correctos solo se permiten de 8 a 14 numeros",
        });
        valid = false;
      }

      // Validar el campo nombre
      if (!expresiones.namee.test(nombre)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en el nombre no son correctos solo se permiten letras",
        });
        valid = false;
      }

      if (valid) {
        const usuario = {
          documento,
          nombre,
          email,
          numero,
          rol,
          estado: "Activo",
        };

        fetch(`/api/usuarios/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario), // Convertir objeto a cadena JSON
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("No se pudo actualizar el usuario.");
            }
            return response.json();
          })
          .then((data) => {
            Swal.fire({
              title: "¡Buen trabajo!",
              text: data.msg || "Usuario actualizado exitosamente.",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href =
                  "../../PAGES/viewsUsuarios/Usuarios.html";
              }
            });
          })
          .catch((error) => console.error("Error al editar usuario:", error));
      }
    });
  }
});
