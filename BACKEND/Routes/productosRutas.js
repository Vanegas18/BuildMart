import { Router } from "express";
import { getProductos, getProductosById, postProducto, putProductos, putProductosEstado } from "../Controllers/productosControlador.js";

// Crea un nuevo router de Express para manejar las rutas de productos
const productosRutas = Router();

// Obtener todos los productos
productosRutas.get("/", getProductos);

// Ruta para obtener un productos por su ID
productosRutas.get('/:id', getProductosById);

// Crear un nuevo producto
productosRutas.post("/", postProducto);

// Actualizar un producto existente
productosRutas.put("/:id", putProductos);

// Ruta para actualizar el estado de un producto por su ID
productosRutas.put("/:id/estado", putProductosEstado);

export default productosRutas;
