import Usuario from "../Models/usuarioModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

//-----------------------------------------------------------------------------------------//
import dotenv from "dotenv";
dotenv.config();

//-----------------------------------------------------------------------------------------//
// CONFIGURACIÓN NODEMAILER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.userGmail,
    pass: process.env.passAppGmail,
  },
});
3;

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

//-----------------------------------------------------------------------------------------//
// METODO GET
export async function getUsuario(req, res) {
  try {
    const usuarios = await Usuario.find().lean();
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al obtener usuarios: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// GET POR ID
export async function getUsuarioById(req, res) {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findById(id).lean();
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al obtener el usuario: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// METODO PUT
export async function putUsuario(req, res) {
  const { id } = req.params;
  const { documento, nombre, email, numero, rol } = req.body;
  let msg = "Usuario actualizado";

  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { documento, nombre, email, numero, rol },
      { new: true } // Configura para devolver el usuario actualizado
    );

    if (!usuarioActualizado) {
      msg = "Usuario no encontrado";
      return res.status(404).json({ msg: msg });
    }
  } catch (error) {
    msg = `Error al actualizar el usuario: ${error.message}`;
    return res.status(500).json({ msg: msg });
  }

  res.status(200).json({ msg: msg });
}

//-----------------------------------------------------------------------------------------//
// METODO PUT
export async function putUsuarioEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { estado: estado },
      { new: true } // Configura para devolver el usuario actualizado
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json({
      msg: "Estado del usuario actualizado",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al actualizar el usuario: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// METODO POST
export async function postUsuario(req, res) {
  let msg = "Usuario creado exitosamente";
  const { documento, nombre, email, numero, rol, contraseña, estado } =
    req.body;
  try {
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
    await usuario.save();
    enviarCorreoRegistro(email);

    res.status(201).json({ msg: msg });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al crear el usuario: ${error.message}` });
  }
}
