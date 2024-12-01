import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/errors';

const errorHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`End-point ${req.url} not found`));
};

export default errorHandler;
