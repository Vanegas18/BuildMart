import { model, Schema } from "mongoose";

//-----------------------------------------------------------------------------------------//

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

//-----------------------------------------------------------------------------------------//

export default model("usuarios", UsuariosSchema);
