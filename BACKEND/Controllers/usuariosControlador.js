import Usuario from "../Models/usuarioModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
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
    const usuarios = await Usuario.findAll();
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
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ msg: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ msg: `Error al obtener usuario: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// METODO PUT
export async function putUsuario(req, res) {
  const { id } = req.params;
  const { documento, nombre, email, numero, rol, contraseña } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      const hashedPassword = contraseña
        ? await bcrypt.hash(contraseña, 10)
        : usuario.contraseña;
      await usuario.update({
        documento,
        nombre,
        email,
        numero,
        rol,
        contraseña: hashedPassword,
      });
      res
        .status(200)
        .json({ message: "Usuario actualizado exitosamente", usuario });
    } else {
      res.status(404).json({ msg: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al actualizar usuario: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//

// METODO PUT
export async function putUsuarioEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const usuarioActualizado = await Usuario.findByPk(id);
    if (usuarioActualizado) {
      await usuarioActualizado.update({ estado: estado });
    }

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
  const { documento, nombre, email, numero, rol, contraseña } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({
      documento,
      nombre,
      email,
      numero,
      rol,
      contraseña: hashedPassword,
    });
    await enviarCorreoRegistro(email);
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
}
