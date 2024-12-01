import { NextFunction, Request, Response } from 'express';
import { Joi, celebrate, Segments } from 'celebrate';
import { faker } from '@faker-js/faker';
import { isValidPhoneNumber } from 'libphonenumber-js';

import { BadRequestError, ServerError } from '../errors/errors';
import Product from '../models/models';

interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export const orderValidateSchema = Joi.object<IOrder>({
  payment: Joi.equal('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .custom((value, helpers) => {
      if (!isValidPhoneNumber(value, 'RU')) {
        return helpers.error('string.phoneNumber', { value });
      }
      return value;
    })
    .required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().min(1).required(),
});

export const orderRouteValidator = celebrate({
  [Segments.BODY]: orderValidateSchema,
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { value, error } = orderValidateSchema.validate(req.body as IOrder);
    if (error) {
      return next(new BadRequestError(`Validation error: ${error.message}`));
    }

    // извлекаем из БД MongoDB список продуктов
    const products = await Promise.all(
      value.items.map(async (item) => {
        const product = await Product.findById(item);
        if (!product || product.price === null) {
          throw new BadRequestError('Product not found or price is null');
        }
        return product;
      }),
    );

    // проверяем, что все товары найдены
    if (products.length !== value.items.length) {
      return next(
        new BadRequestError(
          'Product data error: Not all products are available',
        ),
      );
    }

    // проверяем соответствие суммы заказа стоимости товаров
    const productSum = products.reduce((sum, curr) => sum + curr.price, 0);
    if (value.total !== productSum) {
      return next(
        new BadRequestError(
          'The cost of the order does not correspond to the cost of the goods',
        ),
      );
    }

    // отправляем ответ клиенту
    return res.status(200).send({
      id: faker.number.hex({ min: 1000000000, max: 1000000000 }),
      total: productSum,
    });
  } catch (error) {
    return next(new ServerError(`Server error: ${JSON.stringify(error)}`));
  }
};
