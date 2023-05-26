import express from "express";
import cors from "cors";

import { infoReq } from "./middlewares/infoReq.middleware";
import { checkError } from "./middlewares/error.middleware";

import { bookRouter } from "./routes/book.routes";
import { authorRouter } from "./routes/author.routes";
import { publisherRouter } from "./routes/publisher.routes";

import { connect } from "./db"

// --------------------------------------------------------------------------------------------

//  Función asíncrona que gestiona nuestra API.
const main = async (): Promise<void> => {
  // Conexión a la base de datos.
  const database = await connect(); //  Conectamos con la BBDD.

  //  Configuración del server.
  const PORT = 3000; //  Definimos el puerto..
  const app = express(); // Definimos el app. Lo gestionará express.
  app.use(express.json()); // Sepa interpretar los JSON
  app.use(express.urlencoded({ extended: false })); //  Sepa interpretar bien los parametros de las rutas.
  app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] })); // Utilice la libreria cors para gestionar la seguridad de acceso a la API

  // Definimos el routerHome que será el encargado de manejar las peticiones a nuestras rutas en la raíz.
  const routerHome = express.Router();

  // Endpoint de la Home de nuestra API.
  routerHome.get("/", (req, res) => {
    res.send(`Esta es la Home de nuestra API. Estamos usando la BBDD de ${database?.connection.name as string}`);
  });

  //  Para que todas las peticiones que no se correspondan con nuestras rutas den un codigo 404 y manden un mensaje de error.
  routerHome.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página requerida.");
  });

  // Middleware previo de Info de la req.
  app.use(infoReq);

  // Asignación de los routers para las diferentes rutas creadas:
  //  Usamos las rutas (el orden es importante más restrictivos a menos):
  app.use("/public", express.static("public"));
  app.use("/publisher", publisherRouter); //  Le decimos al app que utilice el publisherRouter importado para gestionar las rutas que tengan "/publisher".
  app.use("/author", authorRouter); //  Le decimos al app que utilice el authorRouter importado para gestionar las rutas que tengan "/author".
  app.use("/book", bookRouter); //  Le decimos al app que utilice el bookRouter importado para gestionar las rutas que tengan "/book".
  app.use("/", routerHome); //  Decimos al app que utilice el routerHome en la raíz.

  // Middleware de gestión de los Errores.
  app.use(checkError);

  // Levantamos el app en el puerto indicado:
  app.listen(PORT, () => {
    console.log(`Server levantado en puerto ${PORT}`);
  });
};

// --------------------------------------------------------------------------------------------

void main(); //  Llamamos a la función de gestión de nuestra API.
