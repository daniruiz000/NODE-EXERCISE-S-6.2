/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *        - pages
 *        - publisher
 *      properties:
 *        title:
 *          type: string
 *          description: Título del libro
 *        author:
 *          type: string
 *          description: ID del autor del libro
 *        pages:
 *          type: number
 *          description: Número de páginas del libro
 *        publisher:
 *          type: string
 *          description: ID de la editorial del libro
 */

import mongoose, { type ObjectId } from "mongoose";

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Interface de Book
export interface IBook {
  title: string;
  author: ObjectId;
  pages: number;
  publisher: ObjectId;
}

// Creamos esquema del book:
const bookSchema = new Schema<IBook>(
  {
    title: { type: String, trim: true, minLength: [3, " Al menos tres letras para el título"], maxLength: [40, "Título demasiado largo, máximo de 20 caracteres"], required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: false }, // Identificará el id como una referencia de la entidad Author relacionando las dos colecciones de la BBDD.
    pages: { type: Number, min: [1, "Mínimo 1 página"], max: [1500, "Máximo 1000 páginas"], required: true },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher", required: false } // Identificará el id como una referencia de la entidad Publisher relacionando las dos colecciones de la BBDD.
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un book valide contra el Schema que hemos creado para ver si es valido.
export const Book = mongoose.model<IBook>("Book", bookSchema);
