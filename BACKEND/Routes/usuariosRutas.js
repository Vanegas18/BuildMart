import { Router } from "express";
import { getUsuario, getUsuarioById, postUsuario, putUsuario, putUsuarioEstado } from "../Controllers/usuariosControlador.js";

//-----------------------------------------------------------------------------------------//
const usuariosRutas = Router();

usuariosRutas.get("/", getUsuario);
usuariosRutas.get('/:id', getUsuarioById);
usuariosRutas.post("/", postUsuario);
usuariosRutas.put("/:id", putUsuario);
usuariosRutas.put("/:id/estado", putUsuarioEstado);

export default usuariosRutas;
