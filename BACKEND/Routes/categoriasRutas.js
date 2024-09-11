import { Router } from "express";
import {
  getByIdCategorias,
  getCategorias,
  postCategorias,
  putCategorias,
  putCategoriasEstado,
} from "../Controllers/categoriasControlador.js";

// Crea un nuevo router de Express para manejar las rutas de categorias
const categoriasRutas = Router();

// Obtener todas los categorias
categoriasRutas.get("/", getCategorias);

// Ruta para obtener un categorias por su ID
categoriasRutas.get("/:id", getByIdCategorias);

// Crear un nuevo categorias
categoriasRutas.post("/", postCategorias);

// Actualizar un categorias existente
categoriasRutas.put("/:id", putCategorias);

// Ruta para actualizar el estado de un categorias por su ID
categoriasRutas.put("/:id/estado", putCategoriasEstado);

export default categoriasRutas;
