document.addEventListener("DOMContentLoaded", () => {
  const formEdit = document.getElementById("formEditProduct");
  const editBtn = document.querySelector(".btn");

  // Obtener el id del producto para editar
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Verificar si esta agarrando el id
  if (!id) {
    console.error("No se proporcionó el ID del usuario en la URL.");
  }

  // Obtener los datos de la API
  fetch(`/api/productos/${id}`)
    .then((response) => {
      if (!response.ok) {
        // Verificar si la respuesta es exitosa
        throw new Error("No se pudo obtener los datos del producto.");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        const producto = data.producto;
        // Rellenar el formulario con los datos del usuario
        document.getElementById("id_editarProduct").value = producto._id;
        document.getElementById("nombreProducto").value = producto.nombre;
        document.getElementById("descripcionProducto").value = producto.descripcion;
        document.getElementById("precioProducto").value = producto.precio;
        document.getElementById("stockProducto").value = producto.stock;

        // Obtener las categorías y seleccionar la del producto
        fetch("/api/categorias")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al obtener las categorias.");
            }
            return response.json();
          })
          .then((data) => {
            if (Array.isArray(data.categorias)) {
              const selectCategoria = document.getElementById("categoriaProducto");
              data.categorias.forEach((categoria) => {
                const option = document.createElement("option");
                option.value = categoria._id;
                option.textContent = categoria.nombre;
                if (categoria._id === producto.categoria) {
                  option.selected = true;
                }
                selectCategoria.appendChild(option);
              });
            } else {
              console.error("La respuesta de la API no es un array.");
            }
          })
          .catch((error) => console.error("Error al obtener las categorias:", error));
      } else {
        console.error("No se encontraron datos del producto.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos del producto:", error);
    });

  const expresiones = {
    nombre: /^[a-zA-Z0-9\s]{1,50}$/,
    categoria: /^[a-zA-Z\s]{1,30}$/,
    descripcion: /^[a-zA-Z0-9\s.,-áéíóúüñÁÉÍÓÚÜÑ]{1,500}$/,
    precio: /^\d+(\.\d{1,2})?$/,
    stock: /^\d+$/,
  };

  // Manejar la edición del usuario al hacer clic en el botón
  if (formEdit && editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Recopilar los datos del formulario
      const id = document.getElementById("id_editarProduct").value;
      const nombre = document.getElementById("nombreProducto").value;
      const categoria = document.getElementById("categoriaProducto").value;
      const descripcion = document.getElementById("descripcionProducto").value;
      const precio = document.getElementById("precioProducto").value;
      const stock = document.getElementById("stockProducto").value;
      let valid = true;

      if (!expresiones.nombre.test(nombre)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en el nombre no son correctos. Solo se permiten letras (mayúsculas o minúsculas), espacios, y opcionalmente números.",
        });
        valid = false;
      }

      if (!categoria) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor selecciona una categoría.",
        });
        valid = false;
      }

      if (!expresiones.descripcion.test(descripcion)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en la descripción no son correctos. Solo se permiten Letras, números, espacios y algunos caracteres especiales comunes. Sin límite específico de longitud.",
        });
        valid = false;
      }

      if (!expresiones.precio.test(precio)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en el precio no son correctos. Solo se permiten Números con hasta dos decimales.",
        });
        valid = false;
      }

      if (!expresiones.stock.test(stock)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Los caracteres que has ingresado en el stock no son correctos. Solo se permiten números enteros, sin decimales.",
        });
        valid = false;
      }

      // Si todos los campos son válidos, enviar los datos
      if (valid) {
        const producto = {
          nombre,
          categoria,
          descripcion,
          precio,
          stock,
        };

        // Enviar los datos actualizados a la API
        fetch(`/api/productos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(producto),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("No se puede actualizar el producto");
            }
            return response.json();
          })
          .then((data) => {
            Swal.fire({
              title: "¡Buen trabajo!",
              text: data.msg || "Producto actualizado exitosamente.",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                // Redirigir a la lista de usuarios después de la actualización
                window.location.href =
                  "../../PAGES/viewsProductos/Productos.html";
              }
            });
          })
          .catch((error) => {
            console.error("Error al editar producto:", error);
          });
      }
    });
  }
});
