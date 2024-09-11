import {model, Schema} from 'mongoose';

// Definición del esquema para el modelo de Usuario
const UsuariosSchema = new Schema(
  {
    documento: { type: Number, required: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    numero: { type: Number, required: true },
    rol: { type: String, required: true },
    contraseña: { type: String, required: true },
    estado: { type: String, default: "Activo", enum: ["Activo", "Inactivo"] },
  },
  { versionKey: false }
);

// Exporta el modelo basado en el esquema UsuariosSchema para que pueda ser utilizado en otras partes de la aplicación
export default model("usuarios", UsuariosSchema);