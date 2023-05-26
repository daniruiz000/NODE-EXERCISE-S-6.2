import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

export const infoReq = (req: Request, res: Response, next: NextFunction): void => {
  const date = new Date();
  console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date.toString()}`);
  next();
};
