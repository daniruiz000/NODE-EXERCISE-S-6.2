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
    await Publisher.insertMany(publisherList); //  Esperamos a que inserte los nuevos documentos creados en la colección publisher de la BBDD.
    console.log("Creados publishers correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetPublishers }; // Exportamos la función para poder usarla.
