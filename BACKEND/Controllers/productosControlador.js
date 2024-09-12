import Productos from "../Models/productoModel.js";
import mongoose from "mongoose";

//-----------------------------------------------------------------------------------------//
// METODO GET
export async function getProductos(req, res) {
  try {
    const productos = await Productos.find().lean();
    res.status(200).json(productos);
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al obtener productos: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// METODO GET BY ID
export async function getProductosById(req, res) {
  const { id } = req.params;
  try {
    const producto = await Productos.findById(id).lean();
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al obtener el producto: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// METODO PUT
export async function putProductos(req, res) {
  const { id, nombre, categoria, descripcion, precio, stock } = req.body;
  let msg = "Producto editado correctamente";
  try {
    const productoActualizado = await Productos.findOneAndUpdate(
      { id: id },
      {
        nombre: nombre,
        categoria: categoria,
        descripcion: descripcion,
        precio: precio,
        stock: stock,
      },
      { new: true }
    );
    if (!productoActualizado) {
      msg = "Producto no encontrado";
      return res.status(404).json({ msg: msg });
    }
  } catch (error) {
    msg = `Error al actualizar el producto: ${error.message}`;
    return res.status(500).json({ msg: msg });
  }
  res.status(200).json({ msg: msg });
}

//-----------------------------------------------------------------------------------------//
// METODO PUT ESTADO
export async function putProductosEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const productoActualizado = await Productos.findByIdAndUpdate(
      id,
      { estado: estado },
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.status(200).json({
      msg: "Estado del producto actualizado",
      producto: productoActualizado,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al actualizar el producto: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// METODO POST
export async function postProducto(req, res) {
  const { nombre, categoria, descripcion, precio, stock, estado } = req.body;
  try {
    const categoriaObjectId = new mongoose.Types.ObjectId(categoria);
    const nuevoProducto = new Productos({
      nombre,
      categoria: categoriaObjectId,
      descripcion,
      precio,
      stock,
      estado,
    });
    await nuevoProducto.save();
    res
      .status(201)
      .json({ msg: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error al crear el producto: ${error.message}` });
  }
}
