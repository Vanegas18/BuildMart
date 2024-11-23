document.addEventListener("DOMContentLoaded", () => {
  const formEdit = document.querySelector("form"); // Selecciona el formulario
  const editBtn = document.getElementById("editBtn"); // Selecciona el botón de edición

  // Obtener el id de la categoría para editar
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    console.error("No se proporcionó el ID de la categoría en la URL.");
  }

  fetch(`/api/categorias/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener datos de la categoría.");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        const categoria = data.categoria;
        document.getElementById("id_editarCategoria").value = categoria.id;
        document.getElementById("nombreCategoria").value = categoria.nombre;
        document.getElementById("descripcionCategoria").value =
          categoria.descripcion;
      } else {
        console.error("No se encontraron los datos de la categoría.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos de la categoría:", error);
    });

  const expresiones = {
    nombre: /^[a-zA-Z0-9\s]{1,50}$/,
    descripcion: /^[a-zA-Z0-9\s.,-áéíóúüñÁÉÍÓÚÜÑ]{1,500}$/,
  };

  if (formEdit && editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombreCategoria").value;
      const descripcion = document.getElementById("descripcionCategoria").value;

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
        };

        fetch(`/api/categorias/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoria),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("No se puede actualizar la categoría.");
            }
            return response.json();
          })
          .then((data) => {
            Swal.fire({
              title: "¡Buen trabajo!",
              text: data.msg || "Categoría actualizada exitosamente.",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href =
                  "../../PAGES/viewsCategorias/Categorias.html";
              }
            });
          })
          .catch((error) => {
            console.error("Error al editar la categoría:", error);
          });
      }
    });
  }
});
