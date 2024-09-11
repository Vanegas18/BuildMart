import Usuario from "../Models/usuarioModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// Carga las variables de entorno desde un archivo .env
import dotenv from "dotenv";
dotenv.config();

// CONFIGURACIÓN NODEMAILER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.userGmail,
    pass: process.env.passAppGmail,
  },
});
3;
// FUNCIÓN PARA ENVIAR EL CORREO ELECTRÓNICO
const enviarCorreoRegistro = async (emailDestino) => {
  const mailOptions = {
    from: process.env.userGmail,
    to: emailDestino,
    subject: "Build Mart - Registro exitoso",
    html: `
    <p>Su registro fue exitoso, cambie su contraseña haciendo clic en el siguiente enlace:</p>
    <a href="http://localhost:3000/views/Usuario/usuario.html">CLICK AQUÍ</a>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
  } catch (error) {
    console.error("Error al enviar el correo", error);
  }
};

// METODO GET - Obtener todos los usuarios
export async function getUsuario(req, res) {
  try {
    // Busca todos los usuarios en la base de datos y utiliza .lean() para mejorar el rendimiento
    const usuarios = await Usuario.find().lean();
    res.status(200).json(usuarios);
  } catch (error) {
    // Responde con un estado 500 si ocurre un error en el servidor
    res
      .status(500)
      .json({ msg: `Error al obtener usuarios: ${error.message}` });
  }
}

// GET POR ID - Obtener un usuario por su ID
export async function getUsuarioById(req, res) {
  const { id } = req.params; // Extrae el ID de los parámetros de la solicitud
  try {
    // Busca un usuario en la base de datos por su ID
    const usuario = await Usuario.findById(id).lean();
    if (!usuario) {
      // Si no se encuentra el usuario, responde con un status 404 (No encontrado)
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    // Responde con el usuario encontrado
    res.json(usuario);
  } catch (error) {
    // Responde con un estado 500 si ocurre un error en el servidor
    res
      .status(500)
      .json({ msg: `Error al obtener el usuario: ${error.message}` });
  }
}

// METODO PUT - Actualizar un usuario basado en su ID
export async function putUsuario(req, res) {
  const { id } = req.params; // Extrae el ID de los parámetros de la solicitud
  const { documento, nombre, email, numero, rol } = req.body; // Extrae los datos del cuerpo de la solicitud
  let msg = "Usuario actualizado";

  try {
    // Busca y actualiza un usuario basado en su ID; retorna el documento actualizado
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { documento, nombre, email, numero, rol },
      { new: true } // Configura para devolver el usuario actualizado
    );

    if (!usuarioActualizado) {
      // Si el usuario no se encuentra, devuelve un estado 404
      msg = "Usuario no encontrado";
      return res.status(404).json({ msg: msg });
    }
  } catch (error) {
    // Actualiza el mensaje de error y responde con un estado 500
    msg = `Error al actualizar el usuario: ${error.message}`;
    return res.status(500).json({ msg: msg });
  }

  // Responde con un mensaje de éxito si se actualiza correctamente
  res.status(200).json({ msg: msg });
}

// METODO PUT - Cambiar el estado de un usuario basado en su ID
export async function putUsuarioEstado(req, res) {
  const { id } = req.params; // Extrae el ID de los parámetros de la solicitud
  const { estado } = req.body; // Extrae el nuevo estado del cuerpo de la solicitud

  try {
    // Busca el usuario por su ID y actualiza su estado
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { estado: estado },
      { new: true } // Configura para devolver el usuario actualizado
    );

    if (!usuarioActualizado) {
      // Si no se encuentra el usuario, responde con un status 404
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Responde con un mensaje de éxito y el usuario actualizado
    res.status(200).json({
      msg: "Estado del usuario actualizado",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    // Responde con un estado 500 si ocurre un error en el servidor
    res
      .status(500)
      .json({ msg: `Error al actualizar el usuario: ${error.message}` });
  }
}

// METODO POST - Crear un nuevo usuario
export async function postUsuario(req, res) {
  let msg = "Usuario creado exitosamente";
  const { documento, nombre, email, numero, rol, contraseña, estado } =
    req.body; // Extrae los datos del cuerpo de la solicitud
  try {
    // Crea una nueva instancia del modelo Usuario con los datos proporcionados
    const usuario = new Usuario({
      documento,
      nombre,
      email,
      numero,
      rol,
      contraseña,
      estado,
    });
    usuario.contraseña = await bcrypt.hash(contraseña, 5);
    // Guarda el nuevo usuario en la base de datos
    await usuario.save();

    // Enviar correo de registro exitoso
    enviarCorreoRegistro(email);
    // Responde con un mensaje de éxito si se crea correctamente
    res.status(201).json({ msg: msg });
  } catch (error) {
    // Actualiza el mensaje de error y responde con un estado 500
    res
      .status(500)
      .json({ msg: `Error al crear el usuario: ${error.message}` });
  }
}
