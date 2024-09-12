import mongoose, {model, Schema} from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrementFactory = mongooseSequence(mongoose);

//-----------------------------------------------------------------------------------------//

const categoriaSchema = new Schema(
  {
    id: { type: Number },
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    estado: { type: String, default: "Activo", enum: ["Activo", "Inactivo"] },
  },
  {
    versionKey: false, 
  }
);

//-----------------------------------------------------------------------------------------//

categoriaSchema.plugin(AutoIncrementFactory, { inc_field: "Id" });

export default model("categorias", categoriaSchema);