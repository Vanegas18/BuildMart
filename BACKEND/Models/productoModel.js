import mongoose, {model, Schema} from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrementFactory = mongooseSequence(mongoose);

const productoSchema = new Schema(
  {
    id: { type: Number },
    nombre: { type: String, required: true, trim: true },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorias",
      required: true,
      trim: true,
    },
    descripcion: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    estado: { type: String, default: "Activo", enum: ["Activo", "Inactivo"] },
  },
  { versionKey: false }
);

productoSchema.plugin(AutoIncrementFactory, { inc_field: "id" });

export default model("Productos", productoSchema);