import { Router } from "express";
import { getProductos, getProductosById, postProducto, putProductos, putProductosEstado } from "../Controllers/productosControlador.js";

//-----------------------------------------------------------------------------------------//
const productosRutas = Router();

productosRutas.get("/", getProductos);
productosRutas.get('/:id', getProductosById);
productosRutas.post("/", postProducto);
productosRutas.put("/:id", putProductos);
productosRutas.put("/:id/estado", putProductosEstado);

export default productosRutas;
