/**
 * @swagger
 * tags:
 *   name: Book
 *   description: The books managing API
 */
import express from "express";

import { Book } from "../models/Book";

import { checkParams } from "../middlewares/checkParams.middleware";

import { resetBooks } from "../utils/resetBooks";
import { resetAuthors } from "../utils/resetAuthors";
import { resetPublishers } from "../utils/resetPublishers";
import { bookRelations } from "../utils/bookRelations";

import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

// Router propio de book:
export const bookRouter = express.Router();
/**
 * @swagger
 * /book:
 *   get:
 *     tags: [Book]
 *     summary: Obtiene todos los libros paginados.
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Número de libros a mostrar por página.
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         description: Número de página a mostrar.
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devuelve una lista paginada de libros.
 */
bookRouter.get("/", checkParams, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit as any;
    const page = req.query.page as any;

    const books = await Book.find() // Devolvemos los books si funciona. Con modelo.find().
      .populate(["author", "publisher"])
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit.

    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el usuario:
    const totalElements = await Book.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: books,
    };
    // Enviamos la respuesta como un json.
    res.json(response);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /book/{id}:
 *   get:
 *     tags: [Book]
 *     summary: Obtiene un libro por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del libro a obtener.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Devuelve el libro encontrado.
 *       404:
 *         description: No se encontró ningún libro con el ID especificado.
 */
bookRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const book = await Book.findById(id).populate(["author", "publisher"]); //  Buscamos un book con un id determinado dentro de nuestro modelo con modelo.findById(id a buscar).
    if (book) {
      res.json(book); //  Si existe el book lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el book se manda un json vacio y un código 400.
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /book/title/{title}:
 *   get:
 *     tags: [Book]
 *     summary: Busca libros por título.
 *     parameters:
 *       - in: path
 *         name: title
 *         description: Título del libro a buscar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Devuelve una lista de libros coincidentes.
 *       404:
 *         description: No se encontraron libros con el título especificado.
 */
bookRouter.get("/title/:title", async (req: Request, res: Response, next: NextFunction) => {
  const title = req.params.title;
  try {
    const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate(["author", "publisher"]); //  Esperamos a que realice una busqueda en la que coincida el texto pasado por query params para la propiedad determinada pasada dentro de un objeto, porqué tenemos que pasar un objeto, sin importar mayusc o minusc.
    if (book?.length) {
      res.json(book); //  Si existe el book lo mandamos en la respuesta como un json.
    } else {
      res.status(404).json([]); //   Si no existe el book se manda un json con un array vacio porque la respuesta en caso de haber tenido resultados hubiera sido un array y un mandamos un código 404.
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /book:
 *   post:
 *     tags: [Book]
 *     summary: Crea un nuevo libro.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Libro creado exitosamente.
 */
bookRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = new Book(req.body); //     Un nuevo book es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdBook = await book.save(); // Esperamos a que guarde el nuevo book creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdBook); // Devolvemos un código 201 que significa que algo se ha creado y el book creado en modo json.
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /book/reset:
 *   delete:
 *     tags: [Book]
 *     summary: Reinicia los libros y las relaciones relacionadas.
 *     parameters:
 *       - in: query
 *         name: all
 *         description: Reiniciar todos los datos (opcional).
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Datos reseteados y relaciones restablecidas.
 */
bookRouter.delete("/reset", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // La constante all recoge un boleano, si recogemos una query (all) y con valor (true), esta será true:
    const all = req.query.all === "true";

    // Si all es true resetearemos todos los datos de nuestras coleciones y las relaciones entre estas.
    if (all) {
      await resetBooks();
      await resetAuthors();
      await resetPublishers();
      await bookRelations();
      res.send("Datos reseteados y Relaciones reestablecidas");
    } else {
      await resetBooks();
      res.send("Datos Book reseteados");
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     tags: [Book]
 *     summary: Elimina un libro por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del libro a eliminar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro eliminado exitosamente.
 *       404:
 *         description: No se encontró ningún libro con el ID especificado.
 */
bookRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const bookDeleted = await Book.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del book eliminado que busca y elimina con el metodo findByIdAndDelete(id del book a eliminar).
    if (bookDeleted) {
      res.json(bookDeleted); //  Devolvemos el book eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /book/{id}:
 *   put:
 *     tags: [Book]
 *     summary: Actualiza un libro por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del libro a actualizar.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente.
 *       404:
 *         description: No se encontró ningún libro con el ID especificado.
 */

bookRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const bookUpdated = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // Esperamos que devuelva la info del book actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el book actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del book a eliminar).
    if (bookUpdated) {
      res.json(bookUpdated); //  Devolvemos el book actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }
  } catch (error) {
    next(error);
  }
});
