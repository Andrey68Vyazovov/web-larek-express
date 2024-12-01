import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import Product, { IProduct } from '../models/models';
import { ConflictError, BadRequestError } from '../errors/errors';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((products) => res.send({ items: products, total: products.length }))
  .catch((error) => next(error.message));

export const productSchema = Joi.object<IProduct>({
  title: Joi.string().min(3).max(30).required(),
  image: { fileName: Joi.string(), originalName: Joi.string() },
  category: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number(),
});

export const productRouteValidator = celebrate({
  [Segments.BODY]: productSchema,
});

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title, image, category, description, price,
  } = req.body;
  return Product.create({
    title,
    image,
    category,
    description,
    price,
  })
    .then((product) => res.send({ data: product }))
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError(error.message));
      }

      if (error.name === 'ValidationError') {
        return next(new BadRequestError(`Validation error: ${error.message}`));
      }

      return next(error.message);
    });
};
