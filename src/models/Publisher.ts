//  Importamos Mongoose
import mongoose from "mongoose";

import { type IBook } from "./Book";

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Enum de países permitidos
enum AllowedCountries {
  SPAIN = "SPAIN",
  COLOMBIA = "COLOMBIA",
  ENGLAND = "ENGLAND",
  RUSSIA = "RUSSIA",
  UNITED_STATES = "UNITED STATES",
  ARGENTINA = "ARGENTINA",
  CZECHOSLOVAKIA = "CZECHOSLOVAKIA",
  JAPAN = "JAPAN",
  NIGERIA = "NIGERIA",
}

// Interface de Publisher
interface IPublisher {
  name: string;
  country: AllowedCountries;
  books?: IBook[];
}
const publisherSchema = new Schema<IPublisher>(
  {
    name: { type: String, trim: true, minLength: [3, " Al menos tres letras para el nombre"], maxLength: [20, "Nombre demasiado largo, máximo de 20 caracteres"], required: true },
    country: { type: String, trim: true, minLength: [3, " Al menos tres letras para el país"], maxLength: [20, "País demasiado largo, máximo de 20 caracteres"], enum: AllowedCountries, uppercase: true, required: true }
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un author valide contra el Schema que hemos creado para ver si es valido.
export const Publisher = mongoose.model<IPublisher>("Publisher", publisherSchema);
