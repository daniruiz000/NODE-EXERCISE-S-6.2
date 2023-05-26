import mongoose from "mongoose";

import { connect } from "../db";

import { bookRelations } from "../utils/bookRelations";

export const seedBookRelations = async (): Promise<void> => {
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
