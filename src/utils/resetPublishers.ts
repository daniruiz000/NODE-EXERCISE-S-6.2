// Importamos el modelo
import { Publisher } from "../models/Publisher";

// Creamos 50 editorial aleatoriamente y los vamos añadiendo al array de editoriales:
const publisherList = [
  { name: "RGB", country: "UNITED STATES" },
  { name: "Amaya", country: "SPAIN" },
  { name: "Alianza Editorial", country: "SPAIN" },
  { name: "Alfaguara", country: "ARGENTINA" }
];

//  Función de reseteo de documentos de la colección.
export const resetPublishers = async (): Promise<void> => {
  try {
    await Publisher.collection.drop(); //  Esperamos a que borre los documentos de la colección publisher de la BBDD.
    console.log("Borrados publishers");
    const documents = publisherList.map((publisher) => new Publisher(publisher));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }
    console.log("Creados publishers correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};
