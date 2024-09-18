import mongoose from "mongoose";

// Función para establecer la conexión con la base de datos
export async function dbConnection() {
  try {
    // Intenta conectarse a la base de datos utilizando la cadena de conexión proporcionada en las variables de entorno
    await mongoose.connect(process.env.MONGO_CNN);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
}
