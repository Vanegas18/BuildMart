import express from "express";

// Se utiliza para permitir o restringir solicitudes de recursos desde diferentes orígenes.
import cors from "cors";
import { dbConnection, dbConnectionSQL } from "../Database/config.js";
import sequelize from "../Database/config.js";
import "../Database/config.js";
import usuariosRutas from "../Routes/usuariosRutas.js";
import productosRutas from "../Routes/productosRutas.js";
import categoriasRutas from "../Routes/categoriasRutas.js";

//-----------------------------------------------------------------------------------------//

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      usuarios: "/api/usuarios",
      productos: "/api/productos",
      categorias: "/api/categorias",
    };
    this.conectarDB();

    // Inicializar middlewares - Son funciones que se ejecutan durante el ciclo de vida de una solicitud HTTP en una aplicación Express. Pueden realizar tareas como la autenticación, el manejo de errores, el análisis de cuerpos de solicitud, la configuración de CORS, entre otros.
    this.middlewares();
    this.routes();
  }

  //-----------------------------------------------------------------------------------------//

  async conectarDB() {
    await dbConnection();
    await dbConnectionSQL();

    // Sincronizar los modelos SQL después de establecer la conexión
    sequelize
      .sync()
      .then(() => {
        console.log("Base de datos SQL y tablas creadas");
      })
      .catch((error) => {
        console.error("Error al sincronizar la base de datos SQL", error);
      });
  }

  //-----------------------------------------------------------------------------------------//

  middlewares() {
    // Habilitar CORS para permitir solicitudes desde otros dominios
    this.app.use(cors());

    // Habilitar la lectura y parseo del cuerpo de las solicitudes en formato JSON
    this.app.use(express.json());

    // Servir archivos estáticos desde el directorio "public"
    this.app.use(express.static("FRONTED"));
  }

  //-----------------------------------------------------------------------------------------//

  routes() {
    this.app.use(this.paths.usuarios, usuariosRutas);
    this.app.use(this.paths.productos, productosRutas);
    this.app.use(this.paths.categorias, categoriasRutas);
  }

  //-----------------------------------------------------------------------------------------//

  listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Servidor corriendo en el puerto http://localhost:${this.port}`
      );
    });
  }
}

export default Server;
