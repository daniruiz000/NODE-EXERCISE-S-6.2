import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { connect } from "../db"

export const mongoConnect = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  await connect()
  next();
};
