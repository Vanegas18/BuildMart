import { Router } from "express";
import {
  getByIdCategorias,
  getCategorias,
  postCategorias,
  putCategorias,
  putCategoriasEstado,
} from "../Controllers/categoriasControlador.js";

//-----------------------------------------------------------------------------------------//
const categoriasRutas = Router();

categoriasRutas.get("/", getCategorias);
categoriasRutas.get("/:id", getByIdCategorias);
categoriasRutas.post("/", postCategorias);
categoriasRutas.put("/:id", putCategorias);
categoriasRutas.put("/:id/estado", putCategoriasEstado);

export default categoriasRutas;
