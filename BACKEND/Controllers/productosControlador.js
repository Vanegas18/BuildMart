import Productos from "../Models/productoModel.js";
import mongoose from "mongoose";

// METODO GET: Obtener todos los productos
export async function getProductos(req, res) {
  try {
    // Busca todos los productos y los devuelve como un array plano
    const productos = await Productos.find().lean();
    res.status(200).json(productos);
  } catch (error) {
    // Responde con un estado 500 si ocurre un error en el servidor
    res
      .status(500)
      .json({ msg: `Error al obtener productos: ${error.message}` });
  }
}

// METODO GET BY ID: Obtener un producto por su ID
export async function getProductosById(req, res) {
  const { id } = req.params;
  try {
    // Busca el producto por ID
    const producto = await Productos.findById(id).lean();
    if (!producto) {
      // Responde con un estado 404 si el producto no es encontrado
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    // Responde con el producto encontrado
    res.json(producto);
  } catch (error) {
    // Responde con un estado 500 si ocurre un error en el servidor
    res
      .status(500)
      .json({ msg: `Error al obtener el producto: ${error.message}` });
  }
}

// METODO PUT: Actualizar un producto por su ID
export async function putProductos(req, res) {
  const { id, nombre, categoria, descripcion, precio, stock } = req.body;
  let msg = "Producto editado correctamente";
  try {
    // Actualiza el producto con el ID especificado
    const productoActualizado = await Productos.findOneAndUpdate(
      { id: id }, // Busca por el campo 'id' en lugar del '_id' por defecto
      {
        nombre: nombre,
        categoria: categoria,
        descripcion: descripcion,
        precio: precio,
        stock: stock,
      },
      { new: true } // Devuelve el producto actualizado en la respuesta
    );
    if (!productoActualizado) {
      msg = "Producto no encontrado";
      return res.status(404).json({ msg: msg });
    }
  } catch (error) {
    // Actualiza el mensaje de error y responde con un estado 500
    msg = `Error al actualizar el producto: ${error.message}`;
    return res.status(500).json({ msg: msg });
  }
  // Responde con un mensaje de éxito si se actualiza correctamente
  res.status(200).json({ msg: msg });
}

// METODO PUT ESTADO: Actualizar solo el estado de un producto
export async function putProductosEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    // Actualiza solo el campo 'status' del producto con el ID especificado
    const productoActualizado = await Productos.findByIdAndUpdate(
      id,
      { estado: estado },
      { new: true } // Devuelve el producto actualizado en la respuesta
    );

    if (!productoActualizado) {
      // Responde con un estado 404 si el producto no es encontrado
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Responde con un mensaje de éxito y el producto actualizado
    res.status(200).json({
      msg: "Estado del producto actualizado",
      producto: productoActualizado,
    });
  } catch (error) {
    // Responde con un estado 500 si ocurre un error en el servidor
    res
      .status(500)
      .json({ msg: `Error al actualizar el producto: ${error.message}` });
  }
}

// METODO POST: Crear un nuevo producto
export async function postProducto(req, res) {
  const { nombre, categoria, descripcion, precio, stock, estado } = req.body;
  try {
    // Convertir categoria a ObjectId
    const categoriaObjectId = new mongoose.Types.ObjectId(categoria);
    // Crea una nueva instancia del producto
    const nuevoProducto = new Productos({
      nombre,
      categoria: categoriaObjectId,
      descripcion,
      precio,
      stock,
      estado,
    });
    // Guarda el nuevo producto en la base de datos
    await nuevoProducto.save();
    // Responde con un mensaje de éxito si se crea correctamente
    res
      .status(201)
      .json({ msg: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (error) {
    // Responde con un estado 500 si ocurre un error en el servidor
    res
      .status(500)
      .json({ msg: `Error al crear el producto: ${error.message}` });
  }
}
