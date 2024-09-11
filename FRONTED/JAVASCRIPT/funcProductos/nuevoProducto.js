document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  if (form) {
    form.addEventListener("submit", Registrar);
  }

  // PARA QUE AL CREAR UNA CATEGORIA SE MUESTRE EN EL SELECT
  fetch("/api/categorias")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener las categorias.");
      }
      return response.json();
    })
    .then((data) => {
      const selectCategoria = document.getElementById("categoriaProducto");
      data.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria._id;
        option.textContent = categoria.nombre;
        selectCategoria.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al obtener las categorias:", error));

  function Registrar(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreProducto").value;
    const categoria = document.getElementById("categoriaProducto").value;
    const descripcion = document.getElementById("descripcionProducto").value;
    const precio = document.getElementById("precioProducto").value.trim();
    const stock = document.getElementById("stockProducto").value.trim();

    const expresiones = {
      id: /^\d+$/,
      nombre: /^[a-zA-Z0-9\s]{1,50}$/,
      categoria: /^[a-zA-Z\s]{1,30}$/,
      descripcion: /^[a-zA-Z0-9\s.,-áéíóúüñÁÉÍÓÚÜÑ]{1,500}$/,
      precio: /^\d+(\.\d{1,2})?$/,
      stock: /^\d+$/,
    };

    let valid = true;

    if (!expresiones.nombre.test(nombre)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Los caracteres que has ingresado en el nombre no son correctos. Solo se permiten letras (mayúsculas o minúsculas), espacios, y opcionalmente números.",
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

    if (valid) {
      const producto = {
        nombre,
        categoria,
        descripcion,
        precio,
        stock,
        estado: "Activo",
      };

      fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convierte el objeto 'producto' a una cadena JSON y lo asigna al cuerpo de la solicitud
        body: JSON.stringify(producto),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al registrar el producto.");
          }
          return response.json();
        })
        .then((data) => {
          // Mostrar mensaje de éxito y redirigir a la página de usuarios
          Swal.fire({
            title: "Buen trabajo!",
            text: data.msg || "Producto registrado!",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href =
                "../../PAGES/viewsProductos/Productos.html"; // Redirigir a la lista de usuarios
            }
          });
        })
        .catch((error) => console.error("Error al registrar producto:", error));
    }
  }
});
