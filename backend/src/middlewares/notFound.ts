import {
  Request, Response, NextFunction, RequestHandler,
} from 'express';
import { NotFoundError } from '../errors/errors';

const notFound: RequestHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => next(new NotFoundError());
export default notFound;
