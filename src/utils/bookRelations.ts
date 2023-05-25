// Importamos los modelos:
import { Book } from "../models/Book";
import { Author } from "../models/Author";
import { Publisher } from "../models/Publisher";
import { generateRandom } from "./generateRandom";

//  Función de relación entre de documentos de la colección.
export const bookRelations = async (): Promise<void> => {
  try {
    //  Recuperamos books, publishers y authors:
    const books = await Book.find();
    if (books.length === 0) {
      console.error("No hay libros en la BBDD.");
      return;
    }
    const author = await Author.find();
    if (author.length === 0) {
      console.error("No hay autores en la BBDD.");
      return;
    }
    const publisher = await Publisher.find();
    if (publisher.length === 0) {
      console.error("No hay editoriales en la BBDD.");
      return;
    }
    // Para cada libro recogido elegimos un autor y una editorial al azar entre los existentes y se lo asignamos como una propiedad a cada libro.
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const randomAuthor = author[generateRandom(0, author.length)];
      const randomPublisher = publisher[generateRandom(0, publisher.length)];

      book.author = randomAuthor as unknown as any;
      book.publisher = randomPublisher as unknown as any;

      await book.save(); // Guardamos el libro creado con las nuevas propiedades.
    }
    console.log("Relaciones entre colecciones creadas correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { bookRelations }; // Exportamos la función para poder usarla.
