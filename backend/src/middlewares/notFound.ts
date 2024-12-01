import { NotFoundError } from "../errors/errors";
import { Request, Response, NextFunction, RequestHandler } from "express";

const notFound: RequestHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next(new NotFoundError());
};
export default notFound;
