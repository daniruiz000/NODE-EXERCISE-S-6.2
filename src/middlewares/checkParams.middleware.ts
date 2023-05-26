import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

export const checkParams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Estamos en el Middleware que comprueba los parámetros");

    const page = req.query.page ? parseInt(req.query?.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query?.limit as string) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page as any;
      req.query.limit = limit as any;
      next();
    } else {
      console.log("Parametros no validos:");
      console.log(JSON.stringify(req.query));
      res.status(400).json({ error: "Params are not valid" });
    }
  } catch (error) {
    next(error);
  }
};
