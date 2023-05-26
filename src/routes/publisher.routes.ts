import express from "express";

import { Publisher } from "../models/Publisher";
import { Book } from "../models/Book";

import { checkParams } from "../middlewares/checkParams.middleware";

import { resetPublishers } from "../utils/resetPublishers";

import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

// Router propio de publisher:
export const publisherRouter = express.Router();

// --------------------------------------------------------------------------------------------
// ------------------------------ ENDPOINTS DE /publisher -------------------------------------
// --------------------------------------------------------------------------------------------

/*  Endpoint para recuperar todos los publishers de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

publisherRouter.get("/", checkParams, async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const limit = req.query.limit as any;
    const page = req.query.page as any;

    const publishers = await Publisher.find() // Devolvemos los publishers si funciona. Con modelo.find().
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit. // Con populate le indicamos que si recoge un id en la propiedad señalada rellene con los campos de datos que contenga ese id
    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el publisher:
    const totalElements = await Publisher.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: publishers,
    };
    // Enviamos la respuesta como un json.
    res.json(response);

    // Si falla la lectura...
  } catch (error) {
    next(error);
  }
});

/* Ejemplo de REQ indicando que queremos la página 4 estableciendo un limite de 10 elementos
 por página (limit = 10 , pages = 4):
 http://localhost:3000/publisher?limit=10&page=4 */

//  ------------------------------------------------------------------------------------------

//  Endpoint para recuperar un publisher en concreto a través de su id ( modelo.findById()) (CRUD: READ):

publisherRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la lectura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const publisher = await Publisher.findById(id); //  Buscamos un documentos con un id determinado dentro de nuestro modelo con modelo.findById(id a buscar).
    if (publisher) {
      const temporalPublisher = publisher.toObject();
      const includeBooks = req.query.includeBooks === "true";

      if (includeBooks) {
        const books = await Book.find({ publisher: id }); // Busco en la entidad Car los coches que correspondena ese id de User.
        temporalPublisher.books = books; // Añadimos la propiedad cars al usuario temporal con los coches que hemos recogido de la entidad Car.
      }
      res.json(temporalPublisher); //  Si existe el publisher lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el publisher se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    next(error);
  }
});

// Ejemplo de REQ:
// http://localhost:3000/publisher/id del publisher a buscar

//  ------------------------------------------------------------------------------------------

//  Endpoint para buscar un publisher por el nombre ( modelo.findById({name: name})) (CRUD: Operación Custom. No es CRUD):

publisherRouter.get("/name/:name", async (req: Request, res: Response, next: NextFunction) => {
  const publisherName = req.params.name;
  // Si funciona la lectura...
  try {
    // const publisher = await publisher.find({ firstName: name }); //Si quisieramos realizar una busqueda exacta, tal y como está escrito.
    const publisher = await Publisher.find({ name: new RegExp("^" + publisherName.toLowerCase(), "i") }); // Devolvemos los books si funciona. Con modelo.find().

    //  Esperamos a que realice una busqueda en la que coincida el texto pasado por query params para la propiedad determinada pasada dentro de un objeto, porqué tenemos que pasar un objeto, sin importar mayusc o minusc.
    if (publisher?.length) {
      res.json(publisher); //  Si existe el publisher lo mandamos en la respuesta como un json.
    } else {
      res.status(404).json([]); //   Si no existe el publisher se manda un json con un array vacio porque la respuesta en caso de haber tenido resultados hubiera sido un array y un mandamos un código 404.
    }

    // Si falla la lectura...
  } catch (error) {
    next(error);
  }
});

// Ejemplo de REQ:
// http://localhost:3000/publisher/name/nombre del publisher a buspublisher

//  ------------------------------------------------------------------------------------------

//  Endpoint para añadir elementos (CRUD: CREATE):

publisherRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la escritura...
  try {
    const publisher = new Publisher(req.body); //     Un nuevo publisher es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdPublisher = await publisher.save(); // Esperamos a que guarde el nuevo publisher creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdPublisher); // Devolvemos un código 201 que significa que algo se ha creado y el publisher creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo de POST para añadir un nuevo publisher (añadimos al body el nuevo publisher con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newPublisher = {name: "Prueba Nombre", country: "Prueba country"}
 fetch("http://localhost:3000/publisher/",{"body": JSON.stringify(newPublisher),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */
//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos de publisher:

publisherRouter.delete("/reset", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona el reseteo...
  try {
    await resetPublishers();
    res.send("Datos Publisher reseteados");

    // Si falla el reseteo...
  } catch (error) {
    next(error);
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoin para eliminar publisher identificado por id (CRUD: DELETE):

publisherRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const publisherDeleted = await Publisher.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del publisher eliminado que busca y elimina con el metodo findByIdAndDelete(id del publisher a eliminar).
    if (publisherDeleted) {
      res.json(publisherDeleted); //  Devolvemos el publisher eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo DELETE para eliminar un publisher (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta) identificado por su id:

fetch("http://localhost:3000/publisher/id del publisher a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoin para actualizar un elemento identificado por id (CRUD: UPDATE):

publisherRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const publisherUpdated = await Publisher.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // Esperamos que devuelva la info del publisher actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el publisher actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del publisher a eliminar).
    if (publisherUpdated) {
      res.json(publisherUpdated); //  Devolvemos el publisher actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    next(error);
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el tlf) recogidos en el body,
de un publisher en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/publisher/id del publisher a actualizar",{"body": JSON.stringify({country: "Prueba country"}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/
