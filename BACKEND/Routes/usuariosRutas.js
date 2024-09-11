import { Router } from "express";
import { getUsuario, getUsuarioById, postUsuario, putUsuario, putUsuarioEstado } from "../Controllers/usuariosControlador.js";

// Crea un nuevo router de Express para manejar las rutas de usuarios
const usuariosRutas = Router();

// Obtener todos los usuarios
usuariosRutas.get("/", getUsuario);

// Ruta para obtener un usuario por su ID
usuariosRutas.get('/:id', getUsuarioById);

// Crear un nuevo usuario
usuariosRutas.post("/", postUsuario);

// Actualizar un usuario existente
usuariosRutas.put("/:id", putUsuario);

// Ruta para actualizar el estado de un usuario por su ID
usuariosRutas.put("/:id/estado", putUsuarioEstado);

export default usuariosRutas;
