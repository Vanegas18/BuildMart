//Importa el módulo express para crear el servidor
import express from "express";

//Importa la clase Server desde el archivo server.js en la carpeta model
import Server from "./BACKEND/Models/Server.js";

// Carga las variables de entorno desde un archivo .env
import dotenv from "dotenv";
dotenv.config();

try {
  // Crea una instancia del servidor utilizando la clase Server
  const server = new Server();
  // Inicia el servidor y lo pone a escuchar en el puerto especificado en la clase Server
  server.listen();
} catch (error) {
  console.error("Error al iniciar el servidor:", error);
  process.exit(1); // Salir del proceso con un código de error
}
