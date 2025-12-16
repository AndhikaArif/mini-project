import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../errors/app.error.js";

export class ErrorMiddleware {
  static notFound(req: Request, res: Response) {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  }

  static global(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: `General error from internal server` });
  }
}
