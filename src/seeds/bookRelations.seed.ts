//  Importamos Mongoose:
import mongoose from "mongoose";

// Conexión a la base de datos:
import { connect } from "../db";

// Importamos la función que nos sirve para relacionar los documentos de nuestra BBDD:
import { bookRelations } from "../utils/bookRelations";

//  Función asíncrona para conectar con la BBDD y ejecutar la función de reseteo de datos.
const seedBookRelations = async (): Promise<void> => {
  try {
    await connect(); //  Esperamos a que conecte con la BBDD.
    await bookRelations(); //  Esperamos que ejecute la función.
    console.log("Datos relacionados");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  } finally {
    //   Finalmente desconecta de la BBDD.
    await mongoose.disconnect();
  }
};

void seedBookRelations(); //  Llamamos a la función.
