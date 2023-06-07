//  Importamos jwt
import jwt from "jsonwebtoken";

import dotenv from "dotenv"

dotenv.config();

export const generateToken = (id: string, email: string): string => {
  if (!id || !email) {
    throw new Error("Email or userId missing");
  }

  const payload = {
    id,
    email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return token;
};

export const verifyToken = (token: string): any => {
  if (!token) {
    throw new Error("Token is missing");
  }
  const result = jwt.verify(token, process.env.JWT_SECRET as string);
  return result;
};
