import { Book } from "../models/Book";

const bookList = [
  { title: "To Kill a Mockingbird", pages: 281 },
  { title: "1984", pages: 328 },
  { title: "The Great Gatsby", pages: 180 },
  { title: "Pride and Prejudice", pages: 279 },
  { title: "The Catcher in the Rye", pages: 234 },
  { title: "The Hobbit", pages: 310 },
  { title: "Fahrenheit 451", pages: 249 },
  { title: "Brave New World", pages: 288 },
  { title: "Moby-Dick", pages: 704 },
  { title: "To the Lighthouse", pages: 209 },
  { title: "Jane Eyre", pages: 532 },
  { title: "The Odyssey", pages: 541 },
  { title: "The Lord of the Rings", pages: 1178 },
  { title: "Crime and Punishment", pages: 430 },
  { title: "Gone with the Wind", pages: 1037 },
  { title: "The Picture of Dorian Gray", pages: 254 },
  { title: "The Alchemist", pages: 163 },
  { title: "The Kite Runner", pages: 371 },
  { title: "Slaughterhouse-Five", pages: 275 },
  { title: "Harry Potter and the Philosopher's Stone", pages: 223 },
  { title: "The Book Thief", pages: 552 },
  { title: "Lord of the Flies", pages: 182 },
  { title: "The Adventures of Huckleberry Finn", pages: 366 },
  { title: "Wuthering Heights", pages: 348 },
  { title: "The Secret Life of Bees", pages: 336 },
  { title: "The Hunger Games", pages: 374 },
  { title: "The Da Vinci Code", pages: 454 },
  { title: "The Girl with the Dragon Tattoo", pages: 465 },
  { title: "The Chronicles of Narnia", pages: 767 },
  { title: "A Game of Thrones", pages: 694 },
  { title: "The Color Purple", pages: 295 },
  { title: "One Hundred Years of Solitude", pages: 417 },
  { title: "The Fault in Our Stars", pages: 313 },
  { title: "The Diary of a Young Girl", pages: 283 },
  { title: "The Shining", pages: 447 },
  { title: "The Help", pages: 444 },
  { title: "A Tale of Two Cities", pages: 489 },
  { title: "The Giver", pages: 208 },
  { title: "The Count of Monte Cristo", pages: 1276 },
  { title: "The Handmaid's Tale", pages: 311 },
  { title: "Gulliver's Travels", pages: 306 },
  { title: "The Little Prince", pages: 96 },
  { title: "Sapiens: A Brief History of Humankind", pages: 443 },
  { title: "The Divine Comedy", pages: 798 },
  { title: "The Outsiders", pages: 192 },
  { title: "The Sun Also Rises", pages: 251 },
  { title: "The Name of the Rose", pages: 536 },
  { title: "The Stranger", pages: 123 },
  { title: "The Bell Jar", pages: 244 },
  { title: "The Adventures of Tom Sawyer", pages: 245 },
  { title: "The Road", pages: 287 },
  { title: "The Old Man and the Sea", pages: 127 }
];

//  Función de reseteo de documentos de la colección.
export const resetBooks = async (): Promise<void> => {
  try {
    await Book.collection.drop(); //  Esperamos a que borre los documentos de la colección book de la BBDD.
    console.log("Borrados books");
    const documents = bookList.map((book) => new Book(book));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }
    console.log("Creados books correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
