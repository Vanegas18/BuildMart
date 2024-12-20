document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  if (form) {
    form.addEventListener("submit", Registrar);
  }

  //-----------------------------------------------------------------------------------------//

  function Registrar(event) {
    event.preventDefault(); // Previene el envío por defecto del formulario

    const nombre = document.getElementById("nombre").value;
    const documento = document.getElementById("documento").value.trim();
    const email = document.getElementById("email").value;
    const numero = document.getElementById("numero").value.trim();
    const rol = document.getElementById("rol").value;
    const contraseña = document.getElementById("contraseña").value;

    // Expresiones regulares para validar los campos
    const expresiones = {
      namee: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      documentoo: /^\d{8,12}$/, // Solo dígitos, 8 a 12 dígitos.
      correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Correo electrónico
      telefono: /^\d{7,14}$/, // 7 a 14 números.
      contraseña: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{10,}$/, // Al menos 10 caracteres, incluyendo letras y números
    };

    let valid = true;

    // Validar campo contraseña
    if (!expresiones.contraseña.test(contraseña)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Los caracteres que has ingresado en la contraseña no son correctos solo se permiten al menos 10 caracteres, incluyendo letras y números",
      });
      valid = false;
    }

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
        contraseña,
        estado: "Activo",
      };

      fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario), // Convierte el objeto a una cadena JSON
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al registrar el usuario.");
          }
          return response.json();
        })
        .then((data) => {
          Swal.fire({
            title: "Buen trabajo!",
            text: data.msg || "Usuario registrado!",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "../../PAGES/viewsUsuarios/Usuarios.html";
            }
          });
        })
        .catch((error) => console.error("Error al registrar usuario:", error));
    }
  }
}); 
