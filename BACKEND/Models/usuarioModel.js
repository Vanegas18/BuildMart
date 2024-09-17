import { DataTypes } from "sequelize";
import sequelize from "../Database/config.js";

//-----------------------------------------------------------------------------------------//

const UsuariosSchema = sequelize.define(
  "Usuarios",
  {
    documento: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.BIGINT, allowNull: false },
    rol: { type: DataTypes.STRING, allowNull: false },
    contraseña: { type: DataTypes.STRING, allowNull: false },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "Activo",
      validate: {
        isIn: [["Activo", "Inactivo"]],
      },
    },
  },
  { timestamps: false }
);

//-----------------------------------------------------------------------------------------//

export default UsuariosSchema;
