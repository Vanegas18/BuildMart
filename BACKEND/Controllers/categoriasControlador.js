import Categorias from "../Models/categoriaModel.js";

//-----------------------------------------------------------------------------------------//
// METODO GET
export async function getCategorias(req, res) {
  try {
    const categorias = await Categorias.find().lean();
    if (!Array.isArray(categorias)) {
      throw new TypeError("La respuesta no es un array.");
    }
    res.status(200).json({ categorias });
  } catch (error) {
    res.status(404).json({ msg: `Error al obtener categorías: ${error.message}` });
  }
}

//-----------------------------------------------------------------------------------------//
// METODO GET BY ID
export async function getByIdCategorias(req, res) {
  const { id } = req.params;
  try {
    const categoria = await Categorias.findById(id).lean();
    if (!categoria) {
      return res.status(404).json("Categoria no encontrada");
    }
    res.status(200).json({ categoria });
  } catch (error) {
    res.status(400).json(error);
  }
}

//-----------------------------------------------------------------------------------------//
// METODO POST
export async function postCategorias(req, res) {
  const { nombre, descripcion } = req.body;
  try {
    const categoria = new Categorias({ nombre, descripcion });
    await categoria.save();
    res.status(200).json({ msg: "Categoria creada correctamente", categoria });
  } catch (error) {
    res.status(400).json(error);
  }
}

//-----------------------------------------------------------------------------------------//
// METODO PUT
export async function putCategorias(req, res) {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const categoriaActualizada = await Categorias.findByIdAndUpdate(
      id, // Usa el ID de la URL
      { nombre, descripcion }, // Actualiza Nombre y Descripcion
      { new: true } // Devuelve el documento actualizado
    );
    if (!categoriaActualizada) {
      return res.status(404).json("Categoría no encontrada");
    }
    res.status(200).json({ msg: "Categoria actualizada", categoria: categoriaActualizada }); // Devuelve la categoría actualizada
  } catch (error) {
    res.status(400).json(error);
  }
}

//-----------------------------------------------------------------------------------------//
// METODO PUT PARA EL ESTADO
export async function putCategoriasEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const categoriaActualizada = await Categorias.findByIdAndUpdate(
      id,
      { estado: estado },
      { new: true }
    );
    if (!categoriaActualizada) {
      return res.status(400).json("Categoria no encontrada");
    }

    res.status(200).json({
      msg: "Estado de la categoria actualizado",
      categoria: categoriaActualizada,
    });
  } catch (error) {
    res.status(400).json(error);
  }
}
