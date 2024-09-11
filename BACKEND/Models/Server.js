import express from 'express'

// Se utiliza para permitir o restringir solicitudes de recursos desde diferentes orígenes.
import cors from 'cors'

import {dbConnection} from '../Database/config.js'
import '../Database/config.js'

import usuariosRutas from '../Routes/usuariosRutas.js'
import productosRutas from '../Routes/productosRutas.js'
import categoriasRutas from '../Routes/categoriasRutas.js' 

class Server{
  constructor(){
    // Inicializa la aplicación Express
    this.app = express()

    // Establece el puerto del servidor, utilizando la variable de entorno PORT
    this.port = process.env.PORT

    // Definir rutas base para las diferentes funcionalidades
    this.paths = {
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      categorias: '/api/categorias'
    }

    // Conectar a la base de datos
    this.conectarDB()

    // Inicializar middlewares - Son funciones que se ejecutan durante el ciclo de vida de una solicitud HTTP en una aplicación Express. Pueden realizar tareas como la autenticación, el manejo de errores, el análisis de cuerpos de solicitud, la configuración de CORS, entre otros.
    this.middlewares()

    // Definir las rutas de la aplicación
    this.routes()
  }

  // Método para conectar a la base de datos MongoDB
  async conectarDB() {
    await dbConnection();
  }

  // Método para configurar los middlewares
  middlewares() {
    // Habilitar CORS para permitir solicitudes desde otros dominios
    this.app.use(cors());

    // Habilitar la lectura y parseo del cuerpo de las solicitudes en formato JSON
    this.app.use(express.json());

    // Servir archivos estáticos desde el directorio "public"
    this.app.use(express.static("FRONTED"));
  }

  // Método para definir las rutas de la aplicación
  routes() {
    // Usa las rutas definidas para las diferentes funcionalidades
    this.app.use(this.paths.usuarios, usuariosRutas)
    this.app.use(this.paths.productos, productosRutas)
    this.app.use(this.paths.categorias, categoriasRutas)
  }

  // Método para iniciar el servidor y escuchar en el puerto definido
  listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Servidor corriendo en el puerto http://localhost:${this.port}`
      );
    })
  }
}

export default Server