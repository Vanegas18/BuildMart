document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  if (form) {
    form.addEventListener("submit", Registrar);
  }

  function Registrar(event) {
    event.preventDefault();

    // const Id = document.getElementById("idCategoria")
    const nombre = document.getElementById("nombreCategoria").value;
    const descripcion = document.getElementById("descripcionCategoria").value;

    const expresiones = {
      id: /^\d+$/,
      nombre: /^[a-zA-Z0-9\s]{1,50}$/,
      descripcion: /^[a-zA-Z0-9\s.,-áéíóúüñÁÉÍÓÚÜÑ]{1,500}$/,
    };

    let valid = true;

    if (!expresiones.descripcion.test(descripcion)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Los caracteres que has ingresado en la descripción no son correctos. Solo se permiten Letras, números, espacios y algunos caracteres especiales comunes. Sin límite específico de longitud.",
      });
      valid = false;
    }

    if (!expresiones.nombre.test(nombre)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Los caracteres que has ingresado en el nombre no son correctos. Solo se permiten letras (mayúsculas o minúsculas), espacios, y opcionalmente números.",
      });
      valid = false;
    }

    if (valid) {
      const categoria = {
        nombre,
        descripcion,
        estado: "Activo",
      };

      fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al registrar la categoria.");
          }
          return response.json();
        })
        .then((data) => {
          // Mostrar mensaje de éxito y redirigir a la página de usuarios
          Swal.fire({
            title: "Buen trabajo!",
            text: data.msg || "Categoria registrada!",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href =
                "../../PAGES/viewsCategorias/Categorias.html"; // Redirigir a la lista de usuarios
            }
          });
        })
        .catch((error) =>
          console.error("Error al registrar la categoria:", error)
        );
    }
  }
});
