import mongoose from "mongoose";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Función para establecer la conexión con la base de datos
export async function dbConnection () {
  try {
    // Intenta conectarse a la base de datos utilizando la cadena de conexión proporcionada en las variables de entorno
    await mongoose.connect(process.env.MONGO_CNN);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

// Configuración de Sequelize para la base de datos SQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Función para establecer la conexión con la base de datos SQL
export async function dbConnectionSQL() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos SQL");
  } catch (error) {
    console.error("Error al conectar a la base de datos SQL:", error);
    process.exit(1);
  }
}

export default sequelize;