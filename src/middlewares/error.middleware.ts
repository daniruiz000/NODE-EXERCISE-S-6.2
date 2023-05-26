import {
  type Request,
  type Response,
  type ErrorRequestHandler,
} from "express";

export const checkError = async (err: ErrorRequestHandler, req: Request, res: Response): Promise<void> => {
  console.log("*** INICIO DE ERROR ***");
  console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
  console.log(err);
  console.log("*** FIN DE ERROR ***");

  // Truco para quitar el tipo a una variable:
  const errorAsAny: any = err as unknown as any

  if (err?.name === "ValidationError") {
    res.status(400).json(err);
  } else if (errorAsAny?.indexOf("duplicate key") !== -1) {
    res.status(400).json({ error: errorAsAny.errmsg });
  } else {
    res.status(500).json(err);
  }
};
