//  Importamos Mongoose
import mongoose from "mongoose";

import validator from "validator";
import bcrypt from "bcrypt";

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

// Interface de Autor
interface IAuthor {
  email: string;
  password: string;
  name: string;
  country: AllowedCountries;
  image: string;
  books?: IBook[];
}

const authorSchema = new Schema<IAuthor>(
  {
    email: {
      type: String,
      trim: true,
      unique: true, // indica que no puede haber otra entidad con esta propiedad que tenga el mismo valor.
      validate: {
        validator: (text: string) => validator.isEmail, // Validamos haciendo uso de la librería validator y la función isEmail que incorpora.
        message: "Email incorrecto"
      },
      required: true
    },
    password: {
      type: String,
      trim: true,
      unique: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false, // Indica que no lo deseamos mostrar cuando se realicen las peticiones.
      required: true
    },
    name: { type: String, trim: true, minLength: [3, "Al menos tres letras para el nombre"], maxLength: [22, "Nombre demasiado largo, máximo de 22 caracteres"], required: true },
    country: { type: String, trim: true, minLength: [3, "Al menos tres letras para el país"], maxLength: [20, "País demasiado largo, máximo de 20 caracteres"], enum: AllowedCountries, uppercase: true, required: true },
    image: { type: String, required: false }
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Cada vez que se guarde un usuario encriptamos la contraseña
authorSchema.pre("save", async function (next) {
  try {
    // Si la password estaba encriptada, no la encriptaremos de nuevo.
    if (this.isModified("password")) {
      // Si el campo password se ha modificado
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds); // Encriptamos la contraseña
      this.password = passwordEncrypted; // guardamos la password en la entidad User
      next();
    }
  } catch (error) {
    next();
  }
});

// Creamos un modelo para que siempre que creamos un author valide contra el Schema que hemos creado para ver si es valido.
export const Author = mongoose.model<IAuthor>("Author", authorSchema);
