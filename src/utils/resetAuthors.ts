// Importamos el modelo
import { Author } from "../models/Author";

// Creamos 50 autores aleatoriamente y los vamos añadiendo al array de autores:
const authorList = [
  { name: "Gabriel García Márquez", country: "COLOMBIA", email: "gabi@gmail.com", password: "12345678" },
  { name: "Jane Austen", country: "ENGLAND", email: "jane@gmail.com", password: "87654321" },
  { name: "Leo Tolstoy", country: "RUSSIA", email: "leot@gmail.com", password: "00000000" },
  { name: "Virginia Woolf", country: "ENGLAND", email: "virg@gmail.com", password: "11111111" },
  { name: "Ernest Hemingway", country: "UNITED STATES", email: "ernest@gmail.com", password: "22222222" },
  { name: "Jorge Luis Borges", country: "ARGENTINA", email: "jorge@gmail.com", password: "33333333" },
  { name: "Franz Kafka", country: "CZECHOSLOVAKIA", email: "frank@gmail.com", password: "44444444" },
  { name: "Toni Morrison", country: "UNITED STATES", email: "tonih@gmail.com", password: "55555555" },
  { name: "Haruki Murakami", country: "JAPAN", email: "haruki@gmail.com", password: "66666666" },
  { name: "Chinua Achebe", country: "NIGERIA", email: "chinua@gmail.com", password: "77777777" }
];

//  Función de reseteo de documentos de la colección.
export const resetAuthors = async (): Promise<void> => {
  try {
    await Author.collection.drop(); //  Esperamos a que borre los documentos de la colección author de la BBDD.
    console.log("Borrados authors");
    const documents = authorList.map((author) => new Author(author));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }
    console.log("Creados authors correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
